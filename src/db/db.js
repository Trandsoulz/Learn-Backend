import mongoose from "mongoose";

export default async function connectDB(maxRetires = 5, initialDelay = 3000) {
  let attempt = 0;

  const connectWithRetry = async () => {
    try {
      console.log(`Attempt ${attempt + 1}: Trying to Connect to DB...`);
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("DB connected");
    } catch (error) {
      attempt += 1;
      console.log(
        `Error occured trying to connect to MongoDB : ${error.message}`
      );

      if (attempt < maxRetires) {
        const delay = initialDelay * 2 ** (attempt - 1);
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return connectWithRetry();
      } else {
        console.error(`Max retries reached. Could not connect to DB.`);
        process.exit(1);
      }
    }
  };
  await connectWithRetry();
}
