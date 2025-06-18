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
  getIdListOfDocumentMetadataByField,
  updateDocumentMetadataById,
  deleteDocumentMetadataById,
} = require("../documentMetadata");

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

  async syncJoins() {
    const promises = [];
    const dataId = this.dbData.id;
    // relationTargetKey should be used instead of id
    try {
      // delete refrring objects

      // update referring objects
      const idList_DocumentMetadata_lastEnrichmentJobId_lastEnrichmentJob =
        await getIdListOfDocumentMetadataByField(
          "lastEnrichmentJobId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_DocumentMetadata_lastEnrichmentJobId_lastEnrichmentJob) {
        promises.push(
          updateDocumentMetadataById(itemId, { lastEnrichmentJobId: null }),
        );
      }

      // delete childs

      // update childs

      // delete & update parents ???

      // delete and update referred parents

      const results = await Promise.allSettled(promises);
      for (const result of results) {
        if (result instanceof Error) {
          console.log(
            "Single Error when synching delete of MetadataEnrichmentJob on joined and parent objects:",
            dataId,
            result,
          );
          hexaLogger.insertError(
            "SyncJoinError",
            { function: "syncJoins", dataId: dataId },
            "->syncJoins",
            result,
          );
        }
      }
    } catch (err) {
      console.log(
        "Total Error when synching delete of MetadataEnrichmentJob on joined and parent objects:",
        dataId,
        err,
      );
      hexaLogger.insertError(
        "SyncJoinsTotalError",
        { function: "syncJoins", dataId: dataId },
        "->syncJoins",
        err,
      );
    }
  }
}

const dbDeleteMetadataenrichmentjob = async (input) => {
  input.id = input.metadataEnrichmentJobId;
  const dbDeleteCommand = new DbDeleteMetadataenrichmentjobCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteMetadataenrichmentjob;
