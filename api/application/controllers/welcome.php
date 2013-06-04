<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Welcome extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -  
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in 
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see http://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{
		$this->load->view('welcome_message');
	}
  
  public function php(){
    $t=strtotime("+3 month"); 
    echo date("Y-m-d H:i:s",$t);
  }

	public function test()
	{
		$_POST['log'] = 'admin';
		$_POST['pwd'] = 'admin';
        $credentials = array(
                       "user_login" => "admin",
                       "user_password" => "admin",
                       );
		
		$user = wp_signon($credentials, '');
        wp_set_current_user($user->ID);
        $user = wp_get_current_user();
        
        if (!is_user_logged_in()) {
            var_dump(1);
             auth_redirect();
        }

        if ( is_user_logged_in() ) {
        $this->load->database();
        $query = $this->db->query('SELECT boy_id, girl_id, relationship FROM wp_friends_relationship');
        foreach ($query->result() as $row)
        {
            echo $row->boy_id;
            echo $row->girl_id;
            echo $row->relationship;
        }
        
        echo 'Total Results: ' . $query->num_rows();
        
        $query = $this->db->query('SELECT girl_id, relationship FROM wp_friends_relationship WHERE boy_id=1');
        foreach ($query->result() as $row)
        {
            echo $row->girl_id;
            echo $row->relationship;
        }
        
        echo 'Total Results: ' . $query->num_rows();
        }
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
