import type { Payload } from "payload";

export const seed = async ({
  payload,
}: {
  payload: Payload;
}): Promise<void> => {
  payload.logger.info("Seeding database...");

  await payload.create({
    collection: "users",
    data: {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    },
  });

  payload.logger.info("Seeded database successfully!");
};
