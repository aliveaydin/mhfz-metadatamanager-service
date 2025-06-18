const { DeleteDocumenttypeManager } = require("managers");

const MetadataManagerRestController = require("../../MetadataManagerServiceRestController");

class DeleteDocumenttypeRestController extends MetadataManagerRestController {
  constructor(req, res) {
    super("deleteDocumenttype", "deletedocumenttype", req, res);
    this.dataName = "documentType";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteDocumenttypeManager(this._req, "rest");
  }
}

const deleteDocumenttype = async (req, res, next) => {
  const deleteDocumenttypeRestController = new DeleteDocumenttypeRestController(
    req,
    res,
  );
  try {
    await deleteDocumenttypeRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteDocumenttype;
