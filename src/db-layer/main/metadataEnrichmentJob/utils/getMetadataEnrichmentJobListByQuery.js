const { HttpServerError, BadRequestError } = require("common");

const { MetadataEnrichmentJob } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getMetadataEnrichmentJobListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    const metadataEnrichmentJob = await MetadataEnrichmentJob.findAll({
      where: query,
    });
    if (!metadataEnrichmentJob) return [];
    return metadataEnrichmentJob.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingMetadataEnrichmentJobListByQuery",
      err,
    );
  }
};

module.exports = getMetadataEnrichmentJobListByQuery;
