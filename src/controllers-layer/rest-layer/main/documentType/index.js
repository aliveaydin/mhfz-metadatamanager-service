const express = require("express");

// DocumentType Db Object Rest Api Router
const documentTypeRouter = express.Router();

// add DocumentType controllers

// getDocumentType controller
documentTypeRouter.get(
  "/documenttypes/:documentTypeId",
  require("./get-documenttype"),
);
// createDocumentType controller
documentTypeRouter.post("/documenttypes", require("./create-documenttype"));
// updateDocumentType controller
documentTypeRouter.patch(
  "/documenttypes/:documentTypeId",
  require("./update-documenttype"),
);
// deleteDocumentType controller
documentTypeRouter.delete(
  "/documenttypes/:documentTypeId",
  require("./delete-documenttype"),
);
// listDocumentTypes controller
documentTypeRouter.get("/documenttypes", require("./list-documenttypes"));

module.exports = documentTypeRouter;
