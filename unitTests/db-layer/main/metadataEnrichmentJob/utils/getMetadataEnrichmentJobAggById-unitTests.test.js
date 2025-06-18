const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getMetadataEnrichmentJobAggById module", () => {
  let sandbox;
  let getMetadataEnrichmentJobAggById;
  let MetadataEnrichmentJobStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test MetadataEnrichmentJob" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MetadataEnrichmentJobStub = {
      findByPk: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getMetadataEnrichmentJobAggById = proxyquire(
      "../../../../../src/db-layer/main/MetadataEnrichmentJob/utils/getMetadataEnrichmentJobAggById",
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

  describe("getMetadataEnrichmentJobAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getMetadataEnrichmentJobAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(MetadataEnrichmentJobStub.findByPk);
      sinon.assert.calledOnce(MetadataEnrichmentJobStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getMetadataEnrichmentJobAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(MetadataEnrichmentJobStub.findAll);
      sinon.assert.calledOnce(MetadataEnrichmentJobStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      MetadataEnrichmentJobStub.findByPk.resolves(null);
      const result = await getMetadataEnrichmentJobAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      MetadataEnrichmentJobStub.findAll.resolves([]);
      const result = await getMetadataEnrichmentJobAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      MetadataEnrichmentJobStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getMetadataEnrichmentJobAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      MetadataEnrichmentJobStub.findByPk.resolves({ getData: () => undefined });
      const result = await getMetadataEnrichmentJobAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findByPk)", async () => {
      MetadataEnrichmentJobStub.findByPk.rejects(new Error("fail"));
      try {
        await getMetadataEnrichmentJobAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMetadataEnrichmentJobAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      MetadataEnrichmentJobStub.findAll.rejects(new Error("all fail"));
      try {
        await getMetadataEnrichmentJobAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMetadataEnrichmentJobAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      MetadataEnrichmentJobStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getMetadataEnrichmentJobAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMetadataEnrichmentJobAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
