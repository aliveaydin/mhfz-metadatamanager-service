const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteMetadataenrichmentjobCommand is exported from main code

describe("DbDeleteMetadataenrichmentjobCommand", () => {
  let DbDeleteMetadataenrichmentjobCommand, dbDeleteMetadataenrichmentjob;
  let sandbox,
    MetadataEnrichmentJobStub,
    getMetadataEnrichmentJobByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MetadataEnrichmentJobStub = {};

    getMetadataEnrichmentJobByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.metadataEnrichmentJobId || 123 };
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

    ({ DbDeleteMetadataenrichmentjobCommand, dbDeleteMetadataenrichmentjob } =
      proxyquire(
        "../../../../src/db-layer/main/metadataEnrichmentJob/dbDeleteMetadataenrichmentjob",
        {
          models: { MetadataEnrichmentJob: MetadataEnrichmentJobStub },
          "./query-cache-classes": {
            MetadataEnrichmentJobQueryCacheInvalidator: sandbox.stub(),
          },
          "./utils/getMetadataEnrichmentJobById":
            getMetadataEnrichmentJobByIdStub,
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
      const cmd = new DbDeleteMetadataenrichmentjobCommand({});
      expect(cmd.commandName).to.equal("dbDeleteMetadataenrichmentjob");
      expect(cmd.objectName).to.equal("metadataEnrichmentJob");
      expect(cmd.serviceLabel).to.equal("mhfz-metadatamanager-service");
      expect(cmd.dbEvent).to.equal(
        "mhfz-metadatamanager-service-dbevent-metadataenrichmentjob-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteMetadataenrichmentjobCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteMetadataenrichmentjob", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getMetadataEnrichmentJobByIdStub.resolves(mockInstance);

      const input = {
        metadataEnrichmentJobId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteMetadataenrichmentjob(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
