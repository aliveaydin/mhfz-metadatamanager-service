const { GetDocumentmetadataManager } = require("managers");

const MetadataManagerRestController = require("../../MetadataManagerServiceRestController");

class GetDocumentmetadataRestController extends MetadataManagerRestController {
  constructor(req, res) {
    super("getDocumentmetadata", "getdocumentmetadata", req, res);
    this.dataName = "documentMetadata";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetDocumentmetadataManager(this._req, "rest");
  }
}

const getDocumentmetadata = async (req, res, next) => {
  const getDocumentmetadataRestController =
    new GetDocumentmetadataRestController(req, res);
  try {
    await getDocumentmetadataRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getDocumentmetadata;
