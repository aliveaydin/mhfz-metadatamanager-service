const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getMetadataEnrichmentJobListByQuery module", () => {
  let sandbox;
  let getMetadataEnrichmentJobListByQuery;
  let MetadataEnrichmentJobStub;

  const fakeList = [
    { getData: () => ({ id: "1", name: "Item 1" }) },
    { getData: () => ({ id: "2", name: "Item 2" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MetadataEnrichmentJobStub = {
      findAll: sandbox.stub().resolves(fakeList),
    };

    getMetadataEnrichmentJobListByQuery = proxyquire(
      "../../../../../src/db-layer/main/MetadataEnrichmentJob/utils/getMetadataEnrichmentJobListByQuery",
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

  describe("getMetadataEnrichmentJobListByQuery", () => {
    it("should return list of getData() results if query is valid", async () => {
      const result = await getMetadataEnrichmentJobListByQuery({
        isActive: true,
      });

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);

      sinon.assert.calledOnce(MetadataEnrichmentJobStub.findAll);
      sinon.assert.calledWithMatch(MetadataEnrichmentJobStub.findAll, {
        where: { isActive: true },
      });
    });

    it("should return [] if findAll returns null", async () => {
      MetadataEnrichmentJobStub.findAll.resolves(null);

      const result = await getMetadataEnrichmentJobListByQuery({
        active: false,
      });
      expect(result).to.deep.equal([]);
    });

    it("should return [] if findAll returns empty array", async () => {
      MetadataEnrichmentJobStub.findAll.resolves([]);

      const result = await getMetadataEnrichmentJobListByQuery({
        clientId: "xyz",
      });
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      MetadataEnrichmentJobStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getMetadataEnrichmentJobListByQuery({
        active: true,
      });
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getMetadataEnrichmentJobListByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getMetadataEnrichmentJobListByQuery("not-an-object");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if findAll fails", async () => {
      MetadataEnrichmentJobStub.findAll.rejects(new Error("findAll failed"));

      try {
        await getMetadataEnrichmentJobListByQuery({ some: "query" });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMetadataEnrichmentJobListByQuery",
        );
        expect(err.details.message).to.equal("findAll failed");
      }
    });
  });
});
