const { getDocumentMetadataById } = require("dbLayer");
const { getDocumentTypeById } = require("dbLayer");
const { getMetadataEnrichmentJobById } = require("dbLayer");
const { DocumentMetadata } = require("models");
const { DocumentType } = require("models");
const { MetadataEnrichmentJob } = require("models");
const path = require("path");
const fs = require("fs");
const { ElasticIndexer } = require("serviceCommon");
const { Op } = require("sequelize");

const indexDocumentMetadataData = async () => {
  const documentMetadataIndexer = new ElasticIndexer("documentMetadata", {
    isSilent: true,
  });
  console.log("Starting to update indexes for DocumentMetadata");

  const idListData = await DocumentMetadata.findAll({
    attributes: ["id"],
  });
  const idList = idListData ? idListData.map((item) => item.id) : [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getDocumentMetadataById(chunk);
    if (dataList.length) {
      await documentMetadataIndexer.indexBulkData(dataList);
      await documentMetadataIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexDocumentTypeData = async () => {
  const documentTypeIndexer = new ElasticIndexer("documentType", {
    isSilent: true,
  });
  console.log("Starting to update indexes for DocumentType");

  const idListData = await DocumentType.findAll({
    attributes: ["id"],
  });
  const idList = idListData ? idListData.map((item) => item.id) : [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getDocumentTypeById(chunk);
    if (dataList.length) {
      await documentTypeIndexer.indexBulkData(dataList);
      await documentTypeIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexMetadataEnrichmentJobData = async () => {
  const metadataEnrichmentJobIndexer = new ElasticIndexer(
    "metadataEnrichmentJob",
    { isSilent: true },
  );
  console.log("Starting to update indexes for MetadataEnrichmentJob");

  const idListData = await MetadataEnrichmentJob.findAll({
    attributes: ["id"],
  });
  const idList = idListData ? idListData.map((item) => item.id) : [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getMetadataEnrichmentJobById(chunk);
    if (dataList.length) {
      await metadataEnrichmentJobIndexer.indexBulkData(dataList);
      await metadataEnrichmentJobIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const syncElasticIndexData = async () => {
  const startTime = new Date();
  console.log("syncElasticIndexData started", startTime);

  try {
    const dataCount = await indexDocumentMetadataData();
    console.log(
      "DocumentMetadata agregated data is indexed, total documentMetadatas:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing DocumentMetadata data",
      err.toString(),
    );
    hexaLogger.insertError(
      "ElasticIndexInitError",
      { function: "indexDocumentMetadataData" },
      "syncElasticIndexData.js->indexDocumentMetadataData",
      err,
    );
  }

  try {
    const dataCount = await indexDocumentTypeData();
    console.log(
      "DocumentType agregated data is indexed, total documentTypes:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing DocumentType data",
      err.toString(),
    );
    hexaLogger.insertError(
      "ElasticIndexInitError",
      { function: "indexDocumentTypeData" },
      "syncElasticIndexData.js->indexDocumentTypeData",
      err,
    );
  }

  try {
    const dataCount = await indexMetadataEnrichmentJobData();
    console.log(
      "MetadataEnrichmentJob agregated data is indexed, total metadataEnrichmentJobs:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing MetadataEnrichmentJob data",
      err.toString(),
    );
    hexaLogger.insertError(
      "ElasticIndexInitError",
      { function: "indexMetadataEnrichmentJobData" },
      "syncElasticIndexData.js->indexMetadataEnrichmentJobData",
      err,
    );
  }

  const elapsedTime = new Date() - startTime;
  console.log("initElasticIndexData ended -> elapsedTime:", elapsedTime);
};

module.exports = syncElasticIndexData;
