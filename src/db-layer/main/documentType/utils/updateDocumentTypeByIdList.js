const { HttpServerError } = require("common");

const { DocumentType } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const updateDocumentTypeByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;
    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };
    [rowsCount, rows] = await DocumentType.update(dataClause, options);
    const documentTypeIdList = rows.map((item) => item.id);
    return documentTypeIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingDocumentTypeByIdList",
      err,
    );
  }
};

module.exports = updateDocumentTypeByIdList;
