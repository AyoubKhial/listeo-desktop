<?php
    include "./connection.php";
	$data = json_decode(file_get_contents("php://input"));
	$regex = "/^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9._-]*\\.[a-zA-Z]{2,4}$/";
	$email = strtolower($data->email);
	if(preg_match($regex, $email)) {
        $stmt_check = $conn->prepare("SELECT * FROM newsletter WHERE email = ?");
        $stmt_check->bind_param("s", $email);
        $stmt_check->execute();
        $stmt_check->store_result();
        if($stmt_check->num_rows() > 0){
            echo 'Already exists';
        }
        else{
            $stmt_check->close();
            $stmt = $conn->prepare("INSERT INTO newsletter(email) VALUES (?)");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            if ($stmt){
                echo "Inserted";
                $stmt->close();
			}
			else {
                echo "Error";
            }
        }
	}
	else{
		echo "Error";
	}
	$conn->close();
?>
