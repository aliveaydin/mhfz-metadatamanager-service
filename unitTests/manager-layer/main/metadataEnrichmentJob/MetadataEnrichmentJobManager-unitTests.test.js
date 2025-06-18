const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("MetadataEnrichmentJobManager", () => {
  let ManagerClass;
  let manager;
  let req;

  beforeEach(() => {
    req = {
      session: {
        _USERID: "u1",
        fullname: "Test User",
        name: "Test",
        surname: "User",
        email: "test@example.com",
      },
    };
    ManagerClass = proxyquire(
      "../../../../src/manager-layer/main/MetadataEnrichmentJob/MetadataEnrichmentJobManager",
      {
        "../../service-manager/MetadataManagerServiceManager": class {
          constructor() {
            this.session = req.session;
            this.bodyParams = {};
          }
          toJSON() {
            return {};
          }
        },
      },
    );
    manager = new ManagerClass(req);
  });

  describe("constructor", () => {
    it("should initialize properties correctly", () => {
      const ManagerClass = proxyquire(
        "../../../../src/manager-layer/main/MetadataEnrichmentJob/MetadataEnrichmentJobManager",
        {
          "../../service-manager/MetadataManagerServiceManager": class {
            constructor(request, options) {
              this.session = request.session;
              this.bodyParams = {};
            }
          },
        },
      );

      const req = {
        session: {
          _USERID: "u1",
          fullname: "Test User",
          name: "Test",
          surname: "User",
          email: "test@example.com",
        },
      };

      const instance = new ManagerClass(req);
      expect(instance).to.have.property("objectName", "metadataEnrichmentJob");
      expect(instance).to.have.property("modelName", "MetadataEnrichmentJob");
      expect(instance.session).to.equal(req.session);
    });
  });
});
