const API_BASE = 'https://vivaahplus-backend.onrender.com/api';

// 1. HELPER: Update Size Dropdown based on Type (Kept from original)
const updateSizeDropdown = (outfitType) => {
    const sizeSelect = document.getElementById('sizeFilter');
    if (!sizeSelect) return;
    const sizeContainer = sizeSelect.parentElement;

    if (outfitType === 'Saree') {
        sizeContainer.style.display = 'none';
        sizeSelect.value = 'all';
    } else {
        sizeContainer.style.display = 'block';
        sizeSelect.innerHTML = '<option value="all">All Size</option>';
        const sizes = (outfitType === 'Lehenga' || outfitType === 'Gown') 
            ? ['S', 'M', 'L', 'XL', 'XXL'] : ['S', 'M', 'L', 'XL'];

        sizes.forEach(sz => {
            const opt = document.createElement('option');
            opt.value = sz;
            opt.textContent = sz;
            sizeSelect.appendChild(opt);
        });
    }
};

// 2. Fetch Dynamic Filters from DB
async function updateTypeDropdown(category) {
    const typeSelect = document.getElementById('typeFilter');
    try {
        const response = await fetch(`${API_BASE}/outfits/filters?category=${category}`);
        const data = await response.json();
        typeSelect.innerHTML = '<option value="all">All Styles</option>';
        data.types.forEach(type => {
            typeSelect.innerHTML += `<option value="${type}">${type}</option>`;
        });
        updateSizeDropdown(typeSelect.value);
    } catch (error) { console.error("Type fetch failed:", error); }
}

async function updateColorDropdown(category) {
    const colorSelect = document.getElementById('colorFilter');
    try {
        const response = await fetch(`${API_BASE}/outfits/filters?category=${category}`);
        const data = await response.json();
        colorSelect.innerHTML = '<option value="all">All Colors</option>';
        data.colors.forEach(color => {
            colorSelect.innerHTML += `<option value="${color}">${color}</option>`;
        });
    } catch (error) { console.error("Color fetch failed:", error); }
}

// 3. Render Outfits from Search API
async function renderOutfits() {
    const filters = {
        category: document.getElementById('genderFilter').value || 'bride',
        type: document.getElementById('typeFilter').value || 'all',
        color: document.getElementById('colorFilter').value || 'all',
        size: document.getElementById('sizeFilter').value || 'all',
        maxCost: document.getElementById('costRange').value || 200000
    };

    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const query = new URLSearchParams(filters).toString();
    
    try {
        const response = await fetch(`${API_BASE}/outfits/search?${query}`);
        const outfits = await response.json();
        
        let selectedIds = [];
        if (user && user.id) {
            const selRes = await fetch(`${API_BASE}/outfits/user-selections?userId=${user.id}`);
            const selData = await selRes.json();
            selectedIds = selData.map(item => item.outfitId);
            document.getElementById('selectedCount').innerText = selectedIds.length;
        }

        const gallery = document.getElementById('outfitGallery');
        if (!gallery) return;
        gallery.innerHTML = '';

        outfits.forEach(item => {
            const currentId = item._id; 
            const isSelected = selectedIds.includes(currentId);

            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6 mb-4 animate-fade-in';
            col.innerHTML = `
                <div class="outfit-card ${isSelected ? 'selected' : ''}" onclick="toggleSelection(this, '${currentId}', '${item.name}', ${item.cost})">
                    <div class="selection-indicator">
                        <i class="bi bi-check2"></i>
                    </div>
                    <div class="img-wrapper"><img src="${item.img}" alt="${item.name}"></div>
                    <div class="outfit-info text-center">
                        <span class="outfit-category text-uppercase">${item.type}</span>
                        <h6 class="outfit-name fw-bold">${item.name}</h6>
                        <p class="outfit-price">₹${item.cost.toLocaleString()}</p>
                    </div>
                </div>
            `;
            gallery.appendChild(col);
        });
    } catch (err) { 
        console.error("Search failed:", err); 
    }
}

