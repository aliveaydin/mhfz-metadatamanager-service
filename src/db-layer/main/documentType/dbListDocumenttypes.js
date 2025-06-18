const { DBGetListSequelizeCommand } = require("dbCommand");
const { sequelize, hexaLogger } = require("common");
const { Op } = require("sequelize");
const {
  DocumentMetadata,
  DocumentType,
  MetadataEnrichmentJob,
} = require("models");

class DbListDocumenttypesCommand extends DBGetListSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbListDocumenttypes";
    this.emptyResult = true;
    this.objectName = "documentTypes";
    this.serviceLabel = "mhfz-metadatamanager-service";
    this.input.pagination = null;
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async transposeResult() {
    for (const documentType of this.dbData.items) {
      // tarnspose dbData item
    }
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }

  async getCqrsJoins(item) {
    if (DocumentType.getCqrsJoins) {
      await DocumentType.getCqrsJoins(item);
    }
  }

  async executeQuery() {
    const input = this.input;
    let options = { where: this.whereClause };
    if (input.sortBy) options.order = input.sortBy ?? [["id", "ASC"]];

    options.include = this.buildIncludes();
    if (options.include && options.include.length == 0) options.include = null;

    if (!input.getJoins) {
      options.include = null;
    }

    let documentTypes = null;

    const selectList = this.getSelectList();
    if (selectList && selectList.length) {
      options.attributes = selectList;
    }

    documentTypes = await DocumentType.findAll(options);

    return documentTypes;
  }
}

const dbListDocumenttypes = (input) => {
  const dbGetListCommand = new DbListDocumenttypesCommand(input);
  return dbGetListCommand.execute();
};

module.exports = dbListDocumenttypes;
