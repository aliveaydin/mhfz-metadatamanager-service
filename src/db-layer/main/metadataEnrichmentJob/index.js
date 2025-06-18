const utils = require("./utils");

module.exports = {
  dbGetMetadataenrichmentjob: require("./dbGetMetadataenrichmentjob"),
  dbCreateMetadataenrichmentjob: require("./dbCreateMetadataenrichmentjob"),
  dbUpdateMetadataenrichmentjob: require("./dbUpdateMetadataenrichmentjob"),
  dbDeleteMetadataenrichmentjob: require("./dbDeleteMetadataenrichmentjob"),
  dbListMetadataenrichmentjobs: require("./dbListMetadataenrichmentjobs"),
  createMetadataEnrichmentJob: utils.createMetadataEnrichmentJob,
  getIdListOfMetadataEnrichmentJobByField:
    utils.getIdListOfMetadataEnrichmentJobByField,
  getMetadataEnrichmentJobById: utils.getMetadataEnrichmentJobById,
  getMetadataEnrichmentJobAggById: utils.getMetadataEnrichmentJobAggById,
  getMetadataEnrichmentJobListByQuery:
    utils.getMetadataEnrichmentJobListByQuery,
  getMetadataEnrichmentJobStatsByQuery:
    utils.getMetadataEnrichmentJobStatsByQuery,
  getMetadataEnrichmentJobByQuery: utils.getMetadataEnrichmentJobByQuery,
  updateMetadataEnrichmentJobById: utils.updateMetadataEnrichmentJobById,
  updateMetadataEnrichmentJobByIdList:
    utils.updateMetadataEnrichmentJobByIdList,
  updateMetadataEnrichmentJobByQuery: utils.updateMetadataEnrichmentJobByQuery,
  deleteMetadataEnrichmentJobById: utils.deleteMetadataEnrichmentJobById,
  deleteMetadataEnrichmentJobByQuery: utils.deleteMetadataEnrichmentJobByQuery,
};