// 4. Handle Selection Persistence
async function toggleSelection(element, outfitId, outfitName, outfitCost) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user || !user.id) {
        alert("Please log in to save your selections.");
        return;
    }

    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    element.classList.toggle('selected');
    const isAdding = element.classList.contains('selected');

    try {
        const response = await fetch(`${API_BASE}/outfits/select`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                outfitId: outfitId,
                userName: fullName,
                outfitName: outfitName,
                outfitCost: outfitCost,
                action: isAdding ? 'add' : 'remove'
            })
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById('selectedCount').innerText = result.currentCount || 0;
        }
    } catch (error) {
        element.classList.toggle('selected'); // Revert UI if fetch fails
        console.error("Selection sync failed:", error);
    }
}

// 5. Initialization and Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const genderButtons = document.querySelectorAll('#genderFilterGroup .btn');
    const costRange = document.getElementById('costRange');

    genderButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            genderButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const val = this.getAttribute('data-value');
            document.getElementById('genderFilter').value = val;
            updateTypeDropdown(val);
            updateColorDropdown(val);
            renderOutfits(); 
        });
    });

    document.getElementById('typeFilter')?.addEventListener('change', (e) => updateSizeDropdown(e.target.value));
    document.getElementById('applyFiltersBtn')?.addEventListener('click', () => {
        renderOutfits();
        window.scrollTo({ top: 400, behavior: 'smooth' });
    });
    document.getElementById('proceedBtn')?.addEventListener('click', proceedToDashboard);

    costRange?.addEventListener('input', (e) => {
        document.getElementById('costValueDisplay').innerText = `₹${parseInt(e.target.value).toLocaleString()}`;
    });

    document.getElementById('resetSelectionsBtn')?.addEventListener('click', async () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user || !user.id) return alert("Please log in first.");

    if (confirm("This will clear all your chosen outfits. Continue?")) {
        try {
            const response = await fetch(`${API_BASE}/outfits/clear-selections`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });

            if (response.ok) {
                document.getElementById('selectedCount').innerText = '0';
                renderOutfits(); // Refresh gallery to remove borders/ticks
            }
        } catch (error) {
            console.error("Clear selections failed:", error);
        }
    }
});

    // Reset Button Logic
    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // 1. Reset standard dropdowns and hidden inputs
            document.getElementById('genderFilter').value = 'bride';
            document.getElementById('typeFilter').value = 'all';
            document.getElementById('colorFilter').value = 'all';
            document.getElementById('sizeFilter').value = 'all';
            
            // 2. Reset Cost Range and its display text
            const costRange = document.getElementById('costRange');
            costRange.value = 200000;
            document.getElementById('costValueDisplay').innerText = `₹2,00,000`;

            // 3. Reset the Visual Category Buttons (UI)
            const genderButtons = document.querySelectorAll('#genderFilterGroup .btn');
            genderButtons.forEach(b => b.classList.remove('active'));
            // Set 'Bride' as the active button visually
            document.querySelector('[data-value="bride"]')?.classList.add('active');

            // 4. Refresh data from the database for the default view
            updateTypeDropdown('bride');
            updateColorDropdown('bride');
            renderOutfits();
            
            // 5. Scroll back to top of gallery for better UX
            window.scrollTo({ top: 400, behavior: 'smooth' });
        });
    }

// outfit-script.js
const selectedButton = document.getElementById('viewSelectedBtn');

if (selectedButton) {
    selectedButton.addEventListener('click', async () => {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!user || !user.id) return alert("Please log in first.");

        try {
            // We use the new progress endpoint to check if outfits are 'completed'
            const response = await fetch(`${API_BASE}/wedspage/user-progress/${user.id}`);
            const data = await response.json();

            if (data.services.outfits !== 'completed') {
                alert("Select an outfit to proceed further");
            } else {
                window.location.href = '../wedspage.html';
            }
        } catch (err) {
            console.error("Error verifying selections:", err);
        }
    });
}

    // Initial Load
    updateTypeDropdown('bride');
    updateColorDropdown('bride');
    renderOutfits();
});