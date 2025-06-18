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
  MetadataEnrichmentJobQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getMetadataEnrichmentJobById = require("./utils/getMetadataEnrichmentJobById");

//not

class DbUpdateMetadataenrichmentjobCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, MetadataEnrichmentJob, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateMetadataenrichmentjob";
    this.nullResult = false;
    this.objectName = "metadataEnrichmentJob";
    this.serviceLabel = "mhfz-metadatamanager-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "mhfz-metadatamanager-service-dbevent-metadataenrichmentjob-updated";
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
    this.queryCacheInvalidator =
      new MetadataEnrichmentJobQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "metadataEnrichmentJob",
      this.session,
      this.requestId,
    );
    const dbData = await getMetadataEnrichmentJobById(this.dbData.id);
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

const dbUpdateMetadataenrichmentjob = async (input) => {
  input.id = input.metadataEnrichmentJobId;
  const dbUpdateCommand = new DbUpdateMetadataenrichmentjobCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateMetadataenrichmentjob;
