<?php
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Methods: PUT, GET, POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);


    include "getAllProducts.php";

    $data = array();

    $query = "SELECT * FROM `products` WHERE availability = 'true' AND `Bought times` != 0 ORDER BY `Bought times` DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();

    $boughtProducts = array();

    while ($row = $result->fetch_assoc()) {
        $boughtProducts[] = $row;
    }

    for($k = 0; $k < count($boughtProducts); $k++) {
        $query = "SELECT name FROM `sizes` WHERE size_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $boughtProducts[$k]['Size']);
        $stmt->execute();
        $result = $stmt->get_result();                        
                               
        $row = $result->fetch_assoc();
        $boughtProducts[$k]['sizeName'] = $row['name'];
        
        $query = "SELECT name FROM `colors` WHERE color_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $boughtProducts[$k]['Color']);
        $stmt->execute();
        $result = $stmt->get_result();                    
                             
        $row = $result->fetch_assoc();
        $boughtProducts[$k]['colorName'] = $row['name'];
        $boughtProducts[$k]['category'] = "Most Bought";
    }

    $data[] = $boughtProducts;


    if($homeCateg[0] !== "") {
        for($i = 0; $i < count($homeCateg); $i++) {
            $query = "SELECT name FROM `categories` WHERE id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("i", $homeCateg[$i]);
            $stmt->execute();
            $result = $stmt->get_result();                
                          
            $row = $result->fetch_assoc();
            $categ = $row['name'];


            $query = "SELECT * FROM `products` WHERE categories REGEXP CONCAT('(^|,)', ?, '(,|$)') AND availability = 'true'";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("i", $homeCateg[$i]);
            $stmt->execute();
            $result = $stmt->get_result();                    
                    
            // Initialize an array to store the data
            $products = array();
            // Iterate through the result set
            while ($row = $result->fetch_assoc()) {
                // Add the row to the array
                $products[] = $row;
            }
            for($j = 0; $j < count($products); $j++) {
                $query = "SELECT name FROM `sizes` WHERE size_id = ?";
                $stmt = $conn->prepare($query);
                $stmt->bind_param("i", $products[$j]['Size']);
                $stmt->execute();
                $result = $stmt->get_result();                        
               
                $row = $result->fetch_assoc();
                $products[$j]['sizeName'] = $row['name'];
                
                $query = "SELECT name FROM `colors` WHERE color_id = ?";
                $stmt = $conn->prepare($query);
                $stmt->bind_param("i", $products[$j]['Color']);
                $stmt->execute();
                $result = $stmt->get_result();                        
                                     
                $row = $result->fetch_assoc();
                $products[$j]['colorName'] = $row['name'];
                $products[$j]['category'] = $categ;
            }

            $data[] = $products;
        }
    }

    header('Content-Type: application/json');
    echo json_encode($data);
    
    $conn->close();
?>