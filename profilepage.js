document.getElementById('profile-image-upload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Update the profile image preview
            document.getElementById('profile-image-preview').src = e.target.result;
            // Update the header image
            document.getElementById('header-profile-image').src = e.target.result;
            // Store the image in localStorage for cross-page persistence
            localStorage.setItem('profileImage', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// On page load, check if there's a stored profile image and set it
window.onload = function () {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
        document.getElementById('profile-image-preview').src = storedImage;
        document.getElementById('header-profile-image').src = storedImage;
    }
};

// Delete image button functionality
document.getElementById('delete-profile-image').addEventListener('click', function () {
    const defaultImage = './images/profile logo.png';
    document.getElementById('profile-image-preview').src = defaultImage;
    document.getElementById('header-profile-image').src = defaultImage;
    // Remove the stored image from localStorage
    localStorage.removeItem('profileImage');
});
