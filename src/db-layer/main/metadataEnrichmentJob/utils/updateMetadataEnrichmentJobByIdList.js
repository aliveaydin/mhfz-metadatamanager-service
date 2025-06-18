const { HttpServerError } = require("common");

const { MetadataEnrichmentJob } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const updateMetadataEnrichmentJobByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;
    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };
    [rowsCount, rows] = await MetadataEnrichmentJob.update(dataClause, options);
    const metadataEnrichmentJobIdList = rows.map((item) => item.id);
    return metadataEnrichmentJobIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingMetadataEnrichmentJobByIdList",
      err,
    );
  }
};

module.exports = updateMetadataEnrichmentJobByIdList;
