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

const { DocumentTypeQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getDocumentTypeById = require("./utils/getDocumentTypeById");

//not

class DbUpdateDocumenttypeCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, DocumentType, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateDocumenttype";
    this.nullResult = false;
    this.objectName = "documentType";
    this.serviceLabel = "mhfz-metadatamanager-service";
    this.joinedCriteria = false;
    this.dbEvent = "mhfz-metadatamanager-service-dbevent-documenttype-updated";
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

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }
}

const dbUpdateDocumenttype = async (input) => {
  input.id = input.documentTypeId;
  const dbUpdateCommand = new DbUpdateDocumenttypeCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateDocumenttype;
