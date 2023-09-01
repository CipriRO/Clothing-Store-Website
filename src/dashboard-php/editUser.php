<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];
    $username = $data['username'];
    $password = $data['password'];

    // Connection details
    $host = 'localhost';
    $db_username = 'root';
    $db_password = 'ciprianS26';
    $dbname = 'epiz_33174967_products';

    // Create connection
    $conn = new mysqli($host, $db_username, $db_password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    function generateSalt() {
      $length = 16;
      $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      $salt = '';
      for ($i = 0; $i < $length; $i++) {
          $salt .= $characters[rand(0, strlen($characters) - 1)];
      }
      return $salt;
    }

    if($id !== "i") {
      if($username !== "") {
        $query = "UPDATE `admins` SET username = ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("si", $username, $id);
        $stmt->execute();
      }

      if($password !== "") {
        $salt = generateSalt();
        $hash = hash('sha256', $password . $salt);

        $query = "UPDATE `admins` SET password_hash = ?, password_salt = ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssi", $hash, $salt, $id);
        $stmt->execute();
      }
    } else {
      $salt = generateSalt();
      $hash = hash('sha256', $password . $salt);

      $query = "INSERT INTO admins (username, password_hash, password_salt) VALUES (?, ?, ?)";
      $stmt = $conn->prepare($query);
      $stmt->bind_param("sss", $username, $hash, $salt);
      $stmt->execute();

      $query = "SELECT id FROM `admins` WHERE password_hash = ? AND password_salt = ?";
      $stmt = $conn->prepare($query);
      $stmt->bind_param("ss", $hash, $salt);
      $stmt->execute();
      $result = $stmt->get_result();

      $row = $result->fetch_assoc();
      $data = $row['id'];

      echo json_encode($data);
    }

    $conn -> close();
?>