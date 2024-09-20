
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

const paymentButton = document.getElementById("payment-button");

paymentButton.addEventListener("click", async () => {
    const inputName = document.getElementById("input-name").value;
    const inputMessage = document.getElementById("input-message").value;
    const paymentValue = document.getElementById("payment-input-value").value;
    if (paymentValue === '') return;

    // Jeśli wybrano PayPal, przekieruj do PayPal
    if (selectedPaymentMethod === 'paypal') {
        // Dodaj odpowiednie parametry do przekierowania do PayPal
        window.location.href = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=YOUR_PAYPAL_EMAIL&item_name=Donation&amount=${paymentValue}&currency_code=PLN`;
        return;
    }

    // Obsługa pozostałych metod płatności
    const requestData = {
        nickname: inputName,
        message: inputMessage,
        value: paymentValue,
        donationType: selectedPaymentMethod
    };

    try {
        const response = await fetch("/save-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });
        
    } catch (error) {
        console.error("Error saving order:", error);
    }

  

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
function processPayment() {
    // Pobierz wartości z formularza
    const amount = document.getElementById('payment-input-value').value;
    const username = document.getElementById('input-name').value;
    
    // Walidacja danych
    if (amount < 1) {
        alert("Kwota musi być większa lub równa 1 zł.");
        return;
    }
    if (username === "") {
        alert("Wpisz swój nick.");
        return;
    }

    // Ustaw wartości w formularzu PayPal
    document.getElementById('paypal-amount').value = amount;
    document.getElementById('paypal-item-name').value = username;

    // Wyświetl formularz i automatycznie go wyślij
    document.getElementById('paypal-form').submit();
}
