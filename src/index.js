const server = require("./server.js");
const connectToMongoDB = require("./config/mongo.config.js");

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  await connectToMongoDB();
  console.log(`Server is  on http://localhost:${PORT}`);
});
