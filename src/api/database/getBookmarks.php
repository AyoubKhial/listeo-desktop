<?php
    include "./connection.php";
    $userId = json_decode(file_get_contents("php://input"));
    $stmt = $conn->prepare("SELECT i.id, f.inserted, i.name, i.adresse, i.rating, v.name AS ville
                            FROM favoris f INNER JOIN item i ON f.id_item = i.id INNER JOIN ville v ON i.id_ville = v.id
                            WHERE f.id_utilisateur = ?");
    $stmt->bind_param("i",$userId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $data = array() ;
        while($row = $result->fetch_assoc()) {
            $sql2 = "SELECT COUNT(*) AS number_reviews FROM commentaire_item WHERE rating IS NOT NULL AND id_item = $row[id]";
            $result2 = $conn->query($sql2);
            $data2 = $result2->fetch_row();
            $row['number_reviews'] = $data2[0];
            $sql3 = "SELECT url FROM photo_item WHERE main = 1 AND id_item = $row[id]";
            $result3 = $conn->query($sql3);
            if ($result3->num_rows > 0) {
                $photo = $result3->fetch_object()->url;
                $row['photo'] = $photo;
            }
            else{
                $row['photo'] = "null";
            }
            $data[] = $row;
        }
        echo json_encode($data);
    }
    else {
        echo "Not found";
    }
    $stmt->close();
    $conn->close();
?>
