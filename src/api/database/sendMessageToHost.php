<?php
    include "./connection.php";
	$data = json_decode(file_get_contents("php://input"));
    $stmt = $conn->prepare("INSERT INTO message(titre, texte, id_sender, id_receiver) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssii", $data->title, $data->message, $data->sender, $data->receiver);
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
