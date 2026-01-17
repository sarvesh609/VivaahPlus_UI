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

        if (loginForm) {
            loginForm.addEventListener('submit', async function(event) {
                event.preventDefault(); 
                
                // 1. Grab inputs from your login.html
                const emailId = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;

                try {
                    // 2. Send request to Render
                    const response = await fetch('https://vivaahplus-backend.onrender.com/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ emailId, password })
                    });

                    const result = await response.json();

                    if (response.ok) {
                        alert(`Welcome back, ${result.user.firstName}!`);
                        
                        // Save the ID properly in localStorage
                        localStorage.setItem('loggedInUser', JSON.stringify({
                            id: result.user.id, // This matches the new server response
                            firstName: result.user.firstName,
                            lastName: result.user.lastName, // ADD THIS LINE
                            email: result.user.email
                        }));
                        window.location.href = 'wedspage/wedspage.html'; 
                    } else {
                        alert(result.message);  // Show error from backend (e.g., "Invalid password")
                    }
                } catch (error) {
                    console.error("Login Error:", error);
                    alert("Could not connect to the server.");
                }
            });
        }
    };
    
    // 3. NEW Function to attach the close button logic
    const attachCloseHandler = () => {
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
                attachFormHandler(); 
                attachCloseHandler();
            }
        });
    }
});