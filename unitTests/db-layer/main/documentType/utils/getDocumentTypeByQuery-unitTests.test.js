const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getDocumentTypeByQuery module", () => {
  let sandbox;
  let getDocumentTypeByQuery;
  let DocumentTypeStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test DocumentType",
    getData: () => ({ id: fakeId, name: "Test DocumentType" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    DocumentTypeStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getDocumentTypeByQuery = proxyquire(
      "../../../../../src/db-layer/main/DocumentType/utils/getDocumentTypeByQuery",
      {
        models: { DocumentType: DocumentTypeStub },
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

  describe("getDocumentTypeByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getDocumentTypeByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test DocumentType" });
      sinon.assert.calledOnce(DocumentTypeStub.findOne);
      sinon.assert.calledWith(DocumentTypeStub.findOne, {
        where: { id: fakeId },
      });
    });

    it("should return null if no record is found", async () => {
      DocumentTypeStub.findOne.resolves(null);

      const result = await getDocumentTypeByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(DocumentTypeStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getDocumentTypeByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getDocumentTypeByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      DocumentTypeStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getDocumentTypeByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingDocumentTypeByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      DocumentTypeStub.findOne.resolves({ getData: () => undefined });

      const result = await getDocumentTypeByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
