const documentMetadataFunctions = require("./documentMetadata");
const documentTypeFunctions = require("./documentType");
const metadataEnrichmentJobFunctions = require("./metadataEnrichmentJob");

module.exports = {
  // main Database
  // DocumentMetadata Db Object
  dbGetDocumentmetadata: documentMetadataFunctions.dbGetDocumentmetadata,
  dbCreateDocumentmetadata: documentMetadataFunctions.dbCreateDocumentmetadata,
  dbUpdateDocumentmetadata: documentMetadataFunctions.dbUpdateDocumentmetadata,
  dbDeleteDocumentmetadata: documentMetadataFunctions.dbDeleteDocumentmetadata,
  dbListDocumentmetadata: documentMetadataFunctions.dbListDocumentmetadata,
  createDocumentMetadata: documentMetadataFunctions.createDocumentMetadata,
  getIdListOfDocumentMetadataByField:
    documentMetadataFunctions.getIdListOfDocumentMetadataByField,
  getDocumentMetadataById: documentMetadataFunctions.getDocumentMetadataById,
  getDocumentMetadataAggById:
    documentMetadataFunctions.getDocumentMetadataAggById,
  getDocumentMetadataListByQuery:
    documentMetadataFunctions.getDocumentMetadataListByQuery,
  getDocumentMetadataStatsByQuery:
    documentMetadataFunctions.getDocumentMetadataStatsByQuery,
  getDocumentMetadataByQuery:
    documentMetadataFunctions.getDocumentMetadataByQuery,
  updateDocumentMetadataById:
    documentMetadataFunctions.updateDocumentMetadataById,
  updateDocumentMetadataByIdList:
    documentMetadataFunctions.updateDocumentMetadataByIdList,
  updateDocumentMetadataByQuery:
    documentMetadataFunctions.updateDocumentMetadataByQuery,
  deleteDocumentMetadataById:
    documentMetadataFunctions.deleteDocumentMetadataById,
  deleteDocumentMetadataByQuery:
    documentMetadataFunctions.deleteDocumentMetadataByQuery,
  // DocumentType Db Object
  dbGetDocumenttype: documentTypeFunctions.dbGetDocumenttype,
  dbCreateDocumenttype: documentTypeFunctions.dbCreateDocumenttype,
  dbUpdateDocumenttype: documentTypeFunctions.dbUpdateDocumenttype,
  dbDeleteDocumenttype: documentTypeFunctions.dbDeleteDocumenttype,
  dbListDocumenttypes: documentTypeFunctions.dbListDocumenttypes,
  createDocumentType: documentTypeFunctions.createDocumentType,
  getIdListOfDocumentTypeByField:
    documentTypeFunctions.getIdListOfDocumentTypeByField,
  getDocumentTypeById: documentTypeFunctions.getDocumentTypeById,
  getDocumentTypeAggById: documentTypeFunctions.getDocumentTypeAggById,
  getDocumentTypeListByQuery: documentTypeFunctions.getDocumentTypeListByQuery,
  getDocumentTypeStatsByQuery:
    documentTypeFunctions.getDocumentTypeStatsByQuery,
  getDocumentTypeByQuery: documentTypeFunctions.getDocumentTypeByQuery,
  updateDocumentTypeById: documentTypeFunctions.updateDocumentTypeById,
  updateDocumentTypeByIdList: documentTypeFunctions.updateDocumentTypeByIdList,
  updateDocumentTypeByQuery: documentTypeFunctions.updateDocumentTypeByQuery,
  deleteDocumentTypeById: documentTypeFunctions.deleteDocumentTypeById,
  deleteDocumentTypeByQuery: documentTypeFunctions.deleteDocumentTypeByQuery,
  // MetadataEnrichmentJob Db Object
  dbGetMetadataenrichmentjob:
    metadataEnrichmentJobFunctions.dbGetMetadataenrichmentjob,
  dbCreateMetadataenrichmentjob:
    metadataEnrichmentJobFunctions.dbCreateMetadataenrichmentjob,
  dbUpdateMetadataenrichmentjob:
    metadataEnrichmentJobFunctions.dbUpdateMetadataenrichmentjob,
  dbDeleteMetadataenrichmentjob:
    metadataEnrichmentJobFunctions.dbDeleteMetadataenrichmentjob,
  dbListMetadataenrichmentjobs:
    metadataEnrichmentJobFunctions.dbListMetadataenrichmentjobs,
  createMetadataEnrichmentJob:
    metadataEnrichmentJobFunctions.createMetadataEnrichmentJob,
  getIdListOfMetadataEnrichmentJobByField:
    metadataEnrichmentJobFunctions.getIdListOfMetadataEnrichmentJobByField,
  getMetadataEnrichmentJobById:
    metadataEnrichmentJobFunctions.getMetadataEnrichmentJobById,
  getMetadataEnrichmentJobAggById:
    metadataEnrichmentJobFunctions.getMetadataEnrichmentJobAggById,
  getMetadataEnrichmentJobListByQuery:
    metadataEnrichmentJobFunctions.getMetadataEnrichmentJobListByQuery,
  getMetadataEnrichmentJobStatsByQuery:
    metadataEnrichmentJobFunctions.getMetadataEnrichmentJobStatsByQuery,
  getMetadataEnrichmentJobByQuery:
    metadataEnrichmentJobFunctions.getMetadataEnrichmentJobByQuery,
  updateMetadataEnrichmentJobById:
    metadataEnrichmentJobFunctions.updateMetadataEnrichmentJobById,
  updateMetadataEnrichmentJobByIdList:
    metadataEnrichmentJobFunctions.updateMetadataEnrichmentJobByIdList,
  updateMetadataEnrichmentJobByQuery:
    metadataEnrichmentJobFunctions.updateMetadataEnrichmentJobByQuery,
  deleteMetadataEnrichmentJobById:
    metadataEnrichmentJobFunctions.deleteMetadataEnrichmentJobById,
  deleteMetadataEnrichmentJobByQuery:
    metadataEnrichmentJobFunctions.deleteMetadataEnrichmentJobByQuery,
};
