<?php
    include "./connection.php";
    $data = json_decode(file_get_contents("php://input"));
    $stmt = $conn->prepare("INSERT INTO contact (name, email, subject, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $data->contactUsName, $data->contactUsEmail, $data->contactUsSubject, $data->contactUsMessage);
    $stmt->execute();
    if ($conn->affected_rows > 0) {
        echo "Inserted";
    }
    else{
        echo "Error";
    }
    $stmt->close();
    $conn->close();
?>
