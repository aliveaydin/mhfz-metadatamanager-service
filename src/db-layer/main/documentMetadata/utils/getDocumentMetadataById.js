const { HttpServerError } = require("common");

let { DocumentMetadata } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getDocumentMetadataById = async (documentMetadataId) => {
  try {
    const documentMetadata = Array.isArray(documentMetadataId)
      ? await DocumentMetadata.findAll({
          where: {
            id: { [Op.in]: documentMetadataId },
          },
        })
      : await DocumentMetadata.findByPk(documentMetadataId);
    if (!documentMetadata) {
      return null;
    }
    return Array.isArray(documentMetadataId)
      ? documentMetadata.map((item) => item.getData())
      : documentMetadata.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingDocumentMetadataById",
      err,
    );
  }
};

module.exports = getDocumentMetadataById;
