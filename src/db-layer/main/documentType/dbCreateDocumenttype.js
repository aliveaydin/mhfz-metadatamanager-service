const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { DocumentType } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const { DocumentTypeQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getDocumentTypeById = require("./utils/getDocumentTypeById");

class DbCreateDocumenttypeCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateDocumenttype";
    this.objectName = "documentType";
    this.serviceLabel = "mhfz-metadatamanager-service";
    this.dbEvent = "mhfz-metadatamanager-service-dbevent-documenttype-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new DocumentTypeQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "documentType",
      this.session,
      this.requestId,
    );
    const dbData = await getDocumentTypeById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let documentType = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        typeName: this.dataClause.typeName,
      };

      documentType =
        documentType || (await DocumentType.findOne({ where: whereClause }));

      if (documentType) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "typeName",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        documentType =
          documentType || (await DocumentType.findByPk(this.dataClause.id));
        if (documentType) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await documentType.update(this.dataClause);
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
        "Error in checking unique index when creating DocumentType",
        eDetail,
      );
    }

    if (!updated && !exists) {
      documentType = await DocumentType.create(this.dataClause);
    }

    this.dbData = documentType.getData();
    this.input.documentType = this.dbData;
    await this.create_childs();
  }
}

const dbCreateDocumenttype = async (input) => {
  const dbCreateCommand = new DbCreateDocumenttypeCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateDocumenttype;
