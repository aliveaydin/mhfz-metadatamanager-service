const { DBGetListSequelizeCommand } = require("dbCommand");
const { sequelize, hexaLogger } = require("common");
const { Op } = require("sequelize");
const {
  DocumentMetadata,
  DocumentType,
  MetadataEnrichmentJob,
} = require("models");

class DbListDocumentmetadataCommand extends DBGetListSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbListDocumentmetadata";
    this.emptyResult = true;
    this.objectName = "documentMetadatas";
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
    for (const documentMetadata of this.dbData.items) {
      // tarnspose dbData item
    }
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }

  async getCqrsJoins(item) {
    if (DocumentMetadata.getCqrsJoins) {
      await DocumentMetadata.getCqrsJoins(item);
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

    let documentMetadatas = null;

    const selectList = this.getSelectList();
    if (selectList && selectList.length) {
      options.attributes = selectList;
    }

    documentMetadatas = await DocumentMetadata.findAll(options);

    return documentMetadatas;
  }
}

const dbListDocumentmetadata = (input) => {
  const dbGetListCommand = new DbListDocumentmetadataCommand(input);
  return dbGetListCommand.execute();
};

module.exports = dbListDocumentmetadata;
