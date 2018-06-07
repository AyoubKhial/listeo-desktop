<?php
    include "./connection.php";
    $sql = "SELECT a.id, a.titre, a.photo, a.inserted, COUNT(*) AS comments_count
            FROM article a LEFT JOIN commentaire_article ca ON a.id = ca.id_article
            GROUP BY a.id, a.titre, a.photo, a.inserted
            ORDER BY comments_count DESC
            LIMIT 3";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $data = array() ;
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo "Not found";
    }
    $conn->close();
?>