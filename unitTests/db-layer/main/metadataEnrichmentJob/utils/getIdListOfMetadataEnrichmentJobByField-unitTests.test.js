const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfMetadataEnrichmentJobByField module", () => {
  let sandbox;
  let getIdListOfMetadataEnrichmentJobByField;
  let MetadataEnrichmentJobStub, hexaLogger;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MetadataEnrichmentJobStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      documentMetadataId: "example-type",
    };

    hexaLogger = {
      insertError: sandbox.stub(),
    };

    getIdListOfMetadataEnrichmentJobByField = proxyquire(
      "../../../../../src/db-layer/main/MetadataEnrichmentJob/utils/getIdListOfMetadataEnrichmentJobByField",
      {
        models: { MetadataEnrichmentJob: MetadataEnrichmentJobStub },
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

  describe("getIdListOfMetadataEnrichmentJobByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      MetadataEnrichmentJobStub["documentMetadataId"] = "string";
      const result = await getIdListOfMetadataEnrichmentJobByField(
        "documentMetadataId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(MetadataEnrichmentJobStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      MetadataEnrichmentJobStub["documentMetadataId"] = "string";
      const result = await getIdListOfMetadataEnrichmentJobByField(
        "documentMetadataId",
        "val",
        true,
      );
      const call = MetadataEnrichmentJobStub.findAll.getCall(0);
      expect(call.args[0].where["documentMetadataId"][Op.contains]).to.include(
        "val",
      );
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfMetadataEnrichmentJobByField(
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
      MetadataEnrichmentJobStub["documentMetadataId"] = 123; // expects number

      try {
        await getIdListOfMetadataEnrichmentJobByField(
          "documentMetadataId",
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
      MetadataEnrichmentJobStub.findAll.resolves([]);
      MetadataEnrichmentJobStub["documentMetadataId"] = "string";

      try {
        await getIdListOfMetadataEnrichmentJobByField(
          "documentMetadataId",
          "nomatch",
          false,
        );
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "MetadataEnrichmentJob with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      MetadataEnrichmentJobStub.findAll.rejects(new Error("query failed"));
      MetadataEnrichmentJobStub["documentMetadataId"] = "string";

      try {
        await getIdListOfMetadataEnrichmentJobByField(
          "documentMetadataId",
          "test",
          false,
        );
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });

    it("should log error to hexaLogger if any error occurs", async () => {
      const error = new Error("boom");
      MetadataEnrichmentJobStub.findAll.rejects(error);
      MetadataEnrichmentJobStub["documentMetadataId"] = "string";

      try {
        await getIdListOfMetadataEnrichmentJobByField(
          "documentMetadataId",
          "test",
          false,
        );
      } catch (err) {
        sinon.assert.calledOnce(hexaLogger.insertError);
        sinon.assert.calledWithMatch(hexaLogger.insertError, "DatabaseError");
      }
    });
  });
});
