// Wedspage/wedspage-script.js - Updated with Dynamic Modal Logic & Help Modal Loader

document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".flip-card-container");
    
    // Get Modal elements
    const serviceModal = new bootstrap.Modal(document.getElementById('serviceDetailModal'));
    const serviceModalTitle = document.getElementById('serviceDetailModalLabel');
    const serviceModalBody = document.getElementById('serviceModalBody');

    // Helper function to unflip all cards
    const unflipAllCards = (excludeCard = null) => {
        cards.forEach(card => {
            if (card !== excludeCard) {
                card.classList.remove("flipped");
            }
        });
    };

    // --- TEMPLATES FOR DYNAMIC SERVICE CONTENT (keep existing templates here) ---
    const templates = {
        // ... (Your existing 'outfitCard', 'venueCard', etc. templates go here)
        outfitCard: {
            title: "Plan Your Wedding Outfits",
            content: `
                <div class="row g-0">
                    <div class="col-lg-3 bg-light p-4 border-end">
                        <h6 class="fw-bold mb-3 text-primary">Outfit Filters</h6>
                        <div class="mb-3">
                            <label class="form-label small">Color Preference</label>
                            <select class="form-select form-select-sm">
                                <option>Red/Gold</option>
                                <option>Pastel Pink</option>
                                <option>Royal Blue</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small">Designer/Style</label>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="traditional">
                                <label class="form-check-label small" for="traditional">Traditional</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="contemporary">
                                <label class="form-check-label small" for="contemporary">Contemporary</label>
                            </div>
                        </div>
                        <div class="d-grid mt-4">
                            <button class="btn btn-sm btn-outline-primary">Apply Filters</button>
                        </div>
                    </div>
                    <div class="col-lg-9 p-4">
                        <h6 class="text-muted mb-3">Showing 8 Top Matches</h6>
                        <div class="row g-3">
                            <div class="col-md-4"><img src="https://picsum.photos/400/300?random=11" class="img-fluid rounded shadow-sm" alt="Outfit 1"></div>
                            <div class="col-md-4"><img src="https://picsum.photos/400/300?random=12" class="img-fluid rounded shadow-sm" alt="Outfit 2"></div>
                            <div class="col-md-4"><img src="https://picsum.photos/400/300?random=13" class="img-fluid rounded shadow-sm" alt="Outfit 3"></div>
                            <div class="col-md-4"><img src="https://picsum.photos/400/300?random=14" class="img-fluid rounded shadow-sm" alt="Outfit 4"></div>
                        </div>
                    </div>
                </div>
            `
        },
        venueCard: {
            title: "Find and Shortlist Venues",
            content: `
                <div class="row g-0">
                    <div class="col-lg-3 bg-light p-4 border-end">
                        <h6 class="fw-bold mb-3 text-primary">Venue Filters</h6>
                        <div class="mb-3">
                            <label class="form-label small">Guest Capacity</label>
                            <input type="number" class="form-control form-control-sm" placeholder="Minimum 250">
                        </div>
                        <div class="mb-3">
                            <label class="form-label small">Type of Venue</label>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="venueType" id="indoor">
                                <label class="form-check-label small" for="indoor">Indoor Banquet</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="venueType" id="outdoor">
                                <label class="form-check-label small" for="outdoor">Outdoor Lawn/Farmhouse</label>
                            </div>
                        </div>
                        <div class="d-grid mt-4">
                            <button class="btn btn-sm btn-outline-primary">Search Venues</button>
                        </div>
                    </div>
                    <div class="col-lg-9 p-4">
                        <h6 class="text-muted mb-3">Showing 5 Prime Locations</h6>
                        <ul class="list-group">
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Royal Palace Grandeur <span class="badge bg-success">Booked</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                The Lakeside Resort <span class="badge bg-warning text-dark">Shortlisted</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                City Convention Center <span class="badge bg-info">New Match</span>
                            </li>
                        </ul>
                    </div>
                </div>
            `
        },
        default: {
            title: "Service Details",
            content: `<div class="p-5 text-center text-muted">Details for this service are coming soon!</div>`
        }
    };
    
    
    // --- MAIN FUNCTION TO OPEN SERVICE MODAL ---
    const openServiceModal = (serviceId) => {
        const serviceTemplate = templates[serviceId] || templates.default;
        
        serviceModalTitle.textContent = serviceTemplate.title;
        serviceModalBody.innerHTML = serviceTemplate.content;

        serviceModal.show();
    };


    // --- 1. EVENT LISTENERS FOR CARDS (Kept existing logic) ---
    cards.forEach(card => {
        card.addEventListener("click", function (e) {

            // Handle GO button click (to open the service modal)
            if (e.target.closest(".go-button")) {
                e.stopPropagation(); 
                const cardId = this.id;
                openServiceModal(cardId);
                return; 
            }

            // Handle Flip 
            const isCurrentlyFlipped = this.classList.contains("flipped");
            if (isCurrentlyFlipped) {
                this.classList.remove("flipped");
            } else {
                unflipAllCards(this); 
                this.classList.add("flipped");
            }
        });
    });
    
    // wedspage-script.js: Add this new section near the top, after the modal variables

    // --- NEW: DUMMY DATA FOR DASHBOARD FEATURES ---
    const dashboardData = {
        // Feature 1: Progress Ring Data (Task completion status)
        tasks: [
            { name: "Book Venue", completed: true },
            { name: "Finalize Date", completed: true },
            { name: "Create Guest List", completed: false },
            { name: "Book Photographer", completed: false },
            { name: "Select Caterer", completed: true },
            { name: "Buy Wedding Outfit", completed: false },
            { name: "Send Invites", completed: false },
            { name: "Finalize Event Schedule", completed: false },
        ],
        // Feature 2: Quick Alerts Data
        alerts: [
            { message: "Venue Deposit due in 5 days.", type: "danger", icon: "bi-exclamation-triangle-fill" },
            { message: "RSVP deadline in 10 days.", type: "warning", icon: "bi-person-badge-fill" },
            { message: "New vendor proposal received.", type: "info", icon: "bi-envelope-fill" },
        ],
        // Feature 3: Budget Snapshot Data (Using Indian Rupees placeholder for clarity)
        budget: {
            total: 3000000, // ₹30,00,000
            spent: 1250000, // ₹12,50,000
        }
    };


    // --- NEW FUNCTIONS FOR DASHBOARD FEATURES ---

    const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
};

        // 1. Dynamic Progress Ring Logic
    const updateProgressRing = () => {
    // Replace with your real data logic
    const totalTasks = 25;
    const completedTasks = 16; 
    const progress = Math.round((completedTasks / totalTasks) * 100);

    // SVG Calculation (for the 120x120 progress ring with r=54)
    const circumference = 2 * Math.PI * 54; // Calculated circumference is ~339.29
    const offset = circumference - (progress / 100) * circumference;

    document.getElementById('progressRingBar').style.strokeDashoffset = offset;
    document.getElementById('progressPercentage').textContent = `${progress}%`;
    document.getElementById('tasksCompleted').textContent = `${completedTasks} / ${totalTasks}`;
};

