<?php
    include "./connection.php";
    include "../file_upload/upload.php";
    $json = array();
    $data = file_get_contents("php://input");
    $input = json_decode($data);
    $json['input'] = $input;
    $json['post'] = ($_POST);
    $json['files'] = $_FILES;
    if(count($json['files']) > 0){
        $count = count($_FILES['fileToUpload']['name']);
    }
    else{
        $count = 0;
    }
    
    if($_POST['review'] == "null"){
        $text = null;
    }
    else{
        $texte = $_POST['review'];
    }
    if($_POST['rating'] == "null"){
        $rating = null;
    }
    else{
        $rating = $_POST['rating'];
    }
    $id_item = $_POST['hotel'];
    $id_utilisateur = $_POST['user'];
    $stmt = $conn->prepare("INSERT INTO commentaire_item(texte, rating, id_item, id_utilisateur) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("siii", $texte, $rating, $id_item, $id_utilisateur);
    $stmt->execute();
    if ($conn->affected_rows > 0){
        $last_id = $conn->insert_id;
        $stmt->close();
        for ($i = 0; $i < $count; $i++) {
            $newfilename = uploadImage($_FILES['fileToUpload'], "../../assets/images/comments/", $i);
            $description = "comment " . $last_id . " - photo " . $newfilename;
            $stmt2 = $conn->prepare("INSERT INTO commentaire_item_photo (url, description, id_commentaire_item) VALUES (?, ?, ?)");
            $stmt2->bind_param("ssi", $newfilename, $description, $last_id);
            $stmt2->execute();
            if ($conn->affected_rows > 0) {
                uploadImage($_FILES['fileToUpload'], "../../assets/images/comments/", $i);
            }
            $stmt2->close();
        }
        echo "Inserted";
	}
	else {
        echo "Error";
    }
	$conn->close();
?>
