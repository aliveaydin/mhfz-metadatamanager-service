const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class MetadataEnrichmentJobQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("metadataEnrichmentJob", [], Op.and, Op.eq, input, wClause);
  }
}
class MetadataEnrichmentJobQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("metadataEnrichmentJob", []);
  }
}

module.exports = {
  MetadataEnrichmentJobQueryCache,
  MetadataEnrichmentJobQueryCacheInvalidator,
};
