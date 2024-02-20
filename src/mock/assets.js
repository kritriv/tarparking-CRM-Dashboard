import { faker } from "@faker-js/faker";

/**
 * User data mock
 */
export const DEFAULT_USER = {
  id: faker.string.uuid(),
  username: "super@tarparking.com",
  email: "super@tarparking.com",
  avatar: faker.image.avatarLegacy(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.recent(),
  password: "super@ME22",
};

export const USER_LIST = [DEFAULT_USER];
