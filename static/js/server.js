const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

// Endpoint do obsługi płatności PaySafeCard
app.post('/process-paysafecard', async (req, res) => {
    const API_KEY = 'YOUR_ADYEN_API_KEY'; // Zamień na swój klucz API
    const MERCHANT_ACCOUNT = 'YOUR_MERCHANT_ACCOUNT'; // Zamień na swoje konto handlowe
    const { value } = req.body;

    try {
        const response = await axios.post(
            'https://checkout-test.adyen.com/v67/payments', // URL dla środowiska testowego
            {
                amount: {
                    currency: "EUR", // Zamień na odpowiednią walutę
                    value: value * 100 // Kwota w centach
                },
                paymentMethod: {
                    type: "paysafecard"
                },
                reference: "YOUR_PAYMENT_REFERENCE", // Zamień na unikalny identyfikator
                merchantAccount: MERCHANT_ACCOUNT,
                returnUrl: "http://localhost:3000/return", // URL, na który wróci użytkownik po płatności
                shopperLocale: "pl_PL"
            },
            {
                headers: {
                    'x-API-key': API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({ redirectUrl: response.data.action.url });

    } catch (error) {
        console.error('Błąd płatności:', error);
        res.status(500).send('Wystąpił błąd przy przetwarzaniu płatności.');
    }
});

// Endpoint do obsługi powrotu z płatności
app.get('/return', (req, res) => {
    const paymentResult = req.query.resultCode; // Odbieranie wyniku płatności
    if (paymentResult === 'Authorised') {
        res.send('Płatność została pomyślnie autoryzowana!');
    } else {
        res.send('Płatność nie powiodła się.');
    }
});

app.listen(port, () => {
    console.log(`Serwer działa na http://localhost:${port}`);
});