// 3. Service Card Statuses (Feature 1 Detail)
const updateServiceStatus = () => {
    // --- SIMULATED DATA ---
    // Replace this with real logic that checks if the card's service is planned/selected
    const serviceStatuses = [
        { name: "Outfits", status: "Selected", type: "success"},
        { name: "Venue", status: "Booked", type: "success"},
        { name: "Events", status: "Planning", type: "warning"},
        { name: "Hotel", status: "Pending", type: "danger"},
    ];
    // ------------------------

    const listContainer = document.getElementById('serviceStatusList');
    listContainer.innerHTML = ''; // Clear loading text

    serviceStatuses.forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = 'd-flex align-items-center mb-2';
        
        // Define the color and icon based on the status type
        const statusColorClass = `text-${item.type}`;
        
        listItem.innerHTML = `
            <i class="bi ${item.icon} ${statusColorClass} me-2" style="font-size: 1.1rem;"></i>
            <span class="fw-medium text-dark me-auto small">${item.name}:</span>
            <span class="badge bg-${item.type} bg-opacity-75">${item.status}</span>
        `;
        listContainer.appendChild(listItem);
    });
};

// 2. Budget Snapshot (Feature 2)
const updateBudgetSnapshot = () => {
    // Replace with your real data logic
    const totalBudget = 800000;
    const amountSpent = 450000;
    const remaining = totalBudget - amountSpent;

    document.getElementById('budgetTotal').textContent = formatCurrency(totalBudget);
    document.getElementById('budgetSpent').textContent = formatCurrency(amountSpent);

    const remainingElement = document.getElementById('budgetRemaining');
    remainingElement.textContent = formatCurrency(remaining);
    
    // Color coding for remaining budget
    remainingElement.classList.remove('text-primary', 'text-warning', 'text-danger');
    if (remaining < (totalBudget * 0.15)) { // Less than 15% remaining
        remainingElement.classList.add('text-danger'); // Red for critical
    } else if (remaining < (totalBudget * 0.40)) { // Less than 40% remaining
        remainingElement.classList.add('text-warning'); // Yellow for caution
    } else {
        remainingElement.classList.add('text-primary'); // Primary color for healthy
    }
};

