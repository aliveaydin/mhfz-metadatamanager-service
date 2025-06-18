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
const { dbUpdateMetadataenrichmentjob } = require("dbLayer");

class UpdateMetadataenrichmentjobManager extends MetadataEnrichmentJobManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateMetadataenrichmentjob",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "metadataEnrichmentJob";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.status = this.status;
    jsonObj.completedAt = this.completedAt;
    jsonObj.outputEnrichedMetadata = this.outputEnrichedMetadata;
    jsonObj.errorDetail = this.errorDetail;
    jsonObj.metadataEnrichmentJobId = this.metadataEnrichmentJobId;
  }

  readRestParameters(request) {
    this.status = request.body?.status;
    this.completedAt = request.body?.completedAt;
    this.outputEnrichedMetadata = request.body?.outputEnrichedMetadata;
    this.errorDetail = request.body?.errorDetail;
    this.metadataEnrichmentJobId = request.params?.metadataEnrichmentJobId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getMetadataEnrichmentJobById } = require("dbLayer");
    this.metadataEnrichmentJob = await getMetadataEnrichmentJobById(
      this.metadataEnrichmentJobId,
    );
    if (!this.metadataEnrichmentJob) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.metadataEnrichmentJobId == null) {
      throw new BadRequestError("errMsg_metadataEnrichmentJobIdisRequired");
    }

    // ID
    if (
      this.metadataEnrichmentJobId &&
      !isValidObjectId(this.metadataEnrichmentJobId) &&
      !isValidUUID(this.metadataEnrichmentJobId)
    ) {
      throw new BadRequestError("errMsg_metadataEnrichmentJobIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.metadataEnrichmentJob?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateMetadataenrichmentjob function to update the metadataenrichmentjob and return the result to the controller
    const metadataenrichmentjob = await dbUpdateMetadataenrichmentjob(this);

    return metadataenrichmentjob;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.metadataEnrichmentJobId }, { isActive: true }] };

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
      status: this.status,
      completedAt: this.completedAt,
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

module.exports = UpdateMetadataenrichmentjobManager;
