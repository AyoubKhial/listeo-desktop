<?php
    include "./connection.php";
    include "../file_upload/upload2.php";
    $input = json_decode(file_get_contents("php://input"));
    $article = array_values($_POST);
    $image = array_values($_FILES);
    $tags = explode(",",array_values($_POST)[2]);
    $articleTitle = $article[0];
    $articleContent = $article[1] ;
    $articleUser = $article[3];
    $articleActive = 0;
    $newfilename = uploadImage($_FILES, "../../assets/images/articles/");
    $stmt = $conn->prepare("INSERT INTO article (titre, texte, photo, id_utilisateur, active) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssii", $articleTitle, $articleContent, $newfilename, $articleUser, $articleActive);
    $stmt->execute();
    if ($conn->affected_rows > 0) {
        uploadImage($_FILES, "../../assets/images/articles/");
        $last_id = $conn->insert_id;
        for($i = 0;$i<count($tags);$i++){
            $stmt = $conn->prepare("INSERT INTO article_tag (id_article, id_tag) VALUES (?,?)");
            $stmt->bind_param("ii", $last_id, $tags[$i]);
            $stmt->execute();
            if ($conn->affected_rows <= 0) {
                echo "Error";
            }
        }
        echo "Inserted";
    }
    else {
        echo "Error";
    }
    $stmt->close();
    $conn->close();
?>