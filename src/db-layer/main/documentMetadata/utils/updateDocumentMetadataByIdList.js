const { HttpServerError } = require("common");

const { DocumentMetadata } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const updateDocumentMetadataByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;
    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };
    [rowsCount, rows] = await DocumentMetadata.update(dataClause, options);
    const documentMetadataIdList = rows.map((item) => item.id);
    return documentMetadataIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingDocumentMetadataByIdList",
      err,
    );
  }
};

module.exports = updateDocumentMetadataByIdList;
