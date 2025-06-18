const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { DocumentMetadata } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const {
  DocumentMetadataQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getDocumentMetadataById = require("./utils/getDocumentMetadataById");

class DbCreateDocumentmetadataCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateDocumentmetadata";
    this.objectName = "documentMetadata";
    this.serviceLabel = "mhfz-metadatamanager-service";
    this.dbEvent =
      "mhfz-metadatamanager-service-dbevent-documentmetadata-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new DocumentMetadataQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "documentMetadata",
      this.session,
      this.requestId,
    );
    const dbData = await getDocumentMetadataById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let documentMetadata = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        documentId: this.dataClause.documentId,
      };

      documentMetadata =
        documentMetadata ||
        (await DocumentMetadata.findOne({ where: whereClause }));

      if (documentMetadata) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "documentId",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        documentMetadata =
          documentMetadata ||
          (await DocumentMetadata.findByPk(this.dataClause.id));
        if (documentMetadata) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await documentMetadata.update(this.dataClause);
          updated = true;
        }
      }
    } catch (error) {
      const eDetail = {
        whereClause: this.normalizeSequalizeOps(whereClause),
        dataClause: this.dataClause,
        errorStack: error.stack,
        checkoutResult: this.input.checkoutResult,
      };
      throw new HttpServerError(
        "Error in checking unique index when creating DocumentMetadata",
        eDetail,
      );
    }

    if (!updated && !exists) {
      documentMetadata = await DocumentMetadata.create(this.dataClause);
    }

    this.dbData = documentMetadata.getData();
    this.input.documentMetadata = this.dbData;
    await this.create_childs();
  }
}

const dbCreateDocumentmetadata = async (input) => {
  const dbCreateCommand = new DbCreateDocumentmetadataCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateDocumentmetadata;
