const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetDocumenttypeCommand is exported from main code

describe("DbGetDocumenttypeCommand", () => {
  let DbGetDocumenttypeCommand, dbGetDocumenttype;
  let sandbox, DocumentTypeStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    DocumentTypeStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.documentTypeId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetDocumenttypeCommand, dbGetDocumenttype } = proxyquire(
      "../../../../src/db-layer/main/documentType/dbGetDocumenttype",
      {
        models: { DocumentType: DocumentTypeStub },
        dbCommand: {
          DBGetSequelizeCommand: BaseCommandStub,
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
    it("should set command metadata correctly", () => {
      const cmd = new DbGetDocumenttypeCommand({});
      expect(cmd.commandName).to.equal("dbGetDocumenttype");
      expect(cmd.objectName).to.equal("documentType");
      expect(cmd.serviceLabel).to.equal("mhfz-metadatamanager-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call DocumentType.getCqrsJoins if exists", async () => {
      const cmd = new DbGetDocumenttypeCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(DocumentTypeStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete DocumentTypeStub.getCqrsJoins;
      const cmd = new DbGetDocumenttypeCommand({});
      let errorThrown = false;
      try {
        await cmd.getCqrsJoins({});
      } catch (err) {
        errorThrown = true;
      }

      expect(errorThrown).to.be.false;
    });
  });

  describe("buildIncludes", () => {
    it("should return [] includes", () => {
      const cmd = new DbGetDocumenttypeCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetDocumenttypeCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetDocumenttype", () => {
    it("should execute dbGetDocumenttype and return documentType data", async () => {
      const result = await dbGetDocumenttype({
        documentTypeId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
