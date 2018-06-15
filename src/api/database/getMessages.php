<?php
    include "./connection.php";
    $receiverId = json_decode(file_get_contents("php://input"));
    $stmt = $conn->prepare("SELECT m.titre, m.texte, m.inserted, CONCAT(u.first_name, ' ', u.last_name) AS name, u.photo, u.provider
                            FROM message m INNER JOIN utilisateur u ON m.id_sender = u.id
                            WHERE id_receiver = ?
                            ORDER BY m.inserted DESC");
    $stmt->bind_param("i",$receiverId);
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
