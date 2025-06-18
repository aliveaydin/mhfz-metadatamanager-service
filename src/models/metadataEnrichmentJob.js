const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Tracks jobs submitted for enrichment of document metadata via DOI/DKB/external integrations. Stores job status, input, output, errors, and traceability.
const MetadataEnrichmentJob = sequelize.define(
  "metadataEnrichmentJob",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    documentMetadataId: {
      // ID of the documentMetadata record this job is enriching.
      type: DataTypes.UUID,
      allowNull: false,
    },
    enrichmentSource: {
      // Source system for metadata enrichment (doi=0, dkb=1, other=2)
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "doi",
    },
    status: {
      // Job status: pending=0, running=1, success=2, failed=3, cancelled=4
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    submittedAt: {
      // Submission date/time of the enrichment job.
      type: DataTypes.DATE,
      allowNull: false,
    },
    completedAt: {
      // Completion date/time of the enrichment job (null if not finished).
      type: DataTypes.DATE,
      allowNull: true,
    },
    inputMetadataSnapshot: {
      // JSON snapshot of documentMetadata at the start of the enrichment job.
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: "{}",
    },
    outputEnrichedMetadata: {
      // Returned JSON object from DOI/DKB enrichment for audit and trace.
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: "{}",
    },
    errorDetail: {
      // Error, exception, or response from the enrichment source if job failed.
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      // isActive property will be set to false when deleted
      // so that the document will be archived
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },
  },
  {
    indexes: [],
  },
);

module.exports = MetadataEnrichmentJob;
