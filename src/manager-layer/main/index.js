module.exports = {
  // main Database Crud Object Routes Manager Layer Classes
  // DocumentMetadata Db Object
  GetDocumentmetadataManager: require("./documentMetadata/get-documentmetadata"),
  CreateDocumentmetadataManager: require("./documentMetadata/create-documentmetadata"),
  UpdateDocumentmetadataManager: require("./documentMetadata/update-documentmetadata"),
  DeleteDocumentmetadataManager: require("./documentMetadata/delete-documentmetadata"),
  ListDocumentmetadataManager: require("./documentMetadata/list-documentmetadata"),
  // DocumentType Db Object
  GetDocumenttypeManager: require("./documentType/get-documenttype"),
  CreateDocumenttypeManager: require("./documentType/create-documenttype"),
  UpdateDocumenttypeManager: require("./documentType/update-documenttype"),
  DeleteDocumenttypeManager: require("./documentType/delete-documenttype"),
  ListDocumenttypesManager: require("./documentType/list-documenttypes"),
  // MetadataEnrichmentJob Db Object
  GetMetadataenrichmentjobManager: require("./metadataEnrichmentJob/get-metadataenrichmentjob"),
  CreateMetadataenrichmentjobManager: require("./metadataEnrichmentJob/create-metadataenrichmentjob"),
  UpdateMetadataenrichmentjobManager: require("./metadataEnrichmentJob/update-metadataenrichmentjob"),
  DeleteMetadataenrichmentjobManager: require("./metadataEnrichmentJob/delete-metadataenrichmentjob"),
  ListMetadataenrichmentjobsManager: require("./metadataEnrichmentJob/list-metadataenrichmentjobs"),
};
