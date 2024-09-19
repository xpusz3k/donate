<?php
// process_payment.php

header('Content-Type: application/json');

// Odczytaj dane z JSON-a
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$shopId = "YOUR_SHOP_ID"; // ID punktu płatności
$secretPhrase = "YOUR_SECRET_PHRASE"; // Sekret dla punktu płatności
$mainUrl = "https://pay.cashbill.pl/ws/rest";

// Dane do płatności przekazane z formularza
$nickname = $data['nickname'];
$message = $data['message'];
$amount = $data['amount']; // Kwota płatności

// Tworzenie żądania transakcji do CashBill
$transactionRequest = array(
    "title" => "Donation from {$nickname}",
    "amount" => array(
        "value" => $amount,
        "currencyCode" => "PLN",
    ),
    "returnUrl" => "https://yourwebsite.com/success.php", // URL powrotu po płatności
    "description" => "Donation with message: {$message}",
    "additionalData" => $nickname,
);

// Generowanie podpisu (sign)
$transactionRequest['sign'] = sha1(
    $transactionRequest['title'] . 
    $transactionRequest['amount']['value'] . 
    $transactionRequest['amount']['currencyCode'] . 
    $transactionRequest['returnUrl'] . 
    $transactionRequest['description'] . 
    $transactionRequest['additionalData'] . 
    $secretPhrase
);

// Wysłanie żądania do API CashBill
$ch = curl_init();
curl_setopt_array($ch, array(
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_URL => "{$mainUrl}/payment/{$shopId}",
    CURLOPT_HTTPHEADER => array("Content-Type: application/json"),
    CURLOPT_POSTFIELDS => json_encode($transactionRequest),
));

$ret = curl_exec($ch);
$response = json_decode($ret);

// Sprawdzenie odpowiedzi z API
if (curl_getinfo($ch, CURLINFO_HTTP_CODE) != 200) {
    echo json_encode(array('error' => $response->errorMessage));
} else {
    // Zwrócenie ID zamówienia i URL do przekierowania
    echo json_encode(array(
        'id' => $response->id,
        'redirectUrl' => $response->redirectUrl
    ));
}

curl_close($ch);
