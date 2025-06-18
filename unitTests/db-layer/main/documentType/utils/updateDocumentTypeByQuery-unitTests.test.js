const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("updateDocumentTypeByQuery module", () => {
  let sandbox;
  let updateDocumentTypeByQuery;
  let DocumentTypeStub;

  const fakeQuery = { clientId: "abc123" };
  const fakeDataClause = { status: "archived" };
  const fakeUpdatedRows = [
    { getData: () => ({ id: "1", status: "archived" }) },
    { getData: () => ({ id: "2", status: "archived" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    DocumentTypeStub = {
      update: sandbox.stub().resolves([2, fakeUpdatedRows]),
    };

    updateDocumentTypeByQuery = proxyquire(
      "../../../../../src/db-layer/main/DocumentType/utils/updateDocumentTypeByQuery",
      {
        models: { DocumentType: DocumentTypeStub },
        common: {
          HttpServerError: class HttpServerError extends Error {
            constructor(message, details) {
              super(message);
              this.name = "HttpServerError";
              this.details = details;
            }
          },
          BadRequestError: class BadRequestError extends Error {
            constructor(message) {
              super(message);
              this.name = "BadRequestError";
            }
          },
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("updateDocumentTypeByQuery", () => {
    it("should update records matching query and return getData list", async () => {
      const result = await updateDocumentTypeByQuery(fakeDataClause, fakeQuery);
      expect(result).to.deep.equal([
        { id: "1", status: "archived" },
        { id: "2", status: "archived" },
      ]);

      sinon.assert.calledOnceWithExactly(
        DocumentTypeStub.update,
        fakeDataClause,
        {
          where: { query: fakeQuery, isActive: true },
          returning: true,
        },
      );
    });

    it("should return [] if update returns no matching rows", async () => {
      DocumentTypeStub.update.resolves([0, []]);

      const result = await updateDocumentTypeByQuery(fakeDataClause, fakeQuery);
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      DocumentTypeStub.update.resolves([
        2,
        [{ getData: () => undefined }, { getData: () => undefined }],
      ]);

      const result = await updateDocumentTypeByQuery(fakeDataClause, fakeQuery);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await updateDocumentTypeByQuery(fakeDataClause, undefined);
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await updateDocumentTypeByQuery(fakeDataClause, "not-an-object");
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if model update fails", async () => {
      DocumentTypeStub.update.rejects(new Error("update failed"));

      try {
        await updateDocumentTypeByQuery(fakeDataClause, fakeQuery);
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenUpdatingDocumentTypeByQuery",
        );
        expect(err.details.message).to.equal("update failed");
      }
    });

    it("should accept empty dataClause and still process", async () => {
      DocumentTypeStub.update.resolves([0, []]);

      const result = await updateDocumentTypeByQuery({}, fakeQuery);
      expect(result).to.deep.equal([]);
    });
  });
});
