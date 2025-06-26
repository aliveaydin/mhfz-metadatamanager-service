# Service Design Specification - Object Design for documentType

**mhfz-metadatamanager-service** documentation

## Document Overview

This document outlines the object design for the `documentType` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## documentType Data Object

### Object Overview

**Description:** Catalog of document types (classification schemas), both system-defined and user/custom defined. Used for standardization, required field policies, and classification.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **unique_typeName_perTenant**: [typeName]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

### Properties Schema

| Property         | Type    | Required | Description                                                                                                                    |
| ---------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `typeName`       | String  | Yes      | Human-readable name for the document type (e.g., &#39;Contract&#39;, &#39;Invoice&#39;, &#39;Meeting Minutes&#39;, or custom). |
| `description`    | Text    | No       | Description of the document type and its use cases.                                                                            |
| `isSystemType`   | Boolean | Yes      | If true, this is a system-defined (not user-removable) document type.                                                          |
| `requiredFields` | Object  | No       | JSON specifying field names and validation for required fields for documents of this type. Used for compliance/policy.         |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Default Values

Default values are automatically assigned to properties when a new object is created, if no value is provided in the request body.
Since default values are applied on db level, they should be literal values, not expressions.If you want to use expressions, you can use transposed parameters in any crud route to set default values dynamically.

- **requiredFields**: {}

### Constant Properties

`isSystemType`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Auto Update Properties

`typeName` `description` `requiredFields`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Elastic Search Indexing

`typeName` `description`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`typeName`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Unique Properties

`typeName`

Unique properties are enforced to have distinct values across all instances of the data object, preventing duplicate entries.
Note that a unique property is automatically indexed in the database so you will not need to set the `Indexed in DB` option.

### Filter Properties

`typeName` `isSystemType`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **typeName**: String has a filter named `typeName`

- **isSystemType**: Boolean has a filter named `isSystemType`
