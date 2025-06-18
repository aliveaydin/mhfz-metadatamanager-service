const { CreateDocumentmetadataManager } = require("managers");

const MetadataManagerRestController = require("../../MetadataManagerServiceRestController");

class CreateDocumentmetadataRestController extends MetadataManagerRestController {
  constructor(req, res) {
    super("createDocumentmetadata", "createdocumentmetadata", req, res);
    this.dataName = "documentMetadata";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateDocumentmetadataManager(this._req, "rest");
  }
}

const createDocumentmetadata = async (req, res, next) => {
  const createDocumentmetadataRestController =
    new CreateDocumentmetadataRestController(req, res);
  try {
    await createDocumentmetadataRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createDocumentmetadata;
