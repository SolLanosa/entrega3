function endPurchase(cid) {
    fetch(`/api/carts/${cid}/purchase`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        }
    })
}