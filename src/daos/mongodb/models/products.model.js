import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'
const collection = 'products'

const ProductsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  code: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  thumbnails: {
    type: Array,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.Mixed,
    default: 'admin'
  }
})

ProductsSchema.plugin(mongoosePaginate)
export const productsModel = mongoose.model(collection, ProductsSchema)