// 3. Alerts & Action Items (Feature 3)
const updateAlerts = () => {
    // Replace this array with your real alerts data fetched from an API
    const alertsData = [
        { type: 'danger', message: 'Photographer payment is due in 7 days.' },
        { type: 'warning', message: 'Venue contract review is pending.' },
        { type: 'success', message: 'Guest list RSVPs are now complete.' },
        { type: 'warning', message: 'Seating chart needs final approval.' }
    ];

    const listContainer = document.getElementById('alertsList');
    listContainer.innerHTML = ''; // Clear existing content

    if (alertsData.length === 0) {
        listContainer.innerHTML = `<li class="list-group-item d-flex align-items-center text-success small py-3">
                                        <i class="bi bi-check-circle-fill me-3 fs-5"></i> All clear! No urgent action items.
                                </li>`;
    } else {
        alertsData.forEach(alert => {
            const icon = alert.type === 'danger' ? 'bi-exclamation-octagon-fill' : 
                        alert.type === 'warning' ? 'bi-exclamation-triangle-fill' : 
                        'bi-check-circle-fill';

            const listItem = document.createElement('li');
            listItem.className = `list-group-item d-flex align-items-center text-${alert.type} small fw-medium`;
            listItem.innerHTML = `<i class="bi ${icon} me-3 fs-5"></i> <span>${alert.message}</span>`;
            listContainer.appendChild(listItem);
        });
    }
};

// 4. Timeline View Button Action (Feature 4)
const setupTimelineButton = () => {
    document.getElementById('viewTimelineBtn').addEventListener('click', () => {
        // Placeholder functionality: Replace this alert with a modal or page redirect
        alert("This button will open the full Event Timeline viewer! (Functionality is a placeholder.)");
    });
};

// 5. Setup Logout (Optional JS action, redirect is in HTML href)
const setupLogout = () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // In a real application, you would clear cookies/session here.
            console.log("User session cleared and redirected to homepage.");
            // The href="../index.html" handles the redirect.
        });
    }
};

// 6. Setup Full Budget Button (Redirect to new Budget page)    
const setupFullBudgetButton = () => {
    const budgetBtn = document.getElementById('viewFullBudgetBtn');
    if (budgetBtn) {
        budgetBtn.addEventListener('click', () => {
            // Redirect to the new dedicated budget page relative to wedspage.html
            window.location.href = 'budget/budget.html';
        });
    }
};

// WEDDING COUNTDOWN TIMER LOGIC ---
// **CHANGE THIS DATE TO YOUR ACTUAL WEDDING DATE**
const weddingDate = new Date("Dec 31, 2025 15:37:25").getTime();

const countdownElements = {
    days: document.getElementById('countdown-days'),
    hours: document.getElementById('countdown-hours'),
    minutes: document.getElementById('countdown-minutes'),
    seconds: document.getElementById('countdown-seconds'),
};

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now; // Time difference in milliseconds

    // Time calculations for days, hours, minutes and seconds
    const _days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const _hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const _minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const _seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Get the main countdown div
    const countdownDiv = document.getElementById('countdown');

    // Display the result
    if (distance > 0 && countdownElements.days) {
        // Use String.padStart for two-digit formatting
        countdownElements.days.textContent = String(_days).padStart(2, '0');
        countdownElements.hours.textContent = String(_hours).padStart(2, '0');
        countdownElements.minutes.textContent = String(_minutes).padStart(2, '0');
        countdownElements.seconds.textContent = String(_seconds).padStart(2, '0');
    } else if (countdownDiv) {
        // If the countdown is finished
        countdownDiv.innerHTML = `<h3 class="text-danger fw-bold">The Wedding Has Begun! 🎉</h3>`;
        clearInterval(countdownInterval);
    }
}

// Run updateCountdown every 1 second
updateCountdown(); // Initial call to prevent delay
const countdownInterval = setInterval(updateCountdown, 1000);    
    // --- INITIALIZE ALL DASHBOARD FEATURES ON LOAD ---
    updateProgressRing();
    updateServiceStatus();
    updateAlerts();
    updateBudgetSnapshot();
    setupTimelineButton();
    setupLogout();
    setupFullBudgetButton();
});