async function deleteUser(uid) {  
      try {
        await fetch(`/api/users/${uid}`, {
          method: 'DELETE',
        })
      } catch (e) {
        console.log('error', e)
      }
    }