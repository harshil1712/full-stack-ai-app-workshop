// Gallery page JavaScript
let gallery = [];
let bearerToken = localStorage.getItem('bearerToken') || '';

// DOM elements
const galleryGrid = document.getElementById('galleryGrid');
const galleryCount = document.getElementById('galleryCount');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalCity = document.getElementById('modalCity');
const modalPrompt = document.getElementById('modalPrompt');
const modalDate = document.getElementById('modalDate');

// Initialize gallery page
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated
    if (!bearerToken) {
        showError('Please authenticate first. Redirecting to main page...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }

    loadGallery();

    // Close modal when clicking outside
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// Load and display gallery
async function loadGallery() {
    try {
        showLoading('Loading your postcards...');

        const response = await fetch('/api/gallery', {
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                showError('Authentication failed. Redirecting to main page...');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                return;
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        gallery = await response.json();

        if (gallery.length === 0) {
            galleryGrid.innerHTML = `
                <div class="empty-gallery">
                    <h3>No postcards yet!</h3>
                    <p>Start creating postcards to build your collection.</p>
                    <a href="index.html" class="btn primary" style="margin-top: 15px; text-decoration: none; display: inline-block;">
                        ✈️ Create Your First Postcard
                    </a>
                </div>
            `;
            updateGalleryStats();
            return;
        }

        galleryGrid.innerHTML = gallery.map((item, index) => `
            <div class="gallery-item">
                <img src="${item.imageUrl}" alt="Postcard of ${item.city}" onclick="openModal(${index})">
                <div class="gallery-item-info">
                    <h4>${item.city}</h4>
                    <p>${truncateText(item.prompt, 80)}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <small style="color: #a0aec0; font-size: 0.8rem;">
                            ID: ${item.id}
                        </small>
                        <button onclick="deletePostcard(${item.id}, ${index})" class="btn danger" style="padding: 5px 10px; font-size: 0.8rem;">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        updateGalleryStats();

    } catch (error) {
        console.error('Failed to load gallery:', error);
        showError('Failed to load gallery. Please try again.');
    } finally {
        hideLoading();
    }
}

// Open modal with full image details
function openModal(index) {
    const item = gallery[index];
    if (!item) return;

    modalImage.src = item.imageUrl;
    modalCity.textContent = item.city;
    modalPrompt.textContent = item.prompt;
    modalDate.textContent = `Postcard ID: ${item.id}`;

    imageModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

// Close modal
function closeModal() {
    imageModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scroll
}

// Delete individual postcard
async function deletePostcard(id, index) {
    const item = gallery[index];
    if (!item) return;

    if (confirm(`Are you sure you want to delete the postcard from ${item.city}? This cannot be undone.`)) {
        try {
            showLoading('Deleting postcard...');

            // Note: You might want to add a DELETE endpoint for this
            // For now, we'll just refresh the gallery
            showSuccess('Delete functionality coming soon! Gallery will refresh.');

            // Refresh gallery to show current state
            await loadGallery();

        } catch (error) {
            console.error('Failed to delete postcard:', error);
            showError('Failed to delete postcard. Please try again.');
        } finally {
            hideLoading();
        }
    }
}

// Clear all postcards
async function clearAllPostcards() {
    if (gallery.length === 0) {
        showError('Gallery is already empty!');
        return;
    }

    if (confirm(`Are you sure you want to delete all ${gallery.length} postcards? This cannot be undone.`)) {
        try {
            showLoading('Clearing gallery...');

            // Note: You might want to add a DELETE endpoint for bulk operations
            showError('Bulk delete functionality needs to be implemented in the API!');

        } catch (error) {
            console.error('Failed to clear gallery:', error);
            showError('Failed to clear gallery. Please try again.');
        } finally {
            hideLoading();
        }
    }
}

// Update gallery statistics
function updateGalleryStats() {
    const count = gallery.length;
    galleryCount.textContent = `${count} postcard${count !== 1 ? 's' : ''}`;
}

// Utility functions
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function formatDate(timestamp) {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
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

// Add loading/hiding functions for gallery page
function showLoading(message = 'Loading...') {
    // Create loading overlay if it doesn't exist
    let loadingSpinner = document.getElementById('loadingSpinner');
    if (!loadingSpinner) {
        loadingSpinner = document.createElement('div');
        loadingSpinner.id = 'loadingSpinner';
        loadingSpinner.className = 'loading';
        loadingSpinner.innerHTML = `
            <div class="spinner"></div>
            <p>Loading...</p>
        `;
        document.body.appendChild(loadingSpinner);
    }

    loadingSpinner.style.display = 'flex';
    loadingSpinner.querySelector('p').textContent = message;
}

function hideLoading() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
}

// Export to JSON (for backup)
function exportGallery() {
    if (gallery.length === 0) {
        showError('No postcards to export!');
        return;
    }

    const dataStr = JSON.stringify(gallery, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `postcard-gallery-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    showSuccess('Gallery exported successfully!');
}