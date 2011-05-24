<?php

$req	= $_GET["q"];

if ($req == "create") {

	$tb = new ThumbsBar();
	$tb->createThumbs(200, 100);
	
	echo "Thumbnails created";
		
}

if ($req == "show") {

	$tb = new ThumbsBar();
	echo $tb->getThumbs();

}


class ThumbsBar {

	private $dir;
	private $filename;
	private $files;

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
			
			// Workaround. Error in Imagick getFilename()
            $thumb->setFilename($file);
			$thumbs[] = $thumb;
			
			$total_width += $thumb->getImageWidth();
			
			
		}
		
		// Create a new image file with width = sum of all thumbs
		
		$thumbsbar = new Imagick();
		$thumbsbar->newImage($total_width, $height, new ImagickPixel('black'));
		$thumbsbar->setImageFormat('jpeg');
		$thumbsbar->setImageProperty('comment', 'testing!');
		
		// thumbx tracks the position of each thumbnail in the new canvas image
		// comment saves thumbnail data (filname, x, width)
		
		$thumbx		= 0;
		$comment	= '';
		
		// Append every thumb to the new image file
		
		foreach ($thumbs as $thumb) {
			
			$thumb_width = $thumb->getImageWidth();
			
			$comment .= $thumb->getFileName() . ',' . $thumbx . ',' . $thumb_width . '|';
			
			$thumbsbar->compositeImage($thumb, imagick::COMPOSITE_OVER, $thumbx, 0);
			
			$thumbx += $thumb_width;
		
		}
		
		$thumbsbar->setImageProperty('comment', $comment);
		
		// Write thumbnails to file
		
		try {
		
			$thumbsbar->writeImage($this->dir . 'thumbsbar.jpg');
			
		
		} catch (Exception $e) {
		
			echo 'Failed to write to ' .$e->getMessage();
		
		}
		
	}

	public function getThumbs() {

		$thumbsbar = new Imagick($this->dir . $this->filename);
		
		// Temporary array to view thumbnail data
		$filelist	= explode('|', $thumbsbar->getImageProperty('comment'));
		$tmp		= implode('<br>', $filelist);
		
		return	'<img src=' . $this->dir . $this->filename . '></img>' . $tmp;
		
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
