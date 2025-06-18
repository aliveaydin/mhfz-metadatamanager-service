const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetDocumentmetadataCommand is exported from main code

describe("DbGetDocumentmetadataCommand", () => {
  let DbGetDocumentmetadataCommand, dbGetDocumentmetadata;
  let sandbox, DocumentMetadataStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    DocumentMetadataStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.documentMetadataId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetDocumentmetadataCommand, dbGetDocumentmetadata } = proxyquire(
      "../../../../src/db-layer/main/documentMetadata/dbGetDocumentmetadata",
      {
        models: { DocumentMetadata: DocumentMetadataStub },
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
      const cmd = new DbGetDocumentmetadataCommand({});
      expect(cmd.commandName).to.equal("dbGetDocumentmetadata");
      expect(cmd.objectName).to.equal("documentMetadata");
      expect(cmd.serviceLabel).to.equal("mhfz-metadatamanager-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call DocumentMetadata.getCqrsJoins if exists", async () => {
      const cmd = new DbGetDocumentmetadataCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(DocumentMetadataStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete DocumentMetadataStub.getCqrsJoins;
      const cmd = new DbGetDocumentmetadataCommand({});
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
      const cmd = new DbGetDocumentmetadataCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetDocumentmetadataCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetDocumentmetadata", () => {
    it("should execute dbGetDocumentmetadata and return documentMetadata data", async () => {
      const result = await dbGetDocumentmetadata({
        documentMetadataId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
