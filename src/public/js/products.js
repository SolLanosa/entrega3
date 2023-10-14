async function addProduct(cid, id) {
  try {
    await fetch(`/api/carts/${cid}/product/${id}`, {
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
