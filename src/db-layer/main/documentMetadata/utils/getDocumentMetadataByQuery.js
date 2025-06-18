const { HttpServerError, BadRequestError } = require("common");

const { DocumentMetadata } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getDocumentMetadataByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    const documentMetadata = await DocumentMetadata.findOne({ where: query });
    if (!documentMetadata) return null;
    return documentMetadata.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingDocumentMetadataByQuery",
      err,
    );
  }
};

module.exports = getDocumentMetadataByQuery;
