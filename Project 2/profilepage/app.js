// Handle profile picture preview in the form
const profilePicInput = document.getElementById('profilePicInput');
const profilePic = document.getElementById('profilePic');
const headerProfilePic = document.getElementById('headerProfilePic');
const profileForm = document.getElementById('profileForm');
let newImageUrl = ''; // Store the selected image's URL temporarily

// Load profile picture from localStorage on page load
window.onload = function() {
  const storedImageUrl = localStorage.getItem('profileImage');
  if (storedImageUrl) {
    headerProfilePic.src = storedImageUrl; // Update header profile picture
    profilePic.src = storedImageUrl; // Update profile picture in the form
  }
};

profilePicInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  
  if (file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      // Preview the selected image in the profile section
      newImageUrl = e.target.result;
      profilePic.src = newImageUrl;
    };
    
    reader.readAsDataURL(file); // Read the file and get the data URL
  }
});

// Handle form submission to update header image and save changes
profileForm.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const userName = document.getElementById('userName').value;
  const userPhone = document.getElementById('userPhone').value;
  const userPassword = document.getElementById('userPassword').value;

  // Perform save logic (e.g., update localStorage or send to server)
  
  // Only update the header profile picture after "Save Changes"
  if (newImageUrl) {
    headerProfilePic.src = newImageUrl;
    localStorage.setItem('profileImage', newImageUrl); // Store the image URL in localStorage
  }

  // Optionally reset the form or perform further actions here
});
// JavaScript for handling profile picture changes
const deleteProfilePicButton = document.getElementById('deleteProfilePicButton');

// Default profile picture URL
const defaultProfilePicUrl = 'path/to/default/image.jpg';

// Handle delete profile picture
deleteProfilePicButton.addEventListener('click', function() {
    // Reset the profile picture to the default image
    document.getElementById('profilePic').src = defaultProfilePicUrl;

    // Also update the header profile picture
    const headerProfilePic = document.getElementById('headerProfilePic');
    headerProfilePic.src = defaultProfilePicUrl;

    // Optionally, remove from localStorage
    localStorage.removeItem('profileImage');
});
