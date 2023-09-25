import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("test usuarios", () => {
    let cookie;
    it.skip("POST /api/sessions/register registrar un usuario", async () => {
      const mockUser = {
        first_name: "Pepe",
        last_name: "Test",
        email: "pepetest@gmail.com",
        password: "12345",
        age:22
      };
      const result = await requester
        .post("/api/sessions/register")
        .send(mockUser);
      console.log(result.body)
      expect(result.body).to.be.ok;
    }).timeout(10000);

    it.skip("POST /api/sessions/login logear un usuario", async () => {
      const mockUser = {
        email: "pepetest@gmail.com",
        password: "12345",
      };
      const result = await requester.post("/api/sessions/login").send(mockUser);
      console.log(result.headers);
      const cookieResult = result.headers["set-cookie"][0];
      expect(cookieResult).to.be.ok;
      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
    }).timeout(10000);

    it.skip("GET api/sessions/current", async () => {
      const result = await requester
        .get("/api/sessions/current")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
     expect(result.body.first_name).to.be.ok
    }).timeout(10000);
  });
