// JavaScript for showing and hiding the add dish form and edit menu items
const addNewItemButton = document.getElementById('addNewItemButton');
const editMenuItemsButton = document.getElementById('editMenuItemsButton');
const addDishForm = document.getElementById('addDishForm');
const editMenuForm = document.getElementById('editMenuForm');
const menuList = document.getElementById('menuList');
const headerProfilePic = document.getElementById('headerProfilePic'); // Add this line to get header image

// Load items from localStorage when the page loads
window.onload = function() {
  loadMenuItems();
  loadProfileImage(); // Load profile image on page load
};

// Function to scroll to a specific element
function scrollToElement(element) {
  const headerOffset = 100; // Adjust this value based on your header height
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Add event listener for "Add New Item" button
addNewItemButton.addEventListener('click', () => {
  addDishForm.classList.remove('hidden');
  editMenuForm.classList.add('hidden'); // Hide edit menu form
  scrollToElement(addDishForm); // Scroll to the add dish form
});

// Add event listener for "Edit Menu Items" button
editMenuItemsButton.addEventListener('click', () => {
  editMenuForm.classList.remove('hidden');
  addDishForm.classList.add('hidden'); // Hide add dish form
  scrollToElement(editMenuForm); // Scroll to the edit menu form
});

// Handling form submission to add a new dish
document.getElementById('addDishForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const dishName = document.getElementById('dishName').value;
  const dishPrice = document.getElementById('dishPrice').value;
  const dishImage = document.getElementById('dishImage').files[0];

  if (dishImage) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const imageUrl = event.target.result;

      // Create a new dish object
      const dish = {
        name: dishName,
        price: dishPrice,
        image: imageUrl
      };

      // Save the dish to localStorage
      saveDishToLocalStorage(dish);

      // Add the dish to the menu
      addMenuItem(dish);

      // Clear the form fields
      document.getElementById('dishName').value = '';
      document.getElementById('dishPrice').value = '';
      document.getElementById('dishImage').value = '';
    };

    reader.readAsDataURL(dishImage);
  }
});

// Load dishes from localStorage
function loadMenuItems() {
  const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
  menuItems.forEach(dish => addMenuItem(dish));
}

// Save dish to localStorage
function saveDishToLocalStorage(dish) {
  const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
  menuItems.push(dish);
  localStorage.setItem('menuItems', JSON.stringify(menuItems));
}

// Add a dish to the menu list
function addMenuItem(dish) {
  // Create a new div for the dish
  const menuItem = document.createElement('div');
  menuItem.classList.add('menu-item');

  // Create the dish image element
  const img = document.createElement('img');
  img.src = dish.image;
  img.alt = dish.name;

  // Create the dish name and price elements
  const dishTitle = document.createElement('h3');
  dishTitle.textContent = dish.name;

  const dishPriceElement = document.createElement('p');
  dishPriceElement.innerHTML = `Price: <span class="price">${dish.price}</span>`;

  // Create the "Delete" button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', function() {
    menuItem.remove();
    deleteDishFromLocalStorage(dish);
  });

  // Append elements to the new menu item div
  menuItem.appendChild(img);
  menuItem.appendChild(dishTitle);
  menuItem.appendChild(dishPriceElement);
  menuItem.appendChild(deleteButton);

  // Append the new item to the menu list
  menuList.appendChild(menuItem);
}

// Delete a dish from localStorage
function deleteDishFromLocalStorage(dishToRemove) {
  let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
  menuItems = menuItems.filter(dish => dish.name !== dishToRemove.name);
  localStorage.setItem('menuItems', JSON.stringify(menuItems));
}

// Load profile image from localStorage
function loadProfileImage() {
  const storedImageUrl = localStorage.getItem('profileImage');
  if (storedImageUrl) {
    headerProfilePic.src = storedImageUrl; // Update header profile picture
  }
}

// Load profile image from localStorage
function loadProfileImage() {
  const storedImageUrl = localStorage.getItem('profileImage');
  if (storedImageUrl) {
      headerProfilePic.src = storedImageUrl; // Update header profile picture
  } else {
      headerProfilePic.src = defaultProfilePicUrl; // Set to default if no image found
  }
}

// In the global scope, define the default profile picture URL
const defaultProfilePicUrl = '../images/profile logo.png';
