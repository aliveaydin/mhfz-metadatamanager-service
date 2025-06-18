const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getDocumentTypeAggById module", () => {
  let sandbox;
  let getDocumentTypeAggById;
  let DocumentTypeStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test DocumentType" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    DocumentTypeStub = {
      findByPk: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getDocumentTypeAggById = proxyquire(
      "../../../../../src/db-layer/main/DocumentType/utils/getDocumentTypeAggById",
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
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getDocumentTypeAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getDocumentTypeAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(DocumentTypeStub.findByPk);
      sinon.assert.calledOnce(DocumentTypeStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getDocumentTypeAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(DocumentTypeStub.findAll);
      sinon.assert.calledOnce(DocumentTypeStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      DocumentTypeStub.findByPk.resolves(null);
      const result = await getDocumentTypeAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      DocumentTypeStub.findAll.resolves([]);
      const result = await getDocumentTypeAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      DocumentTypeStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getDocumentTypeAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      DocumentTypeStub.findByPk.resolves({ getData: () => undefined });
      const result = await getDocumentTypeAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findByPk)", async () => {
      DocumentTypeStub.findByPk.rejects(new Error("fail"));
      try {
        await getDocumentTypeAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingDocumentTypeAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      DocumentTypeStub.findAll.rejects(new Error("all fail"));
      try {
        await getDocumentTypeAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingDocumentTypeAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      DocumentTypeStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getDocumentTypeAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingDocumentTypeAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
