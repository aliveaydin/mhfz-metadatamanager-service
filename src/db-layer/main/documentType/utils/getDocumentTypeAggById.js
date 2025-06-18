const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  DocumentMetadata,
  DocumentType,
  MetadataEnrichmentJob,
} = require("models");
const { Op } = require("sequelize");

const getDocumentTypeAggById = async (documentTypeId) => {
  try {
    const forWhereClause = false;
    const includes = [];
    const documentType = Array.isArray(documentTypeId)
      ? await DocumentType.findAll({
          where: {
            id: { [Op.in]: documentTypeId },
          },
          include: includes,
        })
      : await DocumentType.findByPk(documentTypeId, { include: includes });

    if (!documentType) {
      return null;
    }

    const documentTypeData =
      Array.isArray(documentTypeId) && documentTypeId.length > 0
        ? documentType.map((item) => item.getData())
        : documentType.getData();
    await DocumentType.getCqrsJoins(documentTypeData);
    return documentTypeData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingDocumentTypeAggById",
      err,
    );
  }
};

module.exports = getDocumentTypeAggById;
