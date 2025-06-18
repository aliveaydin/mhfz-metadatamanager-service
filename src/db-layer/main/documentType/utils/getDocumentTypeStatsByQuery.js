const { HttpServerError, BadRequestError } = require("common");

const { DocumentType } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getDocumentTypeCountByQuery = async (query, stats) => {
  const promises = [];
  const statLabels = [];
  try {
    for (const stat of stats) {
      statParts = stat.replace("(", "-").replace(")", "").split("-");
      if (stat === "count") {
        promises.push(DocumentType.count({ where: query }));
        statLabels.push("count");
      } else if (statParts.length == 2) {
        if (statParts[0] === "sum") {
          promises.push(DocumentType.sum(statParts[1], { where: query }));
          statLabels.push("sum-" + statParts[1]);
        } else if (statParts[0] === "avg") {
          promises.push(DocumentType.avg(statParts[1], { where: query }));
          statLabels.push("avg-" + statParts[1]);
        } else if (statParts[0] === "min") {
          promises.push(DocumentType.min(statParts[1], { where: query }));
          statLabels.push("min-" + statParts[1]);
        } else if (statParts[0] === "max") {
          promises.push(DocumentType.max(statParts[1], { where: query }));
          statLabels.push("max-" + statParts[1]);
        }
      }
    }

    if (promises.length == 0) {
      return await DocumentType.count({ where: query });
    } else if (promises.length == 1) {
      return await promises[0];
    } else {
      const results = await Promise.all(promises);
      return results.reduce((acc, val, index) => {
        acc[statLabels[index]] = val;
        return acc;
      }, {});
    }
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingDocumentTypeStatsByQuery",
      err,
    );
  }
};

module.exports = getDocumentTypeCountByQuery;
