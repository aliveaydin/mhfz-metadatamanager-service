const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbUpdateMetadataenrichmentjobCommand is exported from main code

describe("DbUpdateMetadataenrichmentjobCommand", () => {
  let DbUpdateMetadataenrichmentjobCommand, dbUpdateMetadataenrichmentjob;
  let sandbox,
    getMetadataEnrichmentJobByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    getMetadataEnrichmentJobByIdStub = sandbox
      .stub()
      .resolves({ id: 99, name: "Updated metadataEnrichmentJob" });

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dbData = { id: input.id || 99 };
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
      async execute() {
        await this.createQueryCacheInvalidator?.();
        await this.createDbInstance?.();
        await this.indexDataToElastic?.();
        return this.dbData;
      }
    };

    ({ DbUpdateMetadataenrichmentjobCommand, dbUpdateMetadataenrichmentjob } =
      proxyquire(
        "../../../../src/db-layer/main/metadataEnrichmentJob/dbUpdateMetadataenrichmentjob",
        {
          "./utils/getMetadataEnrichmentJobById":
            getMetadataEnrichmentJobByIdStub,
          "./query-cache-classes": {
            MetadataEnrichmentJobQueryCacheInvalidator: sandbox.stub(),
          },
          serviceCommon: { ElasticIndexer: ElasticIndexerStub },
          dbCommand: {
            DBUpdateSequelizeCommand: BaseCommandStub,
          },
          common: {
            NotFoundError: class NotFoundError extends Error {
              constructor(msg) {
                super(msg);
                this.name = "NotFoundError";
              }
            },
          },
          models: {
            User: {},
          },
        },
      ));
  });

  afterEach(() => sandbox.restore());

  describe("constructor", () => {
    it("should set command metadata correctly", () => {
      const cmd = new DbUpdateMetadataenrichmentjobCommand({
        MetadataEnrichmentJobId: 1,
      });
      expect(cmd.commandName).to.equal("dbUpdateMetadataenrichmentjob");
      expect(cmd.objectName).to.equal("metadataEnrichmentJob");
      expect(cmd.serviceLabel).to.equal("mhfz-metadatamanager-service");
      expect(cmd.isBulk).to.be.false;
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with dbData.id", async () => {
      const cmd = new DbUpdateMetadataenrichmentjobCommand({
        session: "s",
        requestId: "r",
      });

      cmd.dbData = { id: 101 };
      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getMetadataEnrichmentJobByIdStub, 101);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().indexData, {
        id: 99,
        name: "Updated metadataEnrichmentJob",
      });
    });
  });

  describe("buildIncludes", () => {
    it("should return [] includes", () => {
      const cmd = new DbUpdateMetadataenrichmentjobCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });
    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbUpdateMetadataenrichmentjobCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbUpdateMetadataenrichmentjob", () => {
    it("should execute update successfully", async () => {
      const result = await dbUpdateMetadataenrichmentjob({
        metadataEnrichmentJobId: 99,
        session: "abc",
        requestId: "xyz",
      });

      expect(result).to.deep.equal({ id: 99 });
    });
  });
});
