const { UpdateDocumentmetadataManager } = require("managers");

const MetadataManagerRestController = require("../../MetadataManagerServiceRestController");

class UpdateDocumentmetadataRestController extends MetadataManagerRestController {
  constructor(req, res) {
    super("updateDocumentmetadata", "updatedocumentmetadata", req, res);
    this.dataName = "documentMetadata";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateDocumentmetadataManager(this._req, "rest");
  }
}

const updateDocumentmetadata = async (req, res, next) => {
  const updateDocumentmetadataRestController =
    new UpdateDocumentmetadataRestController(req, res);
  try {
    await updateDocumentmetadataRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateDocumentmetadata;
