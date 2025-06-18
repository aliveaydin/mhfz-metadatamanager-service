const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getDocumentTypeById module", () => {
  let sandbox;
  let getDocumentTypeById;
  let DocumentTypeStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test DocumentType" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    DocumentTypeStub = {
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

    getDocumentTypeById = proxyquire(
      "../../../../../src/db-layer/main/DocumentType/utils/getDocumentTypeById",
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

  describe("getDocumentTypeById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getDocumentTypeById(fakeId);

      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(DocumentTypeStub.findByPk);
      sinon.assert.calledWith(DocumentTypeStub.findByPk, fakeId);
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getDocumentTypeById(["1", "2"]);

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(DocumentTypeStub.findAll);
      sinon.assert.calledWithMatch(DocumentTypeStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      DocumentTypeStub.findByPk.resolves(null);
      const result = await getDocumentTypeById(fakeId);

      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      DocumentTypeStub.findAll.resolves([]);
      const result = await getDocumentTypeById(["a", "b"]);

      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      DocumentTypeStub.findByPk.rejects(new Error("DB failure"));

      try {
        await getDocumentTypeById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingDocumentTypeById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      DocumentTypeStub.findAll.rejects(new Error("array failure"));

      try {
        await getDocumentTypeById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingDocumentTypeById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      DocumentTypeStub.findByPk.resolves({ getData: () => undefined });
      const result = await getDocumentTypeById(fakeId);

      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      DocumentTypeStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getDocumentTypeById(["1", "2"]);

      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
