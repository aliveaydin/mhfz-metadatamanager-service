const { DeleteDocumentmetadataManager } = require("managers");

const MetadataManagerRestController = require("../../MetadataManagerServiceRestController");

class DeleteDocumentmetadataRestController extends MetadataManagerRestController {
  constructor(req, res) {
    super("deleteDocumentmetadata", "deletedocumentmetadata", req, res);
    this.dataName = "documentMetadata";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteDocumentmetadataManager(this._req, "rest");
  }
}

const deleteDocumentmetadata = async (req, res, next) => {
  const deleteDocumentmetadataRestController =
    new DeleteDocumentmetadataRestController(req, res);
  try {
    await deleteDocumentmetadataRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteDocumentmetadata;
