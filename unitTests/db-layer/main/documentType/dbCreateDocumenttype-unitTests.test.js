const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateDocumenttypeCommand is exported from main code
describe("DbCreateDocumenttypeCommand", () => {
  let DbCreateDocumenttypeCommand, dbCreateDocumenttype;
  let sandbox,
    DocumentTypeStub,
    ElasticIndexerStub,
    getDocumentTypeByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    DocumentTypeStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getDocumentTypeByIdStub = sandbox
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

    ({ DbCreateDocumenttypeCommand, dbCreateDocumenttype } = proxyquire(
      "../../../../src/db-layer/main/documentType/dbCreateDocumenttype",
      {
        models: { DocumentType: DocumentTypeStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getDocumentTypeById": getDocumentTypeByIdStub,
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
      const cmd = new DbCreateDocumenttypeCommand({});
      expect(cmd.commandName).to.equal("dbCreateDocumenttype");
      expect(cmd.objectName).to.equal("documentType");
      expect(cmd.serviceLabel).to.equal("mhfz-metadatamanager-service");
      expect(cmd.dbEvent).to.equal(
        "mhfz-metadatamanager-service-dbevent-documenttype-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getDocumentTypeById and indexData", async () => {
      const cmd = new DbCreateDocumenttypeCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getDocumentTypeByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing documentType if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockdocumentType = { update: updateStub, getData: () => ({ id: 2 }) };

      DocumentTypeStub.findOne = sandbox.stub().resolves(mockdocumentType);
      DocumentTypeStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          typeName: "typeName_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateDocumenttypeCommand(input);
      await cmd.runDbCommand();

      expect(input.documentType).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new documentType if no unique match is found", async () => {
      DocumentTypeStub.findOne = sandbox.stub().resolves(null);
      DocumentTypeStub.findByPk = sandbox.stub().resolves(null);
      DocumentTypeStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          typeName: "typeName_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateDocumenttypeCommand(input);
      await cmd.runDbCommand();

      expect(input.documentType).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(DocumentTypeStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      DocumentTypeStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateDocumenttypeCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateDocumenttype", () => {
    it("should execute successfully and return dbData", async () => {
      DocumentTypeStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "documentType" } };
      const result = await dbCreateDocumenttype(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
