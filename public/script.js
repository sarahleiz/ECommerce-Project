document.getElementById('searchInput').addEventListener('input', updateProducts);

let currentPage = 1;



//event listeners for pagination buttons
document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
document.getElementById('nextPage').addEventListener('click', () => changePage(1));


//event listener for product sorting
document.getElementById('sortSelect').addEventListener('change', () => {
  currentPage = 1; // Reset to the first page when sorting changes
  updateProducts();
});


//update product quantities
function updateQuantity(productId, delta) {
  const quantityInput = document.getElementById(`quantity-${productId}`);
  const hiddenQuantityInput = document.getElementById(`hidden-quantity-${productId}`);
  let quantityValue = parseInt(quantityInput.value, 10) + delta;

  // Ensure the quantity is at least 1
  quantityValue = Math.max(quantityValue, 1);

  quantityInput.value = quantityValue;
  hiddenQuantityInput.value = quantityValue;
}



//updates products in productsList
async function updateProducts() {
  try {
    const name = document.getElementById('searchInput').value;

    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, page: currentPage, pageSize: 6 }),
    });

    if (response.ok) {
      const { products, totalPages } = await response.json();
      const container = document.getElementById('productsList');
      container.innerHTML = '';
      
      
      
      
      
      
      
      
      
    // Get the selected sort option
const sortSelect = document.getElementById('sortSelect');
const selectedSort = sortSelect.value;

// Sort the products based on the selected option
products.sort((a, b) => {
  switch (selectedSort) {
    case 'nameAsc':
      return a.name.localeCompare(b.name);
    case 'nameDesc':
      return b.name.localeCompare(a.name);
    case 'priceAsc':
      return a.price - b.price;
    case 'priceDesc':
      return b.price - a.price;
    case 'stockAsc':
      return a.stock - b.stock;
    case 'stockDesc':
      return b.stock - a.stock;
    default:
      return 0;
  }
});
  
      
      
      
      
      
      
      

      // Inside the products.forEach loop in updateProducts function
products.forEach((product) => {
  const productContainer = document.createElement('div');
  productContainer.classList.add('product-container');

  const productImage = document.createElement('img');
  productImage.src = product.link;
  productImage.alt = product.name;
  productImage.classList.add('product-image');

  const productName = document.createElement('p');
  productName.innerHTML = `<strong>${product.name}</strong>`;

  const productDescription = document.createElement('p');
  productDescription.textContent = product.description;

  const productPrice = document.createElement('p');
  productPrice.textContent = `$${product.price}`;

  const productStock = document.createElement('p');
  productStock.textContent = `${product.stock} available`;

  const quantitySelector = document.createElement('div');
  quantitySelector.classList.add('quantity-selector');

  const decreaseButton = document.createElement('button');
  decreaseButton.textContent = '-';
  decreaseButton.classList.add('quantity-btn');
  decreaseButton.addEventListener('click', (event) => {
  event.preventDefault(); // Prevent the default form submission
  updateQuantity(product._id, -1);
});
  const quantityInput = document.createElement('input');
  quantityInput.type = 'number';
  quantityInput.classList.add('quantity-input');
  quantityInput.id = `quantity-${product._id}`;
  quantityInput.name = 'quantity';
  quantityInput.value = '1';


  const increaseButton = document.createElement('button');
  increaseButton.textContent = '+';
  increaseButton.classList.add('quantity-btn');
  increaseButton.addEventListener('click', (event) => {
  event.preventDefault(); // Prevent the default form submission
  updateQuantity(product._id, 1);
});
  const addToCartForm = document.createElement('form');
  addToCartForm.classList.add('mt-3');
  addToCartForm.action = '/addToCart';
  addToCartForm.method = 'POST';

  const productIdInput = document.createElement('input');
  productIdInput.type = 'hidden';
  productIdInput.name = 'productId';
  productIdInput.value = product._id;

  const hiddenQuantityInput = document.createElement('input');
  hiddenQuantityInput.type = 'hidden';
  hiddenQuantityInput.name = 'quantity';
  hiddenQuantityInput.id = `hidden-quantity-${product._id}`;
  hiddenQuantityInput.value = '1';

  const addToCartButton = document.createElement('button');
  addToCartButton.type = 'submit';
  addToCartButton.textContent = 'Add to Cart';
  
  

  // Append elements to their respective containers
  quantitySelector.appendChild(decreaseButton);
  quantitySelector.appendChild(quantityInput);
  quantitySelector.appendChild(increaseButton);

  addToCartForm.appendChild(productIdInput);
  addToCartForm.appendChild(quantitySelector);
  addToCartForm.appendChild(addToCartButton);

  productContainer.appendChild(productImage);
  productContainer.appendChild(productName);
  productContainer.appendChild(productDescription);
  productContainer.appendChild(productPrice);
  productContainer.appendChild(productStock);
  productContainer.appendChild(addToCartForm);

  container.appendChild(productContainer);
});

// Rest of the code...


      // Update pagination information
      const paginationInfo = document.getElementById('paginationInfo');
      paginationInfo.textContent = `Page ${currentPage} of ${totalPages} (6 products per page)`;

      // Enable/disable pagination buttons based on the current page
      document.getElementById('prevPage').disabled = currentPage === 1;
      document.getElementById('nextPage').disabled = currentPage === totalPages;
    } else {
      console.error('Response not ok with status:', response.status);
    }
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}



