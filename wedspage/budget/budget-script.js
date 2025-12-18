// Budget/budget-script.js

// --- DUMMY DATA FOR FULL BUDGET ANALYSIS ---
const budgetData = [
    { 
        service: "Outfit Selected", 
        category: "Outfit", 
        baseCost: 85000, 
        qualityStars: 4.5, 
        gstRate: 0.05 
    },
    { 
        service: "Venue on Rental", 
        category: "Venue", 
        baseCost: 450000, 
        qualityStars: 5.0, 
        gstRate: 0.18 
    },
    { 
        service: "Wedding Events", 
        category: "Event", 
        baseCost: 320000, 
        qualityStars: 4.0, 
        gstRate: 0.05 
    },
    { 
        service: "Hotel Block Booking", 
        category: "Hotel", 
        baseCost: 150000, 
        qualityStars: 3.5, 
        gstRate: 0.18 
    }
];

// Single total discount for the project
const totalProjectDiscount = {
    amount: 35000, 
    type: 'Card/Cheque Aggregated', 
    details: '₹20,000 Cheque discount, ₹15,000 Credit Card cashback'
};

// Currency formatter
const formatCurrency = (amount) => {
    return `₹${new Intl.NumberFormat('en-IN').format(Math.round(amount))}`;
};

// Helper function to render star icons based on rating
const renderStars = (rating) => {
    let starsHtml = '<span class="quality-stars">';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="bi bi-star-fill text-warning"></i>';
    }
    if (hasHalfStar) {
        starsHtml += '<i class="bi bi-star-half text-warning"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="bi bi-star text-warning opacity-50"></i>';
    }
    
    starsHtml += `<span class="ms-2 small text-dark fw-bold">${rating.toFixed(1)}</span>`;
    starsHtml += '</span>';
    return starsHtml;
};

// Main function to generate and display the budget
const renderFullBudget = () => {
    const contentContainer = document.getElementById('budgetAnalysisContent');
    const grandTotalElement = document.getElementById('budgetGrandTotal');
    
    if (!contentContainer || !grandTotalElement) return;

    let totalPreDiscountCost = 0;
    let totalGST = 0;
    let html = '';

    // Start Table Structure
    html += `
        <div class="table-responsive p-4">
            <table class="table table-hover align-middle table-striped budget-table">
                <thead class="table-dark">
                    <tr>
                        <th>Service</th>
                        <th class="text-center">Category</th>
                        <th class="text-end">Base Cost</th>
                        <th class="text-end">Tax (GST)</th>
                        <th class="text-center">Quality Stars</th>
                        <th class="text-end">Total Cost</th>
                    </tr>
                </thead>
                <tbody>
    `;

    budgetData.forEach(item => {
        const gstAmount = item.baseCost * item.gstRate;
        const itemGrandTotal = item.baseCost + gstAmount;
        totalPreDiscountCost += item.baseCost;
        totalGST += gstAmount;
        
        html += `
            <tr>
                <td>${item.service}</td>
                <td class="text-center small">${item.category}</td>
                <td class="text-end">${formatCurrency(item.baseCost)}</td>
                <td class="text-end text-muted small">
                    + ${formatCurrency(gstAmount)} 
                    <span class="badge bg-light text-dark ms-1">${item.gstRate * 100}%</span>
                </td>
                <td class="text-center">${renderStars(item.qualityStars)}</td>
                <td class="text-end fw-bolder text-dark">${formatCurrency(itemGrandTotal)}</td>
            </tr>
        `;
    });

    // Calculate final grand total after applying project discount
    const finalGrandTotal = totalPreDiscountCost + totalGST - totalProjectDiscount.amount;

// Summary Rows for Discount and Final Total
html += `
                </tbody>
            </table>
        </div>

        <div class="p-4 bg-light border-top">
            <div class="mb-2 d-flex justify-content-start align-items-baseline text-danger">
                <span class="fw-bold me-4 budget-value-col">Base Cost :</span>
                <span class="fw-bolder budget-value">${formatCurrency(totalPreDiscountCost)}</span>
                
            </div>
            <div class="mb-2 d-flex justify-content-start align-items-baseline text-success">
                <span class="fw-bold me-4 budget-value-col">Discount :</span>
                <span class="fw-bolder budget-value">-${formatCurrency(totalProjectDiscount.amount)}</span>
            </div>
            <div class="mb-2 d-flex justify-content-start align-items-baseline text-primary">
                <span class="fw-bold me-4 budget-value-col">GST :</span>
                <span class="fw-bolder budget-value">${formatCurrency(totalGST)}</span>
            </div>
        </div>
    `;

    contentContainer.innerHTML = html;
    grandTotalElement.textContent = formatCurrency(finalGrandTotal);
};  