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
const { dbDeleteMetadataenrichmentjob } = require("dbLayer");

class DeleteMetadataenrichmentjobManager extends MetadataEnrichmentJobManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteMetadataenrichmentjob",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "metadataEnrichmentJob";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.metadataEnrichmentJobId = this.metadataEnrichmentJobId;
  }

  readRestParameters(request) {
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
    // make an awaited call to the dbDeleteMetadataenrichmentjob function to delete the metadataenrichmentjob and return the result to the controller
    const metadataenrichmentjob = await dbDeleteMetadataenrichmentjob(this);

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
}

module.exports = DeleteMetadataenrichmentjobManager;
