<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

global $WP_ROOTPATH;
require( $WP_ROOTPATH . 'wp-load.php' );

class Suggestions extends CI_Controller {

	public function index()
	{
        ;
    }
  
  public function getHoneyId () {
    global $IH_SESSION_LOGGEDIN;
    $uid = $_POST['uid'];
    $sex = $_POST['sex'];
    $honeyId = NULL;
    
    session_start();
        
    if ($_SESSION[$IH_SESSION_LOGGEDIN] ) {
      $this->load->database();
      if (1 == $sex) {
        $query = 'SELECT girl_id FROM wp_friends_relationship WHERE boy_id=' . $uid;
        $query = $this->db->query($query);
        foreach ($query->result() as $row)
        {
          $honeyId = $row->girl_id;
        }
      } else {
        $query = 'SELECT boy_id FROM wp_friends_relationship WHERE girl_id=' . $uid;
        $query = $this->db->query($query);
        foreach ($query->result() as $row)
        {
          $honeyId = $row->boy_id;
        }
      }
    }
    
    return $honeyId;
  }

	public function awards()
	{
	  
    global $IH_SESSION_LOGGEDIN;
    
		$uid = $_POST['uid'];
    $honeyId = $this->getHoneyId();
    $awardsArr = array();
    
        // wp_set_current_user($uid);
        // is_user_logged_in()
        
        session_start();
        
        if ($_SESSION[$IH_SESSION_LOGGEDIN] && $honeyId) {
            $this->load->database();
            
            $query = 'SELECT ID, content, date, fixed FROM wp_suggestions WHERE from_id=' . $honeyId . ' and to_id=' . $uid . ' and suggestion_type=1 order by ID desc';
            $query = $this->db->query($query);
            foreach ($query->result() as $row)
            {
              $award = array('id' => $row->ID, 'text' => $row->content . " : " . $row->date, 'class' => $row->fixed );
              array_push($awardsArr, $award);
            }

            echo json_encode(array("status" => 1, "data" => $awardsArr));

        } else {
            echo json_encode(array("status" => 0, "errorCode" => -1));
        }
	}
    
    public function goodjob()
	{
	  
    global $IH_SESSION_LOGGEDIN;
    
		$uid = $_POST['uid'];
    $honeyId = $this->getHoneyId();
    $awardsArr = array();
    
        // wp_set_current_user($uid);
        // is_user_logged_in()
        
        session_start();
        
        if ($_SESSION[$IH_SESSION_LOGGEDIN] && $honeyId) {
            $this->load->database();
            
            $query = 'SELECT ID, content, date, fixed FROM wp_suggestions WHERE from_id=' . $uid . ' and to_id=' . $honeyId . ' and suggestion_type=1 order by ID desc';
            $query = $this->db->query($query);
            foreach ($query->result() as $row)
            {
              $award = array('id' => $row->ID, 'text' => $row->content . " : " . $row->date, 'class' => $row->fixed );
              array_push($awardsArr, $award);
            }

            echo json_encode(array("status" => 1, "data" => $awardsArr));

        } else {
            echo json_encode(array("status" => 0, "errorCode" => -1));
        }
	}
  
  public function suggestion()
  {
    global $IH_SESSION_LOGGEDIN;
    
    $uid = $_POST['uid'];
    $honeyId = $this->getHoneyId();
    $awardsArr = array();
        
        session_start();
        
        if ($_SESSION[$IH_SESSION_LOGGEDIN] && $honeyId) {
            $this->load->database();
            
            $query = 'SELECT ID, content, date, fixed FROM wp_suggestions WHERE from_id=' . $honeyId . ' and to_id=' . $uid . ' and suggestion_type=2 order by ID desc';
            $query = $this->db->query($query);
            foreach ($query->result() as $row)
            {
              $award = array('id' => $row->ID, 'text' => $row->content . ' : ' .$row->date , 'date' => $row->date, 'class' => $row->fixed);
              array_push($awardsArr, $award);
            }

            echo json_encode(array("status" => 1, "data" => $awardsArr));

        } else {
            echo json_encode(array("status" => 0, "errorCode" => -1));
        }
  }
  
