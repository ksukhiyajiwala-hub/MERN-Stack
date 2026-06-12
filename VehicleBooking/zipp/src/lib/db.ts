import mongoose from "mongoose";

const mongoDbUrl = process.env.MONGO_URL;
if (!mongoDbUrl) {
  throw new Error("Db Url is not found");
}

let cached = global.mongooseConn;

if (!cached) {
  cached = global.mongooseConn = { conn: null, promise: null };
}

const connectDb = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoDbUrl).then((c) => c.connection);
  }

  try {
    const conn = await cached.promise;

    return conn;
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
