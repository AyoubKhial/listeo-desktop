<?php
    include "./connection.php";
    $data = json_decode(file_get_contents("php://input"));
    if(!empty($data->loginEmail) && !empty($data->loginPassword)) {
        $cryptedPassword = md5($data->loginPassword);
        $stmt = $conn->prepare("SELECT u.id, u.first_name, u.last_name, u.email, u.photo, u.provider, v.name
                                FROM utilisateur u INNER JOIN ville v ON u.id_ville = v.id
                                WHERE u.email = ? AND password= ? AND u.active = 1");
        $stmt->bind_param("ss", $data->loginEmail, $cryptedPassword);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows > 0){
            $data = array();
            while($row = $result->fetch_assoc()){
                $data[] = $row;
            }
            echo json_encode($data);
        }
        else {
            echo "Error";
        }
    }
    else {
        echo "Error";
    }
    $stmt->close();
    $conn->close();
?>
