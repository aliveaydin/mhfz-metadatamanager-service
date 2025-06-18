const { sequelize } = require("common");
const { Op } = require("sequelize");
const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { hexaLogger } = require("common");

const {
  DocumentMetadata,
  DocumentType,
  MetadataEnrichmentJob,
} = require("models");

const { DBGetSequelizeCommand } = require("dbCommand");

class DbGetDocumentmetadataCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, DocumentMetadata);
    this.commandName = "dbGetDocumentmetadata";
    this.nullResult = false;
    this.objectName = "documentMetadata";
    this.serviceLabel = "mhfz-metadatamanager-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (DocumentMetadata.getCqrsJoins)
      await DocumentMetadata.getCqrsJoins(data);
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async checkEntityOwnership(entity) {
    return true;
  }

  async transposeResult() {
    // transpose dbData
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }
}

const dbGetDocumentmetadata = (input) => {
  input.id = input.documentMetadataId;
  const dbGetCommand = new DbGetDocumentmetadataCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetDocumentmetadata;
