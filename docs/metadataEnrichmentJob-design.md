# Service Design Specification - Object Design for metadataEnrichmentJob

**mhfz-metadatamanager-service** documentation

## Document Overview

This document outlines the object design for the `metadataEnrichmentJob` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## metadataEnrichmentJob Data Object

### Object Overview

**Description:** Tracks jobs submitted for enrichment of document metadata via DOI/DKB/external integrations. Stores job status, input, output, errors, and traceability.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Properties Schema

| Property                 | Type   | Required | Description                                                             |
| ------------------------ | ------ | -------- | ----------------------------------------------------------------------- |
| `documentMetadataId`     | ID     | Yes      | ID of the documentMetadata record this job is enriching.                |
| `enrichmentSource`       | Enum   | Yes      | Source system for metadata enrichment (doi=0, dkb=1, other=2)           |
| `status`                 | Enum   | Yes      | Job status: pending=0, running=1, success=2, failed=3, cancelled=4      |
| `submittedAt`            | Date   | Yes      | Submission date/time of the enrichment job.                             |
| `completedAt`            | Date   | No       | Completion date/time of the enrichment job (null if not finished).      |
| `inputMetadataSnapshot`  | Object | No       | JSON snapshot of documentMetadata at the start of the enrichment job.   |
| `outputEnrichedMetadata` | Object | No       | Returned JSON object from DOI/DKB enrichment for audit and trace.       |
| `errorDetail`            | Text   | No       | Error, exception, or response from the enrichment source if job failed. |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Default Values

Default values are automatically assigned to properties when a new object is created, if no value is provided in the request body.
Since default values are applied on db level, they should be literal values, not expressions.If you want to use expressions, you can use transposed parameters in any crud route to set default values dynamically.

- **inputMetadataSnapshot**: {}
- **outputEnrichedMetadata**: {}

### Constant Properties

`documentMetadataId` `enrichmentSource` `submittedAt` `inputMetadataSnapshot`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Auto Update Properties

`status` `completedAt` `outputEnrichedMetadata` `errorDetail`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Enum Properties

Enum properties are defined with a set of allowed values, ensuring that only valid options can be assigned to them.
The enum options value will be stored as strings in the database,
but when a data object is created an addtional property with the same name plus an idx suffix will be created, which will hold the index of the selected enum option.
You can use the index property to sort by the enum value or when your enum options represent a sequence of values.

- **enrichmentSource**: [doi, dkb, other]

- **status**: [pending, running, success, failed, cancelled]

### Elastic Search Indexing

`documentMetadataId` `enrichmentSource` `status` `submittedAt`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Relation Properties

`documentMetadataId`

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **documentMetadataId**: ID
  Relation to `documentMetadata`.id

The target object is a parent object, meaning that the relation is a one-to-many relationship from target to this object.

On Delete: Set Null
Required: Yes

### Filter Properties

`enrichmentSource` `status`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **enrichmentSource**: Enum has a filter named `enrichmentSource`

- **status**: Enum has a filter named `status`
