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
const { dbUpdateDocumentmetadata } = require("dbLayer");

class UpdateDocumentmetadataManager extends DocumentMetadataManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateDocumentmetadata",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "documentMetadata";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.typeId = this.typeId;
    jsonObj.customTypeName = this.customTypeName;
    jsonObj.metadata = this.metadata;
    jsonObj.isEnriched = this.isEnriched;
    jsonObj.enrichmentStatus = this.enrichmentStatus;
    jsonObj.documentMetadataId = this.documentMetadataId;
  }

  readRestParameters(request) {
    this.typeId = request.body?.typeId;
    this.customTypeName = request.body?.customTypeName;
    this.metadata = request.body?.metadata;
    this.isEnriched = request.body?.isEnriched;
    this.enrichmentStatus = request.body?.enrichmentStatus;
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
      this.typeId &&
      !isValidObjectId(this.typeId) &&
      !isValidUUID(this.typeId)
    ) {
      throw new BadRequestError("errMsg_typeIdisNotAValidID");
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
    // make an awaited call to the dbUpdateDocumentmetadata function to update the documentmetadata and return the result to the controller
    const documentmetadata = await dbUpdateDocumentmetadata(this);

    return documentmetadata;
  }

  async getRouteQuery() {
    return {
      $and: [{ documentId: { $eq: this.documentId } }, { isActive: true }],
    };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      typeId: this.typeId,
      customTypeName: this.customTypeName,
      metadata: this.metadata
        ? typeof this.metadata == "string"
          ? JSON.parse(this.metadata)
          : this.metadata
        : null,
      isEnriched: this.isEnriched,
      enrichmentStatus: this.enrichmentStatus,
    };

    return dataClause;
  }
}

module.exports = UpdateDocumentmetadataManager;
