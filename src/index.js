const server = require("./server.js");
const connectToMongoDB = require("./config/mongo.config.js");
const envVars = require("./config/server.config.js");

const PORT = envVars.PORT || 3000;

server.listen(PORT, async () => {
  await connectToMongoDB();
  console.log(`Server is  on http://localhost:${PORT}`);
});
