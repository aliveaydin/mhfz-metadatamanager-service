const MetadataEnrichmentJobManager = require("./MetadataEnrichmentJobManager");
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
const { dbCreateMetadataenrichmentjob } = require("dbLayer");

class CreateMetadataenrichmentjobManager extends MetadataEnrichmentJobManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createMetadataenrichmentjob",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "metadataEnrichmentJob";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.documentMetadataId = this.documentMetadataId;
    jsonObj.enrichmentSource = this.enrichmentSource;
    jsonObj.status = this.status;
    jsonObj.submittedAt = this.submittedAt;
    jsonObj.completedAt = this.completedAt;
    jsonObj.inputMetadataSnapshot = this.inputMetadataSnapshot;
    jsonObj.outputEnrichedMetadata = this.outputEnrichedMetadata;
    jsonObj.errorDetail = this.errorDetail;
  }

  readRestParameters(request) {
    this.documentMetadataId = request.body?.documentMetadataId;
    this.enrichmentSource = request.body?.enrichmentSource;
    this.status = request.body?.status;
    this.submittedAt = request.body?.submittedAt;
    this.completedAt = request.body?.completedAt;
    this.inputMetadataSnapshot = request.body?.inputMetadataSnapshot;
    this.outputEnrichedMetadata = request.body?.outputEnrichedMetadata;
    this.errorDetail = request.body?.errorDetail;
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
      this.documentMetadataId &&
      !isValidObjectId(this.documentMetadataId) &&
      !isValidUUID(this.documentMetadataId)
    ) {
      throw new BadRequestError("errMsg_documentMetadataIdisNotAValidID");
    }
  }

  async setLayer1Variables() {
    // stored layer1 validations

    await this.fetchDoiEnrichmentResponse();
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.metadataEnrichmentJob?._owner === this.session.userId;
  }

  async fetchDoiEnrichmentResponse() {
    let doiEnrichmentResponse = null;
    try {
      const fetchResponse = await fetch("https://doi-enrichment.api/metadata", {
        method: "POST",
        headers: { "xxx-access-token": "Bearer xxx-access-token-value" },
        body: [],
      });

      const jsonResponse = await fetchResponse.json();

      doiEnrichmentResponse = jsonResponse;
    } catch (err) {
      console.error(`Error in fetching doiEnrichmentResponse:`, err);
      doiEnrichmentResponse = { error: err.message };
    }

    this.doiEnrichmentResponse = doiEnrichmentResponse ?? null;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateMetadataenrichmentjob function to create the metadataenrichmentjob and return the result to the controller
    const metadataenrichmentjob = await dbCreateMetadataenrichmentjob(this);

    return metadataenrichmentjob;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.metadataEnrichmentJobId = this.id;
    if (!this.metadataEnrichmentJobId)
      this.metadataEnrichmentJobId = newUUID(false);

    const dataClause = {
      id: this.metadataEnrichmentJobId,
      documentMetadataId: this.documentMetadataId,
      enrichmentSource: this.enrichmentSource,
      status: this.status,
      submittedAt: this.submittedAt,
      completedAt: this.completedAt,
      inputMetadataSnapshot: this.inputMetadataSnapshot
        ? typeof this.inputMetadataSnapshot == "string"
          ? JSON.parse(this.inputMetadataSnapshot)
          : this.inputMetadataSnapshot
        : null,
      outputEnrichedMetadata: this.outputEnrichedMetadata
        ? typeof this.outputEnrichedMetadata == "string"
          ? JSON.parse(this.outputEnrichedMetadata)
          : this.outputEnrichedMetadata
        : null,
      errorDetail: this.errorDetail,
    };

    return dataClause;
  }
}

module.exports = CreateMetadataenrichmentjobManager;
