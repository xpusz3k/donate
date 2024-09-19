document.getElementById('payment-button').addEventListener('click', async function() {
    const inputName = document.getElementById('input-name').value;
    const inputMessage = document.getElementById('input-message').value;
    const paymentValue = document.getElementById('payment-input-value').value;

    // Walidacja podstawowa
    if (paymentValue < 1) {
        alert('Minimalna kwota płatności to 1,00 zł');
        return;
    }

    const requestData = {
        nickname: inputName,
        message: inputMessage,
        amount: paymentValue,
        paymentMethod: 'paysafecard' // Zawsze wybieramy PSC
    };

    try {
        const response = await fetch('/process_payment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();

        if (response.ok) {
            // Przekierowanie do płatności
            window.location.href = result.redirectUrl;
        } else {
            alert('Błąd podczas przetwarzania płatności: ' + result.error);
        }
    } catch (error) {
        console.error('Wystąpił błąd:', error);
        alert('Nie udało się nawiązać połączenia z serwerem.');
    }
});
