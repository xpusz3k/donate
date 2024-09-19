document.getElementById('continue').addEventListener('click', function() {
    // Przejście do drugiej strony płatności
    document.querySelector('.page-first').classList.remove('show');
    document.querySelector('.page-second').classList.add('show');
});

document.getElementById('payment-button').addEventListener('click', function(event) {
    const inputName = document.getElementById('input-name').value;
    const inputMessage = document.getElementById('input-message').value;
    const paymentValue = document.getElementById('payment-input-value').value;

    // Walidacja: czy użytkownik wprowadził kwotę i inne dane
    if (paymentValue < 1) {
        alert('Minimalna kwota to 1 zł');
        event.preventDefault(); // Zapobiega wysłaniu formularza
        return;
    }

    // Ustaw kwotę w formularzu PayPal
    document.getElementById('paypal-amount').value = paymentValue;

    // Automatycznie wypełniamy pola nazwy i wiadomości w formularzu PayPal
    // np. jako przedmiot lub notatkę w PayPal, jeśli to konieczne.
});
