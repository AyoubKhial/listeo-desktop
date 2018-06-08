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
        $sql = "SELECT i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name
                FROM ville v, item i, categorie_restaurant cr, plat_restaurant pr
                WHERE i.id_ville = v.id AND i.id_categorie_restaurant = cr.id AND pr.id_item = i.id
                AND i.active = 1 AND i.type = 'restaurant'
                AND pr.price = (SELECT MIN(price) FROM plat_restaurant pr2 WHERE pr.id_item = pr2.id_item) AND i.id IN($ids)
                ORDER BY pr.price DESC";
    }
    elseif($data[0] == "Lowest Price"){
        $sql = "SELECT i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name
                FROM ville v, item i, categorie_restaurant cr, plat_restaurant pr
                WHERE i.id_ville = v.id AND i.id_categorie_restaurant = cr.id AND pr.id_item = i.id
                AND i.active = 1 AND i.type = 'restaurant'
                AND pr.price = (SELECT MIN(price) FROM plat_restaurant pr2 WHERE pr.id_item = pr2.id_item) AND i.id IN($ids)
                ORDER BY pr.price";
    }
    elseif($data[0] == "Highest Rated"){
        $sql = "SELECT i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name
                FROM ville v INNER JOIN item i ON v.id = i.id_ville INNER JOIN categorie_restaurant cr ON i.id_categorie_restaurant = cr.id
                WHERE i.active = 1 AND i.type = 'restaurant' AND i.id IN($ids)
                ORDER BY i.rating DESC";
    }
    
    elseif($data[0] == "Most Reviewed"){
        $b = true;
        $sql = "SELECT i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name, (SELECT COUNT(*) from commentaire_item ci2 where ci2.id_item = i.id AND rating is not null) AS number_reviews
                FROM ville v LEFT JOIN item i ON v.id = i.id_ville LEFT JOIN commentaire_item ci ON i.id = ci.id_item LEFT JOIN categorie_restaurant cr ON i.id_categorie_restaurant = cr.id
                WHERE i.active = 1 AND i.type = 'restaurant' AND i.id IN($ids)
                GROUP BY i.id
                ORDER BY number_reviews DESC";
    }
    elseif($data[0] == "Newest Listings"){
        $sql = "SELECT i.id, i.name, i.type, i.adresse, i.rating, c.name AS category_name, v.name AS ville_name, i.updated
                FROM ville v INNER JOIN item i ON v.id = i.id_ville INNER JOIN categorie_restaurant c ON c.id = i.id_categorie_restaurant
                WHERE i.type = 'restaurant' AND i.active = 1 AND i.id IN($ids)
                ORDER BY i.inserted DESC";
    }
    elseif($data[0] == "Oldest Listings"){
        $sql = "SELECT i.id, i.name, i.type, i.adresse, i.rating, c.name AS category_name, v.name AS ville_name, i.updated
                FROM ville v INNER JOIN item i ON v.id = i.id_ville INNER JOIN categorie_restaurant c ON c.id = i.id_categorie_restaurant
                WHERE i.type = 'restaurant' AND i.active = 1 AND i.id IN($ids)
                ORDER BY i.inserted ";
    }
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $data = array() ;
        while($row = $result->fetch_assoc()) {
            $restaurant_id = $row["id"];
            $sql2 = "SELECT id FROM horaire WHERE id_item = $restaurant_id AND day = DAYNAME(CURDATE()) AND CURRENT_TIME BETWEEN opening_hours AND closing_hours";
            $result2 = $conn->query($sql2);
            if ($result2->num_rows > 0) {
        		$data2 = array();
        		$row['open'] = true;
            }
            else{
                $row['open'] = false;
            }
            $sql3 = "SELECT url FROM photo_item WHERE main = 1 AND id_item = $restaurant_id";
            $result3 = $conn->query($sql3);
            if ($result3->num_rows > 0) {
                $photo = $result3->fetch_object()->url;
                $row['photo'] = $photo;
            }
            else{
                $row['photo'] = "null";
            }
            if(!$b){
                $sql4 = "SELECT COUNT(*) AS number_reviews FROM commentaire_item WHERE rating IS NOT NULL AND id_item = $restaurant_id";
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