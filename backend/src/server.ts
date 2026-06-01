import app from "./app.ts";
import { env } from "./config/env.ts";
import { prisma } from "./config/prisma.ts";

const PORT = Number(env.PORT);

const startServer = async () => {
  try {
    await prisma.$connect();

    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database");
    console.error(error);
    process.exit(1);
  }
};

void startServer();