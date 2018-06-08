<?php
    include "./connection.php";
    $data = json_decode(file_get_contents("php://input"));
    $idArray=array();
    for($i = 1; $i<count($data); $i++){
        array_push($idArray, $data[$i]->id);
    }
    $array = implode("','",$idArray);
    $ids = "'".$array."'";
    $b = false;

    if($data[0] == "Highest Price"){
        $sql = "SELECT DISTINCT(i.id),i.name,type,adresse,i.rating,active, v.name AS ville_name, (SELECT MAX(price) FROM chambre_hotel ch2 WHERE ch.id_item = ch2.id_item) AS chambre_max_price
                FROM ville v LEFT JOIN item i ON v.id = i.id_ville LEFT JOIN chambre_hotel ch on i.id = ch.id_item
                WHERE i.active = 1 AND i.type = 'hotel' AND i.id IN($ids)
                ORDER BY chambre_max_price DESC";
    }
    elseif($data[0] == "Lowest Price"){
        $sql = "SELECT DISTINCT(i.id),i.name,type,adresse,i.rating,active, v.name AS ville_name, (SELECT MIN(price) FROM chambre_hotel ch2 WHERE ch.id_item = ch2.id_item) AS chambre_min_price
                FROM ville v LEFT JOIN item i ON v.id = i.id_ville LEFT JOIN chambre_hotel ch on i.id = ch.id_item
                WHERE i.active = 1 AND i.type = 'hotel' AND i.id IN($ids)
                ORDER BY chambre_min_price";
    }
    elseif($data[0] == "Highest Rated"){
        $sql = "SELECT i.id,i.name,type,adresse,i.rating,active, v.name AS ville_name
                FROM ville v INNER JOIN item i ON v.id = i.id_ville
                WHERE i.active = 1 AND i.type = 'hotel' AND i.id IN($ids)
                ORDER BY i.rating DESC";
    }
    
    elseif($data[0] == "Most Reviewed"){
        $b = true;
        $sql = "SELECT i.id,i.name,type,adresse,i.rating,active, v.name AS ville_name, (SELECT COUNT(*) from commentaire_item ci2 where ci2.id_item = i.id AND rating is not null) AS number_reviews
                FROM ville v LEFT JOIN item i ON v.id = i.id_ville LEFT JOIN commentaire_item ci ON i.id = ci.id_item
                WHERE i.active = 1 AND i.type = 'hotel' AND i.id IN($ids)
                GROUP BY i.id
                ORDER BY number_reviews DESC";
    }
    elseif($data[0] == "Newest Listings"){
        $sql = "SELECT i.id, i.name, i.type, i.adresse, i.rating, v.name AS ville_name, i.updated
                FROM ville v INNER JOIN item i ON v.id = i.id_ville
                WHERE i.type = 'hotel' AND i.active = 1 AND i.id IN($ids)
                ORDER BY i.inserted DESC";
    }
    elseif($data[0] == "Oldest Listings"){
        $sql = "SELECT i.id, i.name, i.type, i.adresse, i.rating, v.name AS ville_name, i.updated
                FROM ville v INNER JOIN item i ON v.id = i.id_ville
                WHERE i.type = 'hotel' AND i.active = 1 AND i.id IN($ids)
                ORDER BY i.inserted ";
    }
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $data = array() ;
        while($row = $result->fetch_assoc()) {
            $hotel_id = $row["id"];
            $sql3 = "SELECT url FROM photo_item WHERE main = 1 AND id_item = $hotel_id";
            $result3 = $conn->query($sql3);
            if ($result3->num_rows > 0) {
                $photo = $result3->fetch_object()->url;
                $row['photo'] = $photo;
            }
            else{
                $row['photo'] = "null";
            }
            if(!$b){
                $sql4 = "SELECT COUNT(*) AS number_reviews FROM commentaire_item WHERE rating IS NOT NULL AND id_item = $hotel_id";
                $result4 = $conn->query($sql4);
                $data4= $result4->fetch_row();
                $row['number_reviews'] = $data4[0];
            }
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo "Not found";
    }
    $conn->close();
?>
