<?php
    include "./connection.php";
    $userId = json_decode(file_get_contents("php://input"));
    $sql = "SELECT i.id, i.name, i.type, i.adresse, i.rating, v.name AS ville_name FROM item i INNER JOIN ville v ON i.id_ville = v.id WHERE i.active = 1 ORDER BY i.inserted DESC LIMIT 6";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $data = array() ;
        while($row = $result->fetch_assoc()) {
            if($row["type"] == "restaurant"){
                $sql2 = "SELECT id FROM horaire WHERE id_item = $row[id] AND day = DAYNAME(CURDATE()) AND CURRENT_TIME BETWEEN opening_hours AND closing_hours";
                $result2 = $conn->query($sql2);
                if ($result2->num_rows > 0) {
                    $data2 = array();
                    $row['open'] = true;
                }
                else{
                    $row['open'] = false;
                }
            }
            $sql3 = "SELECT url FROM photo_item WHERE main = 1 AND id_item = $row[id]";
            $result3 = $conn->query($sql3);
            if ($result3->num_rows > 0) {
                $photo = $result3->fetch_object()->url;
                $row['photo'] = $photo;
            }
            else{
                $row['photo'] = null;
            }
            if($userId != null){
                $sql4 = "SELECT * FROM favoris WHERE id_item = $row[id] AND id_utilisateur = $userId";
                $result4 = $conn->query($sql4);
                if ($result4->num_rows > 0) {
                    $row['liked'] = true;
                }
                else{
                    $row['liked'] = false;
                }
            }
            $sql5 = "SELECT COUNT(*) AS number_reviews FROM commentaire_item WHERE rating IS NOT NULL AND id_item = $row[id]";
            $result5 = $conn->query($sql5);
            $data5= $result5->fetch_row();
            $row['number_reviews'] = $data5[0];
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo "Not found";
    }
    $conn->close();
?>