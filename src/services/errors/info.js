export const generateUserErrorInfo = (user) => {
    return `Could not find user with this email: ${user}`
}

export const generateCartNotFoundInfo = (id) => {
    return `Could not find cart with id: ${id}.`
}

export const generateProductNotFoundInfo = (id) => {
    return `Could not find product with id: ${id}.`
}

export const generateErrorProductNotBeDelete = (product) => {
    return `You can't delete this products. Product: ${product} doesn't exist`
}

export const generateMissingId = (id) => {
    return `Id is missing, received: ${id}`
}

export const productsNotExistError = () => {
    return `Products are missing`
}

export const generateProductCreateErrorInfo = (product)=>{
    return `One or more properties were completed or invalid
    List of required properties:
    *title: needs to be a String, received ${product.title}
    *description: needs to be a String, received ${product.description}
    *code: needs to be a Number, received ${product.code}
    *category: needs to be a String, received ${product.category}
    *price: needs to be a Number, received ${product.price}
    *thumbnails: needs to be an Array, received ${product.thumbnails}
    *stock: needs to be a Number, received ${product.stock}
    *status: needs to be a Boolean, received ${product.status}`
  }