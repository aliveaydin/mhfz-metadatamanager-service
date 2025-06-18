const DocumentMetadataManager = require("./DocumentMetadataManager");
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
const { dbDeleteDocumentmetadata } = require("dbLayer");

class DeleteDocumentmetadataManager extends DocumentMetadataManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteDocumentmetadata",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "documentMetadata";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.documentMetadataId = this.documentMetadataId;
  }

  readRestParameters(request) {
    this.documentMetadataId = request.params?.documentMetadataId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getDocumentMetadataById } = require("dbLayer");
    this.documentMetadata = await getDocumentMetadataById(
      this.documentMetadataId,
    );
    if (!this.documentMetadata) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.documentMetadataId == null) {
      throw new BadRequestError("errMsg_documentMetadataIdisRequired");
    }

    // ID
    if (
      this.documentMetadataId &&
      !isValidObjectId(this.documentMetadataId) &&
      !isValidUUID(this.documentMetadataId)
    ) {
      throw new BadRequestError("errMsg_documentMetadataIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.documentMetadata?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbDeleteDocumentmetadata function to delete the documentmetadata and return the result to the controller
    const documentmetadata = await dbDeleteDocumentmetadata(this);

    return documentmetadata;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.documentMetadataId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = DeleteDocumentmetadataManager;
