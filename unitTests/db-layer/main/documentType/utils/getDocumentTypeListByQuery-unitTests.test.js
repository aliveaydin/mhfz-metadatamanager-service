const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getDocumentTypeListByQuery module", () => {
  let sandbox;
  let getDocumentTypeListByQuery;
  let DocumentTypeStub;

  const fakeList = [
    { getData: () => ({ id: "1", name: "Item 1" }) },
    { getData: () => ({ id: "2", name: "Item 2" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    DocumentTypeStub = {
      findAll: sandbox.stub().resolves(fakeList),
    };

    getDocumentTypeListByQuery = proxyquire(
      "../../../../../src/db-layer/main/DocumentType/utils/getDocumentTypeListByQuery",
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

  describe("getDocumentTypeListByQuery", () => {
    it("should return list of getData() results if query is valid", async () => {
      const result = await getDocumentTypeListByQuery({ isActive: true });

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);

      sinon.assert.calledOnce(DocumentTypeStub.findAll);
      sinon.assert.calledWithMatch(DocumentTypeStub.findAll, {
        where: { isActive: true },
      });
    });

    it("should return [] if findAll returns null", async () => {
      DocumentTypeStub.findAll.resolves(null);

      const result = await getDocumentTypeListByQuery({ active: false });
      expect(result).to.deep.equal([]);
    });

    it("should return [] if findAll returns empty array", async () => {
      DocumentTypeStub.findAll.resolves([]);

      const result = await getDocumentTypeListByQuery({ clientId: "xyz" });
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      DocumentTypeStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getDocumentTypeListByQuery({ active: true });
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getDocumentTypeListByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getDocumentTypeListByQuery("not-an-object");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if findAll fails", async () => {
      DocumentTypeStub.findAll.rejects(new Error("findAll failed"));

      try {
        await getDocumentTypeListByQuery({ some: "query" });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingDocumentTypeListByQuery",
        );
        expect(err.details.message).to.equal("findAll failed");
      }
    });
  });
});
