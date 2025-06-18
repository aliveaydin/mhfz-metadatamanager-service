const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class DocumentMetadataQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("documentMetadata", [], Op.and, Op.eq, input, wClause);
  }
}
class DocumentMetadataQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("documentMetadata", []);
  }
}

module.exports = {
  DocumentMetadataQueryCache,
  DocumentMetadataQueryCacheInvalidator,
};
