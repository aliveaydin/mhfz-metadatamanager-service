const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getMetadataEnrichmentJobById module", () => {
  let sandbox;
  let getMetadataEnrichmentJobById;
  let MetadataEnrichmentJobStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test MetadataEnrichmentJob" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MetadataEnrichmentJobStub = {
      findByPk: sandbox.stub().resolves({
        getData: () => fakeData,
      }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
    };

    getMetadataEnrichmentJobById = proxyquire(
      "../../../../../src/db-layer/main/MetadataEnrichmentJob/utils/getMetadataEnrichmentJobById",
      {
        models: { MetadataEnrichmentJob: MetadataEnrichmentJobStub },
        common: {
          HttpServerError: class HttpServerError extends Error {
            constructor(msg, details) {
              super(msg);
              this.name = "HttpServerError";
              this.details = details;
            }
          },
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getMetadataEnrichmentJobById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getMetadataEnrichmentJobById(fakeId);

      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(MetadataEnrichmentJobStub.findByPk);
      sinon.assert.calledWith(MetadataEnrichmentJobStub.findByPk, fakeId);
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getMetadataEnrichmentJobById(["1", "2"]);

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(MetadataEnrichmentJobStub.findAll);
      sinon.assert.calledWithMatch(MetadataEnrichmentJobStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      MetadataEnrichmentJobStub.findByPk.resolves(null);
      const result = await getMetadataEnrichmentJobById(fakeId);

      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      MetadataEnrichmentJobStub.findAll.resolves([]);
      const result = await getMetadataEnrichmentJobById(["a", "b"]);

      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      MetadataEnrichmentJobStub.findByPk.rejects(new Error("DB failure"));

      try {
        await getMetadataEnrichmentJobById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMetadataEnrichmentJobById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      MetadataEnrichmentJobStub.findAll.rejects(new Error("array failure"));

      try {
        await getMetadataEnrichmentJobById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMetadataEnrichmentJobById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      MetadataEnrichmentJobStub.findByPk.resolves({ getData: () => undefined });
      const result = await getMetadataEnrichmentJobById(fakeId);

      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      MetadataEnrichmentJobStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getMetadataEnrichmentJobById(["1", "2"]);

      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
