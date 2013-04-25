<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

// ErrorCode start with 900

class User extends CI_Controller {

	public function index()
	{
		$this->load->view('welcome_message');
	}
  
  public function setSession() {
    global $IH_SESSION_LOGGEDIN;
    global $IH_SESSION_PATH;
    
    $lifeTime = 24 * 3600; // one day
    session_set_cookie_params($lifeTime);
//    session_save_path($IH_SESSION_PATH);
    session_start();
    $_SESSION[$IH_SESSION_LOGGEDIN] = TRUE;
  }

	public function login(){
        
    $username = $_POST['ihakulaID'];
    $password = $_POST['password'];
    
    if(!$username || !$password) {
      echo json_encode(array("status" => 0, "errorCode" => 900));//not empty
      return;
    }
    
    $this->load->helper('security');
    $pwdMD5Str = do_hash($password, 'md5');
    
    $this->load->database();
            
    $query = 'SELECT * FROM ih_users WHERE user_email="'. $username . '" and user_pass="' . $pwdMD5Str .'"';
    $query = $this->db->query($query);
    
    if (1 == count( $query->result())) {
      $this->setSession();
      
      $queryFirstRow = array_shift($query->result());
      
      echo json_encode(array("status" => 1, "email" => $queryFirstRow->user_email, "id" => $queryFirstRow->ID));
      
      $userLoggedInCount = $queryFirstRow->user_login_times;
      $userLoggedInCount++;
      
      date_default_timezone_set('Asia/Chongqing');
      $date = '"'. date('Y-m-d H:i:s') . '"';
      
      $sql = "UPDATE `ih_users` SET `user_login_times` = " . $userLoggedInCount . ", `user_lasttime_login` = ". $date ." WHERE  `user_email` ='" . $username . "'";
      $this->db->query($sql);
      
    } else {
      echo json_encode(array("status" => 0, "errorCode" => 910));//not exist
    }
    
    return;
	}
  
  public function register(){
    
    // For test
    $username = $_POST['ihakulaID'];
    $password = $_POST['password'];
    $confirmPwd = $_POST['confirmPwd'];
    
    if(!$username || !$password || !$confirmPwd) {
      echo json_encode(array("status" => 0, "errorCode" => 900));//not empty
      return;
    }else if($password != $confirmPwd){
      echo json_encode(array("status" => 0, "errorCode" => 901));//not equal
      return;
    }
    
    $this->load->database();
            
    $query = 'SELECT * FROM ih_users WHERE user_email="'. $username . '"';
    $query = $this->db->query($query);
    
    if (1 == count( $query->result())) {
      echo json_encode(array("status" => 0, "errorCode" => 902));//email exist
      return;
    }
    
    date_default_timezone_set('Asia/Chongqing');
    $date = '"'. date('Y-m-d H:i:s') . '"';
    $this->load->helper('security');
    $pwdMD5Str = do_hash($password, 'md5');
    
    $sql = "INSERT INTO  `ih_users` (
              `user_email` ,
              `user_pass` ,
              `user_registered` ,
              `user_lasttime_login`
              )
              VALUES (
              '$username', '$pwdMD5Str', $date, $date
              )";
    
    $this->db->query($sql);
            
    if (1 == $this->db->affected_rows()) {
      echo json_encode(array("status" => 1));
    } else {
      echo json_encode(array("status" => 0, "errorCode" => 903));//insert error
    }
    
    return;
  }
}