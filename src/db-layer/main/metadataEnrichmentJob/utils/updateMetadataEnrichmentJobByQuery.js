const { HttpServerError, BadRequestError } = require("common");

const { MetadataEnrichmentJob } = require("models");
const { Op } = require("sequelize");

const updateMetadataEnrichmentJobByQuery = async (dataClause, query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    let rowsCount = null;
    let rows = null;
    const options = { where: { query, isActive: true }, returning: true };
    [rowsCount, rows] = await MetadataEnrichmentJob.update(dataClause, options);

    if (!rowsCount) return [];
    return rows.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingMetadataEnrichmentJobByQuery",
      err,
    );
  }
};

module.exports = updateMetadataEnrichmentJobByQuery;
