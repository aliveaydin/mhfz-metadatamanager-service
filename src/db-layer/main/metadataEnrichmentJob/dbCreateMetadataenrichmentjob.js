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

const { DBCreateSequelizeCommand } = require("dbCommand");

const {
  MetadataEnrichmentJobQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getMetadataEnrichmentJobById = require("./utils/getMetadataEnrichmentJobById");

class DbCreateMetadataenrichmentjobCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateMetadataenrichmentjob";
    this.objectName = "metadataEnrichmentJob";
    this.serviceLabel = "mhfz-metadatamanager-service";
    this.dbEvent =
      "mhfz-metadatamanager-service-dbevent-metadataenrichmentjob-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let metadataEnrichmentJob = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      if (!updated && this.dataClause.id && !exists) {
        metadataEnrichmentJob =
          metadataEnrichmentJob ||
          (await MetadataEnrichmentJob.findByPk(this.dataClause.id));
        if (metadataEnrichmentJob) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await metadataEnrichmentJob.update(this.dataClause);
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
        "Error in checking unique index when creating MetadataEnrichmentJob",
        eDetail,
      );
    }

    if (!updated && !exists) {
      metadataEnrichmentJob = await MetadataEnrichmentJob.create(
        this.dataClause,
      );
    }

    this.dbData = metadataEnrichmentJob.getData();
    this.input.metadataEnrichmentJob = this.dbData;
    await this.create_childs();
  }
}

const dbCreateMetadataenrichmentjob = async (input) => {
  const dbCreateCommand = new DbCreateMetadataenrichmentjobCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateMetadataenrichmentjob;
