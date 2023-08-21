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