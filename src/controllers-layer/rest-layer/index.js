const mainRouters = require("./main");
const sessionRouter = require("./session-router");
module.exports = {
  ...mainRouters,
  MetadataManagerServiceRestController: require("./MetadataManagerServiceRestController"),
  ...sessionRouter,
};
