const firstPage = document.querySelector('.page-first');
const secondPage = document.querySelector('.page-second');
const pagination = document.querySelectorAll('#pagination-box');
const paymentButton = document.getElementById('payment-button');
const continueBtn = document.getElementById('continue');
const paymentInputValue = document.querySelector('#payment-input-value');
const paymentBoxes = document.querySelectorAll('.payment-box');

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

continueBtn.addEventListener('click', () => nextPagination());

paymentInputValue.addEventListener('input', () => {
    if (parseInt(paymentInputValue.value) < 1) {
        paymentInputValue.value = '';
    }
});

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

 // PAGINATION
const firstPage = document.querySelector('.page-first');
const secondPage = document.querySelector('.page-second');
const paymentButton = document.getElementById('payment-button');
const paymentInputValue = document.getElementById('payment-input-value');
const paymentBoxes = document.querySelectorAll('.payment-box');
let selectedPaymentMethod = null;

const continueBtn = document.querySelector('#continue');
continueBtn.addEventListener('click', () => {
    if (checkInputs()) {
        firstPage.classList.remove('show');
        secondPage.classList.add('show');
    }
});

function checkInputs() {
    const inputName = document.querySelector('#input-name').value;
    const inputMessage = document.querySelector('#input-message').value;

    if (inputName.trim() === '' || inputMessage.trim() === '') {
        alert('Wszystkie pola muszą być uzupełnione!');
        return false;
    }

    return true;
}

paymentBoxes.forEach((box) => {
    box.addEventListener('click', () => {
        paymentBoxes.forEach((b) => b.classList.remove('active'));
        box.classList.add('active');
        selectedPaymentMethod = box.querySelector('span').textContent;
    });
});

paymentButton.addEventListener('click', () => {
    const inputName = document.querySelector('#input-name').value;
    const inputMessage = document.querySelector('#input-message').value;
    const paymentValue = paymentInputValue.value;

    if (paymentValue < 1) {
        alert('Kwota musi wynosić co najmniej 1,00zł.');
        return;
    }

    if (!selectedPaymentMethod) {
        alert('Wybierz metodę płatności!');
        return;
    }

    processPayment(inputName, inputMessage, paymentValue, selectedPaymentMethod);
});

function processPayment(name, message, amount, method) {
    if (method === 'PayPal') {
        // Przekierowanie na PayPal
        window.location.href = '/process-paypal?amount=' + amount + '&name=' + name + '&message=' + message;
    } else if (method === 'Paysafecard') {
        // Przetwarzanie Paysafecard
        fetch('/process-paysafecard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, message, amount })
        })
        .then(response => response.json())
        .then(data => {
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                alert('Błąd w płatności Paysafecard.');
            }
        });
    } else if (method === 'BLIK' || method === 'Karta') {
        // Przetwarzanie BLIK/karta
        fetch('/process-blik-or-card', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, message, amount, method })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Płatność została zrealizowana.');
            } else {
                alert('Błąd w płatności ' + method);
            }
        });
    }
}

});
            
        
