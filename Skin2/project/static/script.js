const video = document.getElementById('video');          // Video element for the live camera feed
const canvas = document.getElementById('canvas');        // Canvas to capture snapshots from the camera
const context = canvas.getContext('2d');                 // Context for drawing on the canvas (2D images)
const imageUpload = document.getElementById('imageUpload');  // File input for uploading images
const resultDiv = document.getElementById('result');         // Div to display detection results
const selectedImage = document.getElementById('selectedImage'); // Display area for uploaded or captured image
const cameraPermission = document.getElementById('cameraPermission'); // Div showing camera permission message
const requestPermissionBtn = document.getElementById('requestPermission'); // Button to request camera access
const captureBtn = document.getElementById('captureBtn'); // Button to capture an image from the camera
const historyImages = []; // Array to store a history of captured or uploaded images

function initializeCloseButtons() {
    const closeButtons = document.querySelectorAll('.close-btn'); // Selects all close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const popup = this.closest('.popup'); // Finds the closest popup container
            if (popup) {
                popup.style.display = 'none'; // Hides the popup by setting its display to 'none'
            }
        });
    });
}


// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCloseButtons);


// Camera initialization function
async function initializeCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream; // Sets the video source to the live camera feed
        video.style.display = 'block'; // Shows the video element
        cameraPermission.style.display = 'none'; // Hides the permission message
        captureBtn.disabled = false; // Enables the capture button
    } catch (err) {
        console.error('Error accessing webcam:', err);
        video.style.display = 'none'; // Hides the video if permission is denied
        cameraPermission.style.display = 'block'; // Shows permission message if error occurs
        captureBtn.disabled = true; // Disables capture button when access fails
    }
}

// Request camera permission
requestPermissionBtn.addEventListener('click', initializeCamera);


// Initial camera setup
initializeCamera().catch(() => {
    cameraPermission.style.display = 'block';
    captureBtn.disabled = true;
});

// Capture image function
function captureImage() {
    if (!video.srcObject) { // Checks if video is active
        alert('Please allow camera access first');
        return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draws current video frame onto canvas
    const imageData = canvas.toDataURL('image/png'); // Converts the canvas image to a PNG URL format

    // Adds the captured image to history
    historyImages.unshift(imageData);
    if (historyImages.length > 4) historyImages.pop(); // Limits history to 4 images

    // Toggles display states to show the captured image on canvas
    video.style.display = 'none';
    canvas.style.display = 'block';
    selectedImage.style.display = 'none';

    // Creates a download link to allow the user to save the captured image
    const downloadLink = document.createElement('a');
    downloadLink.href = imageData;
    downloadLink.download = `captured-image-${new Date().getTime()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click(); // Automatically downloads the captured image
    document.body.removeChild(downloadLink); // Removes the link after download
}


// Upload image function
function uploadImage() {
    if (imageUpload.files.length > 0) {
        const file = imageUpload.files[0];
        const formData = new FormData();
        formData.append('file', file);

        // Simulated upload process; replace with backend handling code for actual upload
        console.log('Uploading image:', file.name);
        alert('Image upload simulation complete!');
    } else {
        alert('Please select an image first');
    }
}


// Display selected image function
function displaySelectedImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedImage.src = e.target.result; // Sets the image source to the file data
            selectedImage.style.display = 'block'; // Shows the selected image
            video.style.display = 'none';
            canvas.style.display = 'none';

            // Adds image to history and limits it to 4 items
            historyImages.unshift(e.target.result);
            if (historyImages.length > 4) historyImages.pop();
        };
        reader.readAsDataURL(file);
    }
}


// Resubmit function
function resubmit() {
    selectedImage.style.display = 'none';
    initializeCamera(); // Reopens the camera if user needs to capture a new image
    canvas.style.display = 'none';
    imageUpload.value = ''; // Clears the file input field
    resultDiv.innerHTML = ''; // Clears the result display area
}

// Login and Signup Flow
document.getElementById('loginBtn').addEventListener('click', function() {
    document.getElementById('loginPage').style.display = 'block'; // Opens login popup
});

document.getElementById('signupLink').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('loginPage').style.display = 'none'; // Hides login popup
    document.getElementById('signupTypePage').style.display = 'block'; // Opens signup type selection
});

// More code for handling login and signup flows...

document.getElementById('loginLink').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('signupPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
});

// Handle user type selection
document.getElementById('patientSignup').addEventListener('click', function() {
    showSignupForm('Patient');
});

document.getElementById('doctorSignup').addEventListener('click', function() {
    showSignupForm('Doctor');
});

function showSignupForm(userType) {
    document.getElementById('signupTypePage').style.display = 'none';
    document.getElementById('signupPage').style.display = 'block';
    document.getElementById('userType').textContent = userType;
}

// Handle signup submission
document.getElementById('signupSubmit').addEventListener('click', function() {
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const userType = document.getElementById('userType').textContent;

    if (!username || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Here you would typically send this data to your backend
    console.log('Signup data:', { username, email, password, userType });
    
    // For demo purposes, show success and redirect to login
    alert('Signup successful! Please login.');
    document.getElementById('signupPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
});

// Handle login submission
document.getElementById('loginSubmit').addEventListener('click', function() {
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Here you would typically verify with your backend
    console.log('Login attempt:', { email, password });
    
    // For demo purposes, show success
    alert('Login successful!');
    document.getElementById('loginPage').style.display = 'none';
});

// History functionality
document.getElementById('historyBtn').addEventListener('click', function() {
    const historySection = document.getElementById('historySection');
    historySection.style.display = 'block';

    const historyImagesDiv = document.getElementById('historyImages');
    historyImagesDiv.innerHTML = '';

    historyImages.forEach(imgSrc => {
        const imgElement = document.createElement('img');
        imgElement.src = imgSrc;
        imgElement.style.width = '100px';
        imgElement.style.margin = '5px';
        historyImagesDiv.appendChild(imgElement); // Adds each image to the history section
    });
});

// Close popups when clicking outside
window.addEventListener('click', function(event) {
    const popups = document.getElementsByClassName('popup');
    for (let popup of popups) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    }
});