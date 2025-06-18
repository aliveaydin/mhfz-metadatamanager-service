const DocumentTypeManager = require("./DocumentTypeManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbDeleteDocumenttype } = require("dbLayer");

class DeleteDocumenttypeManager extends DocumentTypeManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteDocumenttype",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "documentType";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.documentTypeId = this.documentTypeId;
  }

  readRestParameters(request) {
    this.documentTypeId = request.params?.documentTypeId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getDocumentTypeById } = require("dbLayer");
    this.documentType = await getDocumentTypeById(this.documentTypeId);
    if (!this.documentType) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.documentTypeId == null) {
      throw new BadRequestError("errMsg_documentTypeIdisRequired");
    }

    // ID
    if (
      this.documentTypeId &&
      !isValidObjectId(this.documentTypeId) &&
      !isValidUUID(this.documentTypeId)
    ) {
      throw new BadRequestError("errMsg_documentTypeIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.documentType?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbDeleteDocumenttype function to delete the documenttype and return the result to the controller
    const documenttype = await dbDeleteDocumenttype(this);

    return documenttype;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.documentTypeId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = DeleteDocumenttypeManager;
