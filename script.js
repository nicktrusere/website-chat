document.addEventListener('DOMContentLoaded', () => {
    const logoContainer = document.querySelector('header.navbar .logo');
    const logoImages = Array.from(document.querySelectorAll('header.navbar .logo img'));
    
    if (!logoContainer || logoImages.length === 0) {
        console.error('Logo elements not found!');
        return;
    }

    let currentIndex = 0;
    
    // Initialize visibility
    logoImages.forEach((img, index) => {
        img.style.opacity = index === 0 ? '1' : '0';
        img.style.zIndex = index === 0 ? '1' : '0';
    });

    logoContainer.addEventListener('click', () => {
        // Fade out current
        logoImages[currentIndex].style.opacity = '0';
        logoImages[currentIndex].style.zIndex = '0';
        
        // Update index
        currentIndex = (currentIndex + 1) % logoImages.length;
        
        // Fade in next
        logoImages[currentIndex].style.opacity = '1';
        logoImages[currentIndex].style.zIndex = '1';
    });
});

// Get the elements
const menuBtn = document.getElementById('menu-btn');
const infoBtn = document.getElementById('info-btn');
const searchBtn = document.getElementById('search-btn');

const menuPanel = document.getElementById('menu-panel');
const infoPanel = document.getElementById('info-panel');
const searchPanel = document.getElementById('search-panel');

const overlay = document.createElement('div'); // Create overlay dynamically
overlay.classList.add('overlay');
document.body.appendChild(overlay);

// Function to show a panel
function showPanel(panel) {
  // Hide other panels
  document.querySelectorAll('.side-panel').forEach((p) => p.classList.remove('active'));
  // Show the selected panel
  panel.classList.add('active');
  // Activate overlay
  overlay.classList.add('active');
}

// Function to close all panels
function closePanels() {
  document.querySelectorAll('.side-panel').forEach((p) => p.classList.remove('active'));
  overlay.classList.remove('active');
}

// Event listeners
menuBtn.addEventListener('click', () => showPanel(menuPanel));
infoBtn.addEventListener('click', () => showPanel(infoPanel));
searchBtn.addEventListener('click', () => showPanel(searchPanel));

// Close panels when clicking outside
overlay.addEventListener('click', closePanels);
