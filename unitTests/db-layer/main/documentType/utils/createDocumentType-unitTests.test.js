const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("createDocumentType module", () => {
  let sandbox;
  let createDocumentType;
  let DocumentTypeStub, ElasticIndexerStub, newUUIDStub;

  const fakeId = "uuid-123";
  const mockCreatedDocumentType = {
    getData: () => ({ id: fakeId, ...{ id: "custom-id" } }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    DocumentTypeStub = {
      create: sandbox.stub().resolves(mockCreatedDocumentType),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    newUUIDStub = sandbox.stub().returns(fakeId);

    createDocumentType = proxyquire(
      "../../../../../src/db-layer/main/DocumentType/utils/createDocumentType",
      {
        models: { DocumentType: DocumentTypeStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
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
          newUUID: newUUIDStub,
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("createDocumentType", () => {
    it("should create DocumentType and index to elastic if valid data", async () => {
      const input = { id: "custom-id" };
      const result = await createDocumentType(input);

      expect(result).to.deep.equal({ id: fakeId, ...{ id: "custom-id" } });
      sinon.assert.calledOnce(DocumentTypeStub.create);
      sinon.assert.calledOnce(ElasticIndexerStub);

      sinon.assert.notCalled(newUUIDStub); // id was provided
    });

    it("should throw HttpServerError wrapping BadRequestError if input has unexpected field", async () => {
      const input = { ...{ id: "custom-id" }, foo: "bar" };

      try {
        await createDocumentType(input);
        throw new Error("Expected to throw HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenCreatingDocumentType");
        expect(err.details).to.be.instanceOf(Error);
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include('Unexpected field "foo"');
      }
    });

    it("should throw HttpServerError if DocumentType.create fails", async () => {
      DocumentTypeStub.create.rejects(new Error("DB error"));
      const input = { id: "custom-id" };

      try {
        await createDocumentType(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenCreatingDocumentType");
        expect(err.details.message).to.equal("DB error");
      }
    });
  });

  describe("validateData", () => {
    it("should generate new UUID if id is not provided", async () => {
      const input = { ...{ id: "custom-id" } };
      delete input.id;
      await createDocumentType(input);
      sinon.assert.calledOnce(newUUIDStub);
    });

    it("should use provided id if present", async () => {
      const input = { ...{ id: "custom-id" }, id: "existing-id" };
      await createDocumentType(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        DocumentTypeStub.create,
        sinon.match({ id: "existing-id" }),
      );
    });

    it("should not throw if requiredFields is empty or satisfied", async () => {
      const input = { id: "custom-id" };
      await createDocumentType(input);
    });

    it("should not overwrite id if already present", async () => {
      const input = { ...{ id: "custom-id" }, id: "custom-id" };
      await createDocumentType(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        DocumentTypeStub.create,
        sinon.match({ id: "custom-id" }),
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with documentType data", async () => {
      const input = { id: "custom-id" };
      await createDocumentType(input);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should throw HttpServerError if ElasticIndexer.indexData fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("Elastic error"));
      const input = { id: "custom-id" };

      try {
        await createDocumentType(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenCreatingDocumentType");
        expect(err.details.message).to.equal("Elastic error");
      }
    });
  });
});
