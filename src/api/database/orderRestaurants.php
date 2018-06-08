<?php
    include "./connection.php";
    $data = json_decode(file_get_contents("php://input"));
    $idArray=array();
    for($i = 1; $i<count($data); $i++){
        array_push($idArray, $data[$i]->id);
    }
    $array = implode("','",$idArray);
    $ids = "'".$array."'";
    if($data[0] == "Highest Price"){
        $sql = "SELECT i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name
                FROM ville v, item i, categorie_restaurant cr, plat_restaurant pr
                WHERE i.id_ville = v.id AND i.id_categorie_restaurant = cr.id AND pr.id_item = i.id
                AND i.active = 1 AND i.type = 'restaurant'
                AND pr.price = (SELECT MIN(price) FROM plat_restaurant pr2 WHERE pr.id_item = pr2.id_item) AND i.id IN($ids)
                ORDER BY pr.price DESC";
    }
    elseif($data[0] == "Lowest Price"){
        $sql = "SELECT i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name
                FROM ville v, item i, categorie_restaurant cr, plat_restaurant pr
                WHERE i.id_ville = v.id AND i.id_categorie_restaurant = cr.id AND pr.id_item = i.id
                AND i.active = 1 AND i.type = 'restaurant'
                AND pr.price = (SELECT MIN(price) FROM plat_restaurant pr2 WHERE pr.id_item = pr2.id_item) AND i.id IN($ids)
                ORDER BY pr.price";
    }
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