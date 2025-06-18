const { GetDocumenttypeManager } = require("managers");

const MetadataManagerRestController = require("../../MetadataManagerServiceRestController");

class GetDocumenttypeRestController extends MetadataManagerRestController {
  constructor(req, res) {
    super("getDocumenttype", "getdocumenttype", req, res);
    this.dataName = "documentType";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetDocumenttypeManager(this._req, "rest");
  }
}

const getDocumenttype = async (req, res, next) => {
  const getDocumenttypeRestController = new GetDocumenttypeRestController(
    req,
    res,
  );
  try {
    await getDocumenttypeRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getDocumenttype;
