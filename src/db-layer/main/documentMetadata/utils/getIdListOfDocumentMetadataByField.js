const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { DocumentMetadata } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getIdListOfDocumentMetadataByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const documentMetadataProperties = [
      "id",
      "documentId",
      "typeId",
      "customTypeName",
      "metadata",
      "uniqueDocumentIdentifier",
      "isEnriched",
      "enrichmentStatus",
      "lastEnrichmentJobId",
    ];

    isValidField = documentMetadataProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof DocumentMetadata[fieldName];

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

    let documentMetadataIdList = await DocumentMetadata.findAll(options);

    if (!documentMetadataIdList || documentMetadataIdList.length === 0) {
      throw new NotFoundError(
        `DocumentMetadata with the specified criteria not found`,
      );
    }

    documentMetadataIdList = documentMetadataIdList.map((item) => item.id);
    return documentMetadataIdList;
  } catch (err) {
    hexaLogger.insertError(
      "DatabaseError",
      {
        function: "getIdListOfDocumentMetadataByField",
        fieldValue: fieldValue,
      },
      "getIdListOfDocumentMetadataByField.js->getIdListOfDocumentMetadataByField",
      err,
      null,
    );
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingDocumentMetadataIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfDocumentMetadataByField;
