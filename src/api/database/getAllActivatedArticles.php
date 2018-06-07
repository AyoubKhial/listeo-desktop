<?php
    include "./connection.php";
    $sql = "SELECT id, titre, texte, photo, inserted FROM article WHERE active = 1 ORDER BY inserted DESC";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $data = array() ;
        while($row = $result->fetch_assoc()) {
            $article_id = $row["id"];
        	$sql2 = "SELECT t.name AS tag_name FROM article_tag a INNER JOIN tag t ON a.id_tag = t.id WHERE id_article = $article_id ORDER BY a.inserted";
            $result2 = $conn->query($sql2);
            if ($result2->num_rows > 0) {
        		$data2 = array();
        		while($row2 = $result2->fetch_assoc()) {
        			$data2 [] = $row2["tag_name"];
        		}
        		$row['tags'] = $data2;
            }
            $sql3 = "SELECT COUNT(*) AS nombre_comments FROM commentaire_article ca INNER JOIN article a ON ca.id_article = a.id WHERE a.id = $article_id";
            $result3 = $conn->query($sql3);
            $data3= $result3->fetch_row();
            $row['nombre_comments'] = $data3[0];
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo "Not found";
    }
    $conn->close();
?>
