<?php
    include "./connection.php";
    $data = json_decode(file_get_contents("php://input"));
    $stmt = $conn->prepare("INSERT INTO commentaire_article(texte, id_utilisateur, id_article) VALUES (?, ?, ?)");
    $stmt->bind_param("sii", $data->texte, $data->user, $data->article);
    $stmt->execute();
    if ($stmt){
        echo "Inserted";
        $stmt->close();
	}
	else {
        echo "Error";
    }
	$conn->close();
?>
