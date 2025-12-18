// login/forgot-password/forgot-password-script.js

document.addEventListener('DOMContentLoaded', () => {
    const modalElement = document.getElementById('forgotPasswordModal');
    const modalDialog = document.getElementById('forgotPasswordModalDialog');
    
    // --- Validation Functions (Reused Logic from Signup) ---

    const validateMobile = (input, errorElementId) => {
        const value = input.value;
        const errorElement = document.getElementById(errorElementId);
        const mobilePattern = /^\d{10}$/; 

        // If neither mobile nor email is filled, it's considered valid *at this moment* // to allow validation of the *other* field, but the OTP click will enforce one being present.
        if (!value.length && !document.getElementById('fpEmailId').value.length) {
            input.classList.remove('is-invalid');
            return true; 
        }
        
        if (value.includes(' ') || (value.length > 0 && !mobilePattern.test(value))) {
            input.classList.add('is-invalid');
            errorElement.textContent = "Must be exactly 10 digits and contain no spaces or letters.";
            return false;
        } else {
            input.classList.remove('is-invalid');
            return true;
        }
    };

    const validateEmail = (input, errorElementId) => {
        const value = input.value;
        const errorElement = document.getElementById(errorElementId);
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

        if (!value.length && !document.getElementById('fpMobileNumber').value.length) {
            input.classList.remove('is-invalid');
            return true; 
        }
        
        if (value.includes(' ') || (value.length > 0 && !emailPattern.test(value))) {
            input.classList.add('is-invalid');
            errorElement.textContent = "Please enter a valid email address with no spaces.";
            return false;
        } else {
            input.classList.remove('is-invalid');
            return true;
        }
    };

    // login/forgot-password/forgot-password-script.js
    const validateCode = (input) => {
        const value = input.value;
        const errorElement = document.getElementById('errorFpCode');
        const codePattern = /^[a-zA-Z0-9]{6}$/; 

        if (!value) {
             input.classList.add('is-invalid');
             errorElement.textContent = "FPWD Code is required.";
             return false;
        } else if (!codePattern.test(value)) {
            input.classList.add('is-invalid');
            errorElement.textContent = "Code must be exactly 6 characters (alphabets and numbers only, no spaces)."; 
            return false;
        } else {
            input.classList.remove('is-invalid');
            return true;
        }
    };

    // Password Validation (Same as Signup logic)
    const validatePassword = (input, errorElementId) => {
        const value = input.value;
        const errorElement = document.getElementById(errorElementId);
        let isValid = true;
        let errorMessage = '';

        if (value.includes(' ')) {
            errorMessage = "Password cannot contain spaces.";
            isValid = false;
        } else if (value.length < 8 || value.length > 12) {
            errorMessage += "Must be 8 to 12 characters. ";
            isValid = false;
        } else {
            if (!/[A-Z]/.test(value)) {
                errorMessage += "Must contain 1 uppercase letter. ";
                isValid = false;
            }
            if (!/[0-9]/.test(value)) {
                errorMessage += "Must contain 1 number. ";
                isValid = false;
            }
            if (!/[^a-zA-Z0-9]/.test(value)) { 
                errorMessage += "Must contain 1 special character. ";
                isValid = false;
            }
        }

        if (!isValid) {
            input.classList.add('is-invalid');
            errorElement.textContent = errorMessage.trim();
        } else {
            input.classList.remove('is-invalid');
        }
        return isValid;
    };
    
    // Confirm Password Validation
    const validateConfirmPassword = (input, newPasswordInput) => {
        const value = input.value;
        const errorElement = document.getElementById('errorConfirmNewPassword');
        
        if (!value) {
            input.classList.add('is-invalid');
            errorElement.textContent = "Confirmation password is required.";
            return false;
        } else if (value !== newPasswordInput.value) {
            input.classList.add('is-invalid');
            errorElement.textContent = "Passwords do not match.";
            return false;
        } else {
            input.classList.remove('is-invalid');
            return true;
        }
    };


    // --- Generic Content Loader ---

    const loadContent = async (url, callback) => {
        // Clear existing content immediately for transition effect
        modalDialog.innerHTML = ''; 
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load content from ${url}`);
            }
            const htmlContent = await response.text();
            modalDialog.innerHTML = htmlContent;
            
            // Re-attach handlers after content is inserted
            setTimeout(callback, 0); 
            
        } catch (error) {
            console.error("Error loading modal content:", error);
            modalDialog.innerHTML = '<div class="alert alert-danger">Could not load form. Please try again.</div>';
        }
    };


    // --- Step 1 Handlers (Request OTP & Code Validation) ---
    
    const attachStepOneHandlers = () => {
        const form = document.getElementById('forgotPasswordFormStep1');
        const mobileInput = document.getElementById('fpMobileNumber');
        const emailInput = document.getElementById('fpEmailId');
        const getOtpButton = document.getElementById('getOtpButton');
        const codeFields = document.getElementById('fpCodeFields');
        const codeInput = document.getElementById('fpwdCode');

        // Real-time validation
        mobileInput.addEventListener('blur', () => validateMobile(mobileInput, 'errorFpMobileNumber'));
        emailInput.addEventListener('blur', () => validateEmail(emailInput, 'errorFpEmailId'));
        codeInput.addEventListener('blur', () => validateCode(codeInput));

        // Get OTP button click
        getOtpButton.addEventListener('click', () => {
            const isMobileValid = validateMobile(mobileInput, 'errorFpMobileNumber');
            const isEmailValid = validateEmail(emailInput, 'errorFpEmailId');
            
            // Enforce filling at least one field
            const isOneFilled = mobileInput.value.length > 0 || emailInput.value.length > 0;
            
            if (!isOneFilled) {
                alert('Please enter either your Mobile Number or Email ID.');
                mobileInput.classList.add('is-invalid');
                document.getElementById('errorFpMobileNumber').textContent = "Required.";
                return;
            } 
            if ((mobileInput.value.length > 0 && !isMobileValid) || (emailInput.value.length > 0 && !isEmailValid)) {
                return; // Stop if inputs are invalid
            }

            if (isMobileValid && isEmailValid) {
                // SIMULATION: Assume successful OTP request
                alert('FPWD Code sent successfully! Check your Mobile and Email.');
                codeFields.style.display = 'block';
                getOtpButton.textContent = 'Resend Code';
            }
        });

        // Form Submit (Step 1 - Validate Code and Move to Step 2)
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            if (codeFields.style.display !== 'block') {
                alert('Please click "Get Code" first.');
                return;
            }
            
            if (validateCode(codeInput)) {
                // SIMULATION: Assume code is correct, load Step 2
                loadContent('login/forgot-password/reset-password.html', attachStepTwoHandlers);
            }
        });
    };


    // --- Step 2 Handlers (Reset Password) ---

    const attachStepTwoHandlers = () => {
        const form = document.getElementById('forgotPasswordFormStep2');
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmNewPassword');

        // Real-time validation
        newPasswordInput.addEventListener('blur', () => validatePassword(newPasswordInput, 'errorNewPassword'));
        confirmPasswordInput.addEventListener('blur', () => validateConfirmPassword(confirmPasswordInput, newPasswordInput));

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const isNewPasswordValid = validatePassword(newPasswordInput, 'errorNewPassword');
            const isConfirmPasswordValid = validateConfirmPassword(confirmPasswordInput, newPasswordInput);
            
            if (isNewPasswordValid && isConfirmPasswordValid) {
                // SIMULATION: Successful password update
                alert('Password successfully reset! You can now log in with your new password.');
                
                // Close the modal
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance.hide();
            } else {
                alert('Please correct the password errors before saving.');
            }
        });
    };

    // --- Main Event Listener: Trigger Step 1 Load ---
    
    if (modalElement) {
        modalElement.addEventListener('show.bs.modal', () => {
            // Always load Step 1 when the modal is opened
            loadContent('login/forgot-password/forgot-password.html', attachStepOneHandlers);
        });
    }
});