async function changeRole(uid) {  
    try {
      await fetch(`http://localhost:8080/api/users/premium/${uid}`, {
        method: 'POST',
        body:"premium"
      })
    } catch (e) {
      console.log('error', e)
    }
  }