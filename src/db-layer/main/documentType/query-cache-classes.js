const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class DocumentTypeQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("documentType", [], Op.and, Op.eq, input, wClause);
  }
}
class DocumentTypeQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("documentType", []);
  }
}

module.exports = {
  DocumentTypeQueryCache,
  DocumentTypeQueryCacheInvalidator,
};
