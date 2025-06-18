const { ListMetadataenrichmentjobsManager } = require("managers");

const MetadataManagerRestController = require("../../MetadataManagerServiceRestController");

class ListMetadataenrichmentjobsRestController extends MetadataManagerRestController {
  constructor(req, res) {
    super("listMetadataenrichmentjobs", "listmetadataenrichmentjobs", req, res);
    this.dataName = "metadataEnrichmentJobs";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListMetadataenrichmentjobsManager(this._req, "rest");
  }
}

const listMetadataenrichmentjobs = async (req, res, next) => {
  const listMetadataenrichmentjobsRestController =
    new ListMetadataenrichmentjobsRestController(req, res);
  try {
    await listMetadataenrichmentjobsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listMetadataenrichmentjobs;
