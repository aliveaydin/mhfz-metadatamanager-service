const { ElasticIndexer } = require("serviceCommon");
const { hexaLogger } = require("common");

const documentMetadataMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  documentId: { type: "keyword", index: true },
  typeId: { type: "keyword", index: true },
  customTypeName: { type: "keyword", index: true },
  metadata: { properties: {} },
  uniqueDocumentIdentifier: { type: "keyword", index: true },
  isEnriched: { type: "boolean", null_value: false },
  enrichmentStatus: { type: "keyword", index: true },
  enrichmentStatus_: { type: "keyword" },
  lastEnrichmentJobId: { type: "keyword", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const documentTypeMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  typeName: { type: "keyword", index: true },
  description: { type: "text", index: true },
  isSystemType: { type: "boolean", null_value: false },
  requiredFields: { type: "object", enabled: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const metadataEnrichmentJobMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  documentMetadataId: { type: "keyword", index: true },
  enrichmentSource: { type: "keyword", index: true },
  enrichmentSource_: { type: "keyword" },
  status: { type: "keyword", index: true },
  status_: { type: "keyword" },
  submittedAt: { type: "date", index: true },
  completedAt: { type: "date", index: false },
  inputMetadataSnapshot: { type: "object", enabled: false },
  outputEnrichedMetadata: { type: "object", enabled: false },
  errorDetail: { type: "text", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};

const updateElasticIndexMappings = async () => {
  try {
    ElasticIndexer.addMapping("documentMetadata", documentMetadataMapping);
    await new ElasticIndexer("documentMetadata").updateMapping(
      documentMetadataMapping,
    );
    ElasticIndexer.addMapping("documentType", documentTypeMapping);
    await new ElasticIndexer("documentType").updateMapping(documentTypeMapping);
    ElasticIndexer.addMapping(
      "metadataEnrichmentJob",
      metadataEnrichmentJobMapping,
    );
    await new ElasticIndexer("metadataEnrichmentJob").updateMapping(
      metadataEnrichmentJobMapping,
    );
  } catch (err) {
    hexaLogger.insertError(
      "UpdateElasticIndexMappingsError",
      { function: "updateElasticIndexMappings" },
      "elastic-index.js->updateElasticIndexMappings",
      err,
    );
  }
};

module.exports = updateElasticIndexMappings;
