<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

// ErrorCode start with 1000

class Project extends CI_Controller {

	public function index()
	{
		$this->load->view('welcome_message');
	}

	public function getAllProjects(){
    
    global $IH_SESSION_LOGGEDIN;
    session_start();
    
    $projectsArr = array();
    $userId = $_POST['ihakulaID'];
        
    if ($_SESSION[$IH_SESSION_LOGGEDIN]) {
      if(!$userId) {
        echo json_encode(array("status" => 0, "errorCode" => 900));//not empty
        return;
      }
      
      $this->load->database();
      $query = 'SELECT * FROM ih_scrum_project WHERE user_id=' . $userId . ' order by ID desc';
      $query = $this->db->query($query);
      foreach ($query->result() as $row)
      {
        $project = array('id' => $row->id, 'name' => $row->name);
        array_push($projectsArr, $project);
      }

      echo json_encode(array("status" => 1, "data" => $projectsArr));
    } else {
      echo json_encode(array("status" => 0, "errorCode" => 9001));
    }
	}
    
    public function newProject(){
      global $IH_SESSION_LOGGEDIN;
      session_start();

      $name = $_POST['name'];
      $userID = $_POST['userID'];
      
      if ($_SESSION[$IH_SESSION_LOGGEDIN]) {
          $this->load->database();
          
          $sql = "INSERT INTO  `ih_scrum_project` (
                    `name` ,
                    `user_id`
                    )
                    VALUES (
                    '$name',  '$userID'
                    )";
                    
          $this->db->query($sql);
          
          if (1 == $this->db->affected_rows()) {
            echo json_encode(array("status" => 1));
          } else {
            echo json_encode(array("status" => 0));
          }

      } else {
          echo json_encode(array("status" => 0, "errorCode" => -1));
      }
    }
    
    
  
}