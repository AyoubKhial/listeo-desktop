<?php
    function uploadImage($image, $folder)
    {
        $newfilename = round(microtime(true)) . $image['image']['name'];
        $folder = $folder;
        move_uploaded_file($image['image']['tmp_name'], $folder . $newfilename);
        return $newfilename;
    }
?>
