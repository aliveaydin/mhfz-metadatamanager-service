const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getDocumentMetadataAggById module", () => {
  let sandbox;
  let getDocumentMetadataAggById;
  let DocumentMetadataStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test DocumentMetadata" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    DocumentMetadataStub = {
      findByPk: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getDocumentMetadataAggById = proxyquire(
      "../../../../../src/db-layer/main/DocumentMetadata/utils/getDocumentMetadataAggById",
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
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getDocumentMetadataAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getDocumentMetadataAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(DocumentMetadataStub.findByPk);
      sinon.assert.calledOnce(DocumentMetadataStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getDocumentMetadataAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(DocumentMetadataStub.findAll);
      sinon.assert.calledOnce(DocumentMetadataStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      DocumentMetadataStub.findByPk.resolves(null);
      const result = await getDocumentMetadataAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      DocumentMetadataStub.findAll.resolves([]);
      const result = await getDocumentMetadataAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      DocumentMetadataStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getDocumentMetadataAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      DocumentMetadataStub.findByPk.resolves({ getData: () => undefined });
      const result = await getDocumentMetadataAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findByPk)", async () => {
      DocumentMetadataStub.findByPk.rejects(new Error("fail"));
      try {
        await getDocumentMetadataAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingDocumentMetadataAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      DocumentMetadataStub.findAll.rejects(new Error("all fail"));
      try {
        await getDocumentMetadataAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingDocumentMetadataAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      DocumentMetadataStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getDocumentMetadataAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingDocumentMetadataAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
