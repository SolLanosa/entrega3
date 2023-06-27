async function addProduct(id) {
  try {
    await fetch(`http://localhost:8080/api/carts/648f9b85a6f4620f563343a1/product/${id}`, {
      method: 'POST'
    })
  } catch (e) {
    console.log('error', e)
  }
}
