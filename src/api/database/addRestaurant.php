<?php
    include "./connection.php";
    include "../file_upload/upload.php";
    $json = array();
    $data = file_get_contents("php://input");
    $input = json_decode($data);
    $json['input'] = $input;
    $json['post'] = ($_POST);
    $json['files'] = $_FILES;
    $json['post']['horaire'] = json_decode($json['post']['horaire']);
    $json['post']['pricing'] = json_decode($json['post']['pricing']);
    if(count($json['files']) > 0){
        $count = count($_FILES['fileToUpload']['name']);
    }
    else{
        $count = 0;
    }
    $name = $json['post']['name'];
    $type = "restaurant";
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
    $instagram = $json['post']['instagram'];
    $user = $json['post']['user'];
    $category = $json['post']['category'];
    $city = $json['post']['city'];
    $privileges = explode(",",$json['post']['privilege']);
    $horaire = $json['post']['horaire'];
    $pricing = $json['post']['pricing'];

    $stmt = $conn->prepare("INSERT INTO item (name, type, adresse, description, phone, email, website, facebook, twitter, instagram, latitude, longitude, id_utilisateur, id_categorie_restaurant, id_ville)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssssddiii", $name, $type, $address, $description, $phone, $email, $website, $facebook, $twitter, $instagram, $latitude, $longitude, $user, $category, $city);
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
            $newfilename = uploadImage($_FILES['fileToUpload'], "../../assets/images/restaurants/", $i);
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
                uploadImage($_FILES['fileToUpload'], "../../assets/images/restaurants/", $i);
            }
            $checkMainImage++;
            $stmt2->close();
        }
        for($i = 0; $i<count((array)$horaire); $i++){
            if($i == 0){
                $opening = $horaire->monday->opening;
                $closing = $horaire->monday->closing;
                if($opening != "Closed" && $closing != "Closed"){
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item)
                    VALUES ('monday','$opening', '$closing',$last_id);";
                    $result = $conn->query($sql4);
                }
                else{
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item, closed)
                    VALUES ('monday',NULL, NULL,$last_id, 1);";
                    $result = $conn->query($sql4);
                }
            }
            if($i == 1){
                $opening = $horaire->tuesday->opening;
                $closing = $horaire->tuesday->closing;
                if($opening != "Closed" && $closing != "Closed"){
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item)
                    VALUES ('tuesday','$opening', '$closing',$last_id);";
                    $result = $conn->query($sql4);
                }
                else{
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item, closed)
                    VALUES ('monday',NULL, NULL,$last_id, 1);";
                    $result = $conn->query($sql4);
                }
            }
            if($i == 2){
                $opening = $horaire->wednesday->opening;
                $closing = $horaire->wednesday->closing;
                if($opening != "Closed" && $closing != "Closed"){
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item)
                    VALUES ('wednesday','$opening', '$closing',$last_id);";
                    $result = $conn->query($sql4);
                }
                else{
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item, closed)
                    VALUES ('monday',NULL, NULL,$last_id, 1);";
                    $result = $conn->query($sql4);
                }
            }
            if($i == 3){
                $opening = $horaire->thursday->opening;
                $closing = $horaire->thursday->closing;
                if($opening != "Closed" && $closing != "Closed"){
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item)
                    VALUES ('thursday','$opening', '$closing',$last_id);";
                    $result = $conn->query($sql4);
                }
                else{
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item, closed)
                    VALUES ('monday',NULL, NULL,$last_id, 1);";
                    $result = $conn->query($sql4);
                }
            }
            if($i == 4){
                $opening = $horaire->friday->opening;
                $closing = $horaire->friday->closing;
                if($opening != "Closed" && $closing != "Closed"){
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item)
                    VALUES ('friday','$opening', '$closing',$last_id);";
                    $result = $conn->query($sql4);
                }
                else{
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item, closed)
                    VALUES ('monday',NULL, NULL,$last_id, 1);";
                    $result = $conn->query($sql4);
                }
            }

            if($i == 5){
                $opening = $horaire->saturday->opening;
                $closing = $horaire->saturday->closing;
                if($opening != "Closed" && $closing != "Closed"){
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item)
                    VALUES ('saturday','$opening', '$closing',$last_id);";
                    $result = $conn->query($sql4);
                }
                else{
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item, closed)
                    VALUES ('monday',NULL, NULL,$last_id, 1);";
                    $result = $conn->query($sql4);
                }
            }
            if($i == 6){
                $opening = $horaire->sunday->opening;
                $closing = $horaire->sunday->closing;
                if($opening != "Closed" && $closing != "Closed"){
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item)
                    VALUES ('sunday','$opening', '$closing',$last_id);";
                    $result = $conn->query($sql4);
                }
                else{
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item, closed)
                    VALUES ('monday',NULL, NULL,$last_id, 1);";
                    $result = $conn->query($sql4);
                }
            }
            $sql4 = null;
        }
        for($i = 0; $i<count($pricing); $i++){
            $x = array_values((array)$pricing[$i]);
            $sql5 = "INSERT INTO categorie_plat (name)
            VALUES ('$x[0]');";
            $result = $conn->query($sql5);
            if ($result) {
                $last_id2 = $conn->insert_id;
                echo $sql5;
            }
            for($j = 0;$j<count($x[1]);$j++){
                $y =  array_values((array)$x[1][$j]);
                $sql6 = "INSERT INTO plat_restaurant (name, price, id_category_plat, id_item)
                VALUES ('$y[0]', $y[1], $last_id2, $last_id);";
                $result = $conn->query($sql6);
            }
        }
        echo "Inserted";
    }
    else{
        echo "Error";
    }
    /*$sql = "INSERT INTO item (name, type, adresse, description, phone, email, website, facebook, twitter, instagram, latitude, longitude, id_utilisateur, id_categorie_restaurant, id_ville)
    VALUES ('$data->name','restaurant','$data->address','$data->description','$data->phone','$data->email','$data->website','$data->facebook','$data->twitter','$data->instagram','$data->latitude','$data->longitude',1,'$data->category','$data->city')";
    $result = $conn->query($sql);
    if ($result) {
        $last_id = $conn->insert_id;
        echo $sql;
        $privilege = array_values($data->privilege);
        for($i = 0;$i<count($data->privilege);$i++){
            $sql2 = "INSERT INTO item_privilege (id_item, id_privilege)
            VALUES ($last_id,$privilege[$i]);";
            $result = $conn->query($sql2);
            if ($result) {
                echo $sql2;
            }
        }
        $checkMainImage = 0;
        for($i = 0;$i<count((((array)$data->images->images)));$i++){
            $imageUrl = $data->images->images[$i];
            if($checkMainImage == 0){
                $sql3 = "INSERT INTO photo_item (url, description, main, id_item)
                VALUES ('$imageUrl','item $last_id photo', 1,$last_id);";
            }
            else{
                $sql3 = "INSERT INTO photo_item (url, description, main, id_item)
                VALUES ('$imageUrl','item $last_id photo', 0, $last_id);";
            }
            $result = $conn->query($sql3);
            if ($result) {
                echo $sql3;
            } 
            $checkMainImage++;
        }

        for($i = 0;$i<count((((array)$data->horaire)));$i++){
            if($i == 0){
                $opening = $data->horaire->monday->opening;
                $closing = $data->horaire->monday->closing;
                if($opening != "Closed" && $closing != "Closed"){
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item)
                    VALUES ('monday','$opening', '$closing',$last_id);";
                    $result = $conn->query($sql4);
                }
            }
            if($i == 1){
                $opening = $data->horaire->tuesday->opening;
                $closing = $data->horaire->tuesday->closing;
                if($opening != "Closed" && $closing != "Closed"){
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item)
                    VALUES ('tuesday','$opening', '$closing',$last_id);";
                    $result = $conn->query($sql4);
                }
            }
            if($i == 2){
                $opening = $data->horaire->wednesday->opening;
                $closing = $data->horaire->wednesday->closing;
                if($opening != "Closed" && $closing != "Closed"){
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item)
                    VALUES ('wednesday','$opening', '$closing',$last_id);";
                    $result = $conn->query($sql4);
                }
            }
            if($i == 3){
                $opening = $data->horaire->thursday->opening;
                $closing = $data->horaire->thursday->closing;
                if($opening != "Closed" && $closing != "Closed"){
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item)
                    VALUES ('thursday','$opening', '$closing',$last_id);";
                    $result = $conn->query($sql4);
                }
            }
            if($i == 4){
                $opening = $data->horaire->friday->opening;
                $closing = $data->horaire->friday->closing;
                if($opening != "Closed" && $closing != "Closed"){
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item)
                    VALUES ('friday','$opening', '$closing',$last_id);";
                    $result = $conn->query($sql4);
                }
            }
            if($i == 5){
                $opening = $data->horaire->saturday->opening;
                $closing = $data->horaire->saturday->closing;
                if($opening != "Closed" && $closing != "Closed"){
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item)
                    VALUES ('saturday','$opening', '$closing',$last_id);";
                    $result = $conn->query($sql4);
                }
            }
            if($i == 6){
                $opening = $data->horaire->sunday->opening;
                $closing = $data->horaire->sunday->closing;
                if($opening != "Closed" && $closing != "Closed"){
                    $sql4 = "INSERT INTO horaire (day, opening_hours, closing_hours, id_item)
                    VALUES ('sunday','$opening', '$closing',$last_id);";
                    $result = $conn->query($sql4);
                }
            }
            if ($result) {
                echo $sql4;
            } 
            $sql4 = null;
        }

        for($i = 0;$i<count((((array)$data->pricing)));$i++){
            $x = array_values((array)$data->pricing[$i]);
            $sql5 = "INSERT INTO categorie_plat (name)
            VALUES ('$x[0]');";
            $result = $conn->query($sql5);
            if ($result) {
                $last_id2 = $conn->insert_id;
                echo $sql5;
            }
            for($j = 0;$j<count($x[1]);$j++){
                $y =  array_values((array)$x[1][$j]);
                $sql6 = "INSERT INTO plat_restaurant (name, price, id_category_plat, id_item)
                VALUES ('$y[0]', $y[1], $last_id2, $last_id);";
                $result = $conn->query($sql6);
                if ($result) {
                    echo $sql6;
                }
            }
        }
    } else {
        echo "0";
    }*/
    $conn->close();
?>