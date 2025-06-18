const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateMetadataenrichmentjobCommand is exported from main code
describe("DbCreateMetadataenrichmentjobCommand", () => {
  let DbCreateMetadataenrichmentjobCommand, dbCreateMetadataenrichmentjob;
  let sandbox,
    MetadataEnrichmentJobStub,
    ElasticIndexerStub,
    getMetadataEnrichmentJobByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MetadataEnrichmentJobStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getMetadataEnrichmentJobByIdStub = sandbox
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

    ({ DbCreateMetadataenrichmentjobCommand, dbCreateMetadataenrichmentjob } =
      proxyquire(
        "../../../../src/db-layer/main/metadataEnrichmentJob/dbCreateMetadataenrichmentjob",
        {
          models: { MetadataEnrichmentJob: MetadataEnrichmentJobStub },
          serviceCommon: { ElasticIndexer: ElasticIndexerStub },
          "./utils/getMetadataEnrichmentJobById":
            getMetadataEnrichmentJobByIdStub,
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
      const cmd = new DbCreateMetadataenrichmentjobCommand({});
      expect(cmd.commandName).to.equal("dbCreateMetadataenrichmentjob");
      expect(cmd.objectName).to.equal("metadataEnrichmentJob");
      expect(cmd.serviceLabel).to.equal("mhfz-metadatamanager-service");
      expect(cmd.dbEvent).to.equal(
        "mhfz-metadatamanager-service-dbevent-metadataenrichmentjob-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getMetadataEnrichmentJobById and indexData", async () => {
      const cmd = new DbCreateMetadataenrichmentjobCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getMetadataEnrichmentJobByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing metadataEnrichmentJob if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockmetadataEnrichmentJob = { update: updateStub, getData: () => ({ id: 2 }) };

      MetadataEnrichmentJobStub.findOne = sandbox.stub().resolves(mockmetadataEnrichmentJob);
      MetadataEnrichmentJobStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          id: "id_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateMetadataenrichmentjobCommand(input);
      await cmd.runDbCommand();

      expect(input.metadataEnrichmentJob).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new metadataEnrichmentJob if no unique match is found", async () => {
      MetadataEnrichmentJobStub.findOne = sandbox.stub().resolves(null);
      MetadataEnrichmentJobStub.findByPk = sandbox.stub().resolves(null);
      MetadataEnrichmentJobStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          name: "name_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateMetadataenrichmentjobCommand(input);
      await cmd.runDbCommand();

      expect(input.metadataEnrichmentJob).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(MetadataEnrichmentJobStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      MetadataEnrichmentJobStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateMetadataenrichmentjobCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateMetadataenrichmentjob", () => {
    it("should execute successfully and return dbData", async () => {
      MetadataEnrichmentJobStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "metadataEnrichmentJob" } };
      const result = await dbCreateMetadataenrichmentjob(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
