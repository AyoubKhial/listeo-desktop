<?php
    include "./connection.php";
    $data = json_decode(file_get_contents("php://input"));
    $term = '%' . $data->term . '%';
    $stmt = $conn->prepare("SELECT * FROM article where titre like ?");
    $stmt->bind_param("s",$term);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $data = array() ;
        while($row = $result->fetch_assoc()) {
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
