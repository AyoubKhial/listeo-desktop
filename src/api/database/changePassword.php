<?php
    include "./connection.php";
    $data = json_decode(file_get_contents("php://input"));
    $current_password = md5($data->current_password);
    $sql = "SELECT password FROM utilisateur WHERE id = $data->user";
    $result = $conn->query($sql);
    $data2 = $result->fetch_row();
    if($data2[0] == $current_password){
        $new_password = md5($data->new_password);
        $stmt = $conn->prepare("UPDATE utilisateur
                                SET password = ?
                                WHERE id = ?");
        $stmt->bind_param("si", $new_password, $data->user);
        $stmt->execute();
        if ($stmt){
            echo "Inserted";
            $stmt->close();
	    }
	    else {
            echo "Error";
        }
    }
    else{
        echo "Wrong password";
    }
    $conn->close();
?>
