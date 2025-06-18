const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//For these tests to work we need to export GetDocumentmetadataRestController also from file getdocumentmetadata.js
describe("GetDocumentmetadataRestController", () => {
  let GetDocumentmetadataRestController, getDocumentmetadata;
  let GetDocumentmetadataManagerStub, processRequestStub;
  let req, res, next;

  beforeEach(() => {
    req = { requestId: "req-456" };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    next = sinon.stub();

    // Stub for GetDocumentmetadataManager constructor
    GetDocumentmetadataManagerStub = sinon.stub();

    // Stub for processRequest inherited from RestController
    processRequestStub = sinon.stub();

    // Proxyquire module under test with mocks
    ({ GetDocumentmetadataRestController, getDocumentmetadata } = proxyquire(
      "../../../src/controllers-layer/rest-layer/main/documentMetadata/get-documentmetadata.js",
      {
        serviceCommon: {
          HexaLogTypes: {},
          hexaLogger: { insertInfo: sinon.stub(), insertError: sinon.stub() },
        },
        managers: {
          GetDocumentmetadataManager: GetDocumentmetadataManagerStub,
        },
        "../../RestController": class {
          constructor(name, routeName, _req, _res, _next) {
            this.name = name;
            this.routeName = routeName;
            this._req = _req;
            this._res = _res;
            this._next = _next;
            this.processRequest = processRequestStub;
          }
        },
      },
    ));
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("GetDocumentmetadataRestController class", () => {
    it("should extend RestController with correct values", () => {
      const controller = new GetDocumentmetadataRestController(req, res, next);

      expect(controller.name).to.equal("getDocumentmetadata");
      expect(controller.routeName).to.equal("getdocumentmetadata");
      expect(controller.dataName).to.equal("documentMetadata");
      expect(controller.crudType).to.equal("get");
      expect(controller.status).to.equal(200);
      expect(controller.httpMethod).to.equal("GET");
    });

    it("should create GetDocumentmetadataManager in createApiManager()", () => {
      const controller = new GetDocumentmetadataRestController(req, res, next);
      controller._req = req;

      controller.createApiManager();

      expect(GetDocumentmetadataManagerStub.calledOnceWithExactly(req, "rest"))
        .to.be.true;
    });
  });

  describe("getDocumentmetadata function", () => {
    it("should create instance and call processRequest", async () => {
      await getDocumentmetadata(req, res, next);

      expect(processRequestStub.calledOnce).to.be.true;
    });
  });
});
