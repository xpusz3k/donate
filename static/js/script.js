// /js/script.js

        // Global variable to track selected payment method
        let selectedPaymentMethod = 'paypal'; // Start with PayPal selected

        // Payment method selection handler
        function selectPaymentMethod(method) {
            selectedPaymentMethod = method;
            clearMethods();
            document.getElementById(`${method}-option`).classList.add('active');
            document.getElementById('error-message').style.display = 'none'; // Hide error message when a method is selected
        }

        function clearMethods() {
            const paymentBoxes = document.querySelectorAll('.payment-box');
            paymentBoxes.forEach(button => {
                button.classList.remove('active');
            });
        }

        // Payment button click handler
        document.getElementById('payment-button').addEventListener('click', () => {
            const inputName = document.getElementById('input-name').value;
            const inputMessage = document.getElementById('input-message').value;
            const paymentValue = document.getElementById('payment-input-value').value;

            if (selectedPaymentMethod === 'paypal') {
                if (!inputName || !paymentValue || !inputMessage) {
                    alert('Proszę wypełnić wszystkie pola formularza.');
                    return;
                }

                // Update PayPal form data
                document.getElementById('paypal-item-name').value = `Donation from ${inputName}: ${inputMessage}`;
                document.getElementById('paypal-amount').value = paymentValue;

                // Show and submit PayPal form
                document.getElementById('paypal-form').style.display = 'block';
                document.getElementById('paypal-form').submit();
            } else {
                // Show error message if PayPal is not selected
                document.getElementById('error-message').style.display = 'block';
            }
        });

        // Disable certain payment methods
        function disablePaymentMethods() {
            const disabledMethods = document.querySelectorAll('.payment-box.disabled');
            disabledMethods.forEach(method => {
                method.style.opacity = '0.5'; // Set opacity to indicate disabled state
                method.style.cursor = 'not-allowed'; // Change cursor to indicate disabled
            });
        }

        disablePaymentMethods();
    
