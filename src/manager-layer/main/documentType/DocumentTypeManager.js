const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const MetadataManagerServiceManager = require("../../service-manager/MetadataManagerServiceManager");

/* Base Class For the Crud Routes Of DbObject DocumentType */
class DocumentTypeManager extends MetadataManagerServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "documentType";
    this.modelName = "DocumentType";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = DocumentTypeManager;
