const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

// Konfiguracja body parser do obsługi danych w formacie JSON
app.use(bodyParser.json());
app.use(express.static('public')); // Służy do obsługi zasobów statycznych

// Trasa dla głównej strony (można zastąpić generowaniem dynamicznym lub używać statycznych plików HTML)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Trasa do przetwarzania płatności Paysafecard
app.post('/process-paysafecard', async (req, res) => {
  const { value, nickname, message } = req.body;

  // Zastąp to odpowiednią logiką dla Adyen/Paysafecard
  const paymentData = {
    merchantAccount: 'YourMerchantAccount',
    amount: {
      currency: 'EUR',
      value: Math.round(value * 100) // Kwota w centach
    },
    paymentMethod: {
      type: 'paysafecard'
    },
    reference: 'YOUR_REFERENCE',
    shopperReference: nickname,
    shopperStatement: message,
    returnUrl: 'https://your-domain.com/payment-success'
  };

  try {
    const response = await axios.post('https://checkout-test.adyen.com/v67/payments', paymentData, {
      headers: {
        'x-API-key': 'YourAPIKey',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.action && response.data.action.url) {
      res.json({ redirectUrl: response.data.action.url });
    } else {
      res.status(400).json({ error: 'Nie można wygenerować URL płatności.' });
    }
  } catch (error) {
    console.error('Błąd przetwarzania płatności:', error.message);
    res.status(500).json({ error: 'Wystąpił problem z płatnością.' });
  }
});

// Serwer startuje na porcie 3000
app.listen(3000, () => {
  console.log('Serwer działa na http://localhost:3000');
});
