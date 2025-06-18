const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { MetadataEnrichmentJob } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getIdListOfMetadataEnrichmentJobByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const metadataEnrichmentJobProperties = [
      "id",
      "documentMetadataId",
      "enrichmentSource",
      "status",
      "submittedAt",
      "completedAt",
      "inputMetadataSnapshot",
      "outputEnrichedMetadata",
      "errorDetail",
    ];

    isValidField = metadataEnrichmentJobProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof MetadataEnrichmentJob[fieldName];

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

    let metadataEnrichmentJobIdList =
      await MetadataEnrichmentJob.findAll(options);

    if (
      !metadataEnrichmentJobIdList ||
      metadataEnrichmentJobIdList.length === 0
    ) {
      throw new NotFoundError(
        `MetadataEnrichmentJob with the specified criteria not found`,
      );
    }

    metadataEnrichmentJobIdList = metadataEnrichmentJobIdList.map(
      (item) => item.id,
    );
    return metadataEnrichmentJobIdList;
  } catch (err) {
    hexaLogger.insertError(
      "DatabaseError",
      {
        function: "getIdListOfMetadataEnrichmentJobByField",
        fieldValue: fieldValue,
      },
      "getIdListOfMetadataEnrichmentJobByField.js->getIdListOfMetadataEnrichmentJobByField",
      err,
      null,
    );
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingMetadataEnrichmentJobIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfMetadataEnrichmentJobByField;
