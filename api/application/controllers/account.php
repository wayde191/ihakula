<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Account extends CI_Controller {

	public function index()
	{
	}
    
  public function getFields() {
    
    global $IH_SESSION_LOGGEDIN;
    session_start();
        
    if ($_SESSION[$IH_SESSION_LOGGEDIN]) {
    
      $fieldsArr = array();
      $detailArr = array();
      
      $this->load->database();
      $query = 'SELECT * FROM ih_account_field order by ID asc';
      $query = $this->db->query($query);
      foreach ($query->result() as $row)
      {
        array_push($fieldsArr, $row);
      }
      
      $query = 'SELECT * FROM ih_account_field_detail order by ID asc';
      $query = $this->db->query($query);
      foreach ($query->result() as $row)
      {
        array_push($detailArr, $row);
      }
      
      $fieldInfoArr = array();
      for($i = 0; $i < count($fieldsArr); $i++){
        $field = $fieldsArr[$i];
        $fieldId = $fieldsArr[$i]->ID;
        $dArr = array();
        foreach ($detailArr as $row){
          $pId = $row->field_id;
          if($pId == $fieldId){
            array_push($dArr, $row);
          }
        }
        
        $data = array("fields" => $field, "details" => $dArr);
        $fieldInfoArr[$fieldId] = $data;
      }

      echo json_encode(array("status" => 1, "data" => $fieldInfoArr));
    } else {
      echo json_encode(array("status" => 0, "errorCode" => -1001));
    }
  }
    
    public function addRecord() {
      global $IH_SESSION_LOGGEDIN;
      session_start();

      $money = $_POST['money'];
      $description = $_POST['description'];
      $fieldId = $_POST['fieldId'];
      $detailId = $_POST['detailId'];
      $userId = $_POST['userId'];
      date_default_timezone_set('Asia/Chongqing');
      $date = date('Y-m-d H:i:s');
      
      if ($_SESSION[$IH_SESSION_LOGGEDIN]) {
          $this->load->database();
          
          $sql = "INSERT INTO  `ih_account_money` (
                    `user_id` ,
                    `field_id` ,
                    `field_detail_id` ,
                    `money` ,
                    `description` ,
                    `date`
                    )
                    VALUES (
                    '$userId',  '$fieldId',  '$detailId',  '$money',  '$description',  '$date'
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
  
  public function loadAllAccountRecord() {
    global $IH_SESSION_LOGGEDIN;
    session_start();
    
		$uid = $_POST['uid'];
    if ($_SESSION[$IH_SESSION_LOGGEDIN]) {
        $this->load->database();
      
        $recordArr = array();
        $fieldsArr = array();
        $detailArr = array();
        $resultArr = array();
      
        $query = 'SELECT * FROM ih_account_money WHERE user_id=' . $uid . ' order by ID desc';
        $query = $this->db->query($query);
        foreach ($query->result() as $row) {
          array_push($recordArr, $row);
        }
      
        $query = 'SELECT * FROM ih_account_field order by ID asc';
        $query = $this->db->query($query);
        foreach ($query->result() as $row) {
          $fieldsArr[$row->ID] = $row;
        }
        
        $query = 'SELECT * FROM ih_account_field_detail order by ID asc';
        $query = $this->db->query($query);
        foreach ($query->result() as $row) {
          $detailArr[$row->ID] = $row;
        }
      
        for($i = 0; $i < count($recordArr); $i++){
          $record = $recordArr[$i];
          $field = $fieldsArr[$record->field_id];
          $detail = $detailArr[$record->field_detail_id];
          $text = "";
          if(1 == $field->type){
            $text .= "(+) ";
          } else {
            $text .= "(-) ";
          }
          $text .= $field->field . ":" . $detail->name . " " . $record->money . "(CNY)" . " " . $record->description . " " . $record->date;
          $data = array("id" => $record->ID, "type" => $field->type, "text" => $text);
          array_push($resultArr, $data);
        }

        echo json_encode(array("status" => 1, "data" => $resultArr));

    } else {
        echo json_encode(array("status" => 0, "errorCode" => -1));
    }
	}
}

//$award = array('id' => $row->ID, 'text' => $row->content . " : " . $row->date, 'type' => $row->fixed );

?>
