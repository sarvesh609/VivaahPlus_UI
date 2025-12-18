// login/login-script.js

document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('loginModal');
    const loginModalDialog = document.getElementById('loginModalDialog');
    
    let isContentLoaded = false;

    // 1. Function to Load Content from login.html
    const loadLoginContent = async () => {
        try {
            const response = await fetch('login/login.html');
            if (!response.ok) {
                throw new Error('Failed to load login content.');
            }
            const htmlContent = await response.text();
            
            // Insert the fetched content into the dialog container
            loginModalDialog.innerHTML = htmlContent;
            isContentLoaded = true;
            
            // ATTACH HANDLERS AFTER CONTENT IS LOADED
            attachFormHandler();
            attachCloseHandler(); // NEW: Attach the handler for the close button

        } catch (error) {
            console.error("Error loading login form:", error);
            loginModalDialog.innerHTML = '<div class="alert alert-danger">Could not load login form. Please try again.</div>';
        }
    };
    
    // 2. Function to attach the form submission logic (Existing logic)
    const attachFormHandler = () => {
        const loginForm = document.getElementById('loginForm');
        // We ensure loginModal is accessible if needed, though we will redirect

        if (loginForm) {
            loginForm.addEventListener('submit', function(event) {
                event.preventDefault(); 
                
                // 1. SIMULATION: Assume successful login
                alert('Login successful!');
                
                // 2. NEW: Redirect the user to the new dashboard page
                window.location.href = 'wedspage/wedspage.html'; // <<< THIS IS THE CRITICAL CHANGE
                
                // Note: The modal hide logic is removed as the page navigates away.
            });
        }
    };
    
    // 3. NEW Function to attach the close button logic
    const attachCloseHandler = () => {
        // We look for the button with class 'btn-close' inside the dynamically loaded content
        const closeButton = loginModalDialog.querySelector('.btn-close');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                const modalInstance = bootstrap.Modal.getInstance(loginModal);
                if (modalInstance) {
                    modalInstance.hide(); // Manually call the hide method
                }
            });
        }
    };

    // 4. Event Listener to trigger content loading ONLY when the modal is first opened
    if (loginModal) {
        loginModal.addEventListener('show.bs.modal', () => {
            if (!isContentLoaded) {
                loadLoginContent();
            } else {
                // If already loaded, ensure form and close handlers are active (safe practice)
                attachFormHandler(); 
                attachCloseHandler();
            }
        });
    }
});