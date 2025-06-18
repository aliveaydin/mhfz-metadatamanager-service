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

class DbGetMetadataenrichmentjobCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, MetadataEnrichmentJob);
    this.commandName = "dbGetMetadataenrichmentjob";
    this.nullResult = false;
    this.objectName = "metadataEnrichmentJob";
    this.serviceLabel = "mhfz-metadatamanager-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (MetadataEnrichmentJob.getCqrsJoins)
      await MetadataEnrichmentJob.getCqrsJoins(data);
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

const dbGetMetadataenrichmentjob = (input) => {
  input.id = input.metadataEnrichmentJobId;
  const dbGetCommand = new DbGetMetadataenrichmentjobCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetMetadataenrichmentjob;
