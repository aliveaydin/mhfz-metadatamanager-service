const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Catalog of document types (classification schemas), both system-defined and user/custom defined. Used for standardization, required field policies, and classification.
const DocumentType = sequelize.define(
  "documentType",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    typeName: {
      // Human-readable name for the document type (e.g., 'Contract', 'Invoice', 'Meeting Minutes', or custom).
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      // Description of the document type and its use cases.
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isSystemType: {
      // If true, this is a system-defined (not user-removable) document type.
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    requiredFields: {
      // JSON specifying field names and validation for required fields for documents of this type. Used for compliance/policy.
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: "{}",
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
        fields: ["typeName"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = DocumentType;
