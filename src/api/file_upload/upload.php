<?php
    function uploadImage($image, $folder, $index)
    {
        $newfilename = round(microtime(true)) . $image['name'][$index];
        $folder = $folder;
        move_uploaded_file($image['tmp_name'][$index], $folder . $newfilename);
        return $newfilename;
    }
?>
