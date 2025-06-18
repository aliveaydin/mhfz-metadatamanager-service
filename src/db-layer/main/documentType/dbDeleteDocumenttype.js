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

const {
  getIdListOfDocumentMetadataByField,
  updateDocumentMetadataById,
  deleteDocumentMetadataById,
} = require("../documentMetadata");

const { DocumentTypeQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteDocumenttypeCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, DocumentType, instanceMode);
    this.commandName = "dbDeleteDocumenttype";
    this.nullResult = false;
    this.objectName = "documentType";
    this.serviceLabel = "mhfz-metadatamanager-service";
    this.dbEvent = "mhfz-metadatamanager-service-dbevent-documenttype-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
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
      const idList_DocumentMetadata_typeId_documentType =
        await getIdListOfDocumentMetadataByField(
          "typeId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_DocumentMetadata_typeId_documentType) {
        promises.push(updateDocumentMetadataById(itemId, { typeId: null }));
      }

      // delete childs

      // update childs

      // delete & update parents ???

      // delete and update referred parents

      const results = await Promise.allSettled(promises);
      for (const result of results) {
        if (result instanceof Error) {
          console.log(
            "Single Error when synching delete of DocumentType on joined and parent objects:",
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
        "Total Error when synching delete of DocumentType on joined and parent objects:",
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

const dbDeleteDocumenttype = async (input) => {
  input.id = input.documentTypeId;
  const dbDeleteCommand = new DbDeleteDocumenttypeCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteDocumenttype;
