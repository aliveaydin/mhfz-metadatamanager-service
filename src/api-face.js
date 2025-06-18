const { inject } = require("mindbricks-api-face");

module.exports = (app) => {
  const authUrl = (process.env.SERVICE_URL ?? "mindbricks.com").replace(
    process.env.SERVICE_SHORT_NAME,
    "auth",
  );

  const config = {
    name: "mhfz - metadataManager",
    brand: {
      name: "mhfz",
      image: "https://mindbricks.com/favicon.ico",
      moduleName: "metadataManager",
    },
    auth: {
      url: authUrl,
      loginPath: "/login",
      logoutPath: "/logout",
      currentUserPath: "/currentuser",
      authStrategy: "external",
      initialAuth: true,
    },
    dataObjects: [
      {
        name: "DocumentMetadata",
        description:
          "Holds all metadata fields for a document, including classification (document type), manual and enriched metadata, and policy/enrichment status. Linked to documentCore.document.",
        reference: {
          tableName: "documentMetadata",
          properties: [
            {
              name: "documentId",
              type: "ID",
            },

            {
              name: "typeId",
              type: "ID",
            },

            {
              name: "customTypeName",
              type: "String",
            },

            {
              name: "metadata",
              type: "Object",
            },

            {
              name: "uniqueDocumentIdentifier",
              type: "String",
            },

            {
              name: "isEnriched",
              type: "Boolean",
            },

            {
              name: "enrichmentStatus",
              type: "Enum",
            },

            {
              name: "lastEnrichmentJobId",
              type: "ID",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/documentmetadatas/{documentMetadataId}",
            title: "getDocumentMetadata",
            query: [],

            parameters: [
              {
                key: "documentMetadataId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/documentmetadatas",
            title: "createDocumentMetadata",
            query: [],

            body: {
              type: "json",
              content: {
                documentId: "ID",
                typeId: "ID",
                customTypeName: "String",
                metadata: "Object",
                uniqueDocumentIdentifier: "String",
                isEnriched: "Boolean",
                enrichmentStatus: "Enum",
                lastEnrichmentJobId: "ID",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/documentmetadatas/{documentMetadataId}",
            title: "updateDocumentMetadata",
            query: [],

            body: {
              type: "json",
              content: {
                typeId: "ID",
                customTypeName: "String",
                metadata: "Object",
                isEnriched: "Boolean",
                enrichmentStatus: "Enum",
              },
            },

            parameters: [
              {
                key: "documentMetadataId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/documentmetadatas/{documentMetadataId}",
            title: "deleteDocumentMetadata",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "documentMetadataId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/documentmetadata",
            title: "listDocumentMetadata",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "DocumentType",
        description:
          "Catalog of document types (classification schemas), both system-defined and user/custom defined. Used for standardization, required field policies, and classification.",
        reference: {
          tableName: "documentType",
          properties: [
            {
              name: "typeName",
              type: "String",
            },

            {
              name: "description",
              type: "Text",
            },

            {
              name: "isSystemType",
              type: "Boolean",
            },

            {
              name: "requiredFields",
              type: "Object",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/documenttypes/{documentTypeId}",
            title: "getDocumentType",
            query: [],

            parameters: [
              {
                key: "documentTypeId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/documenttypes",
            title: "createDocumentType",
            query: [],

            body: {
              type: "json",
              content: {
                typeName: "String",
                description: "Text",
                isSystemType: "Boolean",
                requiredFields: "Object",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/documenttypes/{documentTypeId}",
            title: "updateDocumentType",
            query: [],

            body: {
              type: "json",
              content: {
                typeName: "String",
                description: "Text",
                requiredFields: "Object",
              },
            },

            parameters: [
              {
                key: "documentTypeId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/documenttypes/{documentTypeId}",
            title: "deleteDocumentType",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "documentTypeId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/documenttypes",
            title: "listDocumentTypes",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "MetadataEnrichmentJob",
        description:
          "Tracks jobs submitted for enrichment of document metadata via DOI/DKB/external integrations. Stores job status, input, output, errors, and traceability.",
        reference: {
          tableName: "metadataEnrichmentJob",
          properties: [
            {
              name: "documentMetadataId",
              type: "ID",
            },

            {
              name: "enrichmentSource",
              type: "Enum",
            },

            {
              name: "status",
              type: "Enum",
            },

            {
              name: "submittedAt",
              type: "Date",
            },

            {
              name: "completedAt",
              type: "Date",
            },

            {
              name: "inputMetadataSnapshot",
              type: "Object",
            },

            {
              name: "outputEnrichedMetadata",
              type: "Object",
            },

            {
              name: "errorDetail",
              type: "Text",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/metadataenrichmentjobs/{metadataEnrichmentJobId}",
            title: "getMetadataEnrichmentJob",
            query: [],

            parameters: [
              {
                key: "metadataEnrichmentJobId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/metadataenrichmentjobs",
            title: "createMetadataEnrichmentJob",
            query: [],

            body: {
              type: "json",
              content: {
                documentMetadataId: "ID",
                enrichmentSource: "Enum",
                status: "Enum",
                submittedAt: "Date",
                completedAt: "Date",
                inputMetadataSnapshot: "Object",
                outputEnrichedMetadata: "Object",
                errorDetail: "Text",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/metadataenrichmentjobs/{metadataEnrichmentJobId}",
            title: "updateMetadataEnrichmentJob",
            query: [],

            body: {
              type: "json",
              content: {
                status: "Enum",
                completedAt: "Date",
                outputEnrichedMetadata: "Object",
                errorDetail: "Text",
              },
            },

            parameters: [
              {
                key: "metadataEnrichmentJobId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/metadataenrichmentjobs/{metadataEnrichmentJobId}",
            title: "deleteMetadataEnrichmentJob",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "metadataEnrichmentJobId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/metadataenrichmentjobs",
            title: "listMetadataEnrichmentJobs",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },
    ],
  };

  inject(app, config);
};
