const { ListDocumentmetadataManager } = require("managers");

const MetadataManagerRestController = require("../../MetadataManagerServiceRestController");

class ListDocumentmetadataRestController extends MetadataManagerRestController {
  constructor(req, res) {
    super("listDocumentmetadata", "listdocumentmetadata", req, res);
    this.dataName = "documentMetadatas";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListDocumentmetadataManager(this._req, "rest");
  }
}

const listDocumentmetadata = async (req, res, next) => {
  const listDocumentmetadataRestController =
    new ListDocumentmetadataRestController(req, res);
  try {
    await listDocumentmetadataRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listDocumentmetadata;
