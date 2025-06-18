const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfDocumentMetadataByField module", () => {
  let sandbox;
  let getIdListOfDocumentMetadataByField;
  let DocumentMetadataStub, hexaLogger;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    DocumentMetadataStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      documentId: "example-type",
    };

    hexaLogger = {
      insertError: sandbox.stub(),
    };

    getIdListOfDocumentMetadataByField = proxyquire(
      "../../../../../src/db-layer/main/DocumentMetadata/utils/getIdListOfDocumentMetadataByField",
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
          NotFoundError: class NotFoundError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "NotFoundError";
            }
          },
          hexaLogger,
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getIdListOfDocumentMetadataByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      DocumentMetadataStub["documentId"] = "string";
      const result = await getIdListOfDocumentMetadataByField(
        "documentId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(DocumentMetadataStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      DocumentMetadataStub["documentId"] = "string";
      const result = await getIdListOfDocumentMetadataByField(
        "documentId",
        "val",
        true,
      );
      const call = DocumentMetadataStub.findAll.getCall(0);
      expect(call.args[0].where["documentId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfDocumentMetadataByField(
          "nonexistentField",
          "x",
          false,
        );
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      DocumentMetadataStub["documentId"] = 123; // expects number

      try {
        await getIdListOfDocumentMetadataByField(
          "documentId",
          "wrong-type",
          false,
        );
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      DocumentMetadataStub.findAll.resolves([]);
      DocumentMetadataStub["documentId"] = "string";

      try {
        await getIdListOfDocumentMetadataByField(
          "documentId",
          "nomatch",
          false,
        );
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "DocumentMetadata with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      DocumentMetadataStub.findAll.rejects(new Error("query failed"));
      DocumentMetadataStub["documentId"] = "string";

      try {
        await getIdListOfDocumentMetadataByField("documentId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });

    it("should log error to hexaLogger if any error occurs", async () => {
      const error = new Error("boom");
      DocumentMetadataStub.findAll.rejects(error);
      DocumentMetadataStub["documentId"] = "string";

      try {
        await getIdListOfDocumentMetadataByField("documentId", "test", false);
      } catch (err) {
        sinon.assert.calledOnce(hexaLogger.insertError);
        sinon.assert.calledWithMatch(hexaLogger.insertError, "DatabaseError");
      }
    });
  });
});
