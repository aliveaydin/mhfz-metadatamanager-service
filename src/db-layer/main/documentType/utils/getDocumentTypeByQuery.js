const { HttpServerError, BadRequestError } = require("common");

const { DocumentType } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getDocumentTypeByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    const documentType = await DocumentType.findOne({ where: query });
    if (!documentType) return null;
    return documentType.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingDocumentTypeByQuery",
      err,
    );
  }
};

module.exports = getDocumentTypeByQuery;
