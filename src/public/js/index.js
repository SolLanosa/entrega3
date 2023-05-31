const socket = io();

const productList = document.getElementById("productsList")
const form = document.getElementById("form")

//cliente emite señal de que elimina un producto
const onDeleteProduct = (id) => {
  socket.emit('deleteProduct', id)
}

const addProductList = (product) => {
  const tr = document.createElement('tr');
  tr.id = product.id
  const td1 = document.createElement('td');
  const td2 = document.createElement('td');
  const td3 = document.createElement('td');
  const td4 = document.createElement('td');
  const button = document.createElement('button');
  button.addEventListener('click', () => onDeleteProduct(product.id))
  td1.textContent = product.title
  td2.textContent = product.id
  td3.textContent = product.price + '$'
  button.textContent = 'Borrar'

  td4.appendChild(button)
  tr.appendChild(td1)
  tr.appendChild(td2)
  tr.appendChild(td3)
  tr.appendChild(td4)
  productList.appendChild(tr)
}

//cliente escucha que un producto fue eliminado
socket.on('productDeleted', id => {
  const tr = document.getElementById(id)
  productList.removeChild(tr)
})

//cliente escucha los productos
socket.on("products", products => {
  products.forEach(addProductList)
});

//cliente emite señal de que agrega un producto
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const inputTitle = document.getElementById("title")
  const inputPrice = document.getElementById("price")
  const inputCode = document.getElementById("code")
  const inputStock = document.getElementById("stock")
  const inputDescripcion = document.getElementById("descripcion")
  const inputThumbnails = document.getElementById("thumbnails")
  const inputStatus = document.getElementById("status")
  const inputCategory = document.getElementById("category")

  const producto = {
    title: inputTitle.value,
    price: Number(inputPrice.value),
    code: inputCode.value,
    stock: Number(inputStock.value),
    category: inputCategory.value,
    description: inputDescripcion.value,
    thumbnails: [inputThumbnails.value],
    status: inputStatus.value === 'true'
  }

    socket.emit('addProduct', producto);
    inputTitle.value = '';
    inputPrice.value = '';
    inputCode.value  = '';
    inputStock.value  = '';
    inputCategory.value  = '';
    inputDescripcion.value  = '';
    inputThumbnails.value  = '';
    inputStatus.value  = '';
});

socket.on('productAdded', addProductList)