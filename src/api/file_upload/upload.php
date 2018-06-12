<?php
    function uploadImage($image, $folder, $i)
    {
        $newfilename = round(microtime(true)) . $image['name'][$i];
        $folder = $folder;
        move_uploaded_file($image['tmp_name'][$i], $folder . $newfilename);
        return $newfilename;
    }
?>