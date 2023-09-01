<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$datas = json_decode(file_get_contents('php://input'), true);
if($datas === null) { return; }
$firstName = $datas['firstName'];
$lastName = $datas['lastName'];
$email = $datas['email'];
$content = $datas['content'];

$host = 'localhost';
$username = 'root';
$password = 'ciprianS26';
$dbname = 'epiz_33174967_products';

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$query = "INSERT INTO `contact_forms` (`last_name`, `first_name`, `email`, `message_content`, `date`) 
VALUES ( ?, ?, ?, ?, NOW())";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssss", $lastName, $firstName, $email, $content);

if ($stmt->execute()) {
  $data['success'] = true;
} else {
  return;
}

echo json_encode($data);
$conn->close();
?>