// Elements
const addDishForm = document.getElementById('addNewItemForm');
const menuList = document.getElementById('menuList');
const headerProfilePic = document.getElementById('header-profile-image');

// Load items and profile image from localStorage on page load
window.onload = function() {
    loadMenuItems();
    loadProfileImage();
    showSection('addNewItem'); // Show the Add New Item section by default
};

// Load menu items from localStorage
function loadMenuItems() {
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    menuItems.forEach(addMenuItemToDOM);
}

// Load profile image
function loadProfileImage() {
    const storedImage = localStorage.getItem('profileImage') || './images/profile logo.png';
    headerProfilePic.src = storedImage;
}

// Handle form submission to add a new dish
addDishForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const dishName = document.getElementById('dishName').value;
    const dishPrice = document.getElementById('dishPrice').value;
    const dishImage = document.getElementById('dishImage').files[0];

    if (dishImage) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const dish = {
                name: dishName,
                price: dishPrice,
                image: event.target.result,
                status: 'in-stock' // Default stock status
            };

            saveDishToLocalStorage(dish);
            addMenuItemToDOM(dish);
            addDishForm.reset();
        };
        reader.readAsDataURL(dishImage);
    }
});

// Save dish to localStorage
function saveDishToLocalStorage(dish) {
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    menuItems.push(dish);
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
}

// Variable to track the item to delete
let itemToDelete = null;

// Add a dish to the DOM
function addMenuItemToDOM(dish) {
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-md-4', 'mb-3');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'h-100');

    const img = document.createElement('img');
    img.src = dish.image;
    img.alt = dish.name;
    img.classList.add('card-img-top', 'img-fluid');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body', 'text-center');

    const dishTitle = document.createElement('h5');
    dishTitle.textContent = dish.name;
    dishTitle.classList.add('card-title');

    const dishPriceElement = document.createElement('p');
    dishPriceElement.innerHTML = `Price: <span class="price">${dish.price} JD</span>`;
    dishPriceElement.classList.add('card-text');

    // Stock Status and Change buttons
    const stockStatusButton = document.createElement('button');
    stockStatusButton.textContent = dish.status === 'in-stock' ? 'Mark as Out of Stock' : 'Mark as In Stock';
    stockStatusButton.classList.add('btn', dish.status === 'in-stock' ? 'btn-success' : 'btn-secondary', 'mt-2', 'w-100');
    stockStatusButton.addEventListener('click', () => toggleStockStatus(dish, stockStatusButton, img));

    const editImageButton = document.createElement('button');
    editImageButton.textContent = 'Change Image';
    editImageButton.classList.add('btn', 'btn-info', 'mt-2', 'w-100');
    editImageButton.addEventListener('click', () => changeDishImage(dish, img));

    const editPriceButton = document.createElement('button');
    editPriceButton.textContent = 'Change Price';
    editPriceButton.classList.add('btn', 'btn-warning', 'mt-2', 'w-100');
    editPriceButton.addEventListener('click', () => changeDishPrice(dish, dishPriceElement));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger', 'mt-2', 'w-100');
    deleteButton.setAttribute('data-bs-toggle', 'modal');
    deleteButton.setAttribute('data-bs-target', '#deleteConfirmationModal');
    deleteButton.addEventListener('click', () => {
        itemToDelete = { dish, element: cardDiv };
    });

    // Append elements to the card
    cardBody.append(dishTitle, dishPriceElement, stockStatusButton, editImageButton, editPriceButton, deleteButton);
    cardDiv.append(img, cardBody);
    colDiv.append(cardDiv);
    menuList.append(colDiv);

    // Apply blur effect if the item is out of stock
    if (dish.status === 'out-of-stock') {
        img.classList.add('blurred');
    }
}

// Toggle stock status
function toggleStockStatus(dish, button, img) {
    if (dish.status === 'in-stock') {
        dish.status = 'out-of-stock';
        img.classList.add('blurred'); // Add blur effect to image
    } else {
        dish.status = 'in-stock';
        img.classList.remove('blurred'); // Remove blur effect from image
    }
    button.textContent = dish.status === 'in-stock' ? 'Mark as Out of Stock' : 'Mark as In Stock';
    button.classList.toggle('btn-success');
    button.classList.toggle('btn-secondary');
    updateDishInLocalStorage(dish);
}

// Change the image of a dish
function changeDishImage(dish, imgElement) {
    const newImageInput = document.createElement('input');
    newImageInput.type = 'file';
    newImageInput.accept = 'image/*';
    newImageInput.click();

    newImageInput.addEventListener('change', function() {
        const file = newImageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imgElement.src = event.target.result;
                dish.image = event.target.result;
                updateDishInLocalStorage(dish);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Change the price of a dish
function changeDishPrice(dish, priceElement) {
    const newPrice = prompt('Enter the new price:', dish.price);
    if (newPrice && !isNaN(newPrice)) {
        dish.price = newPrice;
        priceElement.innerHTML = `Price: <span class="price">${newPrice} JD</span>`;
        updateDishInLocalStorage(dish);
    }
}

// Update the dish in localStorage
function updateDishInLocalStorage(updatedDish) {
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    const updatedMenuItems = menuItems.map(item =>
        item.name === updatedDish.name ? updatedDish : item
    );
    localStorage.setItem('menuItems', JSON.stringify(updatedMenuItems));
}

// Handle item deletion
document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    if (itemToDelete) {
        deleteDishFromLocalStorage(itemToDelete.dish);
        itemToDelete.element.remove();
        itemToDelete = null;
    }
});

// Delete dish from localStorage
function deleteDishFromLocalStorage(dish) {
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    const updatedMenuItems = menuItems.filter(item => item.name !== dish.name || item.price !== dish.price);
    localStorage.setItem('menuItems', JSON.stringify(updatedMenuItems));
}

// Show the corresponding section
function showSection(sectionName) {
    const sections = ['addNewItem', 'editMenuItem'];
    sections.forEach(section => {
        const sectionElement = document.getElementById(section);
        if (section === sectionName) {
            sectionElement.classList.remove('collapse');
        } else {
            sectionElement.classList.add('collapse');
        }
    });
}
