
// Funkcje związane z paginacją i obsługą błędów
const firstPage = document.querySelector('.page-first');
const secondPage = document.querySelector('.page-second');
const pagination = document.querySelectorAll('#pagination-box');
let selectedPaymentMethod = 'jednorazowo'; // Domyślna metoda

pagination.forEach((button) => {
    button.addEventListener('click', () => setPagination(button));
});

function setPagination(page) {
    checkInputs();
    if (errorHandler) return;
    clearPagination();
    if (!page.classList.contains('active')) {
        page.classList.add('active');
    }
    checkPagination();
}

function clearPagination() {
    pagination.forEach(button => {
        button.classList.remove('active');
    });
    firstPage.classList.remove('show');
    secondPage.classList.remove('show');
}

function checkPagination() {
    if (pagination[0].classList.contains('active')) {
        firstPage.classList.add('show');
    } else {
        secondPage.classList.add('show');
    }
}

let errorHandler = false;

function checkInputs() {
    const inputName = document.querySelector('#input-name');
    const inputMessage = document.querySelector('#input-message');

    if (inputName.value.length <= 0 || inputMessage.value.length <= 0) {
        errorHandler = true;
    } else {
        errorHandler = false;
    }
}

function nextPagination() {
    checkInputs();
    if (errorHandler) return;
    clearPagination();
    pagination[0].classList.remove('active');
    pagination[1].classList.add('active');
    checkPagination();
}

const continueBtn = document.querySelector('#continue');
continueBtn.addEventListener('click', () => nextPagination());

const paymentInputValue = document.querySelector('#payment-input-value');
paymentInputValue.addEventListener('input', () => updateInput());

function updateInput() {
    if (parseInt(paymentInputValue.value) >= 1) return;
    paymentInputValue.value = '';
}

const paymentBoxes = document.querySelectorAll('.payment-box');

paymentBoxes.forEach((button) => {
    button.addEventListener('click', () => setMethod(button));
});

function setMethod(method) {
    clearMethods();
    if (!method.classList.contains('active')) {
        method.classList.add('active');
    }
}

function clearMethods() {
    paymentBoxes.forEach(button => {
        button.classList.remove('active');
    });
}



 function selectPaymentMethod(method) {
            selectedPaymentMethod = method;
            clearMethods();
            document.getElementById(`${method}-option`).classList.add('active');
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
                // Update PayPal form data
                document.getElementById('paypal-item-name').value = `Donation from ${inputName}: ${inputMessage}`;
                document.getElementById('paypal-amount').value = paymentValue;

                // Submit PayPal form
                document.getElementById('paypal-form').submit();
            } else {
                // Handle other payment methods (implement as needed)
                alert(`Selected payment method: ${selectedPaymentMethod}`);
            }
        });
    // Obsługa pozostałych metod płatności
    const requestData = {
        nickname: inputName,
        message: inputMessage,
        value: paymentValue,
        donationType: selectedPaymentMethod
    };

   



let slider = 1;

async function loadImages() {
    const sliders = document.querySelector('.banners-slider');
    
    try {
        const response = await fetch("/get-ads");
        const data = await response.json();

        for (const image in data) {
            const box = document.createElement('div');

            box.classList.add('banner');
            box.id = data[image].adID;
            box.innerHTML = `<span>${data[image].text}</span>`;
            box.style.background = `url(${data[image].image})`;
            box.style.backgroundSize = 'cover';
            box.style.backgroundPosition = 'center';

            sliders.appendChild(box);
        }
    } catch (error) {
        console.log(`🔥 An error occured with get Data from database, ${error}`);
    }

    const sliderWidth = sliders.scrollWidth / sliders.children.length;
    setInterval(() => {
        
        sliders.scrollLeft = sliderWidth * slider;
        
        if (slider >= sliders.children.length) {
            slider = 1;
            sliders.scrollLeft = 0;
        } else {
            slider++;
        }
    }, 2500);
}

window.onload = () => {
    loadImages();
    getMaintenanceStatus();
}

const maintenance_box = document.querySelector('.maintenance-break');

async function getMaintenanceStatus() {
    try {
        const response = await fetch("/get-maintenance-status", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (data && !data.toggled) {
            maintenance_box.classList.add("active");
        }
    } catch (error) {
        console.log(`🔥 An error occured with get Data from database, ${error}`);
    }
}

        // Global variable to track selected payment method
       

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
   
       const paymentButton = document.getElementById("payment-button");

paymentButton.addEventListener("click", async () => {
    const inputName = document.getElementById("input-name").value;
    const inputMessage = document.getElementById("input-message").value;
    const paymentValue = parseFloat(document.getElementById("payment-input-value").value);
    const activePaymentBox = document.querySelector(".payment-box.active");

    // Sprawdź, czy kwota jest co najmniej 1
    if (isNaN(paymentValue) || paymentValue < 1) {
        alert("Kwota musi wynosić co najmniej 1,00 zł.");
        return;
    }

    // Sprawdź, czy wybrano metodę płatności
    if (!activePaymentBox) {
        alert("Wybierz metodę płatności.");
        return;
    }

    const paymentMethod = activePaymentBox.querySelector("span").textContent;

    if (paymentMethod === "PayPal") {
        // PayPal
        window.location.href = `https://www.paypal.com/donate?business=TWÓJ_PAYPAL_EMAIL&amount=${paymentValue}&currency_code=PLN&item_name=Darowizna&message=${encodeURIComponent(inputMessage)}`;
    } else if (paymentMethod === "BLIK") {
        // Integracja z Przelewy24 - BLIK
        const paymentData = {
            merchant_id: 'TWOJE_MERCHANT_ID',
            pos_id: 'TWOJE_MERCHANT_ID',
            session_id: 'unikalne_id_transakcji', // np. generowane dynamicznie
            amount: paymentValue * 100, // kwota w groszach
            currency: 'PLN',
            description: 'Darowizna',
            email: 'user@example.com', // email darczyńcy
            client: inputName,
            url_return: 'https://twoja-strona.pl/success', // URL powrotu
            sign: 'wygenerowany_hash', // wygenerowany hash, szczegóły w dokumentacji Przelewy24
            channel: 150, // kod kanału dla BLIK (150 to kod dla BLIK w Przelewy24)
        };

        // Przekierowanie do Przelewy24
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://secure.przelewy24.pl/trnRequest'; // produkcyjny adres bramki płatności

        for (const key in paymentData) {
            if (paymentData.hasOwnProperty(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = paymentData[key];
                form.appendChild(hiddenField);
            }
        }

        document.body.appendChild(form);
        form.submit();

    } else if (paymentMethod === "Przelew / Karta") {
        // Integracja z Przelewy24 - Przelew/Karta
        const paymentData = {
            merchant_id: 'TWOJE_MERCHANT_ID',
            pos_id: 'TWOJE_MERCHANT_ID',
            session_id: 'unikalne_id_transakcji', // np. generowane dynamicznie
            amount: paymentValue * 100, // kwota w groszach
            currency: 'PLN',
            description: 'Darowizna',
            email: 'user@example.com', // email darczyńcy
            client: inputName,
            url_return: 'https://twoja-strona.pl/success', // URL powrotu
            sign: 'wygenerowany_hash', // wygenerowany hash, szczegóły w dokumentacji Przelewy24
        };

        // Przekierowanie do Przelewy24
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://secure.przelewy24.pl/trnRequest'; // produkcyjny adres bramki płatności

        for (const key in paymentData) {
            if (paymentData.hasOwnProperty(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = paymentData[key];
                form.appendChild(hiddenField);
            }
        }

        document.body.appendChild(form);
        form.submit();
    }
});
