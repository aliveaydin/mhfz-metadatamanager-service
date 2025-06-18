const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const MetadataManagerServiceManager = require("../../service-manager/MetadataManagerServiceManager");

/* Base Class For the Crud Routes Of DbObject MetadataEnrichmentJob */
class MetadataEnrichmentJobManager extends MetadataManagerServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "metadataEnrichmentJob";
    this.modelName = "MetadataEnrichmentJob";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = MetadataEnrichmentJobManager;
