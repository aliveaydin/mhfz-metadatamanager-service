const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteDocumentmetadataCommand is exported from main code

describe("DbDeleteDocumentmetadataCommand", () => {
  let DbDeleteDocumentmetadataCommand, dbDeleteDocumentmetadata;
  let sandbox,
    DocumentMetadataStub,
    getDocumentMetadataByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    DocumentMetadataStub = {};

    getDocumentMetadataByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.documentMetadataId || 123 };
        this.dbInstance = null;
      }

      loadHookFunctions() {}
      initOwnership() {}
      async execute() {
        await this.createQueryCacheInvalidator?.();
        await this.createDbInstance?.();
        await this.indexDataToElastic?.();
        return this.dbData;
      }
    };

    ({ DbDeleteDocumentmetadataCommand, dbDeleteDocumentmetadata } = proxyquire(
      "../../../../src/db-layer/main/documentMetadata/dbDeleteDocumentmetadata",
      {
        models: { DocumentMetadata: DocumentMetadataStub },
        "./query-cache-classes": {
          DocumentMetadataQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getDocumentMetadataById": getDocumentMetadataByIdStub,
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        dbCommand: {
          DBSoftDeleteSequelizeCommand: BaseCommandStub,
        },
        common: {
          NotFoundError: class NotFoundError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "NotFoundError";
            }
          },
          HttpServerError: class extends Error {
            constructor(msg, details) {
              super(msg);
              this.details = details;
            }
          },
        },
      },
    ));
  });

  afterEach(() => sandbox.restore());

  describe("constructor", () => {
    it("should set command metadata correctly", () => {
      const cmd = new DbDeleteDocumentmetadataCommand({});
      expect(cmd.commandName).to.equal("dbDeleteDocumentmetadata");
      expect(cmd.objectName).to.equal("documentMetadata");
      expect(cmd.serviceLabel).to.equal("mhfz-metadatamanager-service");
      expect(cmd.dbEvent).to.equal(
        "mhfz-metadatamanager-service-dbevent-documentmetadata-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteDocumentmetadataCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteDocumentmetadata", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getDocumentMetadataByIdStub.resolves(mockInstance);

      const input = {
        documentMetadataId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteDocumentmetadata(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
