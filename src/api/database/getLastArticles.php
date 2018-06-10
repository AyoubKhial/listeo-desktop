<?php
    include "./connection.php";
    $sql = "SELECT * FROM article WHERE active = 1 ORDER BY inserted DESC LIMIT 3";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $data = array() ;
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo "0";
    }
    $conn->close();
?>