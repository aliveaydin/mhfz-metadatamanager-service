const { ListDocumenttypesManager } = require("managers");

const MetadataManagerRestController = require("../../MetadataManagerServiceRestController");

class ListDocumenttypesRestController extends MetadataManagerRestController {
  constructor(req, res) {
    super("listDocumenttypes", "listdocumenttypes", req, res);
    this.dataName = "documentTypes";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListDocumenttypesManager(this._req, "rest");
  }
}

const listDocumenttypes = async (req, res, next) => {
  const listDocumenttypesRestController = new ListDocumenttypesRestController(
    req,
    res,
  );
  try {
    await listDocumenttypesRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listDocumenttypes;
