<?php
    function uploadImage($image, $folder, $index)
    {
        if($index == NULL){
            $newfilename = round(microtime(true)) . $image['image']['name'];
            $folder = $folder;
            move_uploaded_file($image['image']['tmp_name'], $folder . $newfilename);
        }
        else{
            $newfilename = round(microtime(true)) . $image['name'][$index];
            $folder = $folder;
            move_uploaded_file($image['tmp_name'][$index], $folder . $newfilename);
        }
        return $newfilename;
    }
?>
