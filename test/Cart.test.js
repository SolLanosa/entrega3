import mongoose from "mongoose";
import supertest from "supertest";
import Assert from "assert";
import { CONFIG } from "../src/config.js"
import { expect } from "chai";

const connection = mongoose.connect(CONFIG.MONGO_URL)
const assert = Assert.strict
const requester = supertest("http://localhost:8080");

describe('Testing Cart Router', () => {
    let cookie;
    before(async function () {
      const response  =  await requester.post("/api/sessions/login").send({
        email: CONFIG.ADMIN_EMAIL,
        password: CONFIG.ADMIN_PASSWORD
       })

       cookie = response.headers["set-cookie"];
    })
   
    describe('Prueba de cart', async function() {

        it.skip('Agregar un cart correctamente', async function() {
            const { statusCode, ok, _body } = await requester
            .post("/api/carts")
            .set("Cookie", cookie)
            console.log(statusCode, ok, _body);
            expect(ok).to.be.ok;
            expect(Array.isArray(_body.products)).to.be.equal(true);
         }).timeout(10000);

         it("GET api/carts/", async function() {
            const { statusCode, ok, _body } = await requester.get("/api/carts").set("Cookie", cookie)
            console.log( statusCode, ok,_body, "BODY")
            expect(ok).to.be.ok;
            expect(Array.isArray(_body)).to.equal(true);
          }).timeout(10000);
    })
})