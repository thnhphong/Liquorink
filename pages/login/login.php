<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);

$hostname = "localhost";
$username = "root";
$password = "101204@Ph"; 
$dbname = "signup";

$conn = new mysqli($hostname, $username, $password, $dbname);

if($conn->connect_error){
  die("Connection failed: " . $conn->connect_error);
}

if($_SERVER['REQUEST_METHOD'] === 'POST'){
  $name = $_POST['name'];
  $email = $_POST['email'];
  $password = $_POST['password'];

  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      echo "Invalid email format";
      exit; 
  }

  $sql = "SELECT id, name, email, password FROM users where name = ? AND email = ?";
  if($stmt = $conn->prepare($sql)){
    $stmt->bind_param("ss", $name, $email);
     $stmt->execute();
     $stmt->store_result();

     if($stmt->num_rows > 0){
      $stmt->bind_result($id, $name, $email, $hashed_password);
      $stmt->fetch();
        if(password_verify($password, $hashed_password)){
          echo "Login successfully! Welcome, $name";
        } else {
          echo "Invalid password!";
        }
      } else {
            echo "No user found with this name and email.";
      }
      $stmt->close();
    } else {
        echo "Error: " . $conn->error;
    }
}
$conn->close();
