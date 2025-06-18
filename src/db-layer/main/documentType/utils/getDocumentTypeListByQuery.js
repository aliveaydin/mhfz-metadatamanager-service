const { HttpServerError, BadRequestError } = require("common");

const { DocumentType } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getDocumentTypeListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    const documentType = await DocumentType.findAll({ where: query });
    if (!documentType) return [];
    return documentType.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingDocumentTypeListByQuery",
      err,
    );
  }
};

module.exports = getDocumentTypeListByQuery;
