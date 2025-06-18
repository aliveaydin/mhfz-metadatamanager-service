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
const { dbCreateDocumenttype } = require("dbLayer");

class CreateDocumenttypeManager extends DocumentTypeManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createDocumenttype",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "documentType";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.typeName = this.typeName;
    jsonObj.description = this.description;
    jsonObj.isSystemType = this.isSystemType;
    jsonObj.requiredFields = this.requiredFields;
  }

  readRestParameters(request) {
    this.typeName = request.body?.typeName;
    this.description = request.body?.description;
    this.isSystemType = request.body?.isSystemType;
    this.requiredFields = request.body?.requiredFields;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {}

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.documentType?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateDocumenttype function to create the documenttype and return the result to the controller
    const documenttype = await dbCreateDocumenttype(this);

    return documenttype;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.documentTypeId = this.id;
    if (!this.documentTypeId) this.documentTypeId = newUUID(false);

    const dataClause = {
      id: this.documentTypeId,
      typeName: this.typeName,
      description: this.description,
      isSystemType: this.isSystemType,
      requiredFields: this.requiredFields
        ? typeof this.requiredFields == "string"
          ? JSON.parse(this.requiredFields)
          : this.requiredFields
        : null,
    };

    return dataClause;
  }
}

module.exports = CreateDocumenttypeManager;
