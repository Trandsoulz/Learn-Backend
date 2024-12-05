import mongoose from "mongoose";

export default async function connectDB() {
  const connectWithRetry = async () => {
    try {
      console.log("Trying to Connect to DB...");
      await mongoose.connect(process.env.MONGO_URI);
      console.log("DB connected");
    } catch (error) {
      console.log(`Error occured trying to connect to MongoDB : ${error}`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return connectWithRetry();
    }
  };
  return connectWithRetry();
}
