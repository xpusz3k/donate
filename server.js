const express = require('express');
const bodyParser = require('body-parser');
const { Client, Config, CheckoutAPI } = require('@adyen/api-library');

// Inicjalizacja aplikacji Express
const app = express();
app.use(bodyParser.json());

// Inicjalizacja Adyen Client
const config = new Config();
config.apiKey = 'your-adyen-api-key';  // Wstaw swój Adyen API Key
const client = new Client({ config });
client.setEnvironment('TEST'); // Używaj 'LIVE' w produkcji

const checkout = new CheckoutAPI(client);

// Endpoint do przetwarzania płatności kartą
app.post('/process-card-payment', async (req, res) => {
    const { amount, currency, reference, paymentMethod, shopperEmail } = req.body;

    try {
        // Tworzenie zapytania płatności
        const paymentRequest = {
            amount: {
                value: amount,  // Wartość w najniższej walucie (np. dla 10 PLN -> 1000 groszy)
                currency: currency,  // np. 'PLN'
            },
            reference: reference,  // Unikalne odniesienie do zamówienia
            paymentMethod: paymentMethod,  // Zawiera dane karty płatniczej z frontendu
            merchantAccount: 'your-merchant-account',  // Twoje konto Adyen
            returnUrl: 'https://twoja-strona.pl/return-url',  // Strona, na którą wróci użytkownik po zakończeniu płatności
            shopperEmail: shopperEmail,  // Opcjonalnie: email klienta
            shopperIP: req.ip,  // IP klienta
            channel: 'Web',  // Dla płatności online
            additionalData: {
                allow3DS2: true,  // Obsługa 3D Secure
            }
        };

        // Wysyłanie żądania do Adyen API
        const response = await checkout.payments(paymentRequest);

        // Obsługa odpowiedzi Adyen (np. jeśli wymagane są dodatkowe działania, jak 3D Secure)
        res.json(response);
    } catch (error) {
        console.error('Błąd przy przetwarzaniu płatności:', error.message);
        res.status(500).json({ error: 'Nie udało się przetworzyć płatności.' });
    }
});

// Endpoint powrotu po zakończeniu płatności
app.get('/return-url', (req, res) => {
    res.send('Płatność zakończona. Dziękujemy!');
});

// Uruchamianie serwera
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});
