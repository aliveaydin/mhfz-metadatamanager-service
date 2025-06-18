const { UpdateDocumenttypeManager } = require("managers");

const MetadataManagerRestController = require("../../MetadataManagerServiceRestController");

class UpdateDocumenttypeRestController extends MetadataManagerRestController {
  constructor(req, res) {
    super("updateDocumenttype", "updatedocumenttype", req, res);
    this.dataName = "documentType";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateDocumenttypeManager(this._req, "rest");
  }
}

const updateDocumenttype = async (req, res, next) => {
  const updateDocumenttypeRestController = new UpdateDocumenttypeRestController(
    req,
    res,
  );
  try {
    await updateDocumenttypeRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateDocumenttype;
