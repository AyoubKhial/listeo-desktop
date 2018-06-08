<?php
    include "./connection.php";
    $data = json_decode(file_get_contents("php://input"));

    $privilege = "";
    $count = 0;

    if(!empty($data->privileges)){
        $privilege = implode("','",$data->privileges);
        $privilege = "'".$privilege."'";
        $count = count($data->privileges);
    }

    // empty filter
    if($data->city =="" && empty($data->privileges) && $data->open != true && $data->radius == 0) {
        $sql = "SELECT i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name 
        FROM ville v inner join item i on v.id = i.id_ville inner join categorie_restaurant cr on i.id_categorie_restaurant = cr.id
        WHERE i.type = 'restaurant' AND active = 1";
    }

    // check by city, privilege, open, radius
    elseif($data->city !="" && !empty($data->privileges) && $data->open == true && $data->radius != 0) {
        $sql = "SELECT count(*), i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name 
        FROM ville v, item i, categorie_restaurant cr, item_privilege ip, privilege p, horaire h
        WHERE v.id = i.id_ville AND i.id_categorie_restaurant = cr.id AND i.id = ip.id_item AND ip.id_privilege = p.id AND i.id = h.id_item
        AND i.type = 'restaurant'
        AND active = 1
        AND ACOS(SIN(RADIANS(`latitude`))*SIN(RADIANS($data->latitude))+COS(RADIANS(`latitude`))*COS(RADIANS($data->latitude))*COS(RADIANS(`longitude`)-RADIANS($data->longitude)))*6380<$data->radius
        AND v.name = '$data->city'
        AND day = DAYNAME(CURDATE())
        AND CURRENT_TIME BETWEEN opening_hours AND closing_hours
        AND p.id IN($privilege)
        group by(i.id)
        having COUNT(*) = $count";
    }

    // check by privilege, open, radius
    elseif($data->city =="" && !empty($data->privileges) && $data->open == true && $data->radius != 0) {
        $sql = "SELECT count(*), i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name 
        FROM ville v, item i, categorie_restaurant cr, item_privilege ip, privilege p, horaire h
        WHERE v.id = i.id_ville AND i.id_categorie_restaurant = cr.id AND i.id = ip.id_item AND ip.id_privilege = p.id AND i.id = h.id_item
        AND i.type = 'restaurant'
        AND active = 1
        AND ACOS(SIN(RADIANS(`latitude`))*SIN(RADIANS($data->latitude))+COS(RADIANS(`latitude`))*COS(RADIANS($data->latitude))*COS(RADIANS(`longitude`)-RADIANS($data->longitude)))*6380<$data->radius
        AND day = DAYNAME(CURDATE())
        AND CURRENT_TIME BETWEEN opening_hours AND closing_hours
        AND p.id IN($privilege)
        group by(i.id)
        having COUNT(*) = $count";
    }

    // check by city, open, radius
    elseif($data->city !="" && empty($data->privileges) && $data->open == true && $data->radius != 0) {
        $sql = "SELECT i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name 
        FROM ville v, item i, categorie_restaurant cr, horaire h
        WHERE v.id = i.id_ville AND i.id_categorie_restaurant = cr.id  AND i.id = h.id_item
        AND i.type = 'restaurant'
        AND active = 1
        AND ACOS(SIN(RADIANS(`latitude`))*SIN(RADIANS($data->latitude))+COS(RADIANS(`latitude`))*COS(RADIANS($data->latitude))*COS(RADIANS(`longitude`)-RADIANS($data->longitude)))*6380<$data->radius
        AND v.name = '$data->city'
        AND day = DAYNAME(CURDATE())
        AND CURRENT_TIME BETWEEN opening_hours AND closing_hours";
        $result = $conn->query($sql);
    }

    // check by city, privilege, radius
    elseif($data->city !="" && !empty($data->privileges) && $data->open == false && $data->radius != 0) {
        $sql = "SELECT count(*), i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name 
        FROM ville v, item i, categorie_restaurant cr, item_privilege ip, privilege p
        WHERE v.id = i.id_ville AND i.id_categorie_restaurant = cr.id AND i.id = ip.id_item AND ip.id_privilege = p.id
        AND i.type = 'restaurant'
        AND active = 1
        AND ACOS(SIN(RADIANS(`latitude`))*SIN(RADIANS($data->latitude))+COS(RADIANS(`latitude`))*COS(RADIANS($data->latitude))*COS(RADIANS(`longitude`)-RADIANS($data->longitude)))*6380<$data->radius
        AND v.name = '$data->city'
        AND p.id IN($privilege)
        group by(i.id)
        having COUNT(*) = $count";
        $result = $conn->query($sql);
    }

    // check by city, privilege, open
    elseif($data->city !="" && !empty($data->privileges) && $data->open == true && $data->radius == 0) {
        $sql = "SELECT count(*), i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name 
        FROM ville v, item i, categorie_restaurant cr, item_privilege ip, privilege p, horaire h
        WHERE v.id = i.id_ville AND i.id_categorie_restaurant = cr.id AND i.id = ip.id_item AND ip.id_privilege = p.id AND i.id = h.id_item
        AND i.type = 'restaurant'
        AND active = 1
        AND v.name = '$data->city'
        AND day = DAYNAME(CURDATE())
        AND CURRENT_TIME BETWEEN opening_hours AND closing_hours
        AND p.id IN($privilege)
        group by(i.id)
        having COUNT(*) = $count";
    }

    // check by city, privilege
    elseif($data->city !="" && !empty($data->privileges) && $data->open == false && $data->radius == 0) {
        $sql = "SELECT count(*), i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name 
        FROM ville v, item i, categorie_restaurant cr, item_privilege ip, privilege p
        WHERE v.id = i.id_ville AND i.id_categorie_restaurant = cr.id AND i.id = ip.id_item AND ip.id_privilege = p.id
        AND i.type = 'restaurant'
        AND active = 1
        AND v.name = '$data->city'
        AND p.id IN($privilege)
        group by(i.id)
        having COUNT(*) = $count";
    }

    // check by city, open
    elseif($data->city !="" && empty($data->privileges) && $data->open == true && $data->radius == 0) {
        $sql = "SELECT i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name 
        FROM ville v, item i, categorie_restaurant cr, horaire h
        WHERE v.id = i.id_ville AND i.id_categorie_restaurant = cr.id AND i.id = h.id_item
        AND i.type = 'restaurant'
        AND active = 1
        AND v.name = '$data->city'
        AND day = DAYNAME(CURDATE())
        AND CURRENT_TIME BETWEEN opening_hours AND closing_hours";
    }

    // check by city, radius
    elseif($data->city !="" && empty($data->privileges) && $data->open == false && $data->radius != 0) {
        $sql = "SELECT i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name 
        FROM ville v, item i, categorie_restaurant cr
        WHERE v.id = i.id_ville AND i.id_categorie_restaurant = cr.id
        AND i.type = 'restaurant'
        AND active = 1
        AND ACOS(SIN(RADIANS(`latitude`))*SIN(RADIANS($data->latitude))+COS(RADIANS(`latitude`))*COS(RADIANS($data->latitude))*COS(RADIANS(`longitude`)-RADIANS($data->longitude)))*6380<$data->radius
        AND v.name = '$data->city'";
    }

    // check by privilege, open
    elseif($data->city =="" && !empty($data->privileges) && $data->open == true && $data->radius == 0) {
        $sql = "SELECT count(*), i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name 
        FROM ville v, item i, categorie_restaurant cr, item_privilege ip, privilege p, horaire h
        WHERE v.id = i.id_ville AND i.id_categorie_restaurant = cr.id AND i.id = ip.id_item AND ip.id_privilege = p.id AND i.id = h.id_item
        AND i.type = 'restaurant'
        AND active = 1
        AND day = DAYNAME(CURDATE())
        AND CURRENT_TIME BETWEEN opening_hours AND closing_hours
        AND p.id IN($privilege)
        group by(i.id)
        having COUNT(*) = $count";
    }

    // check by privilege, radius
    elseif($data->city =="" && !empty($data->privileges) && $data->open == false && $data->radius != 0) {
        $sql = "SELECT count(*), i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name 
        FROM ville v, item i, categorie_restaurant cr, item_privilege ip, privilege p
        WHERE v.id = i.id_ville AND i.id_categorie_restaurant = cr.id AND i.id = ip.id_item AND ip.id_privilege = p.id
        AND i.type = 'restaurant'
        AND active = 1
        AND ACOS(SIN(RADIANS(`latitude`))*SIN(RADIANS($data->latitude))+COS(RADIANS(`latitude`))*COS(RADIANS($data->latitude))*COS(RADIANS(`longitude`)-RADIANS($data->longitude)))*6380<$data->radius
        AND p.id IN($privilege)
        group by(i.id)
        having COUNT(*) = $count";
    }
    
    // check by open, radius
    elseif($data->city =="" && empty($data->privileges) && $data->open == true && $data->radius != 0) {
        $sql = "SELECT  i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name 
        FROM ville v, item i, categorie_restaurant cr,horaire h
        WHERE v.id = i.id_ville AND i.id_categorie_restaurant = cr.id AND i.id = h.id_item
        AND i.type = 'restaurant'
        AND active = 1
        AND ACOS(SIN(RADIANS(`latitude`))*SIN(RADIANS($data->latitude))+COS(RADIANS(`latitude`))*COS(RADIANS($data->latitude))*COS(RADIANS(`longitude`)-RADIANS($data->longitude)))*6380<$data->radius
        AND day = DAYNAME(CURDATE())
        AND CURRENT_TIME BETWEEN opening_hours AND closing_hours";
    }

    // check by city
    elseif($data->city !="" && empty($data->privileges) && $data->open == false && $data->radius == 0) {
        $sql = "SELECT i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name 
        FROM ville v, item i, categorie_restaurant cr
        WHERE v.id = i.id_ville AND i.id_categorie_restaurant = cr.id
        AND i.type = 'restaurant'
        AND active = 1
        AND v.name = '$data->city'";
    }

    // check by privilege
    elseif($data->city =="" && !empty($data->privileges) && $data->open == false && $data->radius == 0) {
        $sql = "SELECT count(*), i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name 
        FROM ville v, item i, categorie_restaurant cr, item_privilege ip, privilege p
        WHERE v.id = i.id_ville AND i.id_categorie_restaurant = cr.id AND i.id = ip.id_item AND ip.id_privilege = p.id
        AND i.type = 'restaurant'
        AND active = 1
        AND p.id IN($privilege)
        group by(i.id)
        having COUNT(*) = $count";
    }

    // check by open
    elseif($data->city =="" && empty($data->privileges) && $data->open == true && $data->radius == 0) {
        $sql = "SELECT i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name 
        FROM ville v, item i, categorie_restaurant cr,horaire h
        WHERE v.id = i.id_ville AND i.id_categorie_restaurant = cr.id AND i.id = h.id_item
        AND i.type = 'restaurant'
        AND active = 1
        AND day = DAYNAME(CURDATE())
        AND CURRENT_TIME BETWEEN opening_hours AND closing_hours";
    }

    // check by radius
    elseif($data->city =="" && empty($data->privileges) && $data->open == false && $data->radius != 0) {
        $sql = "SELECT  i.id,i.name,type,adresse,i.rating,active,cr.name AS category_name, v.name AS ville_name 
        FROM ville v, item i, categorie_restaurant cr
        WHERE v.id = i.id_ville AND i.id_categorie_restaurant = cr.id
        AND i.type = 'restaurant'
        AND active = 1
        AND ACOS(SIN(RADIANS(`latitude`))*SIN(RADIANS($data->latitude))+COS(RADIANS(`latitude`))*COS(RADIANS($data->latitude))*COS(RADIANS(`longitude`)-RADIANS($data->longitude)))*6380<$data->radius";
    }
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $data = array() ;
        while($row = $result->fetch_assoc()) {
            $restaurant_id = $row["id"];
            $sql2 = "SELECT id FROM horaire WHERE id_item = $restaurant_id AND day = DAYNAME(CURDATE()) AND CURRENT_TIME BETWEEN opening_hours AND closing_hours";
            $result2 = $conn->query($sql2);
            if ($result2->num_rows > 0) {
        		$data2 = array();
        		$row['open'] = true;
            }
            else{
                $row['open'] = false;
            }
            $sql3 = "SELECT url FROM photo_item WHERE main = 1 AND id_item = $restaurant_id";
            $result3 = $conn->query($sql3);
            if ($result3->num_rows > 0) {
                $photo = $result3->fetch_object()->url;
                $row['photo'] = $photo;
            }
            else{
                $row['photo'] = "null";
            }
            $sql4 = "SELECT COUNT(*) AS number_reviews FROM commentaire_item WHERE rating IS NOT NULL AND id_item = $restaurant_id";
            $result4 = $conn->query($sql4);
            $data4= $result4->fetch_row();
            $row['number_reviews'] = $data4[0];
            $data[] = $row;
        }
        echo json_encode($data);
    }
    else {
        echo "0";
    }
    $conn->close();
?>