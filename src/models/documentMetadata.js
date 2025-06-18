const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Holds all metadata fields for a document, including classification (document type), manual and enriched metadata, and policy/enrichment status. Linked to documentCore.document.
const DocumentMetadata = sequelize.define(
  "documentMetadata",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    documentId: {
      // ID of the business document this metadata belongs to.
      type: DataTypes.UUID,
      allowNull: false,
    },
    typeId: {
      // ID of the document type (classification) assigned to this document metadata. Can be null for unclassified or custom types.
      type: DataTypes.UUID,
      allowNull: true,
    },
    customTypeName: {
      // If custom document type is used, stores its string name.
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      // Arbitrary metadata object; includes both standard and custom fields. Accepts nested JSON, suitable for enrichment.
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: "{}",
    },
    uniqueDocumentIdentifier: {
      // Globally unique document identifier (e.g., DOI or DKB ID) if assigned via enrichment.
      type: DataTypes.STRING,
      allowNull: true,
    },
    isEnriched: {
      // Whether this metadata record has been successfully enriched by DOI/DKB or similar enrichment.
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    enrichmentStatus: {
      // Enrichment status: none=0, pending=1, success=2, failed=3
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "none",
    },
    lastEnrichmentJobId: {
      // Reference to the latest metadataEnrichmentJob record relevant to this metadata.
      type: DataTypes.UUID,
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
    indexes: [
      {
        unique: true,
        fields: ["documentId"],
        where: { isActive: true },
      },

      {
        unique: true,
        fields: ["uniqueDocumentIdentifier"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = DocumentMetadata;
