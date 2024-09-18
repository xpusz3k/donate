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

paymentButton.addEventListener('click', async () => {
    const inputName = document.querySelector('#input-name').value;
    const inputMessage = document.querySelector('#input-message').value;
    const paymentValue = document.querySelector('#payment-input-value').value;
    const activePaymentBox = document.querySelector('.payment-box.active');

    if (paymentValue == '') {
        alert('Kwota musi być wypełniona.');
        return;
    }

    if (!activePaymentBox) {
        alert('Wybierz metodę płatności.');
        return;
    }

    const paymentType = activePaymentBox.querySelector('span').textContent;

    const requestData = {
        nickname: inputName,
        message: inputMessage,
        value: paymentValue,
        donationType: paymentType
    };

    try {
        let paymentUrl;
        if (paymentType === 'PaySafeCard') {
            const response = await fetch('/process-paysafecard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            paymentUrl = data.redirectUrl;
        } else if (paymentType === 'PayPal') {
            // Zamiast tego kodu dodaj swój kod do obsługi PayPal
            paymentUrl = 'https://www.paypal.com/donate?business=YOUR_PAYPAL_BUSINESS_ID&currency_code=USD&amount=' + paymentValue;
        } else if (paymentType === 'BLIK') {
            // Zamiast tego kodu dodaj swój kod do obsługi BLIK
            paymentUrl = 'https://example.com/blik-payment';
        } else if (paymentType === 'Karta') {
            // Zamiast tego kodu dodaj swój kod do obsługi kart kredytowych
            paymentUrl = 'https://example.com/card-payment';
        }

        if (paymentUrl) {
            window.location.href = paymentUrl;
        } else {
            alert('Błąd podczas przetwarzania płatności.');
        }
    } catch (error) {
        console.error('Błąd:', error);
        alert('Wystąpił problem przy przetwarzaniu płatności.');
    }
});
            
        
