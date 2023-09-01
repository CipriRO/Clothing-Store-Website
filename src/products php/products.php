<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    $productId = json_decode(file_get_contents('php://input'), true);

    include "../products/retrieve products.php";
    include "retrieve product info.php";
    include "retrieve default info.php";

    $data = array();

    $data['productsInfoId'] = $productInfoId;
    $data['images'] = $images;
    $data['products'] = $produse;
    $data['defSize'] = $defSize;
    $data['defColor'] = $defColor;
    $data['colorsCode'] = $colorsCode;

    if (!empty($sizes)){
        $data['sizes'] = $sizes;
    }
    if (!empty($colors)){
        $data['colors'] = $colors;
    }
    
    header('Content-Type: application/json');
    echo json_encode($data);

    $conn->close();
?>