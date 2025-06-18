const { HttpServerError } = require("common");

let { MetadataEnrichmentJob } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getMetadataEnrichmentJobById = async (metadataEnrichmentJobId) => {
  try {
    const metadataEnrichmentJob = Array.isArray(metadataEnrichmentJobId)
      ? await MetadataEnrichmentJob.findAll({
          where: {
            id: { [Op.in]: metadataEnrichmentJobId },
          },
        })
      : await MetadataEnrichmentJob.findByPk(metadataEnrichmentJobId);
    if (!metadataEnrichmentJob) {
      return null;
    }
    return Array.isArray(metadataEnrichmentJobId)
      ? metadataEnrichmentJob.map((item) => item.getData())
      : metadataEnrichmentJob.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingMetadataEnrichmentJobById",
      err,
    );
  }
};

module.exports = getMetadataEnrichmentJobById;
