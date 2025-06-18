const MetadataManagerServiceRestController = require("./MetadataManagerServiceRestController");

module.exports = (name, routeName, req, res) => {
  const restController = new MetadataManagerServiceRestController(
    name,
    routeName,
    req,
    res,
  );
  return restController;
};
