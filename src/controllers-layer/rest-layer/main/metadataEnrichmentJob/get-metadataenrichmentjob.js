const { GetMetadataenrichmentjobManager } = require("managers");

const MetadataManagerRestController = require("../../MetadataManagerServiceRestController");

class GetMetadataenrichmentjobRestController extends MetadataManagerRestController {
  constructor(req, res) {
    super("getMetadataenrichmentjob", "getmetadataenrichmentjob", req, res);
    this.dataName = "metadataEnrichmentJob";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetMetadataenrichmentjobManager(this._req, "rest");
  }
}

const getMetadataenrichmentjob = async (req, res, next) => {
  const getMetadataenrichmentjobRestController =
    new GetMetadataenrichmentjobRestController(req, res);
  try {
    await getMetadataenrichmentjobRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getMetadataenrichmentjob;
