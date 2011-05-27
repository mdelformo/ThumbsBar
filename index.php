<!DOCTYPE HTML>

<?php require_once('thumbsbar.php'); ?>

<html>

<head>

<script	type="text/javascript" src="js/functions.js"></script>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="stylesheet" href="css/default.css" type="text/css">

<title></title>

</head>

<body>

<div id="folder_chooser">


    
</div>

<div id="toolbar">

    <select id="folder_select">
    
        <option value="" selected="selected">Choose folder</option>
       
        <?php
           	$imageFolders = ThumbsBar::getImageFolders();
        	foreach ($imageFolders as $imageFolder) {
            	echo '<option>' . $imageFolder . '</option>';
        	}
        ?>
        
    </select>

	<br><br>

	<p>	<a onclick="createThumbsBar()">Create thumbnails</a><br><br>
		<a onclick="showThumbsBar()">Show thumbnails</a></p>

<!-- <button id="bcreate" onclick="createThumbsBar()">Create thumbnails</button>
	 <button id="bshow" onclick="showThumbsBar()">Show thumbnails</button> -->
	
	<div id="progressbar"></div>

</div>

<div id="display">

	<img id="mainimg" height="600" style="visibility: hidden;">

</div>


<!-- Style created in-line style to allow javascript to change it -->

<a class="navarrow" id="leftarrow" onclick="initMoveRight();" style="visibility: hidden; left: 10px;">&#60;</a> 
<a class="navarrow" id="rightarrow" onclick="initMoveLeft();" style="visibility: hidden; right: 10px;">&#62;</a>

<div id="container" style="position: absolute; height: 100px; left: 0px; bottom: 0px;">

	<div id="imagebar"><div>

</div>

</body>

</html>
