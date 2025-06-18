const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateDocumentmetadataCommand is exported from main code
describe("DbCreateDocumentmetadataCommand", () => {
  let DbCreateDocumentmetadataCommand, dbCreateDocumentmetadata;
  let sandbox,
    DocumentMetadataStub,
    ElasticIndexerStub,
    getDocumentMetadataByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    DocumentMetadataStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getDocumentMetadataByIdStub = sandbox
      .stub()
      .resolves({ id: 1, name: "Mock Client" });

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input) {
        this.input = input;
        this.dataClause = input.dataClause || {};
        this.session = input.session;
        this.requestId = input.requestId;
        this.dbData = { id: 9 };
      }

      async runDbCommand() {}
      async execute() {
        return this.dbData;
      }
      loadHookFunctions() {}
      createEntityCacher() {}
      normalizeSequalizeOps(w) {
        return w;
      }
      createQueryCacheInvalidator() {}
    };

    ({ DbCreateDocumentmetadataCommand, dbCreateDocumentmetadata } = proxyquire(
      "../../../../src/db-layer/main/documentMetadata/dbCreateDocumentmetadata",
      {
        models: { DocumentMetadata: DocumentMetadataStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getDocumentMetadataById": getDocumentMetadataByIdStub,
        dbCommand: { DBCreateSequelizeCommand: BaseCommandStub },
        "./query-cache-classes": {
          ClientQueryCacheInvalidator: sandbox.stub(),
        },
        common: {
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
    it("should assign initial properties", () => {
      const cmd = new DbCreateDocumentmetadataCommand({});
      expect(cmd.commandName).to.equal("dbCreateDocumentmetadata");
      expect(cmd.objectName).to.equal("documentMetadata");
      expect(cmd.serviceLabel).to.equal("mhfz-metadatamanager-service");
      expect(cmd.dbEvent).to.equal(
        "mhfz-metadatamanager-service-dbevent-documentmetadata-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getDocumentMetadataById and indexData", async () => {
      const cmd = new DbCreateDocumentmetadataCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getDocumentMetadataByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing documentMetadata if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockdocumentMetadata = { update: updateStub, getData: () => ({ id: 2 }) };

      DocumentMetadataStub.findOne = sandbox.stub().resolves(mockdocumentMetadata);
      DocumentMetadataStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          documentId: "documentId_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateDocumentmetadataCommand(input);
      await cmd.runDbCommand();

      expect(input.documentMetadata).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new documentMetadata if no unique match is found", async () => {
      DocumentMetadataStub.findOne = sandbox.stub().resolves(null);
      DocumentMetadataStub.findByPk = sandbox.stub().resolves(null);
      DocumentMetadataStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          documentId: "documentId_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateDocumentmetadataCommand(input);
      await cmd.runDbCommand();

      expect(input.documentMetadata).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(DocumentMetadataStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      DocumentMetadataStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateDocumentmetadataCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateDocumentmetadata", () => {
    it("should execute successfully and return dbData", async () => {
      DocumentMetadataStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "documentMetadata" } };
      const result = await dbCreateDocumentmetadata(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
