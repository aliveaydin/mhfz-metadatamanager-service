# Service Design Specification - Object Design for documentMetadata

**mhfz-metadatamanager-service** documentation

## Document Overview

This document outlines the object design for the `documentMetadata` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## documentMetadata Data Object

### Object Overview

**Description:** Holds all metadata fields for a document, including classification (document type), manual and enriched metadata, and policy/enrichment status. Linked to documentCore.document.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **unique_document_documentMetadata**: [documentId]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.
  The index also defines a conflict resolution strategy for duplicate key violations.
  When a new record would violate this composite index, the following action will be taken:
  **On Duplicate**: `throwError`
  An error will be thrown, preventing the insertion of conflicting data.

### Properties Schema

| Property                   | Type    | Required | Description                                                                                                                |
| -------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `documentId`               | ID      | Yes      | ID of the business document this metadata belongs to.                                                                      |
| `typeId`                   | ID      | No       | ID of the document type (classification) assigned to this document metadata. Can be null for unclassified or custom types. |
| `customTypeName`           | String  | No       | If custom document type is used, stores its string name.                                                                   |
| `metadata`                 | Object  | No       | Arbitrary metadata object; includes both standard and custom fields. Accepts nested JSON, suitable for enrichment.         |
| `uniqueDocumentIdentifier` | String  | No       | Globally unique document identifier (e.g., DOI or DKB ID) if assigned via enrichment.                                      |
| `isEnriched`               | Boolean | No       | Whether this metadata record has been successfully enriched by DOI/DKB or similar enrichment.                              |
| `enrichmentStatus`         | Enum    | No       | Enrichment status: none=0, pending=1, success=2, failed=3                                                                  |
| `lastEnrichmentJobId`      | ID      | No       | Reference to the latest metadataEnrichmentJob record relevant to this metadata.                                            |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Default Values

Default values are automatically assigned to properties when a new object is created, if no value is provided in the request body.
Since default values are applied on db level, they should be literal values, not expressions.If you want to use expressions, you can use transposed parameters in any crud route to set default values dynamically.

- **metadata**: {}

### Constant Properties

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

- **documentId**: ID

- **uniqueDocumentIdentifier**: String

- **lastEnrichmentJobId**: ID

### Auto Update Properties

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

- **documentId**: ID

- **typeId**: ID

- **customTypeName**: String

- **metadata**: Object

- **isEnriched**: Boolean

- **enrichmentStatus**: Enum

### Enum Properties

Enum properties are defined with a set of allowed values, ensuring that only valid options can be assigned to them.
The enum options value will be stored as strings in the database,
but when a data object is created an addtional property with the same name plus an idx suffix will be created, which will hold the index of the selected enum option.
You can use the index property to sort by the enum value or when your enum options represent a sequence of values.

- **enrichmentStatus**: [none, pending, success, failed]

### Elastic Search Indexing

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API. While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

- **documentId**: ID

- **typeId**: ID

- **customTypeName**: String

- **metadata**: Object

- **uniqueDocumentIdentifier**: String

- **isEnriched**: Boolean

- **enrichmentStatus**: Enum

### Database Indexing

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

- **documentId**: ID

- **uniqueDocumentIdentifier**: String

### Unique Properties

Unique properties are enforced to have distinct values across all instances of the data object, preventing duplicate entries.
Note that a unique property is automatically indexed in the database so you will not need to set the `Indexed in DB` option.

- **documentId**: ID

- **uniqueDocumentIdentifier**: String

### Relation Properties

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **documentId**: ID
  Relation to `document`.id

The target object is a parent object, meaning that the relation is a one-to-many relationship from target to this object.

On Delete: Set Null
Required: Yes

- **typeId**: ID
  Relation to `documentType`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

- **lastEnrichmentJobId**: ID
  Relation to `metadataenrichmentjob`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: Yes

### Filter Properties

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **documentId**: ID has a filter named `documentId`

- **typeId**: ID has a filter named `typeId`

- **uniqueDocumentIdentifier**: String has a filter named `uniqueDocumentIdentifier`

- **isEnriched**: Boolean has a filter named `isEnriched`

- **enrichmentStatus**: Enum has a filter named `enrichmentStatus`
