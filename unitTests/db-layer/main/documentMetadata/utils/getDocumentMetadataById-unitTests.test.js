const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getDocumentMetadataById module", () => {
  let sandbox;
  let getDocumentMetadataById;
  let DocumentMetadataStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test DocumentMetadata" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    DocumentMetadataStub = {
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

    getDocumentMetadataById = proxyquire(
      "../../../../../src/db-layer/main/DocumentMetadata/utils/getDocumentMetadataById",
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

  describe("getDocumentMetadataById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getDocumentMetadataById(fakeId);

      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(DocumentMetadataStub.findByPk);
      sinon.assert.calledWith(DocumentMetadataStub.findByPk, fakeId);
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getDocumentMetadataById(["1", "2"]);

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(DocumentMetadataStub.findAll);
      sinon.assert.calledWithMatch(DocumentMetadataStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      DocumentMetadataStub.findByPk.resolves(null);
      const result = await getDocumentMetadataById(fakeId);

      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      DocumentMetadataStub.findAll.resolves([]);
      const result = await getDocumentMetadataById(["a", "b"]);

      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      DocumentMetadataStub.findByPk.rejects(new Error("DB failure"));

      try {
        await getDocumentMetadataById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingDocumentMetadataById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      DocumentMetadataStub.findAll.rejects(new Error("array failure"));

      try {
        await getDocumentMetadataById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingDocumentMetadataById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      DocumentMetadataStub.findByPk.resolves({ getData: () => undefined });
      const result = await getDocumentMetadataById(fakeId);

      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      DocumentMetadataStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getDocumentMetadataById(["1", "2"]);

      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
