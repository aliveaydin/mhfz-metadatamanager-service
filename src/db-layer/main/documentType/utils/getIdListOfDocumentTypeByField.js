const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { DocumentType } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getIdListOfDocumentTypeByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const documentTypeProperties = [
      "id",
      "typeName",
      "description",
      "isSystemType",
      "requiredFields",
    ];

    isValidField = documentTypeProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof DocumentType[fieldName];

    if (typeof fieldValue !== expectedType) {
      throw new BadRequestError(
        `Invalid field value type for ${fieldName}. Expected ${expectedType}.`,
      );
    }

    const options = {
      where: isArray
        ? { [fieldName]: { [Op.contains]: [fieldValue] }, isActive: true }
        : { [fieldName]: fieldValue, isActive: true },
      attributes: ["id"],
    };

    let documentTypeIdList = await DocumentType.findAll(options);

    if (!documentTypeIdList || documentTypeIdList.length === 0) {
      throw new NotFoundError(
        `DocumentType with the specified criteria not found`,
      );
    }

    documentTypeIdList = documentTypeIdList.map((item) => item.id);
    return documentTypeIdList;
  } catch (err) {
    hexaLogger.insertError(
      "DatabaseError",
      { function: "getIdListOfDocumentTypeByField", fieldValue: fieldValue },
      "getIdListOfDocumentTypeByField.js->getIdListOfDocumentTypeByField",
      err,
      null,
    );
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingDocumentTypeIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfDocumentTypeByField;
