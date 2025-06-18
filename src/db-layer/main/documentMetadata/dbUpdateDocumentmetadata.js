const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const {
  DocumentMetadata,
  DocumentType,
  MetadataEnrichmentJob,
} = require("models");
const { Op } = require("sequelize");
const { sequelize } = require("common");
const { hexaLogger } = require("common");

const { DBUpdateSequelizeCommand } = require("dbCommand");

const {
  DocumentMetadataQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getDocumentMetadataById = require("./utils/getDocumentMetadataById");

//not

class DbUpdateDocumentmetadataCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, DocumentMetadata, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateDocumentmetadata";
    this.nullResult = false;
    this.objectName = "documentMetadata";
    this.serviceLabel = "mhfz-metadatamanager-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "mhfz-metadatamanager-service-dbevent-documentmetadata-updated";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async transposeResult() {
    // transpose dbData
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

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }
}

const dbUpdateDocumentmetadata = async (input) => {
  input.id = input.documentMetadataId;
  const dbUpdateCommand = new DbUpdateDocumentmetadataCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateDocumentmetadata;
