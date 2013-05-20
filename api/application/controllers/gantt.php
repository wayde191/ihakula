<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Gantt extends CI_Controller {

	public function index()
	{
	}
    
  public function getTasks() {
    
    global $IH_SESSION_LOGGEDIN;
    session_start();
    
    $tasksArr = array();
    $rowsPerPage = $_POST['rowsPerPage'];
    $pageIndex = $_POST['pageIndex'];
    $recordStartIndex = $rowsPerPage * ($pageIndex - 1);
    $projectID = $_POST['projectID'];
        
        if ($_SESSION[$IH_SESSION_LOGGEDIN]) {
            $this->load->database();
            
            $query = 'SELECT count(id) as total from ih_scrum_task where project_id=' . $projectID;
            $query = $this->db->query($query);
            $countString = $query->result();
            $countResult = (int)($countString[0]->total);
            $totalPage = ceil($countResult / $rowsPerPage);
            
            // 11 ~ 20
            $query = 'SELECT * FROM ih_scrum_task where project_id='. $projectID .' limit ' . $recordStartIndex . ',' . $rowsPerPage . ';';
            $query = $this->db->query($query);
            $i = 1;
            foreach ($query->result() as $row)
            {
              $award = array('arrayIndex'=>count($tasksArr), 'class' => 'suggestted', 'text' => $i . ' : ' . $row->name, 'id' => $row->id, 'name' => $row->name, 'beginDate' => $row->begin_date, 'endDate' => $row->end_date, 'principal' => $row->principal, 'schedule' => $row->schedule);
              array_push($tasksArr, $award);
              $i++;
            }

            echo json_encode(array("status" => 1, "totalPage" => $totalPage, "data" => $tasksArr));
        } else {
            echo json_encode(array("status" => 0, "errorCode" => 1080));
        }
    }
    
  public function getAllTasks() {
    
    global $IH_SESSION_LOGGEDIN;
    session_start();
    
    $projectID = $_POST['projectID'];
    $tasksArr = array();
        
        if ($_SESSION[$IH_SESSION_LOGGEDIN]) {
            $this->load->database();
            
            $query = 'SELECT * FROM ih_scrum_task WHERE project_id='. $projectID .';';
            $query = $this->db->query($query);
            foreach ($query->result() as $row)
            {
              $award = array('arrayIndex'=>count($tasksArr), 'class' => 'suggestted', 'text' => count($tasksArr) + 1 . ' : ' . $row->name, 'id' => $row->id, 'name' => $row->name, 'beginDate' => $row->begin_date, 'endDate' => $row->end_date, 'principal' => $row->principal, 'schedule' => $row->schedule);
              array_push($tasksArr, $award);
            }

            echo json_encode(array("status" => 1, "data" => $tasksArr));
        } else {
            echo json_encode(array("status" => 0, "errorCode" => 1081));
        }
  }
    
    public function update() {
        global $IH_SESSION_LOGGEDIN;
        session_start();

        $id = $_POST['id'];
        $name = $_POST['name'];
        $beginDate = $_POST['beginDate'];
        $endDate = $_POST['endDate'];
        $principal = $_POST['principal'];
        $schedule = $_POST['schedule'];
        
        if ($_SESSION[$IH_SESSION_LOGGEDIN]) {
            $this->load->database();
            
            $sql;
            if($schedule != "100%"){
                $sql = "UPDATE  `ih_scrum_task` SET  `name` ='" . $name . "', `begin_date` = '". $beginDate . "', `end_date` = '". $endDate . "', `principal` = '". $principal . "', `schedule` = '". $schedule ."' WHERE  `ID` =" . $id;
            } else {
                date_default_timezone_set('Asia/Chongqing');
                $sql = "UPDATE  `ih_scrum_task` SET  `name` ='" . $name . "', `begin_date` = '". $beginDate . "', `end_date` = '". $endDate . "', `principal` = '". $principal . "', `schedule` = '". $schedule . "', `done_date` = '". date("Y-m-d") . "' WHERE  `ID` =" . $id;
            }
            $this->db->query($sql);
              
            if (1 == $this->db->affected_rows()) {
                echo json_encode(array("status" => 1));
            } else {
                echo json_encode(array("status" => 0));
            }

        } else {
            echo json_encode(array("status" => 0, "errorCode" => 1082));
        }
    }
    
    public function delete() {
        global $IH_SESSION_LOGGEDIN;
        session_start();

        $id = $_POST['id'];
        $projectID = $_POST['projectID'];
        
        if ($_SESSION[$IH_SESSION_LOGGEDIN]) {
            $this->load->database();
            
            $sql = "DELETE FROM `ihakula`.`ih_scrum_task` WHERE `ih_scrum_task`.`id` =" . $id . " And `ih_scrum_task`.`project_id` =" . $projectID;
            $this->db->query($sql);
              
            if (1 == $this->db->affected_rows()) {
                echo json_encode(array("status" => 1));
            } else {
                echo json_encode(array("status" => 0));
            }

        } else {
            echo json_encode(array("status" => 0, "errorCode" => 1083));
        }
    }
    
    public function insert() {
        global $IH_SESSION_LOGGEDIN;
        session_start();

        $name = $_POST['name'];
        $beginDate = $_POST['beginDate'];
        $endDate = $_POST['endDate'];
        $principal = $_POST['principal'];
        $schedule = $_POST['schedule'];
        $projectID = $_POST['projectID'];
        
        if ($_SESSION[$IH_SESSION_LOGGEDIN]) {
            $this->load->database();
            
            $sql = "INSERT INTO  `ih_scrum_task` (
                      `name` ,
                      `type` ,
                      `begin_date` ,
                      `end_date` ,
                      `project_id` ,
                      `principal`,
                      `schedule`
                      )
                      VALUES (
                      '$name',  '1',  '$beginDate',  '$endDate',  '$projectID',  '$principal', '$schedule'
                      )";
                      
            $this->db->query($sql);
            
            if (1 == $this->db->affected_rows()) {
              echo json_encode(array("status" => 1));
            } else {
              echo json_encode(array("status" => 0));
            }

        } else {
            echo json_encode(array("status" => 0, "errorCode" => 1084));
        }
    }
}

?>
