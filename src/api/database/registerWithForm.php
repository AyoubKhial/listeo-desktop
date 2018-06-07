<?php
    include "./connection.php";
    $data = json_decode(file_get_contents("php://input"));
    if(!empty($data->registerFirstName) && !empty($data->registerLastName) && !empty($data->registerEmail) && !empty($data->registerPassword) && !empty($data->registerRepeatPassword)){
        if (preg_match("/^[a-zA-Z]{4,10}/",$data->registerFirstName) && (preg_match("/^[a-zA-Z]{4,10}/",$data->registerLastName))&& (preg_match("/^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9._-]*\\.[a-zA-Z]{2,4}$/",$data->registerEmail)) ) { 
            $stmt_check = $conn->prepare("SELECT * FROM utilisateur WHERE email = ?");
            $stmt_check->bind_param("s", $data->registerEmail);
            $stmt_check->execute();
            $stmt_check->store_result();
            if($stmt_check->num_rows() > 0){
                echo 'Already exists';
            }
            else{
                $stmt_check->close();
                $registerPassword = md5($data->registerPassword);
                $stmt = $conn->prepare("INSERT INTO utilisateur (first_name, last_name, email, password, id_ville) VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param("ssssi", $data->registerFirstName, $data->registerLastName, $data->registerEmail, $registerPassword, $data->registerVille);
                $stmt->execute();
                if ($conn->affected_rows > 0) {
                    $stmt->close();
                    $stmt2 = $conn->prepare("SELECT id, first_name, last_name, email FROM utilisateur WHERE email = ?");
                    $stmt2->bind_param("s", $data->registerEmail);
                    $stmt2->execute();
                    $result = $stmt2->get_result();
                    if($result->num_rows > 0){
                        $data = array();
                        while($row = $result->fetch_assoc()){
                            $data[] = $row;
                        }
                        echo json_encode($data);
                        $stmt2->close();
                    }
                }
                else {
                    echo "Error";
                }
            }
        }
        else {
            echo "Error";
        }
    }
    else {
        echo "Error";
    }
    $conn->close();
?>
