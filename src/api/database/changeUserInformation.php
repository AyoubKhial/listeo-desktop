<?php
    include "./connection.php";
    $data = json_decode(file_get_contents("php://input"));
    $stmt = $conn->prepare("UPDATE utilisateur
                            SET first_name = ?, last_name = ?, email = ?, phone = ?, activities = ?, instagram = ?, facebook = ?
                            WHERE id = ?");
    $stmt->bind_param("sssssssi", $data->first_name, $data->last_name, $data->email, $data->phone, $data->activities, $data->instagram, $data->facebook, $data->user);
    $stmt->execute();
    if ($stmt){
        echo "Inserted";
	}
	else {
        echo "Error";
    }
    $stmt->close();
    $conn->close();
?>
