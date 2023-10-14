async function endPurchase(cid) {
    await fetch(`/api/carts/${cid}/purchase`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        }
    })
}

async function emptyCart(cid) {
    try {
        await fetch(`/api/carts/${cid}`, {
            method: 'DELETE',
    
        }) 
        window.location.reload();
    } catch(e) {
        console.log(e)
    }
}

async function deleteProduct(cid, pid) {
    try {
        await fetch(`/api/carts/${cid}/products/${pid}`, {
            method: 'DELETE',
        }) 
        window.location.reload();
    } catch(e) {
        console.log(e)
    }
}


