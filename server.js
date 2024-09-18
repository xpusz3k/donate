const express = require('express');
const bodyParser = require('body-parser');
const { Client, Config, CheckoutAPI } = require('@adyen/api-library'); // Dodanie SDK Adyen

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Konfiguracja klienta Adyen
const config = new Config();
config.apiKey = 'YOUR_ADYEN_API_KEY';  // Zamień na swój API Key
const client = new Client({ config });
client.setEnvironment('TEST');  // Ustaw środowisko (TEST lub LIVE)
const checkout = new CheckoutAPI(client);

// Endpoint do przetwarzania płatności Paysafecard
app.post('/process-paysafecard', async (req, res) => {
    const { name, message, amount } = req.body;

    // Kwota w formacie akceptowanym przez Adyen (w groszach np. 5000 = 50 PLN)
    const paymentAmount = {
        currency: 'PLN',  // Zmień walutę według potrzeby
        value: Math.round(amount * 100)
    };

    try {
        // Zbudowanie payloadu płatności
        const paymentRequest = {
            amount: paymentAmount,
            reference: 'YOUR_ORDER_REFERENCE',
            paymentMethod: {
                type: 'paysafecard'
            },
            returnUrl: 'https://your-website.com/return-url',  // URL, na który wróci użytkownik po płatności
            merchantAccount: 'YOUR_MERCHANT_ACCOUNT',  // Twój merchantAccount
            shopperReference: name, // ID klienta
            shopperStatement: `Donate: ${message}`,  // Komentarz do płatności
            countryCode: 'PL'  // Kraj płatności
        };

        // Wysyłanie żądania płatności do Adyen
        const paymentResponse = await checkout.payments(paymentRequest);

        if (paymentResponse.action) {
            // Sprawdzenie, czy potrzebna jest akcja (np. przekierowanie użytkownika)
            res.json({ redirectUrl: paymentResponse.action.url });
        } else {
            res.status(400).json({ error: 'Payment initiation failed.' });
        }
    } catch (error) {
        console.error('Adyen API error:', error);
        res.status(500).json({ error: 'An error occurred during the payment process.' });
    }
});

// Inne endpointy PayPal, BLIK itp.
app.post('/process-paypal', (req, res) => {
    const { name, message, amount } = req.query;
    res.redirect('https://www.paypal.com/donate?amount=' + amount);
});

app.post('/process-blik-or-card', (req, res) => {
    const { name, message, amount, method } = req.body;
    res.json({ success: true });
});

// Uruchomienie serwera
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
