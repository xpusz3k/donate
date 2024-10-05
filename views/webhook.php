<?php
// webhook.php - obsługa webhooka PayPal

// Sprawdzenie czy request pochodzi od PayPal
$raw_post_data = file_get_contents('php://input');
$raw_post_array = explode('&', $raw_post_data);
$myPost = array();
foreach ($raw_post_array as $keyval) {
    $keyval = explode('=', $keyval);
    if (count($keyval) == 2) {
        $myPost[$keyval[0]] = urldecode($keyval[1]);
    }
}
$req = 'cmd=_notify-validate';
foreach ($myPost as $key => $value) {
    $value = urlencode($value);
    $req .= "&$key=$value";
}

// Wysłanie requesta do PayPal w celu weryfikacji
$ch = curl_init('https://ipnpb.paypal.com/cgi-bin/webscr');
curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $req);
curl_setopt($ch, CURLOPT_SSLVERSION, 6);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
curl_setopt($ch, CURLOPT_FORBID_REUSE, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Connection: Close'));
$res = curl_exec($ch);
curl_close($ch);

if (strcmp($res, "VERIFIED") == 0) {
    // Przetwarzanie danych płatności
    $amount = $_POST['mc_gross'];
    $payer_name = $_POST['payer_email'];
    $message = $_POST['item_name'];

    // Stwórz plik HTML z komunikatem
    $html_content = "
        <div id='notification'>
            <p>Donacja od: <strong>{$payer_name}</strong></p>
            <p>Kwota: <strong>{$amount} PLN</strong></p>
            <p>Wiadomość: <strong>{$message}</strong></p>
        </div>
    ";
    file_put_contents('not.html', $html_content);
} else {
    // Zignoruj requesty, które nie są zweryfikowane
    http_response_code(400);
}
?>
