<?php
// process_payment.php

$shopId = "dajsonek.pl"; // ID punktu płatności
$secretPhrase = "6a8dafe79af388648992ad7e2e534ac9"; // Sekret przypisany do punktu płatności
$mainUrl = "https://pay.cashbill.pl/ws/rest";

// Pobieranie danych z formularza
$nickname = $_POST['nickname'];
$message = $_POST['message'];
$amount = $_POST['amount'];
$paymentMethod = $_POST['payment_method'];

// Inicjalizacja cURL
$ch = curl_init();

switch ($paymentMethod) {
    case 'cashbill':
        // Dane transakcji
        $transactionRequest = array(
            "title" => "Donation from " . $nickname,
            "amount" => array(
                "value" => $amount,
                "currencyCode" => "PLN",
            ),
            "returnUrl" => "https://yourwebsite.com/success.php",
            "description" => $message,
            "additionalData" => "Donation_" . time(),
        );

        // Tworzenie podpisu (signature)
        $transactionRequest['sign'] = sha1(
            $transactionRequest['title'] .
            $transactionRequest['amount']['value'] .
            $transactionRequest['amount']['currencyCode'] .
            $transactionRequest['returnUrl'] .
            $transactionRequest['description'] .
            $transactionRequest['additionalData'] .
            $secretPhrase
        );

        // Ustawienia cURL
        curl_setopt_array($ch, array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_URL => "{$mainUrl}/payment/{$shopId}",
            CURLOPT_HTTPHEADER => array("Content-Type: application/json"),
            CURLOPT_POSTFIELDS => json_encode($transactionRequest),
        ));

        // Wykonanie zapytania
        $ret = curl_exec($ch);
        $response = json_decode($ret);

        if (curl_getinfo($ch, CURLINFO_HTTP_CODE) != "200") {
            echo "Error message: {$response->errorMessage}";
        } else {
            header("Location: {$response->redirectUrl}");
            exit();
        }
        break;

    
    case 'blik':
    case 'card':
        // Dodaj obsługę dla BLIK i karty płatniczej
        echo "Obsługa dla metody $paymentMethod nie została zaimplementowana.";
        break;

    default:
        echo "Nieznana metoda płatności.";
        break;
}

// Zamknięcie sesji cURL
curl_close($ch);
