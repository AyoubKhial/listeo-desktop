<?php
    include "./connection.php";
    $hotelId = json_decode(file_get_contents("php://input"));
    $sql = "SELECT i.name, i.adresse, i.longitude, i.latitude, i.rating, v.name AS ville
            FROM ville v INNER JOIN item i ON v.id = i.id_ville
            WHERE i.id = $hotelId";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $data = array() ;
        while($row = $result->fetch_assoc()) {
            $sql2 = "SELECT COUNT(*) AS number_reviews FROM commentaire_item WHERE rating IS NOT NULL AND id_item = $hotelId";
            $result2 = $conn->query($sql2);
            $data2= $result2->fetch_row();
            $row['number_reviews'] = $data2[0];
            $data[] = $row;
        }
        echo json_encode($data);
    }
    else {
        echo "Not found";
    }
    $conn->close();
?>