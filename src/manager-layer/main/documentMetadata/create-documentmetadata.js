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
const { dbCreateDocumentmetadata } = require("dbLayer");

class CreateDocumentmetadataManager extends DocumentMetadataManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createDocumentmetadata",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "documentMetadata";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.documentId = this.documentId;
    jsonObj.typeId = this.typeId;
    jsonObj.customTypeName = this.customTypeName;
    jsonObj.metadata = this.metadata;
    jsonObj.uniqueDocumentIdentifier = this.uniqueDocumentIdentifier;
    jsonObj.isEnriched = this.isEnriched;
    jsonObj.enrichmentStatus = this.enrichmentStatus;
    jsonObj.lastEnrichmentJobId = this.lastEnrichmentJobId;
  }

  readRestParameters(request) {
    this.documentId = request.body?.documentId;
    this.typeId = request.body?.typeId;
    this.customTypeName = request.body?.customTypeName;
    this.metadata = request.body?.metadata;
    this.uniqueDocumentIdentifier = request.body?.uniqueDocumentIdentifier;
    this.isEnriched = request.body?.isEnriched;
    this.enrichmentStatus = request.body?.enrichmentStatus;
    this.lastEnrichmentJobId = request.body?.lastEnrichmentJobId;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    // ID
    if (
      this.documentId &&
      !isValidObjectId(this.documentId) &&
      !isValidUUID(this.documentId)
    ) {
      throw new BadRequestError("errMsg_documentIdisNotAValidID");
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
      this.lastEnrichmentJobId &&
      !isValidObjectId(this.lastEnrichmentJobId) &&
      !isValidUUID(this.lastEnrichmentJobId)
    ) {
      throw new BadRequestError("errMsg_lastEnrichmentJobIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.documentMetadata?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateDocumentmetadata function to create the documentmetadata and return the result to the controller
    const documentmetadata = await dbCreateDocumentmetadata(this);

    return documentmetadata;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.documentMetadataId = this.id;
    if (!this.documentMetadataId) this.documentMetadataId = newUUID(false);

    const dataClause = {
      id: this.documentMetadataId,
      documentId: this.documentId,
      typeId: this.typeId,
      customTypeName: this.customTypeName,
      metadata: this.metadata
        ? typeof this.metadata == "string"
          ? JSON.parse(this.metadata)
          : this.metadata
        : null,
      uniqueDocumentIdentifier: this.uniqueDocumentIdentifier,
      isEnriched: this.isEnriched,
      enrichmentStatus: this.enrichmentStatus,
      lastEnrichmentJobId: this.lastEnrichmentJobId,
    };

    return dataClause;
  }
}

module.exports = CreateDocumentmetadataManager;
