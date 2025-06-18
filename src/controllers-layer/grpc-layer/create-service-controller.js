const MetadataManagerServiceGrpcController = require("./MetadataManagerServiceGrpcController");

module.exports = (name, routeName, call, callback) => {
  const grpcController = new MetadataManagerServiceGrpcController(
    name,
    routeName,
    call,
    callback,
  );
  return grpcController;
};
