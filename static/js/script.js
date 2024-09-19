// /js/script.js

document.getElementById('continue').addEventListener('click', function() {
    document.querySelector('.page-first').classList.remove('show');
    document.querySelector('.page-second').classList.add('show');
});

document.querySelectorAll('.payment-box').forEach(box => {
    box.addEventListener('click', function() {
        document.querySelectorAll('.payment-box').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});

document.getElementById('payment-button').addEventListener('click', function(event) {
    const amount = parseFloat(document.getElementById('payment-input-value').value);
    const selectedMethod = document.querySelector('.payment-box.active');
    
    if (amount < 1) {
        event.preventDefault();
        alert('Kwota musi być minimalnie 1,00 PLN!');
        return;
    }

    if (!selectedMethod) {
        event.preventDefault();
        alert('Proszę wybrać metodę płatności!');
        return;
    }

    // Ukryj formularz płatności i prześlij dane do PHP
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'payment.php';

    const inputName = document.createElement('input');
    inputName.type = 'hidden';
    inputName.name = 'nickname';
    inputName.value = document.getElementById('input-name').value;
    form.appendChild(inputName);

    const inputMessage = document.createElement('input');
    inputMessage.type = 'hidden';
    inputMessage.name = 'message';
    inputMessage.value = document.getElementById('input-message').value;
    form.appendChild(inputMessage);

    const inputAmount = document.createElement('input');
    inputAmount.type = 'hidden';
    inputAmount.name = 'amount';
    inputAmount.value = amount;
    form.appendChild(inputAmount);

    const inputMethod = document.createElement('input');
    inputMethod.type = 'hidden';
    inputMethod.name = 'payment_method';
    inputMethod.value = selectedMethod.getAttribute('data-method');
    form.appendChild(inputMethod);

    document.body.appendChild(form);
    form.submit();
});

