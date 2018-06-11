<?php
include "./connection.php";
$data = json_decode(file_get_contents("php://input"));
//var_dump($data);
if ($data->provider == "LISTEO") {
    if (!empty($data->registerFirstName) && !empty($data->registerLastName) && !empty($data->registerEmail) && !empty($data->registerPassword) && !empty($data->registerRepeatPassword)) {
        if (preg_match("/^[a-zA-Z]{4,10}/", $data->registerFirstName) && (preg_match("/^[a-zA-Z]{4,10}/", $data->registerLastName)) && (preg_match("/^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9._-]*\\.[a-zA-Z]{2,4}$/", $data->registerEmail))) {
            $stmt_check = $conn->prepare("SELECT * FROM utilisateur WHERE email = ?");
            $stmt_check->bind_param("s", $data->registerEmail);
            $stmt_check->execute();
            $stmt_check->store_result();
            if ($stmt_check->num_rows() > 0) {
                echo 'Already exists';
            } else {
                $stmt_check->close();
                $registerPassword = md5($data->registerPassword);
                $stmt = $conn->prepare("INSERT INTO utilisateur (first_name, last_name, email, password, id_ville) VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param("ssssi", $data->registerFirstName, $data->registerLastName, $data->registerEmail, $registerPassword, $data->registerVille);
                $stmt->execute();
                if ($conn->affected_rows > 0) {
                    $stmt->close();
                    $stmt2 = $conn->prepare("SELECT id, first_name, last_name, email, photo FROM utilisateur WHERE email = ?");
                    $stmt2->bind_param("s", $data->registerEmail);
                    $stmt2->execute();
                    $result = $stmt2->get_result();
                    if ($result->num_rows > 0) {
                        $data = array();
                        while ($row = $result->fetch_assoc()) {
                            $data[] = $row;
                        }
                        echo json_encode($data);
                        $stmt2->close();
                    }
                } else {
                    echo "Error";
                }
            }
        } else {
            echo "Error";
        }
    } else {
        echo "Error";
    }
} elseif ($data->provider == "GOOGLE") {
    $stmt1 = $conn->prepare("SELECT * FROM utilisateur WHERE email = ? AND provider != 'google'");
    $stmt1->bind_param("s", $data->email);
    $stmt1->execute();
    $stmt1->store_result();
    if ($stmt1->num_rows() > 0) {
        echo "Already exists";
    } else {
        $stmt1->close();
        $stmt2 = $conn->prepare("SELECT * FROM utilisateur WHERE email = ? AND provider = 'google'");
        $stmt2->bind_param("s", $data->email);
        $stmt2->execute();
        $stmt2->store_result();
        if ($stmt2->num_rows() > 0) {
            $stmt3 = $conn->prepare("SELECT id, first_name, last_name, email, photo FROM utilisateur WHERE email = ?");
            $stmt3->bind_param("s", $data->email);
            $stmt3->execute();
            $result = $stmt3->get_result();
            if ($result->num_rows > 0) {
                $data = array();
                while ($row = $result->fetch_assoc()) {
                    $data[] = $row;
                }
                echo json_encode($data);
                $stmt3->close();
            }
        } else {
            $stmt4 = $conn->prepare("INSERT INTO utilisateur (first_name, last_name, email, password, photo, provider) VALUES (?, ?, ?, ?, ?, 'google')");
            $stmt4->bind_param("sssss", $data->firstName, $data->lastName, $data->email, $data->authToken, $data->photoUrl);
            $stmt4->execute();
            if ($conn->affected_rows > 0) {
                $stmt4->close();
                $stmt5 = $conn->prepare("SELECT id, first_name, last_name, email, photo FROM utilisateur WHERE email = ?");
                $stmt5->bind_param("s", $data->email);
                $stmt5->execute();
                $result = $stmt5->get_result();
                if ($result->num_rows > 0) {
                    $data = array();
                    while ($row = $result->fetch_assoc()) {
                        $data[] = $row;
                    }
                    echo json_encode($data);
                    $stmt5->close();
                }
            } else {
                echo "Error";
            }
        }
    }
}
elseif ($data->provider == "FACEBOOK") {
    $stmt1 = $conn->prepare("SELECT * FROM utilisateur WHERE email = ? AND provider != 'facebook'");
    $stmt1->bind_param("s", $data->email);
    $stmt1->execute();
    $stmt1->store_result();
    if ($stmt1->num_rows() > 0) {
        echo "Already exists";
    } else {
        $stmt1->close();
        $stmt2 = $conn->prepare("SELECT * FROM utilisateur WHERE email = ? AND provider = 'facebook'");
        $stmt2->bind_param("s", $data->email);
        $stmt2->execute();
        $stmt2->store_result();
        if ($stmt2->num_rows() > 0) {
            $stmt3 = $conn->prepare("SELECT id, first_name, last_name, email, photo FROM utilisateur WHERE email = ?");
            $stmt3->bind_param("s", $data->email);
            $stmt3->execute();
            $result = $stmt3->get_result();
            if ($result->num_rows > 0) {
                $data = array();
                while ($row = $result->fetch_assoc()) {
                    $data[] = $row;
                }
                echo json_encode($data);
                $stmt3->close();
            }
        } else {
            $stmt4 = $conn->prepare("INSERT INTO utilisateur (first_name, last_name, email, password, photo, provider) VALUES (?, ?, ?, ?, ?, 'facebook')");
            $stmt4->bind_param("sssss", $data->firstName, $data->lastName, $data->email, $data->authToken, $data->photoUrl);
            $stmt4->execute();
            if ($conn->affected_rows > 0) {
                $stmt4->close();
                $stmt5 = $conn->prepare("SELECT id, first_name, last_name, email, photo FROM utilisateur WHERE email = ?");
                $stmt5->bind_param("s", $data->email);
                $stmt5->execute();
                $result = $stmt5->get_result();
                if ($result->num_rows > 0) {
                    $data = array();
                    while ($row = $result->fetch_assoc()) {
                        $data[] = $row;
                    }
                    echo json_encode($data);
                    $stmt5->close();
                }
            } else {
                echo "Error";
            }
        }
    }
}
$conn->close();
?>
