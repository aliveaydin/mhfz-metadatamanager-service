const express = require("express");

// DocumentMetadata Db Object Rest Api Router
const documentMetadataRouter = express.Router();

// add DocumentMetadata controllers

// getDocumentMetadata controller
documentMetadataRouter.get(
  "/documentmetadatas/:documentMetadataId",
  require("./get-documentmetadata"),
);
// createDocumentMetadata controller
documentMetadataRouter.post(
  "/documentmetadatas",
  require("./create-documentmetadata"),
);
// updateDocumentMetadata controller
documentMetadataRouter.patch(
  "/documentmetadatas/:documentMetadataId",
  require("./update-documentmetadata"),
);
// deleteDocumentMetadata controller
documentMetadataRouter.delete(
  "/documentmetadatas/:documentMetadataId",
  require("./delete-documentmetadata"),
);
// listDocumentMetadata controller
documentMetadataRouter.get(
  "/documentmetadata",
  require("./list-documentmetadata"),
);

module.exports = documentMetadataRouter;
