const createCart = async (id) => {
  await fetch(`http://localhost:8080/api/carts`, {
    method: 'POST'
  })
}
