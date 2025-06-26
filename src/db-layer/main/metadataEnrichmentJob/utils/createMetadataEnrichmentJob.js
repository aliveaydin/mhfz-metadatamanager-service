const { HttpServerError, BadRequestError } = require("common");

const { ElasticIndexer } = require("serviceCommon");

const { MetadataEnrichmentJob } = require("models");
const { hexaLogger, newUUID } = require("common");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer(
    "metadataEnrichmentJob",
    this.session,
    this.requestId,
  );
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = [];

  requiredFields.forEach((field) => {
    if (data[field] === null || data[field] === undefined) {
      throw new BadRequestError(
        `Field "${field}" is required and cannot be null or undefined.`,
      );
    }
  });

  if (!data.id) {
    data.id = newUUID();
  }
};

const createMetadataEnrichmentJob = async (data) => {
  try {
    validateData(data);

    const newmetadataEnrichmentJob = await MetadataEnrichmentJob.create(data);
    const _data = newmetadataEnrichmentJob.getData();
    await indexDataToElastic(_data);
    return _data;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenCreatingMetadataEnrichmentJob",
      err,
    );
  }
};

module.exports = createMetadataEnrichmentJob;
