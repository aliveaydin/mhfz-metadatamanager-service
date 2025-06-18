const { CreateMetadataenrichmentjobManager } = require("managers");

const MetadataManagerRestController = require("../../MetadataManagerServiceRestController");

class CreateMetadataenrichmentjobRestController extends MetadataManagerRestController {
  constructor(req, res) {
    super(
      "createMetadataenrichmentjob",
      "createmetadataenrichmentjob",
      req,
      res,
    );
    this.dataName = "metadataEnrichmentJob";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateMetadataenrichmentjobManager(this._req, "rest");
  }
}

const createMetadataenrichmentjob = async (req, res, next) => {
  const createMetadataenrichmentjobRestController =
    new CreateMetadataenrichmentjobRestController(req, res);
  try {
    await createMetadataenrichmentjobRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createMetadataenrichmentjob;
