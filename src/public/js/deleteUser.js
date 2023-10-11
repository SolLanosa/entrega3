async function deleteUser(uid) {  
      try {
        await fetch(`http://localhost:8080/api/users/${uid}`, {
          method: 'DELETE',
        })
      } catch (e) {
        console.log('error', e)
      }
    }