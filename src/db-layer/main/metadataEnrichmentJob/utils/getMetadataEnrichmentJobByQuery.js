const { HttpServerError, BadRequestError } = require("common");

const { MetadataEnrichmentJob } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getMetadataEnrichmentJobByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    const metadataEnrichmentJob = await MetadataEnrichmentJob.findOne({
      where: query,
    });
    if (!metadataEnrichmentJob) return null;
    return metadataEnrichmentJob.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingMetadataEnrichmentJobByQuery",
      err,
    );
  }
};

module.exports = getMetadataEnrichmentJobByQuery;
