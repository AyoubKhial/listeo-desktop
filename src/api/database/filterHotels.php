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
    if($data->city == "" && empty($data->privileges) && $data->radius == 0) {
        $sql = "SELECT i.id,i.name,type,adresse,i.rating,active, v.name AS ville_name 
        FROM ville v inner join item i on v.id = i.id_ville
        WHERE i.type = 'hotel' AND active = 1";
    }

    // check by city, privilege, radius
    elseif($data->city !="" && !empty($data->privileges) && $data->radius != 0) {
        $sql = "SELECT count(*), i.id,i.name,type,adresse,i.rating,active, v.name AS ville_name 
        FROM ville v, item i, item_privilege ip, privilege p
        WHERE v.id = i.id_ville AND i.id = ip.id_item AND ip.id_privilege = p.id
        AND i.type = 'hotel'
        AND active = 1
        AND ACOS(SIN(RADIANS(`latitude`))*SIN(RADIANS($data->latitude))+COS(RADIANS(`latitude`))*COS(RADIANS($data->latitude))*COS(RADIANS(`longitude`)-RADIANS($data->longitude)))*6380<$data->radius
        AND v.name = '$data->city'
        AND p.name IN($privilege)
        group by(i.id)
        having COUNT(*) = $count";
    }

    // check by city, privilege
    elseif($data->city !="" && !empty($data->privileges) && $data->radius == 0) {
        $sql = "SELECT count(*), i.id,i.name,type,adresse,i.rating,active, v.name AS ville_name 
        FROM ville v, item i,  item_privilege ip, privilege p
        WHERE v.id = i.id_ville AND i.id = ip.id_item AND ip.id_privilege = p.id
        AND i.type = 'hotel'
        AND active = 1
        AND v.name = '$data->city'
        AND p.name IN($privilege)
        group by(i.id)
        having COUNT(*) = $count";
    }

    // check by city, radius
    elseif($data->city !="" && empty($data->privileges) && $data->radius != 0) {
        $sql = "SELECT i.id,i.name,type,adresse,i.rating,active, v.name AS ville_name 
        FROM ville v, item i
        WHERE v.id = i.id_ville
        AND i.type = 'hotel'
        AND active = 1
        AND ACOS(SIN(RADIANS(`latitude`))*SIN(RADIANS($data->latitude))+COS(RADIANS(`latitude`))*COS(RADIANS($data->latitude))*COS(RADIANS(`longitude`)-RADIANS($data->longitude)))*6380<$data->radius
        AND v.name = '$data->city'";
    }

    // check by privilege, radius
    elseif($data->city =="" && !empty($data->privileges) && $data->radius != 0) {
        $sql = "SELECT count(*), i.id,i.name,type,adresse,i.rating,active, v.name AS ville_name 
        FROM ville v, item i,  item_privilege ip, privilege p
        WHERE v.id = i.id_ville AND i.id = ip.id_item AND ip.id_privilege = p.id
        AND i.type = 'hotel'
        AND active = 1
        AND ACOS(SIN(RADIANS(`latitude`))*SIN(RADIANS($data->latitude))+COS(RADIANS(`latitude`))*COS(RADIANS($data->latitude))*COS(RADIANS(`longitude`)-RADIANS($data->longitude)))*6380<$data->radius
        AND p.name IN($privilege)
        group by(i.id)
        having COUNT(*) = $count";
    }

    // check by city
    elseif($data->city !="" && empty($data->privileges) && $data->radius == 0) {
        $sql = "SELECT i.id,i.name,type,adresse,i.rating,active, v.name AS ville_name 
        FROM ville v, item i
        WHERE v.id = i.id_ville
        AND i.type = 'hotel'
        AND active = 1
        AND v.name = '$data->city'";
    }

    // check by privilege
    elseif($data->city =="" && !empty($data->privileges) && $data->radius == 0) {
        $sql = "SELECT count(*), i.id,i.name,type,adresse,i.rating,active, v.name AS ville_name 
        FROM ville v, item i,  item_privilege ip, privilege p
        WHERE v.id = i.id_ville AND i.id = ip.id_item AND ip.id_privilege = p.id
        AND i.type = 'hotel'
        AND active = 1
        AND p.name IN($privilege)
        group by(i.id)
        having COUNT(*) = $count";
    }

    // check by radius
    elseif($data->city =="" && empty($data->privileges) && $data->radius != 0) {
        $sql = "SELECT  i.id,i.name,type,adresse,i.rating,active, v.name AS ville_name 
        FROM ville v, item i
        WHERE v.id = i.id_ville
        AND i.type = 'hotel'
        AND active = 1
        AND ACOS(SIN(RADIANS(`latitude`))*SIN(RADIANS($data->latitude))+COS(RADIANS(`latitude`))*COS(RADIANS($data->latitude))*COS(RADIANS(`longitude`)-RADIANS($data->longitude)))*6380<$data->radius";
    }
    $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $data = array() ;
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode($data);
        }
        else {
            echo "0";
        }
    $conn->close();
?>
