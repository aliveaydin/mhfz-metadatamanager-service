const { CreateDocumenttypeManager } = require("managers");

const MetadataManagerRestController = require("../../MetadataManagerServiceRestController");

class CreateDocumenttypeRestController extends MetadataManagerRestController {
  constructor(req, res) {
    super("createDocumenttype", "createdocumenttype", req, res);
    this.dataName = "documentType";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateDocumenttypeManager(this._req, "rest");
  }
}

const createDocumenttype = async (req, res, next) => {
  const createDocumenttypeRestController = new CreateDocumenttypeRestController(
    req,
    res,
  );
  try {
    await createDocumenttypeRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createDocumenttype;
