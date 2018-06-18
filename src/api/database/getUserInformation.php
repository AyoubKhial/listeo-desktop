<?php
    include "./connection.php";
    $userId = json_decode(file_get_contents("php://input"));
    $sql = "SELECT u.id, u.first_name, u.last_name, u.email, u.password, u.photo, u.phone, u.instagram, u.facebook
            FROM utilisateur u
            WHERE u.id = $userId";
     $result = $conn->query($sql);
     if ($result->num_rows > 0) {
        $data = array() ;
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
     }
    else{
        echo "Not found";
    }
    $conn->close();
?>
