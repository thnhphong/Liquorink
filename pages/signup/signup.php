<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$hostname = "localhost";
$username = "root";
$password = "101204@Ph"; 
$dbname = "signup"; 

$conn = new mysqli($hostname, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $dob = $_POST['dob'];

    if (empty($name) || empty($email) || empty($password) || empty($dob)) {
        echo "All fields are required.";
        exit;
    }
    //name and email initialize
    $name_error = false;
    $email_error = false;

    //name exists
    $sql_name_check = "SELECT * FROM users WHERE name = ?";
    $stmt_name = $conn->prepare($sql_name_check);
    $stmt_name->bind_param("s", $name);
    $stmt_name->execute();
    $result_name = $stmt_name->get_result();

    if ($result_name->num_rows > 0) {
        echo "Name already taken";
        exit;
    }
    //email exists
    $sql_email_check = "SELECT * FROM users WHERE email = ?";
    $stmt_email = $conn->prepare($sql_email_check);
    $stmt_email->bind_param("s", $email);
    $stmt_email->execute();
    $result_email = $stmt_email->get_result();

    if ($result_email->num_rows > 0) {
        echo "Email already taken"; 
        exit;
    }

    if ($name_error && $email_error) {
        echo "Username and email are already taken.";
        exit;
    } elseif ($name_error) {
        echo "This username is already taken.";
        exit;
    } elseif ($email_error) {
        echo "This email is already taken.";
        exit;
    }
    //check dob < 18
    echo "DOB: " . htmlspecialchars($dob) . "<br>";
    $dobDate = new DateTime($dob);
    $currentDate = new DateTime();
    $age = $currentDate->diff($dobDate)->y;

    if ($age < 18 || ($age == 18 && $currentDate->format('Y-m-d') < $dobDate->format('Y-m-d'))) {
        echo "You must be at least 18 years old to sign up.";
        exit;
    }


    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $sql = "INSERT INTO users (name, email, password, dob) VALUES (?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        echo "Error: Could not prepare statement for insert. " . $conn->error;
        exit;
    }

    $stmt->bind_param("ssss", $name, $email, $hashed_password, $dob);

    if ($stmt->execute()) {
        echo "User registered successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();

