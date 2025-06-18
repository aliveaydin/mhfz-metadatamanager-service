const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteDocumenttypeCommand is exported from main code

describe("DbDeleteDocumenttypeCommand", () => {
  let DbDeleteDocumenttypeCommand, dbDeleteDocumenttype;
  let sandbox,
    DocumentTypeStub,
    getDocumentTypeByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    DocumentTypeStub = {};

    getDocumentTypeByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.documentTypeId || 123 };
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

    ({ DbDeleteDocumenttypeCommand, dbDeleteDocumenttype } = proxyquire(
      "../../../../src/db-layer/main/documentType/dbDeleteDocumenttype",
      {
        models: { DocumentType: DocumentTypeStub },
        "./query-cache-classes": {
          DocumentTypeQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getDocumentTypeById": getDocumentTypeByIdStub,
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
      const cmd = new DbDeleteDocumenttypeCommand({});
      expect(cmd.commandName).to.equal("dbDeleteDocumenttype");
      expect(cmd.objectName).to.equal("documentType");
      expect(cmd.serviceLabel).to.equal("mhfz-metadatamanager-service");
      expect(cmd.dbEvent).to.equal(
        "mhfz-metadatamanager-service-dbevent-documenttype-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteDocumenttypeCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteDocumenttype", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getDocumentTypeByIdStub.resolves(mockInstance);

      const input = {
        documentTypeId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteDocumenttype(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
