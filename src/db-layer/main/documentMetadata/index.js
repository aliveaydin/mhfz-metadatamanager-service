const utils = require("./utils");

module.exports = {
  dbGetDocumentmetadata: require("./dbGetDocumentmetadata"),
  dbCreateDocumentmetadata: require("./dbCreateDocumentmetadata"),
  dbUpdateDocumentmetadata: require("./dbUpdateDocumentmetadata"),
  dbDeleteDocumentmetadata: require("./dbDeleteDocumentmetadata"),
  dbListDocumentmetadata: require("./dbListDocumentmetadata"),
  createDocumentMetadata: utils.createDocumentMetadata,
  getIdListOfDocumentMetadataByField: utils.getIdListOfDocumentMetadataByField,
  getDocumentMetadataById: utils.getDocumentMetadataById,
  getDocumentMetadataAggById: utils.getDocumentMetadataAggById,
  getDocumentMetadataListByQuery: utils.getDocumentMetadataListByQuery,
  getDocumentMetadataStatsByQuery: utils.getDocumentMetadataStatsByQuery,
  getDocumentMetadataByQuery: utils.getDocumentMetadataByQuery,
  updateDocumentMetadataById: utils.updateDocumentMetadataById,
  updateDocumentMetadataByIdList: utils.updateDocumentMetadataByIdList,
  updateDocumentMetadataByQuery: utils.updateDocumentMetadataByQuery,
  deleteDocumentMetadataById: utils.deleteDocumentMetadataById,
  deleteDocumentMetadataByQuery: utils.deleteDocumentMetadataByQuery,
};
