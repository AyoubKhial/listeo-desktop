<?php
    include "./connection.php";
    $sql = "SELECT i.id, i.name, i.type, i.adresse, i.rating, v.name AS ville_name, i.updated
            FROM ville v INNER JOIN item i ON v.id = i.id_ville
            WHERE i.type = 'hotel' AND i.active = 1
            ORDER BY i.inserted DESC";
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
            $sql4 = "SELECT COUNT(*) AS number_reviews FROM commentaire_item WHERE rating IS NOT NULL AND id_item = $hotel_id";
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