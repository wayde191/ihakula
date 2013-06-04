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
      echo json_encode(array("status" => 0, "errorCode" => 1001));
    }
  }
  
    public function investment(){
      global $IH_SESSION_LOGGEDIN;
      if(!isset($_SESSION)){
        session_start();
      }

      $userId = $_POST['userId'];
      $money = (float)$_POST['money'];
      $type = $_POST['type'];
      $time = (float)$_POST['time'];
      $rate = (float)$_POST['rate'];
      
      date_default_timezone_set('Asia/Chongqing');
      $date = date('Y-m-d');
      
      $settle =strtotime("+" . (12 * $time) . " month");
      $settleDate = date("Y-m-d",$settle);
      
      
      if ($_SESSION[$IH_SESSION_LOGGEDIN]) {
        $this->load->database();
        
        $sql = 'SELECT * FROM ih_account_wealth WHERE user_id=' . $userId;
        $userAccount = $this->db->query($sql);
                  
        if ($userAccount->num_rows() > 0) {
          $row = $userAccount->row();
          $avaliable_wealth = (float)$row->avaliable_wealth;
          $fix_wealth = (float)$row->fix_wealth;
          
          $fix_wealth += $money;
          $avaliable_wealth -= $money;
          $sql = "UPDATE  `ih_account_wealth` SET  `fix_wealth` ='" . $fix_wealth . "', `avaliable_wealth` ='" . $avaliable_wealth . "' WHERE `user_id` =" . $userId;
          $this->db->query($sql);
          
          $sql = "INSERT INTO  `ih_account_investment` (
                    `user_id` ,
                    `money` ,
                    `type` ,
                    `period` ,
                    `rate`,
                    `start_date`,
                    `settle_date`
                    )
                    VALUES (
                    '$userId',  '$money',  '$type',  '$time',  '$rate', '$date', '$settleDate'
                    )";
                    
          $this->db->query($sql);
        
          $this->getWealth();
          
        } else {
          echo json_encode(array("status" => 0));
        }

      } else {
          echo json_encode(array("status" => 0, "errorCode" => 1002));
      }

    }
  
    public function getWealth(){
      global $IH_SESSION_LOGGEDIN;
      if(!isset($_SESSION)){
        session_start();
      }

      $userId = $_POST['userId'];
      
      if ($_SESSION[$IH_SESSION_LOGGEDIN]) {
        $this->load->database();
        
        $sql = 'SELECT * FROM ih_account_wealth WHERE user_id=' . $userId;
        $userAccount = $this->db->query($sql);
                  
        if ($userAccount->num_rows() > 0) {
          $row = $userAccount->row();
          $avaliable_wealth = (float)$row->avaliable_wealth;
          $funds = (float)$row->funds;
          $consume = (float)$row->consume;
          $fix_wealth = (float)$row->fix_wealth;
          
          date_default_timezone_set('Asia/Chongqing');
          $today = date('Y-m-d');
          $query = '(SELECT * FROM `ih_account_investment` where `user_id`="' . $userId . '" and `settle_date`>="' . $today . '" order by id asc)';
          $query = $this->db->query($query);
          $recordsArr = array();
          foreach ($query->result() as $row) {
            array_push($recordsArr, $row);
          }
          
          $query = '(SELECT * FROM `ih_account_investment` where `user_id`="' . $userId . '" and `settle_date`<"' . $today . '" order by id desc)';
          $query = $this->db->query($query);
          $incomeRecordsArr = array();
          foreach ($query->result() as $row) {
            array_push($incomeRecordsArr, $row);
          }
        
          echo json_encode(array("status" => 1, "data" => array("avaliable_wealth" => $avaliable_wealth, "funds" => $funds, "consume" => $consume, "fix_wealth" => $fix_wealth, "income" => $incomeRecordsArr, "coming" => $recordsArr)));
          
        } else {
          echo json_encode(array("status" => 0));
        }

      } else {
          echo json_encode(array("status" => 0, "errorCode" => 1002));
      }
    }
  
    public function updateWealth($userId, $fieldId, $detailId, $money) {
      $this->load->database();
        
      $sql = 'SELECT * FROM ih_account_wealth WHERE user_id=' . $userId;
      $userAccount = $this->db->query($sql);
                
      if ($userAccount->num_rows() > 0) {
        $row = $userAccount->row();
        $avaliable_wealth = (float)$row->avaliable_wealth;
        $funds = (float)$row->funds;
        $consume = (float)$row->consume;
        
        if($fieldId == 1 || $fieldId == 2){
          if($fieldId == 1 && $detailId == 67){
            $funds += $money;
            $sql = "UPDATE  `ih_account_wealth` SET  `funds` ='" . $funds . "' WHERE `user_id` =" . $userId;
            $this->db->query($sql);
          } else {
            $avaliable_wealth += $money;
            $sql = "UPDATE  `ih_account_wealth` SET  `avaliable_wealth` ='" . $avaliable_wealth . "' WHERE `user_id` =" . $userId;
            $this->db->query($sql);
          }
        } else {
          $consume += $money;
          $avaliable_wealth -= $money;
          $sql = "UPDATE  `ih_account_wealth` SET  `consume` ='" . $consume . "', `avaliable_wealth` ='" . $avaliable_wealth . "' WHERE `user_id` =" . $userId;
          $this->db->query($sql);
        }
      } else {
        $sql = "INSERT INTO  `ih_account_wealth` (
                    `user_id` ,
                    `avaliable_wealth` ,
                    `fix_wealth` ,
                    `funds` ,
                    `consume`
                    )
                    VALUES (
                    '$userId',  '0',  '0',  '0',  '0'
                    )";
                    
        $this->db->query($sql);
        $this->updateWealth($userId, $fieldId, $detailId, $money);
      }
      
      return TRUE;
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
      
          $this->updateWealth($userId, $fieldId, $detailId, $money);
        
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
          echo json_encode(array("status" => 0, "errorCode" => 1002));
      }
    }
  
    public function addSalary() {
      global $IH_SESSION_LOGGEDIN;
      session_start();

      $actualIncome = $_POST['actualIncome'];
      $basicIncome = $_POST['basicIncome'];
      $companyName = $_POST['companyName'];
      $salaryDate = $_POST['date'];
      $individualIncomeTax = $_POST['individualIncomeTax'];
      $loseInsure = $_POST['loseInsure'];
      $medicalInsure = $_POST['medicalInsure'];
      $oldInsure = $_POST['oldInsure'];
      $reservedFunds = $_POST['reservedFunds'];
      $taxBase = $_POST['taxBase'];
      $userId = $_POST['userId'];
      
      date_default_timezone_set('Asia/Chongqing');
      $date = date('Y-m-d H:i:s');
      
      if ($_SESSION[$IH_SESSION_LOGGEDIN]) {
          $this->load->database();
          
          $sql = "INSERT INTO  `ih_account_salary` (
                    `user_id` ,
                    `date` ,
                    `company` ,
                    `salary_basic` ,
                    `salary_actual` ,
                    `salary_reserved_funds` ,
                    `salary_pension` ,
                    `salary_tax_base` ,
                    `salary_individual_income_tax` ,
                    `salary_unemployed` ,
                    `salary_medical`
                    )
                    VALUES (
                    '$userId',  '$salaryDate',  '$companyName',  '$basicIncome',  '$actualIncome', '$reservedFunds', '$oldInsure', '$taxBase', '$individualIncomeTax', '$loseInsure',  '$medicalInsure'
                    )";
                    
          $this->db->query($sql);
          
          if (1 == $this->db->affected_rows()) {
            $description = $companyName . ',' . $salaryDate . ',工资收入';
            $sql = "INSERT INTO  `ih_account_money` (
                    `user_id` ,
                    `field_id` ,
                    `field_detail_id` ,
                    `money` ,
                    `description` ,
                    `date`
                    )
                    VALUES (
                    '$userId',  '1',  '1',  '$basicIncome',  '$description',  '$date'
                    )";
                    
            $this->db->query($sql);
            $this->updateWealth($userId, 1, 1, $basicIncome);
            
            // salary_reserved_funds, 公积金
            $fundsIncome = $reservedFunds * 2;
            $this->updateWealth($userId, 1, 67, $fundsIncome);
            
            // fee
            $description = $companyName . ',' . $salaryDate . ',税收支出';
            $money = $basicIncome - $actualIncome;
            $sql = "INSERT INTO  `ih_account_money` (
                      `user_id` ,
                      `field_id` ,
                      `field_detail_id` ,
                      `money` ,
                      `description` ,
                      `date`
                      )
                      VALUES (
                      '$userId',  '12',  '61',  '$money',  '$description',  '$date'
                      )";
                      
            $this->db->query($sql);
            $this->updateWealth($userId, 12, 61, $money);
          
            echo json_encode(array("status" => 1));
          } else {
            echo json_encode(array("status" => 0, "errorCode" => 1003));
          }

      } else {
          echo json_encode(array("status" => 0, "errorCode" => 1003));
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
        echo json_encode(array("status" => 0, "errorCode" => 1004));
    }
	}
  
  public function getAnalyseYears() {
    global $IH_SESSION_LOGGEDIN;
    session_start();
    
		$uid = $_POST['uid'];
    $yearsArr = array();
    
    if ($_SESSION[$IH_SESSION_LOGGEDIN]) {
      $this->load->database();
      
      $query = '(SELECT `date` FROM `ih_account_money` where `user_id`="' . $uid . '" limit 1) union (SELECT `date` FROM `ih_account_money` where `user_id`="' . $uid . '" order by id desc limit 1)';
          
      $query = $this->db->query($query);
      foreach ($query->result() as $row) {
        $arr_time = explode("-", $row->date);
        array_push($yearsArr, $arr_time[0]);
      }
      
      sort($yearsArr);
      $yearsArr = array_unique($yearsArr);
      
      if(2 == count($yearsArr)){
        $fromYear = (int)$yearsArr[0];
        $toYear = (int)$yearsArr[1];
        
        $yearsArr = array();
        for($i = $toYear; $i > $fromYear - 1; $i--){
          array_push($yearsArr, $i);
        }
      }
      
      if(0 == count($yearsArr)) {
        echo json_encode(array("status" => 0, "errorCode" => 1005));
      } else {
        echo json_encode(array("status" => 1, "data" => $yearsArr));
      }
    } else {
      echo json_encode(array("status" => 0, "errorCode" => 9001));
    }
    
  }
  
  public function _buildAccount($records) {
    $recordArr = $records;
    $fieldsArr = array();
    $detailArr = array();
    $resultArr = array();
  
    $this->load->database();
  
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
      $data = array("id" => $record->ID, "type" => $field->type, "text" => $text, "date" => $record->date, "money" => $record->money, "fieldName" => $field->field);
      array_push($resultArr, $data);
    }

    return $resultArr;
  }
  
  public function getAnalyse() {
    global $IH_SESSION_LOGGEDIN;
    session_start();
    
		$year = $_POST['year'];
    $uid = $_POST['uid'];
    $fromYear = $year . "-00-00 00:00:00";
    $toYear = ((int)$year + 1) . "-00-00 00:00:00";
    
    $recordsArr = array();
    $monthsArr = array();
    $returnArr = array();
    
    if ($_SESSION[$IH_SESSION_LOGGEDIN]) {
      $this->load->database();
        
      $query = '(SELECT * FROM `ih_account_money` where `user_id`="' . $uid . '" and `date`>"' . $fromYear . '" and `date`<"' . $toYear . '" order by id desc)';

      $query = $this->db->query($query);
      foreach ($query->result() as $row) {
        array_push($recordsArr, $row);
      }
      
      $resultArr = $this->_buildAccount($recordsArr);
      $yearIncome = 0.0;
      $yearOutcome = 0.0;
      for($i = 0; $i < count($resultArr); $i++) {
        $record = $resultArr[$i];
        $arr_time = explode("-", $record["date"]);
        $month = $arr_time[1];
        
        $monthArr = array();
        if(!isset($monthsArr[$month])){
          $monthArr = array("income" => array(), "outcome" => array(), "earn"=>0.0, "use"=>0.0, "month"=>$month, "statistic"=>array());
          $monthsArr[$month] = $monthArr;
        }
        $monthArr = $monthsArr[$month];
        
        $use = $monthArr["use"];
        $earn = $monthArr["earn"];
        $income = $monthArr["income"];
        $outcome = $monthArr["outcome"];
        $statistic = $monthArr["statistic"];
        
        $fieldName = $record["fieldName"];
        if(isset($statistic[$fieldName])){
          $statistic[$fieldName] = (float)$statistic[$fieldName] + (float)$record["money"];
        } else {
          $statistic[$fieldName] = (float)$record["money"];
        }
        
        if("1" == $record["type"]){ // income
          $earn += (float)$record["money"];
          $yearIncome += (float)$record["money"];
          array_push($income, $record);
        } else {
          $use += (float)$record["money"];
          $yearOutcome += (float)$record["money"];
          array_push($outcome, $record);
        }
        $monthArr["use"] = $use;
        $monthArr["earn"] = $earn;
        $monthArr["income"] = $income;
        $monthArr["outcome"] = $outcome;
        $monthArr["statistic"] = $statistic;
        
        $monthsArr[$month] = $monthArr;
      }
      
      $yearAccount = array("id" => $year, "year" => $year, "type" => "year", "text" => $year . "年 收入:" . $yearIncome . " 支出:" . $yearOutcome . " 产值:" . ($yearIncome - $yearOutcome));
      array_push($returnArr, $yearAccount);
      
      foreach($monthsArr as $monthRecord){
        $month = $monthRecord["month"];
        $earn = $monthRecord["earn"];
        $use = $monthRecord["use"];
        
        $monthAccount = array("id" => $month, "year" => $year, "type" => "month", "text" => $year . "-" . $month . " 收入:" . $earn . " 支出:" . $use . " 产值:" . ($earn - $use));
        array_push($returnArr, $monthAccount);
      }
      
      echo json_encode(array("status" => 1, "data" => array("year" => $returnArr, "month" => $monthsArr, "yearIncome" => $yearIncome, "yearOutcome" => $yearOutcome)));
      
    } else {
      echo json_encode(array("status" => 0, "errorCode" => 9001));
    }
  }
  
}

//$award = array('id' => $row->ID, 'text' => $row->content . " : " . $row->date, 'type' => $row->fixed );

?>
