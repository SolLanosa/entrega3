
const identificacionInput = document.getElementById("identificacion");
const domicilioInput = document.getElementById('domicilio');
const estadoDeCuentaInput = document.getElementById('estadoDeCuenta');

async function uploadDocuments(uid) {
  const formData = new FormData();
  formData.append(identificacionInput.name, identificacionInput.files[0])
  formData.append(domicilioInput.name, domicilioInput.files[0])
  formData.append(estadoDeCuentaInput.name, estadoDeCuentaInput.files[0])

    try {
      await fetch(`http://localhost:8080/api/users/${uid}/documents`, {
        method: 'POST',
        body: formData
      })
    } catch (e) {
      console.log('error', e)
    }
  }