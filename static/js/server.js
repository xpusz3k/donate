const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.json());

// Endpoint do obsługi płatności
app.post('/payment', async (req, res) => {
    const API_KEY = 'YOUR_ADYEN_API_KEY';
    const MERCHANT_ACCOUNT = 'YOUR_MERCHANT_ACCOUNT';
    const { amount } = req.body;

    try {
        const response = await axios.post(
            'https://checkout-test.adyen.com/v67/payments', // URL środowiska testowego Adyen
            {
                amount: {
                    currency: "EUR",
                    value: amount * 100  // Kwota w centach, np. 1000 = 10 EUR
                },
                paymentMethod: {
                    type: "paysafecard"
                },
                reference: "YOUR_PAYMENT_REFERENCE",
                merchantAccount: MERCHANT_ACCOUNT,
                returnUrl: "https://yourwebsite.com/return",
                shopperLocale: "pl_PL"
            },
            {
                headers: {
                    'x-API-key': API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Zwracamy URL do przekierowania na stronę płatności
        res.json({ redirectUrl: response.data.action.url });

    } catch (error) {
        console.error('Błąd płatności:', error);
        res.status(500).send('Wystąpił błąd przy przetwarzaniu płatności.');
    }
});

app.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
});
