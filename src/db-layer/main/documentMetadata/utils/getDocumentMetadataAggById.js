const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  DocumentMetadata,
  DocumentType,
  MetadataEnrichmentJob,
} = require("models");
const { Op } = require("sequelize");

const getDocumentMetadataAggById = async (documentMetadataId) => {
  try {
    const forWhereClause = false;
    const includes = [];
    const documentMetadata = Array.isArray(documentMetadataId)
      ? await DocumentMetadata.findAll({
          where: {
            id: { [Op.in]: documentMetadataId },
          },
          include: includes,
        })
      : await DocumentMetadata.findByPk(documentMetadataId, {
          include: includes,
        });

    if (!documentMetadata) {
      return null;
    }

    const documentMetadataData =
      Array.isArray(documentMetadataId) && documentMetadataId.length > 0
        ? documentMetadata.map((item) => item.getData())
        : documentMetadata.getData();
    await DocumentMetadata.getCqrsJoins(documentMetadataData);
    return documentMetadataData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingDocumentMetadataAggById",
      err,
    );
  }
};

module.exports = getDocumentMetadataAggById;
