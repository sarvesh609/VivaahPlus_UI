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
        default: {
            title: "Service Details",
            content: `<div class="p-5 text-center text-muted">Details for this service are coming soon!</div>`
        }
    };
    
    
// --- MAIN FUNCTION TO OPEN SERVICE MODAL ---
const openServiceModal = (serviceId) => {
    // 1. Check if the card should redirect to a new page
    if (serviceId === 'outfitCard') {
        window.location.href = 'outfits/outfit.html';
        return; // Exit function so modal doesn't open
    }
    
    // 2. Default Modal Logic for other cards
    const serviceTemplate = templates[serviceId] || templates.default;
    serviceModalTitle.textContent = serviceTemplate.title;
    serviceModalBody.innerHTML = serviceTemplate.content;
    serviceModal.show();
};

// --- EVENT LISTENERS FOR CARDS (Flip ability maintained) ---
cards.forEach(card => {
    card.addEventListener("click", function (e) {

        // Handle GO button click
        if (e.target.closest(".go-button")) {
            e.stopPropagation(); 
            const cardId = this.id; // This gets 'outfitCard', 'venueCard', etc.
            openServiceModal(cardId);
            return; 
        }

        // Handle Flip (This part remains untouched)
        const isCurrentlyFlipped = this.classList.contains("flipped");
        if (isCurrentlyFlipped) {
            this.classList.remove("flipped");
        } else {
            unflipAllCards(this); 
            this.classList.add("flipped");
        }
    });
});

    const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
};

    // 1. Dynamic Progress Ring Logic
    const updateProgressRing = () => {
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



// 2. Budget Snapshot (Feature 2)
const updateBudgetSnapshot = () => {
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
        alert("This button will open the full Event Timeline viewer! (Functionality is a placeholder.)");
    });
};

// 5. Setup Logout (Optional JS action, redirect is in HTML href)
const setupLogout = () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
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
const weddingDate = new Date("Jan 31, 2026 15:37:25").getTime();

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

// wedspage-script.js
const updateDashboardProgress = async () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user || !user.id) return;

    try {
        const response = await fetch(`https://vivaahplus-backend.onrender.com/api/wedspage/user-progress/${user.id}`);
        const data = await response.json();

        // 1. Update SVG Ring & Percentage Text
        const percentageText = document.getElementById('progressPercentage');
        const tasksCounter = document.getElementById('tasksCompleted');
        const ringBar = document.getElementById('progressRingBar');

        if (percentageText) percentageText.textContent = `${data.percentage}%`;
        if (tasksCounter) tasksCounter.textContent = `${data.completedCount} / ${data.totalServices}`;
        
        if (ringBar) {
            const radius = ringBar.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (data.percentage / 100) * circumference;
            ringBar.style.strokeDashoffset = offset;
        }

        // 2. Logic for Badges (Matches your Old Image)
        const updateStatusRow = (idPrefix, status) => {
            const label = document.getElementById(`${idPrefix}StatusLabel`);
            const dot = document.getElementById(`${idPrefix}Dot`);
            
            if (label && dot) {
                if (status === 'completed') {
                    label.innerText = 'Completed';
                    label.className = 'status-badge bg-success text-white px-2 py-1 rounded-pill fw-bold';
                    dot.style.color = 'green';
                } else {
                    label.innerText = 'Pending';
                    label.className = 'status-badge bg-danger text-white px-2 py-1 rounded-pill fw-bold';
                    dot.style.color = 'red';
                }
            }
        };

        // Call for each service
        updateStatusRow('outfit', data.services.outfits);
        updateStatusRow('venue', data.services.venue);
        updateStatusRow('event', data.services.event);
        updateStatusRow('hotel', data.services.hotel);

    } catch (err) {
        console.error("Sync error:", err);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    updateDashboardProgress();
});

updateDashboardProgress();

// Run updateCountdown every 1 second
updateCountdown(); // Initial call to prevent delay
const countdownInterval = setInterval(updateCountdown, 1000);    

// --- INITIALIZE ALL DASHBOARD FEATURES ON LOAD ---
    updateProgressRing();
    updateAlerts();
    updateBudgetSnapshot();
    setupTimelineButton();
    setupLogout();
    setupFullBudgetButton();
    updateDashboardProgress();
});