const { HttpServerError } = require("common");

let { DocumentType } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getDocumentTypeById = async (documentTypeId) => {
  try {
    const documentType = Array.isArray(documentTypeId)
      ? await DocumentType.findAll({
          where: {
            id: { [Op.in]: documentTypeId },
          },
        })
      : await DocumentType.findByPk(documentTypeId);
    if (!documentType) {
      return null;
    }
    return Array.isArray(documentTypeId)
      ? documentType.map((item) => item.getData())
      : documentType.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingDocumentTypeById",
      err,
    );
  }
};

module.exports = getDocumentTypeById;
