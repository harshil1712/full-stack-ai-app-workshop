// Global state
let bearerToken = '';
let currentPostcardId = null;
let currentCity = '';
let gallery = JSON.parse(localStorage.getItem('postcardGallery') || '[]');

// DOM elements
const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const tokenInput = document.getElementById('tokenInput');
const cityInput = document.getElementById('cityInput');
const promptSection = document.getElementById('promptSection');
const promptDisplay = document.getElementById('promptDisplay');
const resultSection = document.getElementById('resultSection');
const generatedImage = document.getElementById('generatedImage');
const postcardCity = document.getElementById('postcardCity');
const galleryGrid = document.getElementById('galleryGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const generatePromptBtn = document.getElementById('generatePromptBtn');
const generateImageBtn = document.getElementById('generateImageBtn');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check if token exists in localStorage
    const savedToken = localStorage.getItem('bearerToken');
    if (savedToken) {
        bearerToken = savedToken;
        tokenInput.value = savedToken;
        showAppSection();
    }

    // Add enter key listeners
    tokenInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') authenticate();
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generatePrompt();
    });
});

// Authentication
function authenticate() {
    const token = tokenInput.value.trim();
    if (!token) {
        showError('Please enter a bearer token');
        return;
    }

    bearerToken = token;
    localStorage.setItem('bearerToken', token);
    showAppSection();
    showSuccess('Successfully authenticated!');
}

function showAppSection() {
    authSection.style.display = 'none';
    appSection.style.display = 'block';
}

// API calls
async function makeAPICall(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(endpoint, options);

        if (!response.ok) {
            if (response.status === 401) {
                showError('Authentication failed. Please check your token.');
                logout();
                return null;
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
    } catch (error) {
        console.error('API call failed:', error);
        showError(`API call failed: ${error.message}`);
        return null;
    }
}

// Generate prompt
async function generatePrompt() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    showLoading('Generating prompt...');
    generatePromptBtn.disabled = true;

    try {
        const response = await makeAPICall('/api/generate/prompt', 'POST', { city });

        if (response) {
            const data = await response.json();
            currentPostcardId = data.id;
            currentCity = city;

            promptDisplay.textContent = data.prompt;
            promptSection.style.display = 'block';
            resultSection.style.display = 'none';

            showSuccess('Prompt generated successfully!');
        }
    } catch (error) {
        showError('Failed to generate prompt. Please try again.');
    } finally {
        hideLoading();
        generatePromptBtn.disabled = false;
    }
}

// Generate image
async function generateImage() {
    if (!currentPostcardId) {
        showError('No prompt available. Please generate a prompt first.');
        return;
    }

    showLoading('Generating image... This may take a moment.');
    generateImageBtn.disabled = true;

    try {
        const response = await makeAPICall(`/api/generate/image/${currentPostcardId}`, 'POST');

        if (response) {
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);

            generatedImage.src = imageUrl;
            postcardCity.textContent = currentCity;
            resultSection.style.display = 'block';

            showSuccess('Image generated successfully!');
        }
    } catch (error) {
        showError('Failed to generate image. Please try again.');
    } finally {
        hideLoading();
        generateImageBtn.disabled = false;
    }
}

// Save to gallery
function saveToGallery() {
    if (!currentPostcardId || !generatedImage.src) {
        showError('No image to save');
        return;
    }

    showSuccess('Postcard saved! The image and prompt are stored in the database. Click "View Gallery" to see all your postcards.');
}

// Note: Gallery functionality moved to separate gallery.html page

// Utility functions
function showLoading(message = 'Loading...') {
    loadingSpinner.style.display = 'flex';
    loadingSpinner.querySelector('p').textContent = message;
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

function showError(message) {
    removeMessages();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    const firstCard = document.querySelector('.card');
    if (firstCard) {
        firstCard.insertBefore(errorDiv, firstCard.firstChild);
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

function showSuccess(message) {
    removeMessages();
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;

    const firstCard = document.querySelector('.card');
    if (firstCard) {
        firstCard.insertBefore(successDiv, firstCard.firstChild);
        setTimeout(() => successDiv.remove(), 3000);
    }
}

function removeMessages() {
    document.querySelectorAll('.error-message, .success-message').forEach(el => el.remove());
}

function logout() {
    bearerToken = '';
    localStorage.removeItem('bearerToken');
    tokenInput.value = '';
    authSection.style.display = 'block';
    appSection.style.display = 'none';
    promptSection.style.display = 'none';
    resultSection.style.display = 'none';
}