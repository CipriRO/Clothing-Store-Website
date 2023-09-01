<?php

$host = 'localhost';
$username = 'root';
$password = 'ciprianS26';
$dbname = 'epiz_33174967_products';

// Create connection
$conn = mysqli_connect($host, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$lastName = filter_input(INPUT_POST, 'last_name', FILTER_SANITIZE_STRING);
$firstName = filter_input(INPUT_POST, 'first_name', FILTER_SANITIZE_STRING);
$phoneNumber = filter_input(INPUT_POST, 'phone_number', FILTER_SANITIZE_NUMBER_INT);
$phoneNumber = $phoneNumber = preg_replace('/[^0-9\+]/', '', $phoneNumber);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$streetAddress = filter_input(INPUT_POST, 'street_address', FILTER_SANITIZE_STRING);
$zipCode = filter_input(INPUT_POST, 'postal_code', FILTER_SANITIZE_NUMBER_INT);
$bloc = filter_input(INPUT_POST, 'bloc', FILTER_SANITIZE_NUMBER_INT);
$scara = filter_input(INPUT_POST, 'staircase', FILTER_SANITIZE_NUMBER_INT);
$apartament = filter_input(INPUT_POST, 'apartament', FILTER_SANITIZE_NUMBER_INT);
$judet = filter_input(INPUT_POST, 'judet', FILTER_SANITIZE_STRING);
$localitate = filter_input(INPUT_POST, 'localitate', FILTER_SANITIZE_STRING);
$livrare = $_POST["Livrare"];
$plata = $_POST["Plata"];
$produseData = $_POST["cart"];
$produse = json_decode($produseData, true);
$verification = true;

$result = mysqli_query($conn,"SELECT `pret alb cm patrati` FROM `preturi` ORDER BY id ASC LIMIT 1");
$row1 = mysqli_fetch_assoc($result);
$pret = $row1['pret alb cm patrati'];

$total = 0;

foreach($produse as $produs) {
    $id = $produs["id"];
    $qnt = $produs["qnt"];
    $size = $produs["size"];

    $sizes = explode(" X ", $size);
    $total = $total + ((intval($sizes[0]) * intval($sizes[1])) * $pret) * $qnt;
}
$total = round($total, 2);

$comenzi_query = "INSERT INTO comenzi (`Nume`, `Prenume`, `Nr. Tel`, `Email`, `Strada si Nr.`, `Cod postal`, `Bloc`, `Scara`, `Apartament`, `Judet`, `Localitate`, `livrare`, `plata`, `ora`, `data`, `pret`) 
VALUES ('$lastName', '$firstName', '$phoneNumber', '$email', '$streetAddress', '$zipCode', '$bloc', '$scara', '$apartament', '$judet', '$localitate', '$livrare', '$plata', NOW(), CURRENT_DATE(), '$total')";

$comenzi_response = mysqli_query($conn, $comenzi_query);

$orderIdQuery = mysqli_query($conn, "SELECT `order_id` FROM `comenzi` WHERE `Email` = '$email' ORDER BY `order_id` DESC LIMIT 1");
$orderRow = mysqli_fetch_assoc($orderIdQuery);
$orderId = $orderRow['order_id'];

foreach($produse as $produs) {
    $id = $produs["id"];
    $qnt = $produs["qnt"];
    $size = $produs["size"];

    $sizes = explode(" X ", $size);

    $productNameQuery = mysqli_query($conn, "SELECT `name` FROM `produse` WHERE `id` = '$id'");
    $productNameRow = mysqli_fetch_assoc($productNameQuery);
    $productName = $productNameRow['name'];

    $price = ($sizes[0] * $sizes[1]) * $pret;

    $produseComandate_query = "INSERT INTO `produse comandate` (`order_id`, `Nume produs`, `Cantitate`, `Marime`, `Pret`) 
VALUES ('$orderId', '$productName', '$qnt', '$size', '$price')";

    $produseComandate_response = mysqli_query($conn, $produseComandate_query);
    if(!$produseComandate_response) {
        $verification = false;
        break;
    }
}

if($comenzi_response && !$verification === false) {
    $response = array(
        'success' => true,
        'id' => $orderId
    );
} else {
    $response = array(
        'success' => false,
    );
}
error_log(mysqli_error($conn));
echo json_encode($response);
?>