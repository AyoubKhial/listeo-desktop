<?php
    include "./connection.php";
    $articleId = json_decode(file_get_contents("php://input"));
    $sql = "SELECT a.id, a.titre, a.texte, a.photo, a.inserted, CONCAT(u.first_name, ' ', u.last_name) AS user_name, u.photo AS user_photo, u.email, u.activities
            FROM article a INNER JOIN utilisateur u ON a.id_utilisateur = u.id
            WHERE a.id = $articleId";
    $qry = $conn->query($sql);
    if($qry->num_rows > 0){
        $data = array();
        while($row = $qry->fetch_assoc()){
            $sql2 = "SELECT COUNT(*) AS number_comments
                    FROM commentaire_article
                    WHERE id_article = $articleId";
            $result2 = $conn->query($sql2);
            $data2= $result2->fetch_row();
            $row['number_comments'] = $data2[0];

            $sql3 = "SELECT t.name AS tag_name
                    FROM article_tag a INNER JOIN tag t ON a.id_tag = t.id
                    WHERE id_article = $articleId
                    ORDER BY a.inserted";
            $result3 = $conn->query($sql3);
            if ($result3->num_rows > 0) {
        		$data3 = array();
        		while($row3 = $result3->fetch_assoc()) {
        			$data3 [] = $row3["tag_name"];
        		}
        		$row['tags'] = $data3;
            }
            $sql4 = "SELECT id, titre FROM article WHERE id > $articleId ORDER BY id ASC LIMIT 1";
            $result4 = $conn->query($sql4);
            $data4= $result4->fetch_row();
            $row['next_id'] = $data4[0];
            $row['next_name'] = $data4[1];
            $sql5 = "SELECT id, titre FROM article WHERE id < $articleId ORDER BY id DESC LIMIT 1";
            $result5 = $conn->query($sql5);
            $data5= $result5->fetch_row();
            $row['previous_id'] = $data5[0];
            $row['previous_name'] = $data5[1];
            $sql6 = "SELECT a.id_article, ar.titre, ar.texte, ar.photo, ar.inserted, COUNT(*) as 'number',
                            (SELECT name FROM tag t WHERE t.id = a.id_tag ORDER BY t.inserted LIMIT 1) AS tag
                    FROM article_tag a INNER JOIN article ar ON a.id_article = ar.id
                    WHERE id_tag IN(SELECT id_tag FROM article_tag b WHERE b.id_article = $articleId AND b.id_article != a.id_article )
                    GROUP BY id_article
                    ORDER BY number DESC LIMIT 2";
            $result6 = $conn->query($sql6);
            $x = 0;
            if ($result6->num_rows > 0) {
                $data7 = array();
                while($row6 = $result6->fetch_assoc()) {
                    $data6 = array();
                    $data6 [] = $row6["id_article"];
                    $data6 [] = $row6["titre"];
                    $data6 [] = $row6["photo"];
                    $data6 [] = $row6["inserted"];
                    $data6 [] = $row6["tag"];
                    $data6 [] = $row6["texte"];
                   // $relatedArticleId = $row6["id_article"];

                    /*$sql7 = "SELECT t.name AS tag_name
                    FROM article_tag a INNER JOIN tag t ON a.id_tag = t.id
                    WHERE id_article = $row6[id_article]
                    ORDER BY a.inserted";
                    $result7 = $conn->query($sql7);
                    if ($result7->num_rows > 0) {
                        $data8 = array();
                        while($row7 = $result7->fetch_assoc()) {
                            $data8 [] = $row7["tag_name"];
                        }
                        $data6 [] = $data8;
                    }*/
                    $data7[$x] = $data6;
                    $x++;
                }
                $row['related_posts'] = $data7;
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
