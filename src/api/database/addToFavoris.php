<?php
    include "./connection.php";
    $data = json_decode(file_get_contents("php://input"));
    if($data->action == "add"){
        $stmt = $conn->prepare("INSERT INTO favoris(id_utilisateur, id_item) VALUES (?, ?)");
    }
    else if($data->action == "remove"){
        $stmt = $conn->prepare("DELETE FROM favoris WHERE id_utilisateur = ? AND id_item = ?");
    }
    $stmt->bind_param("ii", $data->user, $data->item);
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
