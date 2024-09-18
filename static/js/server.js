const axios = require('axios');

// Funkcja do przetworzenia płatności PaySafeCard przez Adyen
async function processPayment(req, res) {
    const API_KEY = 'YOUR_ADYEN_API_KEY'; // Zastąp własnym kluczem API
    const MERCHANT_ACCOUNT = 'YOUR_MERCHANT_ACCOUNT'; // Zastąp własnym kontem handlowym Adyen

    try {
        const response = await axios.post(
            'https://checkout-test.adyen.com/v67/payments', // URL dla środowiska testowego
            {
                amount: {
                    currency: "EUR", // Waluta
                    value: 1000 // Kwota w centach, np. 1000 = 10 EUR
                },
                paymentMethod: {
                    type: "paysafecard"
                },
                reference: "YOUR_PAYMENT_REFERENCE", // Unikalny identyfikator transakcji
                merchantAccount: MERCHANT_ACCOUNT,
                returnUrl: "https://yourwebsite.com/return", // Adres URL, do którego wróci klient po dokonaniu płatności
                shopperLocale: "pl_PL"
            },
            {
                headers: {
                    'x-API-key': API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Przekierowanie klienta na stronę płatności
        const redirectUrl = response.data.action.url;
        res.redirect(redirectUrl);

    } catch (error) {
        console.error('Błąd płatności:', error);
        res.status(500).send('Wystąpił błąd przy przetwarzaniu płatności.');
    }
}
