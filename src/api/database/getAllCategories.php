<?php
    include "./connection.php";
    $sql = "SELECT id, name FROM categorie_restaurant";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $data = array() ;
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
    }
    else {
        echo "Error";
    }
    $conn->close();
?>