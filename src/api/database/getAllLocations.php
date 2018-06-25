<?php
    include "./connection.php";
    $sql = "SELECT i.id, name, adresse, rating, pi.url, latitude, longitude, type FROM item i INNER JOIN photo_item pi ON i.id = pi.id_item WHERE pi.main = 1";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $data = array() ;
        while($row = $result->fetch_assoc()) {
            $sql2 = "SELECT COUNT(*) AS number_reviews FROM commentaire_item WHERE rating IS NOT NULL AND id_item = $row[id]";
            $result2 = $conn->query($sql2);
            $data2 = $result2->fetch_row();
            $row['number_reviews'] = $data2[0];
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo "Not found";
    }
    $conn->close();
?>