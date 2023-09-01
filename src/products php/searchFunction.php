<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    $data = json_decode(file_get_contents('php://input'), true);
    $search_term = $data;
    $limit = 10;

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

    $query = "SELECT * FROM products WHERE name LIKE CONCAT('%', ?, '%') LIMIT ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $search_term, $limit);
    $stmt->execute();
    $result = $stmt->get_result();

    $products = array();

    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    for($j = 0; $j < count($products); $j++) {
        $query = "SELECT Name FROM `sizes` WHERE size_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $products[$j]['Size']);
        $stmt->execute();
        $result = $stmt->get_result();                        
        if ($result->num_rows === 0) {
            die("error");
        }                        
        $row = $result->fetch_assoc();
        $products[$j]['sizeName'] = $row['Name'];
        
        $query = "SELECT Name FROM `colors` WHERE color_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $products[$j]['Color']);
        $stmt->execute();
        $result = $stmt->get_result();                        
                       
        $row = $result->fetch_assoc();
        $products[$j]['colorName'] = $row['Name'];
    }

    header('Content-Type: application/json');
    echo json_encode($products);
?>