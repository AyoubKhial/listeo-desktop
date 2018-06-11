<?php
    include "./connection.php";
    $sql = "SELECT * FROM site_information";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $data = array() ;
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $data = $data[0];
        echo '{
            "id": "'.$data["id"].'", 
            "adresse": "'.$data["adresse"].'", 
            "phone": "'.$data["phone"].'",
            "fax": "'.$data["fax"].'",
            "website": "'.$data["website"].'",
            "email": "'.$data["email"].'",
            "longitude": "'.$data["longitude"].'",
            "latitude": "'.$data["latitude"].'"
        }';
    } else {
        echo "Not found";
    }
    $conn->close();
?>