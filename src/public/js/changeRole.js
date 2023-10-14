async function changeRole(uid, isPremium) {  
    try {
      await fetch(`/api/users/premium/${uid}`, {
        method: 'POST',
        body: JSON.stringify({role: isPremium ?  "user" : "premium" }),
        headers:{
          'Content-Type':'application/json'
      }
      })
      window.location.reload();
    } catch (e) {
      console.log('error', e)
    }
  }