const utils = require("./utils");

module.exports = {
  dbGetDocumenttype: require("./dbGetDocumenttype"),
  dbCreateDocumenttype: require("./dbCreateDocumenttype"),
  dbUpdateDocumenttype: require("./dbUpdateDocumenttype"),
  dbDeleteDocumenttype: require("./dbDeleteDocumenttype"),
  dbListDocumenttypes: require("./dbListDocumenttypes"),
  createDocumentType: utils.createDocumentType,
  getIdListOfDocumentTypeByField: utils.getIdListOfDocumentTypeByField,
  getDocumentTypeById: utils.getDocumentTypeById,
  getDocumentTypeAggById: utils.getDocumentTypeAggById,
  getDocumentTypeListByQuery: utils.getDocumentTypeListByQuery,
  getDocumentTypeStatsByQuery: utils.getDocumentTypeStatsByQuery,
  getDocumentTypeByQuery: utils.getDocumentTypeByQuery,
  updateDocumentTypeById: utils.updateDocumentTypeById,
  updateDocumentTypeByIdList: utils.updateDocumentTypeByIdList,
  updateDocumentTypeByQuery: utils.updateDocumentTypeByQuery,
  deleteDocumentTypeById: utils.deleteDocumentTypeById,
  deleteDocumentTypeByQuery: utils.deleteDocumentTypeByQuery,
};
