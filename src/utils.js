import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import { faker } from "@faker-js/faker"
import multer from 'multer';
import mime from 'mime-types';

export const createHash =(password) => bcrypt.hashSync(password,bcrypt.genSaltSync(10));
export const isValidPassword = (hashedPassword, password) =>bcrypt.compareSync(password,hashedPassword);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const generateProduct = () => {
    return { 
        ObjectId: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.number.int({ max: 1000000 }),
        category: faker.commerce.department(),
        price: faker.commerce.price(),
        thumbnails: [faker.image.url()],
        stock: faker.number.int({ max: 2000 }),
        status: true
    }
}

const storage = (destination) => multer.diskStorage({
  destination: function(req, file, cb){
      let destinationPath = `/public/${destination}`
      cb(null, __dirname+destinationPath);
    },

  filename: function(req, file, cb){
      cb(null, Date.now() + "-" + `${file.fieldname}.${mime.extension(file.mimetype)}` )
  }
})

export const uploader = (destination) => multer({
  storage: storage(destination),
  onError: function (err, next) {
    console.log(err);
    next();
  },
});
