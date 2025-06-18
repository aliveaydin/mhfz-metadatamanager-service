const express = require("express");

// MetadataEnrichmentJob Db Object Rest Api Router
const metadataEnrichmentJobRouter = express.Router();

// add MetadataEnrichmentJob controllers

// getMetadataEnrichmentJob controller
metadataEnrichmentJobRouter.get(
  "/metadataenrichmentjobs/:metadataEnrichmentJobId",
  require("./get-metadataenrichmentjob"),
);
// createMetadataEnrichmentJob controller
metadataEnrichmentJobRouter.post(
  "/metadataenrichmentjobs",
  require("./create-metadataenrichmentjob"),
);
// updateMetadataEnrichmentJob controller
metadataEnrichmentJobRouter.patch(
  "/metadataenrichmentjobs/:metadataEnrichmentJobId",
  require("./update-metadataenrichmentjob"),
);
// deleteMetadataEnrichmentJob controller
metadataEnrichmentJobRouter.delete(
  "/metadataenrichmentjobs/:metadataEnrichmentJobId",
  require("./delete-metadataenrichmentjob"),
);
// listMetadataEnrichmentJobs controller
metadataEnrichmentJobRouter.get(
  "/metadataenrichmentjobs",
  require("./list-metadataenrichmentjobs"),
);

module.exports = metadataEnrichmentJobRouter;
