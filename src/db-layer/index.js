const mainFunctions = require("./main");

module.exports = {
  // main Database
  // DocumentMetadata Db Object
  dbGetDocumentmetadata: mainFunctions.dbGetDocumentmetadata,
  dbCreateDocumentmetadata: mainFunctions.dbCreateDocumentmetadata,
  dbUpdateDocumentmetadata: mainFunctions.dbUpdateDocumentmetadata,
  dbDeleteDocumentmetadata: mainFunctions.dbDeleteDocumentmetadata,
  dbListDocumentmetadata: mainFunctions.dbListDocumentmetadata,
  createDocumentMetadata: mainFunctions.createDocumentMetadata,
  getIdListOfDocumentMetadataByField:
    mainFunctions.getIdListOfDocumentMetadataByField,
  getDocumentMetadataById: mainFunctions.getDocumentMetadataById,
  getDocumentMetadataAggById: mainFunctions.getDocumentMetadataAggById,
  getDocumentMetadataListByQuery: mainFunctions.getDocumentMetadataListByQuery,
  getDocumentMetadataStatsByQuery:
    mainFunctions.getDocumentMetadataStatsByQuery,
  getDocumentMetadataByQuery: mainFunctions.getDocumentMetadataByQuery,
  updateDocumentMetadataById: mainFunctions.updateDocumentMetadataById,
  updateDocumentMetadataByIdList: mainFunctions.updateDocumentMetadataByIdList,
  updateDocumentMetadataByQuery: mainFunctions.updateDocumentMetadataByQuery,
  deleteDocumentMetadataById: mainFunctions.deleteDocumentMetadataById,
  deleteDocumentMetadataByQuery: mainFunctions.deleteDocumentMetadataByQuery,
  // DocumentType Db Object
  dbGetDocumenttype: mainFunctions.dbGetDocumenttype,
  dbCreateDocumenttype: mainFunctions.dbCreateDocumenttype,
  dbUpdateDocumenttype: mainFunctions.dbUpdateDocumenttype,
  dbDeleteDocumenttype: mainFunctions.dbDeleteDocumenttype,
  dbListDocumenttypes: mainFunctions.dbListDocumenttypes,
  createDocumentType: mainFunctions.createDocumentType,
  getIdListOfDocumentTypeByField: mainFunctions.getIdListOfDocumentTypeByField,
  getDocumentTypeById: mainFunctions.getDocumentTypeById,
  getDocumentTypeAggById: mainFunctions.getDocumentTypeAggById,
  getDocumentTypeListByQuery: mainFunctions.getDocumentTypeListByQuery,
  getDocumentTypeStatsByQuery: mainFunctions.getDocumentTypeStatsByQuery,
  getDocumentTypeByQuery: mainFunctions.getDocumentTypeByQuery,
  updateDocumentTypeById: mainFunctions.updateDocumentTypeById,
  updateDocumentTypeByIdList: mainFunctions.updateDocumentTypeByIdList,
  updateDocumentTypeByQuery: mainFunctions.updateDocumentTypeByQuery,
  deleteDocumentTypeById: mainFunctions.deleteDocumentTypeById,
  deleteDocumentTypeByQuery: mainFunctions.deleteDocumentTypeByQuery,
  // MetadataEnrichmentJob Db Object
  dbGetMetadataenrichmentjob: mainFunctions.dbGetMetadataenrichmentjob,
  dbCreateMetadataenrichmentjob: mainFunctions.dbCreateMetadataenrichmentjob,
  dbUpdateMetadataenrichmentjob: mainFunctions.dbUpdateMetadataenrichmentjob,
  dbDeleteMetadataenrichmentjob: mainFunctions.dbDeleteMetadataenrichmentjob,
  dbListMetadataenrichmentjobs: mainFunctions.dbListMetadataenrichmentjobs,
  createMetadataEnrichmentJob: mainFunctions.createMetadataEnrichmentJob,
  getIdListOfMetadataEnrichmentJobByField:
    mainFunctions.getIdListOfMetadataEnrichmentJobByField,
  getMetadataEnrichmentJobById: mainFunctions.getMetadataEnrichmentJobById,
  getMetadataEnrichmentJobAggById:
    mainFunctions.getMetadataEnrichmentJobAggById,
  getMetadataEnrichmentJobListByQuery:
    mainFunctions.getMetadataEnrichmentJobListByQuery,
  getMetadataEnrichmentJobStatsByQuery:
    mainFunctions.getMetadataEnrichmentJobStatsByQuery,
  getMetadataEnrichmentJobByQuery:
    mainFunctions.getMetadataEnrichmentJobByQuery,
  updateMetadataEnrichmentJobById:
    mainFunctions.updateMetadataEnrichmentJobById,
  updateMetadataEnrichmentJobByIdList:
    mainFunctions.updateMetadataEnrichmentJobByIdList,
  updateMetadataEnrichmentJobByQuery:
    mainFunctions.updateMetadataEnrichmentJobByQuery,
  deleteMetadataEnrichmentJobById:
    mainFunctions.deleteMetadataEnrichmentJobById,
  deleteMetadataEnrichmentJobByQuery:
    mainFunctions.deleteMetadataEnrichmentJobByQuery,
};
