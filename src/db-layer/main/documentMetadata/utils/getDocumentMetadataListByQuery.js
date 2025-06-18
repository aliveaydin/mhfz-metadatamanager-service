const { HttpServerError, BadRequestError } = require("common");

const { DocumentMetadata } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getDocumentMetadataListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    const documentMetadata = await DocumentMetadata.findAll({ where: query });
    if (!documentMetadata) return [];
    return documentMetadata.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingDocumentMetadataListByQuery",
      err,
    );
  }
};

module.exports = getDocumentMetadataListByQuery;
