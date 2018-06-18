<?php
    include "./connection.php";
    include "../file_upload/upload.php";
    $json = array();
    $data = file_get_contents("php://input");
    $input = json_decode($data);
    $json['input'] = $input;
    $json['post'] = ($_POST);
    $json['files'] = $_FILES;
    $json['post']['pricing'] = json_decode($json['post']['pricing']);
    if(count($json['files']) > 0){
        $count = count($_FILES['fileToUpload']['name']);
    }
    else{
        $count = 0;
    }
    $name = $json['post']['name'];
    $type = "hotel";
    $address = $json['post']['address'];
    $description = $json['post']['description'];
    $phone = NULL;
    $email = NULL;
    $website = NULL;
    $facebook = NULL;
    $twitter = NULL;
    $instagram = NULL;
    if($json['post']['phone'] != "")
    $phone = $json['post']['phone'];
    if($json['post']['email'] != "")
    $email = $json['post']['email'];
    if($json['post']['website'] != "")
    $website = $json['post']['website'];
    if($json['post']['facebook'] != "")
    $facebook = $json['post']['facebook'];
    if($json['post']['twitter'] != "")
    $twitter = $json['post']['twitter'];
    if($json['post']['instagram'] != "")
    $instagram = $json['post']['instagram'];
    $latitude = $json['post']['latitude'];
    $longitude = $json['post']['longitude'];
    $user = $json['post']['user'];
    $city = $json['post']['city'];
    $privileges = explode(",",$json['post']['privilege']);
    $pricing = $json['post']['pricing'];

    $stmt = $conn->prepare("INSERT INTO item (name, type, adresse, description, phone, email, website, facebook, twitter, instagram, latitude, longitude, id_utilisateur, id_ville)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssssddii", $name, $type, $address, $description, $phone, $email, $website, $facebook, $twitter, $instagram, $latitude, $longitude, $user, $city);
    $stmt->execute();
    if ($conn->affected_rows > 0){
        $last_id = $conn->insert_id;
        $stmt->close();
        $privilege = array_values($privileges);
        for($i = 0; $i<count($privileges); $i++){
            $sql1 = "INSERT INTO item_privilege (id_item, id_privilege)
            VALUES ($last_id,$privilege[$i])";
            $result = $conn->query($sql1);
        }
        $checkMainImage = 0;
        for ($i = 0; $i < $count; $i++) {
            $newfilename = uploadImage($_FILES['fileToUpload'], "../../assets/images/hotels/", $i);
            $description = "comment " . $last_id . " - photo " . $newfilename;
            if($checkMainImage == 0){
                $stmt2 = $conn->prepare("INSERT INTO photo_item (url, description, main, id_item) VALUES (?, ?, 1, ?)");
            }
            else{
                $stmt2 = $conn->prepare("INSERT INTO photo_item (url, description, main, id_item) VALUES (?, ?, 0, ?)");
            }
            $stmt2->bind_param("ssi", $newfilename, $description, $last_id);
            $stmt2->execute();
            if ($conn->affected_rows > 0) {
                uploadImage($_FILES['fileToUpload'], "../../assets/images/hotels/", $i);
            }
            $checkMainImage++;
            $stmt2->close();
        }
        if($pricing[0] != NULL){
            for($i = 0; $i<count($pricing); $i++){
                $x = array_values((array)$pricing[$i]);
                $sql5 = "INSERT INTO chambre_type (name) VALUES ('$x[0]')";
                $result = $conn->query($sql5);
                if ($result) {
                    $last_id2 = $conn->insert_id;
                }
                $sql6 = "INSERT INTO chambre_hotel (price, id_item, id_chambre_type)
                            VALUES ($x[1], $last_id, $last_id2)";
                $result = $conn->query($sql6);
            }
        }
        echo "Inserted";
    }
    else{
        echo "Error";
    }
    $conn->close();
?>
