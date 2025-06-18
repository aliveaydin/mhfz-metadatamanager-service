const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetMetadataenrichmentjobCommand is exported from main code

describe("DbGetMetadataenrichmentjobCommand", () => {
  let DbGetMetadataenrichmentjobCommand, dbGetMetadataenrichmentjob;
  let sandbox, MetadataEnrichmentJobStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MetadataEnrichmentJobStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.metadataEnrichmentJobId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetMetadataenrichmentjobCommand, dbGetMetadataenrichmentjob } =
      proxyquire(
        "../../../../src/db-layer/main/metadataEnrichmentJob/dbGetMetadataenrichmentjob",
        {
          models: { MetadataEnrichmentJob: MetadataEnrichmentJobStub },
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
      const cmd = new DbGetMetadataenrichmentjobCommand({});
      expect(cmd.commandName).to.equal("dbGetMetadataenrichmentjob");
      expect(cmd.objectName).to.equal("metadataEnrichmentJob");
      expect(cmd.serviceLabel).to.equal("mhfz-metadatamanager-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call MetadataEnrichmentJob.getCqrsJoins if exists", async () => {
      const cmd = new DbGetMetadataenrichmentjobCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(MetadataEnrichmentJobStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete MetadataEnrichmentJobStub.getCqrsJoins;
      const cmd = new DbGetMetadataenrichmentjobCommand({});
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
      const cmd = new DbGetMetadataenrichmentjobCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetMetadataenrichmentjobCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetMetadataenrichmentjob", () => {
    it("should execute dbGetMetadataenrichmentjob and return metadataEnrichmentJob data", async () => {
      const result = await dbGetMetadataenrichmentjob({
        metadataEnrichmentJobId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
