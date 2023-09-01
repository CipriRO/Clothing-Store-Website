<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$host = 'localhost';
$username_db = 'root';
$password_db = 'ciprianS26';
$dbname = 'epiz_33174967_products';

// Start the session
session_start();

// Retrieve the entered username and password
$input_username = $_POST['username'];
$input_password = $_POST['password'];

// Connect to the database
$db = mysqli_connect($host, $username_db, $password_db, $dbname);

// Prepare the SQL query with parameters
$stmt = $db->prepare("SELECT * FROM admins WHERE username = ?");
$stmt->bind_param("s", $input_username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user_data = $result->fetch_assoc();
    $hash = hash('sha256', $input_password . $user_data['password_salt']);
    if ($hash == $user_data['password_hash']) {
        $session_id = session_id();
        $user_id = $user_data['id'];
        $ip_address = $_SERVER['REMOTE_ADDR'];
        $user_agent = $_SERVER['HTTP_USER_AGENT'];
        $session_data_query = "INSERT INTO sessions (session_id, user_id, ip_address, user_agent) VALUES ('$session_id', $user_id, '$ip_address', '$user_agent')";
        mysqli_query($db, $session_data_query);

        $response = array(
            'success' => true,
            'session' => $session_id,
            'url' => 'http://192.168.1.17:5173/src/login/dashboard.html'
        );
        echo json_encode($response);
        $db->close();
        exit();
    }
}

$response = array(
    'success' => false,
);
header('Content-Type: application/json');
echo json_encode($response);
$db->close();
?>