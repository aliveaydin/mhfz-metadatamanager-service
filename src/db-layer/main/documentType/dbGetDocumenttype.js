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

class DbGetDocumenttypeCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, DocumentType);
    this.commandName = "dbGetDocumenttype";
    this.nullResult = false;
    this.objectName = "documentType";
    this.serviceLabel = "mhfz-metadatamanager-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (DocumentType.getCqrsJoins) await DocumentType.getCqrsJoins(data);
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

const dbGetDocumenttype = (input) => {
  input.id = input.documentTypeId;
  const dbGetCommand = new DbGetDocumenttypeCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetDocumenttype;
