import mongoose from "mongoose";
import ProductDAO from "../src/daos/mongodb/ProductDAO.js";
import supertest from "supertest";
import Assert from "assert";
import { CONFIG } from "../src/config.js"
import { expect } from "chai";

const connection = mongoose.connect(CONFIG.MONGO_URL)
const assert = Assert.strict
const requester = supertest("http://localhost:8080");

describe('Testing Product Router', () => {
    let cookie;
    before(async function () {
       mongoose.connection.collections.products.deleteMany({
        $where: {
            code: 333
        }
       })
      const response  =  await requester.post("/api/sessions/login").send({
        email: CONFIG.ADMIN_EMAIL,
        password: CONFIG.ADMIN_PASSWORD
       })

       cookie = response.headers["set-cookie"];
    })
   
    describe('Prueba de producto', async function() {
        let producto = {
                title: "Cuaderno A4 Verde",
                description: "Cuaderno para apuntes",
                category: "libreria",
                code: 333,
                price: 20,
                thumbnails: ["https://www.libreriaascorti.com.ar/4118-large_default/cuaderno-america-terra-a4-80-hojas-rayado.jpg"],
                stock: 28,
                status: true
            }
        it.skip('Agregar un producto correctamente', async function() {
            const { statusCode, ok, _body } = await requester
            .post("/api/products")
            .set("Cookie", cookie)
            .send(producto);
            console.log(statusCode, ok, _body);
            expect(ok).to.be.ok;
            expect(_body).to.have.property("product");
            expect(_body.product.title).to.equal(producto.title)
            expect(_body.product.code).to.equal(producto.code)
         }).timeout(10000);

         it.skip("Error al crear un producto: missing fields", async function() {
            const mockProduct = {
                title: "Cuaderno A4 Verde",
                description: "Cuaderno para apuntes",
                category: "libreria",
                price: 20,
                thumbnails: ["https://www.libreriaascorti.com.ar/4118-large_default/cuaderno-america-terra-a4-80-hojas-rayado.jpg"],
                stock: 28
            }
            const { statusCode, ok, _body } = await requester
            .post("/api/products")
            .set("Cookie", cookie)
            .send(mockProduct);
            console.log(statusCode, ok, _body);
            expect(ok).to.not.be.ok;
            console.log(_body, 'body')
         }).timeout(10000);
        })

        it.skip("GET api/products/ debe campo status y payload ser arreglo", async function() {
            const { statusCode, ok, _body } = await requester.get("/api/products").set("Cookie", cookie)
            console.log( statusCode, ok,_body, "BODY")
            expect(ok).to.be.ok;
            expect(Array.isArray(_body.docs)).to.equal(true);
          }).timeout(10000);
    })

