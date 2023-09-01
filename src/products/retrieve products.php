<?php
header("Content-Type: text/html; charset=UTF-8");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

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

// Execute a SELECT query
$query = "SELECT * FROM products WHERE product_id= ? AND availability = 'true'";

$stmt = $conn->prepare($query);
$stmt->bind_param("s", $productId);
$stmt->execute();
$result = $stmt->get_result();

// Initialize an array to store the data
$produse = array();

// Iterate through the result set
while ($row = $result->fetch_assoc()) {
    // Add the row to the array
    $produse[] = $row;
}

if (empty($produse)) {
    //header("Location: http://localhost:5173/src/html/pageNotFound.html");
    exit;
}

for($i = 0; $i < count($produse); $i++) {
    for($j = 0; $j < count(explode(",", $produse[$i]['categories'])); $j++) {
        $query = "SELECT Name FROM `categories` WHERE category_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", explode(",", $produse[$i]['categories'])[$j]);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            die("error");
        }

        $row = $result->fetch_assoc();
        $produse[$i]['categoryName'][] = $row['Name'];
    }
}

$conn->close();
?>