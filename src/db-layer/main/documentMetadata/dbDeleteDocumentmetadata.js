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

const {
  getIdListOfMetadataEnrichmentJobByField,
  updateMetadataEnrichmentJobById,
  deleteMetadataEnrichmentJobById,
} = require("../metadataEnrichmentJob");

const {
  DocumentMetadataQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteDocumentmetadataCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, DocumentMetadata, instanceMode);
    this.commandName = "dbDeleteDocumentmetadata";
    this.nullResult = false;
    this.objectName = "documentMetadata";
    this.serviceLabel = "mhfz-metadatamanager-service";
    this.dbEvent =
      "mhfz-metadatamanager-service-dbevent-documentmetadata-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
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

      // delete childs
      const idList_MetadataEnrichmentJob_documentMetadataId_documentMetadata =
        await getIdListOfMetadataEnrichmentJobByField(
          "documentMetadataId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_MetadataEnrichmentJob_documentMetadataId_documentMetadata) {
        promises.push(deleteMetadataEnrichmentJobById(itemId));
      }

      // update childs

      // delete & update parents ???

      // delete and update referred parents

      const results = await Promise.allSettled(promises);
      for (const result of results) {
        if (result instanceof Error) {
          console.log(
            "Single Error when synching delete of DocumentMetadata on joined and parent objects:",
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
        "Total Error when synching delete of DocumentMetadata on joined and parent objects:",
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

const dbDeleteDocumentmetadata = async (input) => {
  input.id = input.documentMetadataId;
  const dbDeleteCommand = new DbDeleteDocumentmetadataCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteDocumentmetadata;
