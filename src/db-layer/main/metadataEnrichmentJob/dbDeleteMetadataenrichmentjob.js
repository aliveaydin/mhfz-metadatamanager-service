const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { MetadataEnrichmentJob } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const {
  MetadataEnrichmentJobQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteMetadataenrichmentjobCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, MetadataEnrichmentJob, instanceMode);
    this.commandName = "dbDeleteMetadataenrichmentjob";
    this.nullResult = false;
    this.objectName = "metadataEnrichmentJob";
    this.serviceLabel = "mhfz-metadatamanager-service";
    this.dbEvent =
      "mhfz-metadatamanager-service-dbevent-metadataenrichmentjob-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
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
    await elasticIndexer.deleteData(this.dbData.id);
  }

  async transposeResult() {
    // transpose dbData
  }
}

const dbDeleteMetadataenrichmentjob = async (input) => {
  input.id = input.metadataEnrichmentJobId;
  const dbDeleteCommand = new DbDeleteMetadataenrichmentjobCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteMetadataenrichmentjob;
