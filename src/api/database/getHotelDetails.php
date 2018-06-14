<?php
    include "./connection.php";
    $data = json_decode(file_get_contents("php://input"));
    $hotelId = $data->hotel;
    $userId = $data->user;
    $sql = "SELECT i.id, i.name, i.type, i.adresse, i.rating, i.longitude, i.latitude, i.description, v.name AS ville_name
            FROM ville v INNER JOIN item i ON v.id = i.id_ville
            WHERE i.type = 'hotel' AND i.active = 1 AND i.id = $hotelId";
    $qry = $conn->query($sql);
    if($qry->num_rows > 0){
        $data = array();
        while($row = $qry->fetch_assoc()){
            $sql2 = "SELECT pt.url FROM photo_item pt WHERE pt.id_item = $hotelId";
            $result2 = $conn->query($sql2);
            if ($result2->num_rows > 0) {
        		$data2 = array();
        		while($row2 = $result2->fetch_assoc()) {
        			$data2[] = $row2["url"];
        		}
        		$row['photos'] = $data2;
            }
            $sql3 = "SELECT COUNT(*) AS number_reviews FROM commentaire_item WHERE rating IS NOT NULL AND id_item = $hotelId";
            $result3 = $conn->query($sql3);
            $data3= $result3->fetch_row();
            $row['number_reviews'] = $data3[0];
            $sql4 = "SELECT p.name AS privilege
                    FROM item_privilege ip INNER JOIN privilege p ON ip.id_privilege = p.id
                    WHERE ip.id_item = $hotelId";
            $result4 = $conn->query($sql4);
            if ($result4->num_rows > 0) {
        		$data4 = array();
        		while($row4 = $result4->fetch_assoc()) {
        			$data4[] = $row4["privilege"];
        		}
        		$row['privileges'] = $data4;
            }
            $x = 0;
            $sql5 = "SELECT DISTINCT(ct.id), ct.name AS type_chambre
                    FROM chambre_hotel ch INNER JOIN chambre_type ct ON ch.id_chambre_type = ct.id
                    WHERE ch.id_item = $hotelId";
            $result5 = $conn->query($sql5);
            if ($result5->num_rows > 0) {
                $data5 = array();
                $data6 = array();
        		while($row5 = $result5->fetch_assoc()) {
                    $data5["name"] = $row5["type_chambre"];
                    $sql6 = "SELECT ch.price
                            FROM chambre_type ct INNER JOIN chambre_hotel ch ON ct.id = ch.id_chambre_type
                            WHERE ch.id_item = $hotelId AND ct.id = $row5[id]";
                    $result6 = $conn->query($sql6);
                    if ($result6->num_rows > 0) {
                        while($row6 = $result6->fetch_assoc()) {
                            $data5["price"] = $row6["price"];
                        }
                    }
                    $data6[$x] = $data5;
                    $x++;
                }
                $row['chambres'] = $data6;
            }
            $sql7 = "SELECT COUNT(*) AS number_reviews FROM commentaire_item WHERE texte IS NOT NULL AND id_item = $hotelId";
            $result7 = $conn->query($sql7);
            $data7= $result7->fetch_row();
            $row['number_comments'] = $data7[0];
            $y = 0;
            $sql8 = "SELECT ci.id, ci.texte, CONCAT(u.first_name, ' ', u.last_name) AS utilisateur, ci.inserted, u.photo, ci.rating
                    FROM utilisateur u INNER JOIN commentaire_item ci ON u.id = ci.id_utilisateur
                    WHERE ci.id_item = $hotelId AND ci.texte IS NOT NULL
                    ORDER BY ci.inserted DESC";
            $result8 = $conn->query($sql8);
            if ($result8->num_rows > 0) {
                $data8 = array();
        		while($row8 = $result8->fetch_assoc()) {
                    $data9 = array();
                    $data9[] = $row8["texte"];
                    $data9[] = $row8["utilisateur"];
                    $data9[] = $row8["inserted"];
                    $data9[] = $row8["photo"];
                    $data9[] = $row8["rating"];
                    $sql9 = "SELECT cip.url
                                FROM commentaire_item ci INNER JOIN commentaire_item_photo cip ON ci.id = cip.id_commentaire_item
                                WHERE ci.id = $row8[id]";
                    $result9 = $conn->query($sql9);
                    $data10 = array();
        		    while($row9 = $result9->fetch_assoc()) {
                        $data10[] = $row9["url"];
                    }
                    $data9[] = $data10;

                    $data8[$y] = $data9;
                    $y++;
        		}
        		$row['comments'] = $data8;
            }
            $sql9 = "SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) AS name, u.phone, u.email, photo, provider, u.facebook, u.instagram
                        FROM utilisateur u INNER JOIN item i ON u.id = i.id_utilisateur
                        Where i.id = $hotelId";
            $result9 = $conn->query($sql9);
            if ($result9->num_rows > 0) {
        		$data11 = array();
        		while($row9 = $result9->fetch_assoc()) {
                    $data11[] = $row9;
        		}
        		$row['user'] = $data11;
            }
            if($userId != null){
                $sql10 = "SELECT * FROM favoris WHERE id_item = $hotelId AND id_utilisateur = $userId";
                $result10 = $conn->query($sql10);
                if ($result10->num_rows > 0) {
                    $row['liked'] = true;
                }
                else{
                    $row['liked'] = false;
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
