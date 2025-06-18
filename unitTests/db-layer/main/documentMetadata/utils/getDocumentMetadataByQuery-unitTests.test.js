const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getDocumentMetadataByQuery module", () => {
  let sandbox;
  let getDocumentMetadataByQuery;
  let DocumentMetadataStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test DocumentMetadata",
    getData: () => ({ id: fakeId, name: "Test DocumentMetadata" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    DocumentMetadataStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getDocumentMetadataByQuery = proxyquire(
      "../../../../../src/db-layer/main/DocumentMetadata/utils/getDocumentMetadataByQuery",
      {
        models: { DocumentMetadata: DocumentMetadataStub },
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

  describe("getDocumentMetadataByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getDocumentMetadataByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test DocumentMetadata",
      });
      sinon.assert.calledOnce(DocumentMetadataStub.findOne);
      sinon.assert.calledWith(DocumentMetadataStub.findOne, {
        where: { id: fakeId },
      });
    });

    it("should return null if no record is found", async () => {
      DocumentMetadataStub.findOne.resolves(null);

      const result = await getDocumentMetadataByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(DocumentMetadataStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getDocumentMetadataByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getDocumentMetadataByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      DocumentMetadataStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getDocumentMetadataByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingDocumentMetadataByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      DocumentMetadataStub.findOne.resolves({ getData: () => undefined });

      const result = await getDocumentMetadataByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
