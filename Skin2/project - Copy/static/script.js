// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const resultDiv = document.getElementById('result');
const selectedImage = document.getElementById('selectedImage');
const cameraPermission = document.getElementById('cameraPermission');
const requestPermissionBtn = document.getElementById('requestPermission');
const captureBtn = document.getElementById('captureBtn');
const historyImages = []; // Store history of captured images

// Initialize close buttons
function initializeCloseButtons() {
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const popup = this.closest('.popup');
            if (popup) {
                popup.style.display = 'none';
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
        video.srcObject = stream;
        video.style.display = 'block';
        cameraPermission.style.display = 'none';
        captureBtn.disabled = false;
    } catch (err) {
        console.error('Error accessing webcam:', err);
        video.style.display = 'none';
        cameraPermission.style.display = 'block';
        captureBtn.disabled = true;
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
    if (!video.srcObject) {
        alert('Please allow camera access first');
        return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');

    // Add captured image to history
    historyImages.unshift(imageData);
    if (historyImages.length > 4) historyImages.pop();

    video.style.display = 'none';
    canvas.style.display = 'block';
    selectedImage.style.display = 'none';

    // Create download link and trigger download
    const downloadLink = document.createElement('a');
    downloadLink.href = imageData;
    downloadLink.download = `captured-image-${new Date().getTime()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Upload image function
function uploadImage() {
    if (imageUpload.files.length > 0) {
        const file = imageUpload.files[0];
        const formData = new FormData();
        formData.append('file', file);

        // Here you would send the formData to your backend
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
            selectedImage.src = e.target.result;
            selectedImage.style.display = 'block';
            video.style.display = 'none';
            canvas.style.display = 'none';

            // Add to history
            historyImages.unshift(e.target.result);
            if (historyImages.length > 4) historyImages.pop();
        };
        reader.readAsDataURL(file);
    }
}

// Resubmit function
function resubmit() {
    selectedImage.style.display = 'none';
    initializeCamera(); // Properly reinitialize camera
    canvas.style.display = 'none';
    imageUpload.value = '';
    resultDiv.innerHTML = '';
}

// Login and Signup Flow
document.getElementById('loginBtn').addEventListener('click', function() {
    document.getElementById('loginPage').style.display = 'block';
});

document.getElementById('signupLink').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('signupTypePage').style.display = 'block';
});

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
        historyImagesDiv.appendChild(imgElement);
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