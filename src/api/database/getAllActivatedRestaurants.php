<?php
    include "./connection.php";
    $sql = "SELECT i.id, i.name, i.type, i.adresse, i.rating, c.name AS category_name, v.name AS ville_name, u.email AS user_name, i.inserted, i.updated
            FROM ville v INNER JOIN utilisateur u ON v.id = u.id_ville INNER JOIN item i ON u.id = i.id_utilisateur INNER JOIN categorie_restaurant c ON c.id = i.id_categorie_restaurant
            WHERE i.type = 'restaurant' AND i.active = 1
            ORDER BY i.inserted DESC";
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
            $sql4 = "SELECT COUNT(*) AS number_reviews FROM commentaire_item WHERE rating IS NOT NULL AND id_item = $restaurant_id";
            $result4 = $conn->query($sql4);
            $data4= $result4->fetch_row();
            $row['number_reviews'] = $data4[0];
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo "Not found";
    }
    $conn->close();
?>