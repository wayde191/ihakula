
<?php
	class Demo extends CI_Controller {

	function index()
	{
		echo 'Hello world!';
		var_dump(BASEPATH);
		var_dump(APPPATH);
		var_dump(APPROOTPATH);
		var_dump(APPROOTPATH.'logs/');
		log_message('error', 'test where is my file');
	}
	}
?>

