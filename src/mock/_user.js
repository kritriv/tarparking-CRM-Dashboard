import { faker } from "@faker-js/faker";
import { http, HttpResponse } from "msw";
import { USER_LIST } from "./assets";

const signIn = http.post("/api/auth/signin", async ({ request }) => {
  const { username, password } = await request.json();

  const user = USER_LIST.find((item) => item.username === username);

  if (!user || user.password !== password) {
    return HttpResponse.json({
      status: 10001,
      message: "Incorrect username or password.",
    });
  }

  return HttpResponse.json({
    status: 0,
    message: "",
    data: {
      user,
      accessToken: faker.string.uuid(),
      refreshToken: faker.string.uuid(),
    },
  });
});

const userList = http.get("/api/user", () => {
  return HttpResponse.json(
    Array.from({ length: 10 }).map(() => ({
      fullname: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      address: faker.location.streetAddress(),
    })),
    { status: 201 }
  );
});

export default [signIn, userList];
