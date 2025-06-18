const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getMetadataEnrichmentJobByQuery module", () => {
  let sandbox;
  let getMetadataEnrichmentJobByQuery;
  let MetadataEnrichmentJobStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test MetadataEnrichmentJob",
    getData: () => ({ id: fakeId, name: "Test MetadataEnrichmentJob" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MetadataEnrichmentJobStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getMetadataEnrichmentJobByQuery = proxyquire(
      "../../../../../src/db-layer/main/MetadataEnrichmentJob/utils/getMetadataEnrichmentJobByQuery",
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
          BadRequestError: class BadRequestError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "BadRequestError";
            }
          },
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getMetadataEnrichmentJobByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getMetadataEnrichmentJobByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test MetadataEnrichmentJob",
      });
      sinon.assert.calledOnce(MetadataEnrichmentJobStub.findOne);
      sinon.assert.calledWith(MetadataEnrichmentJobStub.findOne, {
        where: { id: fakeId },
      });
    });

    it("should return null if no record is found", async () => {
      MetadataEnrichmentJobStub.findOne.resolves(null);

      const result = await getMetadataEnrichmentJobByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(MetadataEnrichmentJobStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getMetadataEnrichmentJobByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getMetadataEnrichmentJobByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      MetadataEnrichmentJobStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getMetadataEnrichmentJobByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMetadataEnrichmentJobByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      MetadataEnrichmentJobStub.findOne.resolves({ getData: () => undefined });

      const result = await getMetadataEnrichmentJobByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
