const { DataTypes } = require("sequelize");
const { getEnumValue } = require("serviceCommon");
const { ElasticIndexer } = require("serviceCommon");
const updateElasticIndexMappings = require("./elastic-index");
const { hexaLogger } = require("common");

const DocumentMetadata = require("./documentMetadata");
const DocumentType = require("./documentType");
const MetadataEnrichmentJob = require("./metadataEnrichmentJob");

DocumentMetadata.prototype.getData = function () {
  const data = this.dataValues;

  data.documentType = this.documentType
    ? this.documentType.getData()
    : undefined;
  data.lastEnrichmentJob = this.lastEnrichmentJob
    ? this.lastEnrichmentJob.getData()
    : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const enrichmentStatusOptions = ["none", "pending", "success", "failed"];
  const dataTypeenrichmentStatusDocumentMetadata = typeof data.enrichmentStatus;
  const enumIndexenrichmentStatusDocumentMetadata =
    dataTypeenrichmentStatusDocumentMetadata === "string"
      ? enrichmentStatusOptions.indexOf(data.enrichmentStatus)
      : data.enrichmentStatus;
  data.enrichmentStatus_idx = enumIndexenrichmentStatusDocumentMetadata;
  data.enrichmentStatus =
    enumIndexenrichmentStatusDocumentMetadata > -1
      ? enrichmentStatusOptions[enumIndexenrichmentStatusDocumentMetadata]
      : undefined;

  return data;
};

DocumentMetadata.belongsTo(DocumentType, {
  as: "documentType",
  foreignKey: "typeId",
  targetKey: "id",
  constraints: false,
});

DocumentMetadata.belongsTo(MetadataEnrichmentJob, {
  as: "lastEnrichmentJob",
  foreignKey: "lastEnrichmentJobId",
  targetKey: "id",
  constraints: false,
});

DocumentType.prototype.getData = function () {
  const data = this.dataValues;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  return data;
};

MetadataEnrichmentJob.prototype.getData = function () {
  const data = this.dataValues;

  data.documentMetadata = this.documentMetadata
    ? this.documentMetadata.getData()
    : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const enrichmentSourceOptions = ["doi", "dkb", "other"];
  const dataTypeenrichmentSourceMetadataEnrichmentJob =
    typeof data.enrichmentSource;
  const enumIndexenrichmentSourceMetadataEnrichmentJob =
    dataTypeenrichmentSourceMetadataEnrichmentJob === "string"
      ? enrichmentSourceOptions.indexOf(data.enrichmentSource)
      : data.enrichmentSource;
  data.enrichmentSource_idx = enumIndexenrichmentSourceMetadataEnrichmentJob;
  data.enrichmentSource =
    enumIndexenrichmentSourceMetadataEnrichmentJob > -1
      ? enrichmentSourceOptions[enumIndexenrichmentSourceMetadataEnrichmentJob]
      : undefined;
  // set enum Index and enum value
  const statusOptions = [
    "pending",
    "running",
    "success",
    "failed",
    "cancelled",
  ];
  const dataTypestatusMetadataEnrichmentJob = typeof data.status;
  const enumIndexstatusMetadataEnrichmentJob =
    dataTypestatusMetadataEnrichmentJob === "string"
      ? statusOptions.indexOf(data.status)
      : data.status;
  data.status_idx = enumIndexstatusMetadataEnrichmentJob;
  data.status =
    enumIndexstatusMetadataEnrichmentJob > -1
      ? statusOptions[enumIndexstatusMetadataEnrichmentJob]
      : undefined;

  return data;
};

MetadataEnrichmentJob.belongsTo(DocumentMetadata, {
  as: "documentMetadata",
  foreignKey: "documentMetadataId",
  targetKey: "id",
  constraints: false,
});

module.exports = {
  DocumentMetadata,
  DocumentType,
  MetadataEnrichmentJob,
  updateElasticIndexMappings,
};
