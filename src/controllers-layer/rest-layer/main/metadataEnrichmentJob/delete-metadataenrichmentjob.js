const { DeleteMetadataenrichmentjobManager } = require("managers");

const MetadataManagerRestController = require("../../MetadataManagerServiceRestController");

class DeleteMetadataenrichmentjobRestController extends MetadataManagerRestController {
  constructor(req, res) {
    super(
      "deleteMetadataenrichmentjob",
      "deletemetadataenrichmentjob",
      req,
      res,
    );
    this.dataName = "metadataEnrichmentJob";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteMetadataenrichmentjobManager(this._req, "rest");
  }
}

const deleteMetadataenrichmentjob = async (req, res, next) => {
  const deleteMetadataenrichmentjobRestController =
    new DeleteMetadataenrichmentjobRestController(req, res);
  try {
    await deleteMetadataenrichmentjobRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteMetadataenrichmentjob;
