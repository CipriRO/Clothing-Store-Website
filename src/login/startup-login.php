<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $data = json_decode(file_get_contents('php://input'), true);
    $session = $data;

    $host = 'localhost';
    $username_db = 'root';
    $password_db = 'ciprianS26';
    $dbname = 'epiz_33174967_products';

    $db = mysqli_connect($host, $username_db, $password_db, $dbname);
    // Check if user already has a session ID cookie
    if ($session !== null) {
        // Retrieve the session data from the database
        $session_id = mysqli_real_escape_string($db, $session);
        $session_data_query = "SELECT * FROM sessions WHERE session_id = '$session_id'";
        $session_data_result = mysqli_query($db, $session_data_query);
        $session_data = mysqli_fetch_assoc($session_data_result);
  
        if ($session_data) {
            $url = "http://192.168.1.17:5173/src/login/dashboard.html";
            echo json_encode($url);
            $db->close();
            exit();
        } else {
            setcookie('session_id', '', time() - 3600);
            echo json_encode(true);
        }
    } else {echo json_encode(true);}
    $db->close();
?>