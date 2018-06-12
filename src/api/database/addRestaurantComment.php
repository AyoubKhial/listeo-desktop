<?php
    include "./connection.php";
    include "../file_upload/upload.php";
    $json = array();
    $data = file_get_contents("php://input");
    $input = json_decode($data);
    $json['input'] = $input;
    $json['post'] = ($_POST);
    $json['files'] = $_FILES;
    $count = count($_FILES['fileToUpload']['name']);
    $texte = $_POST['review'];
    $rating = $_POST['rating'];
    $id_item = $_POST['restaurant'];
    $id_utilisateur = $_POST['user'];
    $stmt = $conn->prepare("INSERT INTO commentaire_item(texte, rating, id_item, id_utilisateur) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("siii", $texte, $rating, $id_item, $id_utilisateur);
    $stmt->execute();
    if ($conn->affected_rows > 0){
        $last_id = $conn->insert_id;
        for ($i = 0; $i < $count; $i++) {
            $newfilename = uploadImage($_FILES['fileToUpload'], "../../assets/images/comments/", $i);
            $description = "comment " . $last_id . " - photo " . $newfilename;
            $stmt = $conn->prepare("INSERT INTO commentaire_item_photo (url, description, id_commentaire_item) VALUES (?, ?, ?)");
            $stmt->bind_param("ssi", $newfilename, $description, $last_id);
            $stmt->execute();
            if ($conn->affected_rows > 0) {
                uploadImage($_FILES['fileToUpload'], "../../assets/images/comments/", $i);
            }
            else{
                echo "Error";
            }
        }
        $stmt->close();
	}
	else {
        echo "Error";
    }
	$conn->close();
?>
