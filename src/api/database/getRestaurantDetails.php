<?php
    include "./connection.php";
    $data = json_decode(file_get_contents("php://input"));
    $restaurantId = $data->restaurant;
    $userId = $data->user;
    $sql = "SELECT i.id, i.name, i.type, i.adresse, i.rating, i.longitude, i.latitude, i.description, c.name AS category_name, v.name AS ville_name
            FROM ville v INNER JOIN item i ON v.id = i.id_ville INNER JOIN categorie_restaurant c ON c.id = i.id_categorie_restaurant
            WHERE i.type = 'restaurant' AND i.active = 1 AND i.id = $restaurantId";
    $qry = $conn->query($sql);
    if($qry->num_rows > 0){
        $data = array();
        while($row = $qry->fetch_assoc()){
            $sql2 = "SELECT url FROM photo_item pt INNER JOIN item i ON pt.id_item = i.id WHERE i.type = 'restaurant' AND i.active = 1 AND i.id = $restaurantId";
            $result2 = $conn->query($sql2);
            if ($result2->num_rows > 0) {
        		$data2 = array();
        		while($row2 = $result2->fetch_assoc()) {
        			$data2[] = $row2["url"];
        		}
        		$row['photos'] = $data2;
            }
            $sql3 = "SELECT COUNT(*) AS number_reviews FROM commentaire_item WHERE rating IS NOT NULL AND id_item = $restaurantId";
            $result3 = $conn->query($sql3);
            $data3= $result3->fetch_row();
            $row['number_reviews'] = $data3[0];
            $sql4 = "SELECT p.name AS privilege
                    FROM item i INNER JOIN item_privilege ip ON i.id = ip.id_item INNER JOIN privilege p ON ip.id_privilege = p.id
                    WHERE i.type = 'restaurant' AND i.active = 1 AND i.id = $restaurantId";
            $result4 = $conn->query($sql4);
            if ($result4->num_rows > 0) {
        		$data4 = array();
        		while($row4 = $result4->fetch_assoc()) {
        			$data4[] = $row4["privilege"];
        		}
        		$row['privileges'] = $data4;
            }
            $x = 0;
            $y = 0;
            $sql5 = "SELECT DISTINCT(cp.id), cp.name AS category_plat
                    FROM plat_restaurant pr INNER JOIN categorie_plat cp ON cp.id = pr.id_category_plat
                    WHERE pr.id_item = $restaurantId";
            $result5 = $conn->query($sql5);
            if ($result5->num_rows > 0) {
                $data8 = array();
                $data9 = array();
        		while($row5 = $result5->fetch_assoc()) {
                    $data8["name"] = $row5["category_plat"];
                    $categoryPlatId = $row5["id"];
                    $categoryPlatName = $row5["category_plat"];
                    $sql6 = "SELECT pr.name as plat_restaurant, pr.price
                            FROM plat_restaurant pr INNER JOIN categorie_plat cp ON cp.id = pr.id_category_plat
                            WHERE pr.id_item = $restaurantId AND cp.id = $categoryPlatId";
                    $result6 = $conn->query($sql6);
                    if ($result6->num_rows > 0) {
                        $data6 = array();
                        $data7 = array();
                        while($row6 = $result6->fetch_assoc()) {
                            $data6[] = $row6["plat_restaurant"];
                            $data7[] = $row6["price"];
                        }
                        $data8["plats"] = $data6;
                        $data8["prices"] = $data7;
                    }
                    $data9[$x] = $data8;
                    $x=$x+1;
                }
                $row['categories'] = $data9;
            }
            $sql10 = "SELECT COUNT(*) AS number_reviews FROM commentaire_item WHERE texte IS NOT NULL AND id_item = $restaurantId";
            $result10 = $conn->query($sql10);
            $data10= $result10->fetch_row();
            $row['number_comments'] = $data10[0];
            $z = 0;
            $n = 0;
            $sql11 = "SELECT ci.id, ci.texte, CONCAT(u.first_name, ' ', u.last_name) AS utilisateur, ci.inserted, u.photo, ci.rating
                    FROM utilisateur u INNER JOIN commentaire_item ci ON u.id = ci.id_utilisateur
                    WHERE ci.id_item = $restaurantId AND ci.texte IS NOT NULL
                    ORDER BY ci.inserted DESC";
            $result11 = $conn->query($sql11);
            if ($result11->num_rows > 0) {
                $data12 = array();
        		while($row11 = $result11->fetch_assoc()) {
                    $data11 = array();
                    $data11[] = $row11["texte"];
                    $data11[] = $row11["utilisateur"];
                    $data11[] = $row11["inserted"];
                    $data11[] = $row11["photo"];
                    $data11[] = $row11["rating"];
                    $commentId = $row11["id"];
                    $sql12 = "SELECT cip.url
                                FROM commentaire_item ci INNER JOIN commentaire_item_photo cip ON ci.id = cip.id_commentaire_item
                                WHERE ci.id = $commentId";
                    $result12 = $conn->query($sql12);
                    $data13 = array();
        		    while($row12 = $result12->fetch_assoc()) {
                        $data13[] = $row12["url"];
                    }
                    $data11[] = $data13;

                    $data12[$z] = $data11;
                    $z++;
        		}
        		$row['comments'] = $data12;
            }
            $f = 0;
            $sql13 = "SELECT day, opening_hours, closing_hours, closed FROM horaire h WHERE h.id_item = $restaurantId";
            $result13 = $conn->query($sql13);
            if ($result13->num_rows > 0) {
                $data15 = array();
                while($row13 = $result13->fetch_assoc()) {
                    $data14 = array();
                    $data14[] = $row13["day"];
                    $data14[] = $row13["opening_hours"];
                    $data14[] = $row13["closing_hours"];
                    $data14[] = $row13["closed"];
                    $data15[$f] = $data14;
                    $f = $f + 1;
                }
                $row['horaire'] = $data15;
            }
            $sql14 = "SELECT id FROM horaire WHERE id_item = $restaurantId AND day = DAYNAME(CURDATE()) AND CURRENT_TIME BETWEEN opening_hours AND closing_hours";
            $result14 = $conn->query($sql14);
            if ($result14->num_rows > 0) {
        		$row['open'] = true;
            }
            else{
                $row['open'] = false;
            }
            $sql15 = "SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) AS name, u.phone, u.email, photo, provider, u.facebook, u.instagram
                        FROM utilisateur u INNER JOIN item i ON u.id = i.id_utilisateur
                        Where i.id = $restaurantId";
            $result15 = $conn->query($sql15);
            if ($result15->num_rows > 0) {
        		$data16 = array();
        		while($row15 = $result15->fetch_assoc()) {
                    $data16[] = $row15;
        		}
        		$row['user'] = $data16;
            }
            if($userId != null){
                $sql16 = "SELECT * FROM favoris WHERE id_item = $restaurantId AND id_utilisateur = $userId";
                $result16 = $conn->query($sql16);
                if ($result16->num_rows > 0) {
                    $row['liked'] = true;
                }
                else{
                    $row['liked'] = false;
                }
            }
            if($userId != null){
                $sql17 = "SELECT * FROM commentaire_item WHERE id_item = $restaurantId AND id_utilisateur = $userId AND rating IS NOT NULL";
                $result17 = $conn->query($sql17);
                if ($result17->num_rows > 0) {
                    $row['rated'] = true;
                }
                else{
                    $row['rated'] = false;
                }
            }
            $data[] = $row;
        }
        echo json_encode($data);
    }
    else{
        echo "Not found";
    }
    $conn->close();
?>
