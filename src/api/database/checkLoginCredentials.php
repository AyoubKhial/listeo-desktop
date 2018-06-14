<?php
    include "./connection.php";
    $data = json_decode(file_get_contents("php://input"));
    if(!empty($data->loginEmail) && !empty($data->loginPassword)) {
        $cryptedPassword = md5($data->loginPassword);
        $stmt = $conn->prepare("SELECT id, first_name, last_name, email, photo, provider FROM utilisateur WHERE email = ? AND password= ? AND active = 1");
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
