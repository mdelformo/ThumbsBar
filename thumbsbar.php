<?php

$req;

set_time_limit(120);		// Increase from default 30 to allow large folders

if(isset($_GET['q'])) {

	$req				= $_GET["q"];

	if ($req == "create") {

		$folder = $_GET["folder"];
		$tb		= new ThumbsBar($folder . '/');
	
		$tb->createThumbs(200, 100);
	
		echo "Thumbnails created";
		
	}

	if ($req == "show") {

		$folder = $_GET["folder"];
		$tb 	= new ThumbsBar($folder . '/');
		
		echo $tb->getThumbs($folder . '/');

	}

}

class ThumbsBar {

	private $dir;
	private $filename;
	private $files;

	function ThumbsBar($dir, $filename = 'thumbsbar.jpg') {

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

	public function getThumbs($folder) {

		$thumbsbar	= new Imagick($this->dir . $this->filename);
		
		$thumbsbar_width = $thumbsbar->getImageWidth();
		
		$thumbsdata	= explode('|', $thumbsbar->getImageProperty('comment'));
		
		$output		= $thumbsbar_width . '||';
		
		$output		.= 
			'<style type="text/css">
				#container		{	width:' . $thumbsbar_width . 'px; }
				#imagebar 		{ 	position: relative; opacity: 0.1; }
				#imagebar a		{ 	background-image: url(\'' . $folder .'/thumbsbar.jpg\');
									display: block; position: absolute; height: 100px; }
			</style>';

		foreach($thumbsdata as $td) {
		
			$meta		= explode(',', $td);
			
			if (count($meta) == 3) {
				
				$td_name 	= $meta[0];
				$td_x		= $meta[1];
				$td_width	= $meta[2];

				$output 	.= 	
				'<a style="background-position: -' . $td_x . 'px 0px; width: ' . 
					$td_width . 'px; left: ' . $td_x. 'px;" onmousedown=displayImage("' . $folder . $td_name . '");></a>';
				
			}

		}
		
		return $output;
		
	}

	private function getImages($source) {

		$dir		= scandir($source);
		$img_files	= array();

		foreach ($dir as $file) {

			if (ThumbsBar::isImage($file) && $file != 'thumbsbar.jpg') {
			
				$img_files[] = $file;
				
			}

		}
		
		return $img_files;

	}
	
	private static function isImage($file) {
		
		// \z = is last in string, /i = ignore case
		if (preg_match('/jpg|jpeg|png|gif\z/i', $file)) return true;
		else return false;

	}
	
	// Returns: An array of all folders in the current folder.
    static function getFolders($startFolder = './') {
        $ignoredFolder[] = '.';
        $ignoredFolder[] = '..';
        if (is_dir($startFolder)) {
            if ($folderHandle = opendir($startFolder)) {
                while (($folder = readdir($folderHandle)) !== false) {
                    if (!(array_search($folder, $ignoredFolder) > -1)) {
                        if (filetype($startFolder . $folder) == "dir") {
                            $folders[] = $folder;
                        }
                    }
                }
                closedir($folderHandle);
            }
        }
        return($folders);
    }

    // Parameter: A list of folders that can contain images relative to the current directory.
    // Returns: A list of the folders that contains images.
    static function getImageFolders() {
 
        $folders = ThumbsBar::getFolders();
 
        foreach ($folders as $folder) {
    
            $folderFiles = ThumbsBar::getFolderFiles($folder);
          
            foreach ($folderFiles as $folderFile) {
              
                if (ThumbsBar::isImage($folderFile)) {
                   
                    $imageFolders[] = $folder;
                    break;
                    
                }
           
            }
       
        }
        
        return $imageFolders;
    
    }

    // Parameter folder: array with folder names.
    // Parameter recursive: if files in sub folders should be added as well.
    // Returns: An array with files in the folder and possibly in the subfolders.
    static function getFolderFiles($folder, $recursive = false) {
        
        $files = array();
        
        if ($handle = opendir($folder)) {
            
            while (false !== ($file = readdir($handle))) {
               
                if ($file != "." && $file != "..") {
                   
                    if (is_dir($folder . "/" . $file)) {
                     
                        if ($recursive) {
                         
                            $files = array_merge($files, directoryToArray($folder . "/" . $file, $recursive));
                        
                        }
                       
                        $file = $folder . "/" . $file;
                        $files[] = preg_replace("/\/\//si", "/", $file);
                    
                    } else {
                       
                        $file = $folder . "/" . $file;
                        
                        $files[] = preg_replace("/\/\//si", "/", $file);
                    }
                
                }
            
            }
            
            closedir($handle);
        
        }
       
        return $files;
    }

}
?>
