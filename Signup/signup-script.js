document.addEventListener('DOMContentLoaded', () => {
    const signupModal = document.getElementById('signupModal');
    const signupModalDialog = document.getElementById('signupModalDialog');
    
    let isContentLoaded = false;

    // --- Validation Functions ---

    // 1. Name Validation (Alphabets only)
    const validateName = (input, errorElementId) => {
        const value = input.value.trim();
        const errorElement = document.getElementById(errorElementId);
        const namePattern = /^[a-zA-Z]+$/;  

        if (value === "") {
            input.classList.remove('is-invalid');
            return true;
        } else if (!namePattern.test(value)) {
            input.classList.add('is-invalid');
            errorElement.textContent = "Only alphabetic characters are allowed, no spaces."; 
            return false;
        } else {
            input.classList.remove('is-invalid');
            return true;
        }
    };

    // 2. Mobile Validation (10 digits, numbers only)
    const validateMobile = (input) => {
        const value = input.value.trim();
        const errorElement = document.getElementById('errorMobileNumber');
        const mobilePattern = /^\d{10}$/;

        if (value === "") {
            input.classList.remove('is-invalid');
            return true;
        } else if (!mobilePattern.test(value)) {
            input.classList.add('is-invalid');
            errorElement.textContent = "Mobile number must be exactly 10 digits and contain only numbers.";
            return false;
        } else {
            input.classList.remove('is-invalid');
            return true;
        }
    };

    // 3. Email Validation (@ mandatory)
    const validateEmail = (input) => {
        const value = input.value.trim();
        const errorElement = document.getElementById('errorEmailId');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

        if (value === "") {
            input.classList.remove('is-invalid');
            return true;
        } else if (value.includes(' ') || !emailPattern.test(value)) { // ADDED explicit check for space
            input.classList.add('is-invalid');
            errorElement.textContent = "Please enter a valid email address with no spaces."; 
            return false;
        } else {
            input.classList.remove('is-invalid');
            return true;
        }
    };

    // 4. Password Validation (8-12 chars, 1 uppercase, 1 number, 1 special char)
    const validatePassword = (input) => {
        const value = input.value; // Note: We use raw value here before trim, but check for space is better
        const errorElement = document.getElementById('errorSignupPassword');
        let isValid = true;
        let errorMessage = '';

        if (value.includes(' ')) {
            input.classList.add('is-invalid');
            errorElement.textContent = "Password cannot contain spaces.";
            return false;
        }
            
        const trimmedValue = value.trim();

        if (trimmedValue.length < 8 || trimmedValue.length > 12) {
            errorMessage += "Must be 8 to 12 characters. ";
            isValid = false;
        }
        if (!/[A-Z]/.test(trimmedValue)) {
            errorMessage += "Must contain 1 uppercase letter. ";
            isValid = false;
        }
        if (!/[0-9]/.test(trimmedValue)) {
            errorMessage += "Must contain 1 number. ";
            isValid = false;
        }
        // Check for common special characters (non-alphanumeric)
        if (!/[^a-zA-Z0-9]/.test(trimmedValue)) { 
            errorMessage += "Must contain 1 special character. ";
            isValid = false;
        }

        if (!isValid) {
            input.classList.add('is-invalid');
            errorElement.textContent = errorMessage.trim();
        } else {
            input.classList.remove('is-invalid');
        }
        return isValid;
    };
    
    // --- Modal Loading and Handler Attachment ---
    const attachHandlers = () => {
        const form = document.getElementById('signupForm');
        if (!form) return;

        // Get inputs for real-time validation
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const mobileNumberInput = document.getElementById('mobileNumber');
        const emailIdInput = document.getElementById('emailId');
        const passwordInput = document.getElementById('signupPassword');
        const closeButton = signupModalDialog.querySelector('.btn-close');
        
        // Real-time Input Listeners (blur event for efficiency)
        firstNameInput.addEventListener('blur', () => validateName(firstNameInput, 'errorFirstName'));
        lastNameInput.addEventListener('blur', () => validateName(lastNameInput, 'errorLastName'));
        mobileNumberInput.addEventListener('blur', () => validateMobile(mobileNumberInput));
        emailIdInput.addEventListener('blur', () => validateEmail(emailIdInput));
        passwordInput.addEventListener('blur', () => validatePassword(passwordInput));

        // Close Button Handler (For dynamic content)
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                const modalInstance = bootstrap.Modal.getInstance(signupModal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });
        }
        
    // Form Submission Handler
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        
        // 1. Run your existing validations
        const isFirstNameValid = validateName(firstNameInput, 'errorFirstName');
        const isLastNameValid = validateName(lastNameInput, 'errorLastName');
        const isMobileValid = validateMobile(mobileNumberInput);
        const isEmailValid = validateEmail(emailIdInput);
        const isPasswordValid = validatePassword(passwordInput);
        const genderValue = form.elements['gender'].value;

        // 2. If valid, send to Backend
        if (isFirstNameValid && isLastNameValid && isMobileValid && isEmailValid && isPasswordValid && genderValue) {
            
            // Prepare the data object
            const userData = {
                gender: genderValue,
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                mobileNumber: mobileNumberInput.value,
                emailId: emailIdInput.value,
                password: passwordInput.value
            };

            try {
                // REPLACE with your actual Render URL
                const response = await fetch('https://vivaahplus-backend.onrender.com/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Registration successful! Redirecting to login...');
                    form.reset(); 
                    const inputs = form.querySelectorAll('.form-control');
                    inputs.forEach(input => input.classList.remove('is-invalid'));
                    const modalInstance = bootstrap.Modal.getInstance(signupModal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                } else {
                    alert(result.message); // Shows "Email already registered" from backendx
                }
            } catch (error) {
                console.error("Signup Error:", error);
                alert("Could not connect to the server.");
            }
        } else {
            alert('Please correct the highlighted errors before submitting.');
        }
    });
    };
    
    // Function to Load Content from signup.html
    const loadSignupContent = async () => {
        try {
            const response = await fetch('signup/signup.html');
            if (!response.ok) {
                throw new Error('Failed to load signup content.');
            }
            const htmlContent = await response.text();
            
            // Insert the fetched content
            signupModalDialog.innerHTML = htmlContent;
            isContentLoaded = true;
            
            // Attach all event listeners after content is loaded
            attachHandlers();

        } catch (error) {
            console.error("Error loading signup form:", error);
            signupModalDialog.innerHTML = '<div class="alert alert-danger">Could not load signup form. Please try again.</div>';
        }
    };
    
    // Event Listener to trigger content loading when modal is opened
    if (signupModal) {
        signupModal.addEventListener('show.bs.modal', () => {
            if (!isContentLoaded) {
                loadSignupContent();
            } else {
                attachHandlers(); // Ensure handlers are re-attached if content was cleared/re-used
            }
        });
    }
    
    // --- Login to Signup Transition Handler ---
    const loginModal = document.getElementById('loginModal');
    const signupTriggerFromLogin = document.getElementById('signupTriggerFromLogin');
    
    if (loginModal && signupTriggerFromLogin) {
        signupTriggerFromLogin.addEventListener('click', (event) => {
            event.preventDefault();
            const loginModalInstance = bootstrap.Modal.getInstance(loginModal);
            if (loginModalInstance) {
                loginModalInstance.hide();
            }
        });
    }
});