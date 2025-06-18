const { UpdateMetadataenrichmentjobManager } = require("managers");

const MetadataManagerRestController = require("../../MetadataManagerServiceRestController");

class UpdateMetadataenrichmentjobRestController extends MetadataManagerRestController {
  constructor(req, res) {
    super(
      "updateMetadataenrichmentjob",
      "updatemetadataenrichmentjob",
      req,
      res,
    );
    this.dataName = "metadataEnrichmentJob";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateMetadataenrichmentjobManager(this._req, "rest");
  }
}

const updateMetadataenrichmentjob = async (req, res, next) => {
  const updateMetadataenrichmentjobRestController =
    new UpdateMetadataenrichmentjobRestController(req, res);
  try {
    await updateMetadataenrichmentjobRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateMetadataenrichmentjob;
