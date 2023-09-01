<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    $domain = "http://localhost:5173/";

    require_once '../stripe-php/init.php';
    require_once 'secretKey.php';

    \Stripe\Stripe::setApiKey($stripeSecretKey);
  
  // Connection details
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

    $productList = explode(',', $_POST['product_list']);
    $sizeList = explode('|', $_POST['size_list']);
    $quantityList = explode(',', $_POST['quantity_list']);
    $backLink = $_POST['back_link'];

    if ($productList === null) {
      die('An error occurred. Please try again later');
    } else if ($sizeList === null) {
      die('An error occurred. Please try again later');
    } else if ($quantityList === null) {
      die('An error occurred. Please try again later');
    }

    $lineItems = [];
    $productIds = [];
    $sizes = [];
    $colors = [];
    $quantities = [];

    for ($i = 0; $i < count($productList); $i++) {
        $product = $productList[$i];
        $productIds[] = $product;
        $size = explode(',', $sizeList[$i]);
        $sizes[] = $size[0];
        $colors[] = $size[1];
        $quantity = $quantityList[$i];
        $quantities[] = $quantity;

        $query = "SELECT price, image FROM `products info` WHERE size_id = ? AND color_id = ? AND product_id = ? AND quantity > 0";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("iii", $size[0], $size[1], $product);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            die("An error occurred. Please try again later");
        }
        
        $row = $result->fetch_assoc();
        $price = $row['price'];
        $image = $row['image'];


        $query = "SELECT Name FROM `colors` WHERE color_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $size[1]);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            die("An error occurred. Please try again later");
        }
        
        $row = $result->fetch_assoc();
        $color = $row['Name'];



        $query = "SELECT Name FROM `sizes` WHERE size_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $size[0]);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            die("An error occurred. Please try again later");
        }
        
        $row = $result->fetch_assoc();
        $sizeName = $row['Name'];


        $query = "SELECT name FROM `products` WHERE product_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $product);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            die("An error occurred. Please try again later");
        }
        
        $row = $result->fetch_assoc();
        $name = $row['name'];

        
        $lineItems[] = [
            'price_data' => [
              'currency' => 'usd',
              'product_data' => [
                //'images' => [$domain . 'produ`cts%20photo/' . $image],
                'name' => $name,
                'description' => 'Size: ' . $sizeName . ", " . 'Color: ' . $color,
              ],
              'unit_amount' => $price * 100,
            ],
            'quantity' => $quantity,
        ];
    }

    $productIds = json_encode($productIds, true);
    $colors = json_encode($colors, true);
    $sizes = json_encode($sizes, true);
    $quantities = json_encode($quantities, true);

    error_log('--------------------------stripe portocale: '. print_r($productIds, true), 0);


$checkout_session = \Stripe\Checkout\Session::create([
  'line_items' => $lineItems,
  'metadata' => [
    'product_ids'  => $productIds,
    'colors' => $colors,
    'sizes' => $sizes,
    'quantities' => $quantities
  ],
  'mode' => 'payment',
  'shipping_address_collection' => ['allowed_countries' => ['US', 'CA', 'RO']],
  'success_url' => $domain . 'src/payment-page/success.html',
  'cancel_url' => $backLink,
]);

      header("HTTP/1.1 303 See Other");
      header("Location: " . $checkout_session->url);
?>