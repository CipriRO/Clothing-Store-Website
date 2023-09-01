<?php
// webhook.php
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (webhook.php)
//
// 2) Install dependencies
//   composer require stripe/stripe-php
//
// 3) Run the server on http://localhost:4242
//   php -S localhost:4242


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$host = 'localhost';
$username = 'root';
$password = 'ciprianS26';
$dbname = 'epiz_33174967_products';

// Create connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

require '../../vendor/autoload.php';
require_once 'secretKey.php';

// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.
$stripe = new \Stripe\StripeClient($stripeSecretKey);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
$endpoint_secret = 'whsec_dc5f073fffeb0a50de84b00aa0a63ddb243a568e0cfb2a18595f8c1e6fb9d15f';

$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
$event = null;

try {
  $event = \Stripe\Webhook::constructEvent(
    $payload, $sig_header, $endpoint_secret
  );
} catch(\UnexpectedValueException $e) {
  // Invalid payload
  http_response_code(400);
  exit();
} catch(\Stripe\Exception\SignatureVerificationException $e) {
  // Invalid signature
  http_response_code(400);
  exit();
}

switch ($event->type) {
    case 'checkout.session.completed':
      $paymentIntent = $event->data->object;
      $productIds = json_decode($paymentIntent->metadata['product_ids'], true);
      $colors = json_decode($paymentIntent->metadata['colors'], true);
      $sizes = json_decode($paymentIntent->metadata['sizes'], true);
      $quantities = json_decode($paymentIntent->metadata['quantities'], true);

      for($i = 0; $i < count($productIds); $i++) {
        $productId = $productIds[$i];
        $color = $colors[$i];
        $size = $sizes[$i];
        $quantity = $quantities[$i];

        $query = "SELECT quantity FROM `products info` WHERE size_id = ? AND color_id = ? AND product_id = ? AND quantity > 0";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("iii", $size, $color, $productId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
          die("Something is wrong. Try again later!");
        }

        $query = "SELECT `Bought Times` FROM `products info` WHERE product_id = ? AND availability = true";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
          die("Something is wrong. Try again later!");
        }
        
        $row = $result->fetch_assoc();
        $oldCounter = $row['Bought Times'];

        $newCounter = $oldCounter + $quantity;

        $query = "UPDATE `products` SET `Bought Times` = ? WHERE product_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ii", $newCounter, $productId);
        $stmt->execute();

        $newQuantity = $oldQuantity - $quantity;

        if($newQuantity < 0) {
          die("You have bought too many items with the id " . $productId);
        }

        $query = "UPDATE `products info` SET quantity = ? WHERE product_id = ? AND size_id = ? AND color_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("iiii", $newQuantity, $productId, $size, $color);
        $stmt->execute();
      }
    }

http_response_code(200);