module.exports = {
  MetadataManagerServiceManager: require("./service-manager/MetadataManagerServiceManager"),
  // main Database Crud Object Routes Manager Layer Classes
  // DocumentMetadata Db Object
  GetDocumentmetadataManager: require("./main/documentMetadata/get-documentmetadata"),
  CreateDocumentmetadataManager: require("./main/documentMetadata/create-documentmetadata"),
  UpdateDocumentmetadataManager: require("./main/documentMetadata/update-documentmetadata"),
  DeleteDocumentmetadataManager: require("./main/documentMetadata/delete-documentmetadata"),
  ListDocumentmetadataManager: require("./main/documentMetadata/list-documentmetadata"),
  // DocumentType Db Object
  GetDocumenttypeManager: require("./main/documentType/get-documenttype"),
  CreateDocumenttypeManager: require("./main/documentType/create-documenttype"),
  UpdateDocumenttypeManager: require("./main/documentType/update-documenttype"),
  DeleteDocumenttypeManager: require("./main/documentType/delete-documenttype"),
  ListDocumenttypesManager: require("./main/documentType/list-documenttypes"),
  // MetadataEnrichmentJob Db Object
  GetMetadataenrichmentjobManager: require("./main/metadataEnrichmentJob/get-metadataenrichmentjob"),
  CreateMetadataenrichmentjobManager: require("./main/metadataEnrichmentJob/create-metadataenrichmentjob"),
  UpdateMetadataenrichmentjobManager: require("./main/metadataEnrichmentJob/update-metadataenrichmentjob"),
  DeleteMetadataenrichmentjobManager: require("./main/metadataEnrichmentJob/delete-metadataenrichmentjob"),
  ListMetadataenrichmentjobsManager: require("./main/metadataEnrichmentJob/list-metadataenrichmentjobs"),
};