//for pagination
function changePage(delta) {
  currentPage += delta;
  updateProducts();
}

updateProducts();



//for GIF slideshow
const scrollingGifsContainer = document.getElementById('scrollingGifs');
let gifIndex = 0;



//GIF links in slideshow
function updateScrollingGifs() {
  const gifLinks = [
  
  'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHZ3NDV4MzJ6bmNrN3J2d3o4NXdrcWNiaXEybTJwcmQ1Z2czemFhcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3SP9ATEG1KCJ1wUZdC/giphy.gif',
  'https://media.giphy.com/media/MVO3PcGkAOsog/giphy.gif?cid=ecf05e4711qi5585kq73blx3rrax11a4l5otwauo8wkzwvo2&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/ycggHBOJnimDtb6Zba/giphy.gif?cid=ecf05e4766qufort8g7xpkx85m91mu5x9xy5v9osgbt0zx1k&ep=v1_gifs_search&rid=giphy.gif&ct=g',   
  'https://media.giphy.com/media/En6uBClyHm0RG/giphy.gif?cid=ecf05e47mptnd4pr21ggxmya0jzfn22vuuihek099n5znudh&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media0.giphy.com/media/UPgCwaZODQAYo/giphy.gif?cid=ecf05e47ijpbj3knqgwk7j0tf4m2ow7heto6ud68p6c9cbyo&ep=v1_gifs_related&rid=giphy.gif&ct=g',
  'https://media0.giphy.com/media/l1J3CuNWgWGN8Ll5e/giphy.gif?cid=ecf05e47czcupu30hzyy0rph593knqcfinyktg8uhnts12og&ep=v1_gifs_related&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/q01igVw9qN8B072nXa/giphy.gif?cid=790b76116m4vh087t3tkrjq2r3jbtylve6su8o49kd24xyp3&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/26uf1bq4LjIMxplVm/giphy.gif?cid=790b7611k73ij37d4alf3yazq7mz0gpaycxswfvvuaoyq6ac&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/uKpWZU3VXLprW/giphy.gif?cid=790b7611s6mb4r5q0yb7vhl4p7qisik1ee0jquz9ar7p1bnd&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/ymkUFbGgt3loA/giphy.gif?cid=790b7611jduahyl9vdqrpuqklhog2ky8idvl3d30zqrq2pew&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://64.media.tumblr.com/6e3e4eee2ffc25af97750e2620fb4727/9cc552734ee1b3ad-8d/s400x600/a7fcaf86ecd88fabf464b9f4aee6ec22a3ef5c67.gifv',
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXhyNWg3ZzAxMG9rb2J1bWN0b3pucWhnMjhnMmw3dnYyMHRzZjRyaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Pqp4Y64TcGwJa/giphy.gif',
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnF5cGt5dnBleHVlMm05bWE3anAzYzViMWEzcXB3anVldm5nc3NibCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l44QvFam1JXtKYNna/100.webp',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3MzeWhnaGk5bnd0b3IzaHJnNW43dTZuejl6eG5hdWFuM2ZoYWM2NCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/14nwNM6Ee4csPm/giphy.gif'
    // Add more gif links as needed
  ];

  const gifElement = document.createElement('img');
  gifElement.src = gifLinks[gifIndex];
  gifElement.alt = 'Scrolling Gif';

  scrollingGifsContainer.appendChild(gifElement);

  // Increment gifIndex or reset to 0 when reaching the end
  gifIndex = (gifIndex + 1) % gifLinks.length;

  // Remove the first gif element if there are too many to keep the line from growing indefinitely
  if (scrollingGifsContainer.children.length > 20) {
    scrollingGifsContainer.removeChild(scrollingGifsContainer.firstChild);
  }

  // Schedule the next update after a short delay (adjust as needed)
  setTimeout(updateScrollingGifs, 300); // 2000 milliseconds (2 seconds)
}

updateScrollingGifs();