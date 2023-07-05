async function addProduct(id) {
  try {
    await fetch(`http://localhost:8080/api/carts/648f9b85a6f4620f563343a1/product/${id}`, {
      method: 'POST'
    })
  } catch (e) {
    console.log('error', e)
  }
}

async function logout() {
  fetch('/api/sessions/logout',{
    method:'GET',
  }).then(result=>{
    if(result.status===200){
        window.location.replace('/login');
    }
  })
}
