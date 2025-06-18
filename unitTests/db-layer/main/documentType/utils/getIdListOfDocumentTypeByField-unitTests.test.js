const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfDocumentTypeByField module", () => {
  let sandbox;
  let getIdListOfDocumentTypeByField;
  let DocumentTypeStub, hexaLogger;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    DocumentTypeStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      typeName: "example-type",
    };

    hexaLogger = {
      insertError: sandbox.stub(),
    };

    getIdListOfDocumentTypeByField = proxyquire(
      "../../../../../src/db-layer/main/DocumentType/utils/getIdListOfDocumentTypeByField",
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

  describe("getIdListOfDocumentTypeByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      DocumentTypeStub["typeName"] = "string";
      const result = await getIdListOfDocumentTypeByField(
        "typeName",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(DocumentTypeStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      DocumentTypeStub["typeName"] = "string";
      const result = await getIdListOfDocumentTypeByField(
        "typeName",
        "val",
        true,
      );
      const call = DocumentTypeStub.findAll.getCall(0);
      expect(call.args[0].where["typeName"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfDocumentTypeByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      DocumentTypeStub["typeName"] = 123; // expects number

      try {
        await getIdListOfDocumentTypeByField("typeName", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      DocumentTypeStub.findAll.resolves([]);
      DocumentTypeStub["typeName"] = "string";

      try {
        await getIdListOfDocumentTypeByField("typeName", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "DocumentType with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      DocumentTypeStub.findAll.rejects(new Error("query failed"));
      DocumentTypeStub["typeName"] = "string";

      try {
        await getIdListOfDocumentTypeByField("typeName", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });

    it("should log error to hexaLogger if any error occurs", async () => {
      const error = new Error("boom");
      DocumentTypeStub.findAll.rejects(error);
      DocumentTypeStub["typeName"] = "string";

      try {
        await getIdListOfDocumentTypeByField("typeName", "test", false);
      } catch (err) {
        sinon.assert.calledOnce(hexaLogger.insertError);
        sinon.assert.calledWithMatch(hexaLogger.insertError, "DatabaseError");
      }
    });
  });
});
