const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  DocumentMetadata,
  DocumentType,
  MetadataEnrichmentJob,
} = require("models");
const { Op } = require("sequelize");

const getMetadataEnrichmentJobAggById = async (metadataEnrichmentJobId) => {
  try {
    const forWhereClause = false;
    const includes = [];
    const metadataEnrichmentJob = Array.isArray(metadataEnrichmentJobId)
      ? await MetadataEnrichmentJob.findAll({
          where: {
            id: { [Op.in]: metadataEnrichmentJobId },
          },
          include: includes,
        })
      : await MetadataEnrichmentJob.findByPk(metadataEnrichmentJobId, {
          include: includes,
        });

    if (!metadataEnrichmentJob) {
      return null;
    }

    const metadataEnrichmentJobData =
      Array.isArray(metadataEnrichmentJobId) &&
      metadataEnrichmentJobId.length > 0
        ? metadataEnrichmentJob.map((item) => item.getData())
        : metadataEnrichmentJob.getData();
    await MetadataEnrichmentJob.getCqrsJoins(metadataEnrichmentJobData);
    return metadataEnrichmentJobData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingMetadataEnrichmentJobAggById",
      err,
    );
  }
};

module.exports = getMetadataEnrichmentJobAggById;
