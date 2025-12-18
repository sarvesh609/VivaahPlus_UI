// help/help-script.js - Universal Content Loader

document.addEventListener('DOMContentLoaded', () => {
    const helpModal = document.getElementById('helpModal');
    const helpModalDialog = document.getElementById('helpModalDialog');
    
    let isContentLoaded = false;
    
    // Determine the correct path to help.html dynamically based on the current page's location.
    const currentPath = window.location.pathname.toLowerCase(); // <--- CRITICAL FIX: CONVERT PATH TO LOWERCASE
    let helpContentPath = 'help/help.html'; // Default path (works for index.html)
    
    // Check for the folder name in lowercase
    if (currentPath.includes('/wedspage/')) { // The comparison is now always lowercase
        helpContentPath = '../help/help.html';
    }

    // 1. Function to Load Content from help.html
    const loadHelpContent = async () => {
        try {
            // Use the determined path
            const response = await fetch(helpContentPath);
            // ... (rest of the try/catch block remains the same)
            
            if (!response.ok) {
                // Throw an error if the path or file is wrong
                // This error message will now show the correct path it tried to fetch
                throw new Error(`Failed to load help content. Status: ${response.status}. Path attempted: ${helpContentPath}`);
            }
            const htmlContent = await response.text();
            
            // Insert the fetched content into the dialog container
            helpModalDialog.innerHTML = htmlContent;
            isContentLoaded = true;
            
        } catch (error) {
            console.error("Error loading help section:", error);
            helpModalDialog.innerHTML = '<div class="alert alert-danger p-4">Could not load Help/FAQ content. Please check the file path.</div>';
        }
    };
    
    // 2. Event Listener to trigger content loading ONLY when the modal is first opened
    if (helpModal) {
        helpModal.addEventListener('show.bs.modal', () => {
            if (!isContentLoaded) {
                loadHelpContent();
            }
        });
    }
}); 