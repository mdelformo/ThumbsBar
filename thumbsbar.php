<?php

$tb 	= new ThumbsBar();

$req	= $_GET["q"];

if ($req == "create") {

	$tb->createThumbs(200, 100);
	
	echo "Thumbnails created";
		
}

if ($req == "show") {

	echo $tb->getThumbs();

}


class ThumbsBar {

	private $dir;
	private $filename;
	private $files;
	private $imgs;

	function ThumbsBar($dir = 'img/', $filename = 'thumbsbar.jpg') {

		$this->dir 		= $dir;
		$this->filename	= $filename;
		$this->files	= $this->getImages($this->dir);
		
	}

	public function createThumbs($width, $height) {
		
		$total_width 	= 0;
		$thumbs			= array();
		
		// For each image file, create a thumbnail and save it to an array
		
		foreach ($this->files as $file) {
		
			$thumb = new Imagick($this->dir . $file);
			$thumb->thumbnailImage($width, $height, true);
			
			$thumbs[] = $thumb;
			
			$total_width += $thumb->getImageWidth();
			
			
		}
		
		// Create a new image file with width = sum of all thumbs
		
		$thumbsbar = new Imagick();
		$thumbsbar->newImage($total_width, $height, new ImagickPixel('black'));
		$thumbsbar->setImageFormat('jpeg');
		$thumbsbar->setImageProperty('comment', 'testing!');
		
		$thumbx = 0;
		
		// Append every thumb to the new image file
		
		foreach ($thumbs as $thumb) {
		
			$thumbsbar->compositeImage($thumb, imagick::COMPOSITE_OVER, $thumbx, 0);
			
			$thumbx += $thumb->getImageWidth();
		
		}
		
		// Write thumbnails to file
		
		try {
		
			$thumbsbar->writeImage($this->dir . 'thumbsbar.jpg');
			
		
		} catch (Exception $e) {
		
			echo 'Failed to write to ' .$e->getMessage();
		
		}
		
	}

	public function getThumbs() {

		$thumbsbar = new Imagick($this->dir . $this->filename);
		//return $thumbsbar->getImageProperty('comment');
		
		return '<img src=' . $this->dir . $this->filename . '></img>';
		
	}

	private function getImages($source) {

		$dir		= scandir($source);
		$img_files	= array();

		foreach ($dir as $file) {

			if ($this->isImage($file) && $file != 'thumbsbar.jpg') {
			
				$img_files[] = $file;
				
			}

		}
		
		return $img_files;

	}
	
	private function isImage($file) {
		
		// \z = is last in string, /i = ignore case
		if (preg_match('/jpg|jpeg|png|gif\z/i', $file)) return true;
		else return false;

	}

}

?>