  public function advice()
  {
    global $IH_SESSION_LOGGEDIN;
    
    $uid = $_POST['uid'];
    $honeyId = $this->getHoneyId();
    $awardsArr = array();
        
        session_start();
        
        if ($_SESSION[$IH_SESSION_LOGGEDIN] && $honeyId) {
            $this->load->database();
            
            $query = 'SELECT ID, content, date, fixed FROM wp_suggestions WHERE from_id=' . $uid . ' and to_id=' . $honeyId . ' and suggestion_type=2 order by ID desc';
            $query = $this->db->query($query);
            foreach ($query->result() as $row)
            {
              $award = array('id' => $row->ID, 'text' => $row->content . ' : ' .$row->date , 'date' => $row->date, 'class' => $row->fixed);
              array_push($awardsArr, $award);
            }

            echo json_encode(array("status" => 1, "data" => $awardsArr));

        } else {
            echo json_encode(array("status" => 0, "errorCode" => -1));
        }
  }
  
  public function newsuggestion() {
    global $IH_SESSION_LOGGEDIN;

    $uid = $_POST['uid'];
    $content = $_POST['text'];
    $suggestionType = $_POST['suggestionType'];
    $honeyId = $this->getHoneyId();
    
    date_default_timezone_set('Asia/Chongqing');
    $date = '"'. date('Y-m-d H:i:s') . '"';
      
        session_start();
        
        if ($_SESSION[$IH_SESSION_LOGGEDIN] && $honeyId) {
            $this->load->database();
            $sql = "INSERT INTO  `wp_suggestions` (
                      `content` ,
                      `date` ,
                      `from_id` ,
                      `to_id` ,
                      `suggestion_type` ,
                      `fixed`
                      )
                      VALUES (
                      '$content',  $date,  $uid,  $honeyId,  $suggestionType,  'suggestted'
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
  
  public function ihavedone() {
    global $IH_SESSION_LOGGEDIN;

    $uid = $_POST['uid'];
    $suggestionId = $_POST['suggestionId'];
    $honeyId = $this->getHoneyId();
        
        session_start();
        
        if ($_SESSION[$IH_SESSION_LOGGEDIN] && $honeyId) {
            $this->load->database();
            
            $query = 'SELECT fixed FROM wp_suggestions WHERE ID='. $suggestionId . ' and from_id=' . $honeyId . ' and to_id=' . $uid . ' and fixed="suggestted"';
            $query = $this->db->query($query);
            
            if (1 == count( $query->result())) {
                date_default_timezone_set('Asia/Chongqing');
        
              $sql = "UPDATE  `wp_suggestions` SET  `fixed` =  'improving', `fixedDate` = '". date("Y-m-d H:i:s") ."' WHERE  `ID` =" . $suggestionId;
              $this->db->query($sql);
              
              if (1 == $this->db->affected_rows()) {
                echo json_encode(array("status" => 1));
              } else {
                echo json_encode(array("status" => 0));
              }
            } else {
              echo json_encode(array("status" => 0));
            }

        } else {
            echo json_encode(array("status" => 0, "errorCode" => -1));
        }
  }

  public function suredone() {
    global $IH_SESSION_LOGGEDIN;

    $uid = $_POST['uid'];
    $suggestionId = $_POST['suggestionId'];
    $honeyId = $this->getHoneyId();
        
        session_start();
        
        if ($_SESSION[$IH_SESSION_LOGGEDIN] && $honeyId) {
            $this->load->database();
            
            $query = 'SELECT fixed FROM wp_suggestions WHERE ID='. $suggestionId . ' and from_id=' . $uid . ' and to_id=' . $honeyId . ' and fixed="improving"';
            $query = $this->db->query($query);
            
            if (1 == count( $query->result())) {
            date_default_timezone_set('Asia/Chongqing');
              $sql = "UPDATE  `wp_suggestions` SET  `fixed` =  'improved', `fixedDate` = '". date("Y-m-d H:i:s") ."' WHERE  `ID` =" . $suggestionId;
              $this->db->query($sql);
              
              if (1 == $this->db->affected_rows()) {
                echo json_encode(array("status" => 1));
              } else {
                echo json_encode(array("status" => 0));
              }
            } else {
              echo json_encode(array("status" => 0));
            }

        } else {
            echo json_encode(array("status" => 0, "errorCode" => -1));
        }
  }
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
