
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 5/8/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

  ih.defineClass("ih.plugins.accountViewController", null, null, function(ACCOUNT, account){
  
    account.prototype.init = function(){
      this.dm = new ih.plugins.accountDataModel();
      this.dm.delegate = this;
      this.doSubscribes();
      this.loadContent();
      this.setupEvents();
      this.loadFields();
    };
    
    account.prototype.doSubscribes = function(){
      ih.plugins.rootViewController.dm.pubsub.subscribe("loginSucceed", this, this.loadFields);
    };
    
    account.prototype.loadFields = function(){
      if(ih.plugins.rootViewController.dm.sysUser.isLogin()){
        ih.plugins.rootPlugin.showMaskSpinner();
        this.dm.doLoadFields();
      } else {
        this.showLoginDialog();
      }
    };
    
    account.prototype.updateFieldsOptions = function(){
      ih.plugins.rootPlugin.hideMaskSpinner();
      var optionsHtml = "";
      for(var index in this.dm.fields) {
        if(index == 1 || index == 2 || index == 3) {
          continue;
        }
        var fieldInfo = this.dm.fields[index];
        var field = fieldInfo['fields'];
        optionsHtml += "<option field_id='" + field.ID
                    + "' value='" + field.field + "' type='" + field.type + "' >" +
                    field.field + "</option>";
      }
      
      for(var i = 0; i < 3; i++){
        var index = i+1;
        var fieldInfo = this.dm.fields[index];
        var field = fieldInfo['fields'];
        optionsHtml += "<option field_id='" + field.ID
                    + "' value='" + field.field + "' type='" + field.type + "' >" +
                    field.field + "</option>";
      }
      
      $("#ih-field-select").html(optionsHtml);
      this.onFieldSelected();
    };
    
    account.prototype.updateYearsOptions = function(){
      ih.plugins.rootPlugin.hideMaskSpinner();
      var optionsHtml = "";
      for(var i = 0; i < this.dm.analyseYears.length; i++) {
        var year = this.dm.analyseYears[i];
        optionsHtml += "<option year_id='" + year
                    + "' value='" + year +  "' >" +
                    year + "</option>";
      }
      
      $("#ih-analyse-year-select").html(optionsHtml);
      
      var today = new Date();
      var year = today.getFullYear();
      var years = ih.$A(this.dm.analyseYears);
      if(years.contains(year)){
        $("#ih-analyse-year-select").val(year);
      }
      
      this.onYearSelected();
    };
    
    account.prototype.updateSuccess = function(){
      ih.plugins.rootPlugin.hideMaskSpinner();
      this.showMessage({title:"温馨提示", text:"成功"});
    };
    
    account.prototype.onFieldSelected = function(){
      var index = $("#ih-field-select").find("option:selected").attr("field_id");
      var fieldInfo = this.dm.fields[index];
      var details = fieldInfo['details'];
      var optionsHtml = "";
      for(var i = 0; i < details.length; i++){
        var d = details[i];
        optionsHtml += "<option field_id='" + d.field_id
                    + "' value='" + d.name + "' detail_id='" + d.ID + "' >" +
                    d.name + "</option>";
      }
      $("#ih-field-detail").html(optionsHtml);
    };
    
    account.prototype.onYearSelected = function(){
      var index = $("#ih-analyse-year-select").find("option:selected").attr("year_id");
      var paras = {"year":index, "uid":ih.plugins.rootViewController.dm.sysUser.id};
      if(this.dm.yearsRecords[index]){
        this.getYearRecordSuccess();
      } else {
        ih.plugins.rootPlugin.showMaskSpinner();
        this.dm.doLoadYearRecord(paras);
      }
    };
    
    account.prototype.showLoginDialog = function(){
      window.setTimeout(ih.$F(ih.plugins.rootViewController.onLoginBtnClicked).bind(ih.plugins.rootViewController), 2000);
    };
    
    account.prototype.restorePanelClass = function(){
      $("#ih-tally").removeClass().addClass("P");
      $("#ih-statistics").removeClass().addClass("P");
      $("#ih-analyse").removeClass().addClass("P");
      $("#ih-manager").removeClass().addClass("P");
    };
    
    account.prototype.setupEvents = function(){
      var me = this;
      $("#ih-tally").click(ih.$F(function(){
        me.restorePanelClass();
        $("#ih-tally").removeClass().addClass("P selecting");
        me.onTallyClicked();
      }).bind(this));
      
      $("#ih-statistics").click(ih.$F(function(){
        me.restorePanelClass();
        $("#ih-statistics").removeClass().addClass("P selecting");
        me.onStatisticsClicked();
      }).bind(this));
      
      $("#ih-analyse").click(ih.$F(function(){
        me.restorePanelClass();
        $("#ih-analyse").removeClass().addClass("P selecting");
        me.onAnalyseClicked();
      }).bind(this));
      
      $("#ih-manager").click(ih.$F(function(){
        me.restorePanelClass();
        $("#ih-manager").removeClass().addClass("P selecting");
        me.onManagerClicked();
      }).bind(this));
      
      this.onTallyClicked();
    };
    
    account.prototype.onTallyClicked = function(){
      $("#ih-reportContainer").html(this.tallyHtml);
      
      var sc = new ih.Scroll("scrollWrapper");
      $("#scrollLeftButton").click(ih.$F(function(){
        sc.toElement("scrollRight", 750);
      }).bind(this));
      
      $("#scrollRightButton").click(ih.$F(function(){
        sc.toElement("scrollLeft", 750);
      }).bind(this));
      
      var me = this;
      $("#ih-field-select").change(function(){
        me.onFieldSelected();
      });
      
      $("#ih-add-record-button").click(ih.$F(function(){
        var money = $("#accountMoney")[0].value;
        var desc = $("#accountDescription")[0].value;
        var field = $("#ih-field-select").find("option:selected").attr("field_id");
        var detail = $("#ih-field-detail").find("option:selected").attr("detail_id");
        if(!(/^\d+\.{0,1}\d+$/.test(money))){
          this.showMessage({title:"温馨提示", text:"请在金额栏输入数字"});
          return;
        }
        
        if(field == 0 && detail == 0){
          this.showMessage({title:"温馨提示", text:"分类信息无效，请刷新页面获取正确分类信息"});
          return;
        }
        
        var paras = {"money":money,
                     "description":desc,
                     "fieldId":field,
                     "detailId":detail,
                     "userId":ih.plugins.rootViewController.dm.sysUser.id
                     };
        ih.plugins.rootPlugin.showMaskSpinner();
        this.dm.addRecord(paras);
        
        
      }).bind(this));
      
      // Set Salary data
      var today = new Date();
      var year = today.getFullYear();
      var month = today.getMonth() + 1;
      $("#ih-salary-year").val(year);
      $("#ih-salary-month").val(month);
      
      if("1" == ih.plugins.rootViewController.dm.sysUser.id){
        $("#actualIncome").val(12745.55);
        $("#basicIncome").val(16000);
        $("#reservedFunds").val(816);
        $("#medicalInsure").val(139);
        $("#oldInsure").val(544);
        $("#loseInsure").val(13.6);
        $("#taxBase").val(10987.4);
        $("#individualIncomeTax").val(1741.85);
        $("#companyName").val("Symbio");
      }
      
      $("#ih-add-salary-button").click(ih.$F(function(){
        var actualIncome = $("#actualIncome").val();
        var basicIncome = $("#basicIncome").val();
        var reservedFunds = $("#reservedFunds").val();
        var medicalInsure = $("#medicalInsure").val();
        var oldInsure = $("#oldInsure").val();
        var loseInsure = $("#loseInsure").val();
        var taxBase = $("#taxBase").val();
        var individualIncomeTax = $("#individualIncomeTax").val();
        var companyName = $("#companyName").val();
        
        var year = $("#ih-salary-year").find("option:selected").val();
        var month = $("#ih-salary-month").find("option:selected").val();
        
        if(!(/^\d+\.{0,1}\d+$/.test(actualIncome))){
          this.showMessage({title:"温馨提示", text:"请在实际收入栏输入数字"});
          return;
        }
        if(!(/^\d+\.{0,1}\d+$/.test(basicIncome))){
          this.showMessage({title:"温馨提示", text:"请在基本工资栏输入数字"});
          return;
        }
        if(!(/^\d+\.{0,1}\d+$/.test(reservedFunds))){
          this.showMessage({title:"温馨提示", text:"请在公积金数栏输入数字"});
          return;
        }
        if(!(/^\d+\.{0,1}\d+$/.test(medicalInsure))){
          this.showMessage({title:"温馨提示", text:"请在医疗保险栏输入数字"});
          return;
        }
        if(!(/^\d+\.{0,1}\d+$/.test(oldInsure))){
          this.showMessage({title:"温馨提示", text:"请在养老保险栏输入数字"});
          return;
        }
        if(!(/^\d+\.{0,1}\d+$/.test(loseInsure))){
          this.showMessage({title:"温馨提示", text:"请在失业保险栏输入数字"});
          return;
        }
        if(!(/^\d+\.{0,1}\d+$/.test(taxBase))){
          this.showMessage({title:"温馨提示", text:"请在计税基数栏输入数字"});
          return;
        }
        if(!(/^\d+\.{0,1}\d+$/.test(individualIncomeTax))){
          this.showMessage({title:"温馨提示", text:"请在个人得税栏输入数字"});
          return;
        }
        
        var actualIncome = $("#actualIncome").val();
        var basicIncome = $("#basicIncome").val();
        var reservedFunds = $("#reservedFunds").val();
        var medicalInsure = $("#medicalInsure").val();
        var oldInsure = $("#oldInsure").val();
        var loseInsure = $("#loseInsure").val();
        var taxBase = $("#taxBase").val();
        var individualIncomeTax = $("#individualIncomeTax").val();
        var companyName = $("#companyName").val();
        
        var year = $("#ih-salary-year").find("option:selected").val();
        var month = $("#ih-salary-month").find("option:selected").val();
        
        var paras = {"actualIncome":actualIncome,
                     "basicIncome":basicIncome,
                     "reservedFunds":reservedFunds,
                     "medicalInsure":medicalInsure,
                     "oldInsure":oldInsure,
                     "loseInsure":loseInsure,
                     "taxBase":taxBase,
                     "individualIncomeTax":individualIncomeTax,
                     "companyName":companyName,
                     "date":year + "." + month,
                     "userId":ih.plugins.rootViewController.dm.sysUser.id
                     };
        ih.plugins.rootPlugin.showMaskSpinner();
        this.dm.addSalary(paras);
      }).bind(this));
      
      // Set option value
      if(this.dm.fields){
        this.updateFieldsOptions();
      }
      
    };
    
    account.prototype.getAllRecordsSuccess = function(){
      var me = this;
      $('[rel*="data{menuitem}"]').setData({ menuitem : me.dm.allRecords });
      ih.plugins.rootPlugin.hideMaskSpinner();
    };
    
    account.prototype.getYearRecordSuccess = function(){
      var index = $("#ih-analyse-year-select").find("option:selected").attr("year_id");
      var me = this;
      $('[rel*="data{yearaccount}"]').setData({
        yearaccount : me.dm.yearsRecords[index]["year"]
        }, this.onAnalyseRecordClicked.bind(this));
      ih.plugins.rootPlugin.hideMaskSpinner();
    };
    
    account.prototype.onAnalyseRecordClicked = ih.$F(function(selectedEle){
        var self = this;
        var jqEle = $(selectedEle.currentTarget);
        var id = jqEle.attr('id');
        var type = jqEle.attr('type');
        var year = jqEle.attr('year');
        
        var incomeFields = {};
        var outcomeFields = {};
        var detailArr = [];
        var incomeOutcomeArr = [];
        var sArr = [];
        
        var earn = null;
        var use = null;
        
        if(type == "year"){
          var months = this.dm.yearsRecords[year]["month"];
          
          for(var m in months){
            var statistic = months[m]["statistic"];
            
            for(var field in statistic){
              if(field.indexOf("收入") > -1){
                if(null == incomeFields[field]){
                  incomeFields[field] = parseFloat(statistic[field]);
                } else {
                  incomeFields[field] = parseFloat(incomeFields[field]) + parseFloat(statistic[field]);
                }
              } else {
                if(null == outcomeFields[field]){
                  outcomeFields[field] = parseFloat(statistic[field]);
                } else {
                  outcomeFields[field] = parseFloat(outcomeFields[field]) + parseFloat(statistic[field]);
                }
              }
            }
            
            incomeOutcomeArr = incomeOutcomeArr.concat(months[m]["income"]);
            incomeOutcomeArr = incomeOutcomeArr.concat(months[m]["outcome"]);
          }
          
          var yearIncome = this.dm.yearsRecords[year]["yearIncome"];
          var yearOutcome = this.dm.yearsRecords[year]["yearOutcome"];
          earn = yearIncome;
          use = yearOutcome;
          
          for(var field in incomeFields){
            incomeFields[field] = field + "," + incomeFields[field] + "@" + (incomeFields[field] / yearIncome * 100).toPrecision(4) + "%";
          }
          for(var field in outcomeFields){
            outcomeFields[field] = field + "," + outcomeFields[field] + "@" + (outcomeFields[field] / yearOutcome * 100).toPrecision(4) + "%";
          }
          
        } else {
          var month = this.dm.yearsRecords[year]["month"][id];
          
          var statistic = month["statistic"];
          var earn = month["earn"];
          var use = month["use"];
          
          for(var field in statistic){
            if(field.indexOf("收入") > -1){
              incomeFields[field] = field + "," + statistic[field] + "@" + (statistic[field] / earn * 100).toPrecision(4) + "%";
            } else {
              outcomeFields[field] = field + "," + statistic[field] + "@" + (statistic[field] / use * 100).toPrecision(4) + "%";
            }
          }
          
          incomeOutcomeArr = incomeOutcomeArr.concat(month["income"]);
          incomeOutcomeArr = incomeOutcomeArr.concat(month["outcome"]);
        }
        
        if(incomeFields){
          var sText = "收入:" + earn;
          for(var field in incomeFields){
            sText += (" || " + incomeFields[field])
          }
          sArr.push({id:"-1000", type:"incomeStatistic", text:sText});
        }
        
        if(outcomeFields){
          var sText = "支出:" + use;
          for(var field in outcomeFields){
            sText += (" || " + outcomeFields[field])
          }
          sArr.push({id:"-1000", type:"outcomeStatistic", text:sText});
        }
        
        detailArr = detailArr.concat(sArr);
        detailArr = detailArr.concat(incomeOutcomeArr);
        
        $("#accountYearDetailModel").html('<li style="padding:0;" rel="data{yearaccountdetail}"><a class="account-list" rel="data{yearaccountdetail.text;yearaccountdetail.link@href;yearaccountdetail.id@id;yearaccountdetail.type@type}" type="" href="javascript:void(0)"></a></li>');
        
        $('[rel*="data{yearaccountdetail}"]').setData({
        yearaccountdetail : detailArr
        });
        
        this.sc.toElement("scrollRight", 750);
    });
    
    account.prototype.onStatisticsClicked = function(){
      ih.plugins.rootPlugin.showMaskSpinner();
      this.dm.loadAllAccountRecord({"uid":ih.plugins.rootViewController.dm.sysUser.id});
      $("#ih-reportContainer").html(this.accountListHtml);
    };
    
    account.prototype.onAnalyseClicked = function(){
      $("#ih-reportContainer").html(this.analyseHtml);
      
      this.sc = new ih.Scroll("scrollWrapper");
      $("#scrollLeftButton").click(ih.$F(function(){
        this.sc.toElement("scrollRight", 750);
      }).bind(this));
      
      $("#scrollRightButton").click(ih.$F(function(){
        this.sc.toElement("scrollLeft", 750);
      }).bind(this));
            
      var me = this;
      $("#ih-analyse-year-select").change(function(){
        $("#accountYearModel").html('<li style="padding:0;" rel="data{yearaccount}"><a class="account-list" rel="data{yearaccount.text;yearaccount.link@href;yearaccount.id@id;yearaccount.type@type;yearaccount.year@year}" type="" href="javascript:void(0)"></a></li>');
        me.onYearSelected();
      });
      
      // Set option value
      if(this.dm.analyseYears){
        this.updateYearsOptions();
      } else {
        var paras = {
                     "uid":ih.plugins.rootViewController.dm.sysUser.id
                     };
        ih.plugins.rootPlugin.showMaskSpinner();
        this.dm.doLoadAnalyseYears(paras);
      }
      

    };
    
    account.prototype.onManagerClicked = function(){
      $("#ih-reportContainer").html(this.managerHtml);
      
      var me = this;
      $('#ih-coming-benifit').handsontable({
          colWidths: [80, 80, 80, 80, 80, 80, 80],
          currentRowClassName: 'currentRow',
          currentColClassName: 'currentCol',
          onChange: function (data) {
            if(data) {
              var selectedValue = data[0];
              if(selectedValue) {
                me.onTableValueChanged(selectedValue);
              }
            }
          },
          colHeaders: ["金额", "类型", "时长", "利率", "收益", "起始时间", "收益时间"],
          columns: [
              {
                data: "金额",
                readOnly: true
              },
              {
                data: "类型",
                readOnly: true
              },
              {
                data: "时长",
                readOnly: true
              },
              {
                data: "利率",
                readOnly: true
              },
              {
                data: "收益",
                readOnly: true
              },
              {
                data: "起始时间",
                readOnly: true
              },
              {
                data: "收益时间",
                readOnly: true
              }
            ],
            rowHeaders: true,
            RemoveRow: false,
            minSpareRows: 1
        });
        
        $('#ih-earn-benifit').handsontable({
          colWidths: [80, 80, 80, 80, 80, 80, 80],
          currentRowClassName: 'currentRow',
          currentColClassName: 'currentCol',
          onChange: function (data) {
            if(data) {
              var selectedValue = data[0];
              if(selectedValue) {
                me.onTableValueChanged(selectedValue);
              }
            }
          },
          colHeaders: ["金额", "类型", "时长", "利率", "收益", "起始时间", "收益时间"],
          columns: [
              {
                data: "金额",
                readOnly: true
              },
              {
                data: "类型",
                readOnly: true
              },
              {
                data: "时长",
                readOnly: true
              },
              {
                data: "利率",
                readOnly: true
              },
              {
                data: "收益",
                readOnly: true
              },
              {
                data: "起始时间",
                readOnly: true
              },
              {
                data: "收益时间",
                readOnly: true
              }
            ],
            rowHeaders: true,
            RemoveRow: false,
            minSpareRows: 1
        });
      
      $("#ih-investment-button").click(ih.$F(function(){
        this.onInvestmentBtnClicked();
      }).bind(this));
        
      // Set option value
      if(this.dm.wealth){
        this.getWealthSuccess();
      } else {
        var paras = {
                     "userId":ih.plugins.rootViewController.dm.sysUser.id
                     };
        ih.plugins.rootPlugin.showMaskSpinner();
        this.dm.getWealth(paras);
      }
    };
    
    account.prototype.onInvestmentBtnClicked = function(){
      
      var money = $("#investment-money").val();
      var type = $("#investment-type").val();
      var time = $("#investment-time").val();
      var rate = $("#investment-rate").val();
      
      if(!money || !type || !time || !rate){
        this.showMessage({title:"温馨提示", text:"请将必填项完善"});
        return;
      }
      
      if(!(/^\d+\.{0,1}\d+$/.test(money))){
        this.showMessage({title:"温馨提示", text:"请在金额栏输入数字"});
        return;
      }
      if(!(/^\d+\.{0,1}\d+$/.test(rate))){
        this.showMessage({title:"温馨提示", text:"请在利率栏输入数字"});
        return;
      }
      
      if(money > this.dm.wealth.avaliable_wealth){
        this.showMessage({title:"温馨提示", text:"您可用于投资的资产值为:" + this.dm.wealth.avaliable_wealth});
        return;
      }
      
      var paras = {
        "userId":ih.plugins.rootViewController.dm.sysUser.id,
        "money": money,
        "type": type,
        "time": time,
        "rate": rate
      };
      ih.plugins.rootPlugin.showMaskSpinner();
      this.dm.investment(paras);
      
    };
    
    account.prototype.getWealthSuccess = function(){
      ih.plugins.rootPlugin.hideMaskSpinner();
      $("#ih-avaliable-wealth-label").html(this.dm.wealth.avaliable_wealth);
      $("#ih-fix-wealth-label").html(this.dm.wealth.fix_wealth + this.dm.wealth.funds);
      $("#ih-all-consume-label").html(this.dm.wealth.consume);
      
      var income = this.dm.wealth.income;
      var coming = this.dm.wealth.coming;
      
      var incomeArr = [];
      var comingArr = [];
      
      for(var i = 0; i < income.length; i++) {
        var item = income[i];
        var task = {
          "金额":item.money,
          "类型":item.type,
          "时长":item.period,
          "利率":item.rate,
          "收益":(item.money * item.period * item.rate).toPrecision(8),
          "起始时间":item.start_date,
          "收益时间":item.settle_date
        };
        incomeArr.push(task);
      }
      
      var task = {
          "金额":this.dm.wealth.funds,
          "类型":"公积金",
          "时长":"∞",
          "利率":"",
          "收益":"",
          "起始时间":"2013-01-04",
          "收益时间":"2313-01-04"
      };
      comingArr.push(task);
      for(var i = 0; i < coming.length; i++) {
        var item = coming[i];
        var task = {
          "金额":item.money,
          "类型":item.type,
          "时长":item.period,
          "利率":item.rate,
          "收益":(item.money * item.period * item.rate).toPrecision(8),
          "起始时间":item.start_date,
          "收益时间":item.settle_date
        };
        comingArr.push(task);
      }
      
      $('#ih-coming-benifit').handsontable('loadData', comingArr);
      $('#ih-earn-benifit').handsontable('loadData', incomeArr);
    };
    
    account.prototype.loadContent = function(){
      this.accountHtml = '<div style="clear:both;"><h2>iAccount</h2><div id="ih-panelBody">'+
        '<table class="" cellpadding="0" cellspacing="0" style="margin-top:15px;">'+
        '<tbody>'+
          '<tr>'+
            '<td id="ih-navPanelContainer" class="OK" style="">'+
            '<div id="ih-newNavPanel" style="">'+
              '<div class="q"><div class="cC">我来理财</div>'+
              '<div class="Hc"><div id="ih-tally" class="P selecting"><div class="hm">记账</div></div></div>'+
              '<div class="Hc"><div id="ih-statistics" class="P"><div class="hm">统计</div></div></div>'+
              '<div class="Hc"><div id="ih-analyse" class="P"><div class="hm">分析</div></div></div>'+
              '<div class="Hc"><div id="ih-manager" class="P"><div class="hm">理财</div></div></div>'+
           '</div>'+
           '</td>'+
           '<td id="ih-navToggle" class="St"><div class="Bmb"></div></td>'+
           '<td id="ih-view" class="BQ">'+
            '<div class="IJ">'+
              '<div class="mw">'+
                '<div id="ih-reportContainer" class="Ti">'+
                '</div>'+
              '</div>'+
            '</div>'+
           '</td>'+
           '</tr>'+
        '</tbody>'+
        '</table>'+
        '</div></div>';
        
      $("#content").html(this.accountHtml);
        
      this.tallyHtml = '<style>'+
                  '#scrollLeft{left:0px;}'+
                  '#scrollRight{left:678px;}'+
                  '#scrollContent{left:628px}'+
                  '.scrollButton{position:absolute;font-size:40px;box-sizing: border-box;-webkit-box-align: center;text-align: center;cursor: default;color: rgba(0,0,0, 0.5);border: none;background:transparent;z-index:10;}'+
                  '.scrollButton:hover{background-color:#999;color:#fff;}'+
                '</style>'+
                '<div id="scrollWrapper" style="width:678px;height:300px;position:relative;overflow:hidden">'+
                  '<div id="scrollContent" style="position:absolute;width:100px;height:40px;">'+
                    '<button id="scrollLeftButton" class="scrollButton" style="left:0px;"><</button>'+
                    '<button id="scrollRightButton" class="scrollButton" style="left:60px;">></button>'+
                  '</div>'+
                  '<div id="scrollLeft" style="position:absolute;top:0px;width:678px;height:300px;">'+
                     '<div style="padding:12px 10px 10px 10px;"><h4>记一笔</h4>' +
                     '<font size="2"><label><span class="dslabel">金额:</span></label></font>' +
                     '<input size="30" autocapitalize="off" oncut="return false ;" oncopy="return false ;" maxlength="32" id="accountMoney" name="accountMoney"/>' +
                     '<select id="ih-field-detail" style="float:right;"><option>工资收入</option></select>'+
                     '<select id="ih-field-select" style="float:right;"><option>职业收入</option></select>'+
                    '<div style="padding-top:8px;"><font size="2"><label><span class="dslabel">描述:</span></label></font>' +
                    '<textarea id="accountDescription" row="10" cols="50" style="height:100px;"></textarea>'+
                    '<div><a id="ih-add-record-button" class="button-fillet" style="text-decoration: none;float:right; margin-left:8px;">确定</a></div>'+
                    '</div></div>' +
                  '</div>'+
                  '<div id="scrollRight" style="position:absolute;top:0px;width:678px;height:300px;">'+
                    '<div style="padding:52px 10px 10px 30px;"><h4>固定薪资</h4>' +
                      '<font size="2"><label><span class="dslabel">实际收入:</span></label></font>' +
                      '<input size="30" autocapitalize="off" oncut="return false ;" oncopy="return false ;" maxlength="32" id="actualIncome" name="actualIncome"/>' +
                      '<font size="2"><label style="padding-left: 20px;"><span class="dslabel">基本工资:</span></label></font>' +
                        '<input size="30" autocapitalize="off" oncut="return false ;" oncopy="return false ;" maxlength="32" id="basicIncome" name="basicIncome"/>' +
                      '<select id="ih-salary-month" style="float:right;"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option></select>'+
                      '<select id="ih-salary-year" style="float:right;"><option>2011</option><option>2012</option><option>2013</option><option>2014</option><option>2015</option><option>2016</option><option>2017</option><option>2018</option><option>2019</option></select>'+
                      '<div style="padding-top:8px;">'+
                        '<font size="2"><label><span class="dslabel">公积金数:</span></label></font>' +
                        '<input size="30" autocapitalize="off" oncut="return false ;" oncopy="return false ;" maxlength="32" id="reservedFunds" name="reservedFunds"/>' +
                        '<font size="2"><label style="padding-left: 20px;"><span class="dslabel">医疗保险:</span></label></font>' +
                        '<input size="30" autocapitalize="off" oncut="return false ;" oncopy="return false ;" maxlength="32" id="medicalInsure" name="medicalInsure"/>' +
                      '</div>'+
                      '<div style="padding-top:8px;">'+
                        '<font size="2"><label><span class="dslabel">养老保险:</span></label></font>' +
                        '<input size="30" autocapitalize="off" oncut="return false ;" oncopy="return false ;" maxlength="32" id="oldInsure" name="oldInsure"/>' +
                        '<font size="2"><label style="padding-left: 20px;"><span class="dslabel">失业保险:</span></label></font>' +
                        '<input size="30" autocapitalize="off" oncut="return false ;" oncopy="return false ;" maxlength="32" id="loseInsure" name="loseInsure"/>' +
                      '</div>'+
                      '<div style="padding-top:8px;">'+
                        '<font size="2"><label><span class="dslabel">计税基数:</span></label></font>' +
                        '<input size="30" autocapitalize="off" oncut="return false ;" oncopy="return false ;" maxlength="32" id="taxBase" name="taxBase"/>' +
                        '<font size="2"><label style="padding-left: 20px;"><span class="dslabel">个人得税:</span></label></font>' +
                        '<input size="30" autocapitalize="off" oncut="return false ;" oncopy="return false ;" maxlength="32" id="individualIncomeTax" name="individualIncomeTax"/>' +
                      '</div>'+
                      '<div style="padding-top:8px;">'+
                        '<font size="2"><label><span class="dslabel">公司名称:</span></label></font>' +
                        '<input size="30" autocapitalize="off" oncut="return false ;" oncopy="return false ;" maxlength="32" id="companyName" name="companyName"/>' +
                        
                        '<div><a id="ih-add-salary-button" class="button-fillet" style="text-decoration: none;float:right; margin-left:8px;">确定</a></div>'+
                    '</div>'+
                  '</div>' +
                  '</div>'+
                '</div>';
                
      this.accountListHtml = '<style>.account-list{color:#666}.account-list:hover{text-decoration: none;}</style><div style="padding:0 0 0 8px;"><li style="padding:0;" rel="data{menuitem}"><a class="account-list" rel="data{menuitem.text;menuitem.link@href;menuitem.id@id;menuitem.type@type}" type="" href="javascript:void(0)"></a></li></div>';
      
      this.analyseHtml = '<style>'+
                  '#scrollLeft{left:0px;}'+
                  '#scrollRight{left:678px;}'+
                  '#scrollContent{left:628px}'+
                  '.scrollButton{position:absolute;font-size:40px;box-sizing: border-box;-webkit-box-align: center;text-align: center;cursor: default;color: rgba(0,0,0, 0.5);border: none;background:transparent;z-index:10;}'+
                  '.scrollButton:hover{background-color:#999;color:#fff;}'+
                '</style>'+
                '<div id="scrollWrapper" style="width:678px;height:300px;position:relative;overflow:hidden">'+
                  '<div id="scrollContent" style="position:absolute;width:100px;height:40px;">'+
                    '<button id="scrollLeftButton" class="scrollButton" style="left:0px;"><</button>'+
                    '<button id="scrollRightButton" class="scrollButton" style="left:60px;">></button>'+
                  '</div>'+
                  '<div id="scrollLeft" style="position:absolute;top:0px;width:678px;height:300px;">'+
                  '<div style="padding:12px 10px 10px 10px;"><h4>分析统计</h4>' +
                     '<font size="2"><label><span class="dslabel">年份:</span></label></font>' +
                     '<select id="ih-analyse-year-select" style=""><option>2013</option></select>'+
                  '</div>'+
                  '<style>.account-list{color:#666}.account-list:hover{text-decoration: none;}</style><div style="padding:0 0 0 8px;" id="accountYearModel"><li style="padding:0;" rel="data{yearaccount}"><a class="account-list" rel="data{yearaccount.text;yearaccount.link@href;yearaccount.id@id;yearaccount.type@type;yearaccount.year@year}" type="" href="javascript:void(0)"></a></li></div>'+
                  '</div>'+
                  '<div id="scrollRight" style="position:absolute;top:0px;width:678px;height:300px;overflow:scroll;">'+
                    '<div style="padding:52px 10px 10px 30px;"><h4>详细情况</h4>' +
                      '<div style="padding:0 0 0 8px;" id="accountYearDetailModel"><li style="padding:0;" rel="data{yearaccountdetail}"><a class="account-list" rel="data{yearaccountdetail.text;yearaccountdetail.link@href;yearaccountdetail.id@id;yearaccountdetail.type@type}" type="" href="javascript:void(0)"></a></li></div>'+
                    '</div>' +
                  '</div>'+
                '</div>';
        
        this.managerHtml = '<style>'+
                  '.star{color:#D10002;padding-left:3px;}'+
                  '.b5{line-height:5px;height:5px;}'+
                  '#manager-frame td{border:none}'+
                  '.handsontable .currentRow {' +
                    'background-color: #E7E8EF;' +
                  '}' +
                  '.handsontable .currentCol {' +
                    'background-color: #F9F9FB;' +
                  '}' +
                '</style>'+
          '<div id="manager-frame" style="padding:4px;">'+
          '<div style="font-size:15px;">'+
            '<div><span style="font-weight:bold;">活期资产:</span><span id="ih-avaliable-wealth-label" style="color:#73A925;font-weight:bold;padding-left:20px;">00.00</span> (RMB)</div>'+
            '<div><span style="font-weight:bold;">定期资产:</span><span id="ih-fix-wealth-label" style="color:#73A925;font-weight:bold; padding-left:20px;">00.00</span> (RMB)</div>'+
            '<div><span style="font-weight:bold;">全部消费:</span><span id="ih-all-consume-label" style="color:#cc0066;font-weight:bold; padding-left:20px;">00.00</span> (RMB)</div>'+
            '</div>'+
          '<div style="padding:20px;"><h4 style="margin-bottom:8px;">投资</h4>'+
          '<div style="background-color: #efefef; border-radius:4px;"><table style="margin:8px;"><tbody>'+
            '<tr style="height:0px;"><td style="width:120px; padding-right:10px;"></td><td style="width:120px; padding-right:10px;"></td><td style="width:120px; padding-right:10px;"></td><td style="width:120px; padding-right:10px;"></td><td style="width:120px; padding-right:10px;"></td></tr>'+
            '<tr style="height:0px;">'+
              '<td><span><span>金额:</span></span><span class="star">*</span><div class="b5"></div><input id="investment-money"></input></td>'+
              '<td><span><span>类型:</span></span><span class="star">*</span><div class="b5"></div><input id="investment-type"></input></td>'+
              '<td><span><span>时长（年）:</span></span><span class="star">*</span><div class="b5"></div><select id="investment-time" style="width:90px;"><option>0.25</option><option>0.5</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option></select></td>'+
              '<td><span><span>利率:</span></span><span class="star">*</span><div class="b5"></div><input id="investment-rate"></input></td>'+
              '<td><div style="position: absolute;height: 40px;left:594px;top:134px;"><a id="ih-investment-button" class="button-fillet3" style="background: -moz-linear-gradient(19% 75% 90deg, rgba(30,30,30,.45), rgba(75,75,75,1));background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(rgba(30,30,30,.45)), to(rgba(75,75,75,1)));">确定</a></div></td>'+
            '</tr>'+
          '</tbody></table></div>'+
          '</div>'+
          '</div>'+
          '<div style="padding:0 20px 20px 20px;">'+
          '<h4 style="margin-bottom:8px;">待收益</h4><div id="ih-coming-benifit"></div>'+
          '<h4 style="margin-bottom:8px; margin-top:8px;">已收益</h4><div id="ih-earn-benifit"></div></div>';
          
    };
    
    account.prototype.showMessage = function(dialogMsg){
      // Dialog
        $('#dialog').dialog({
            autoOpen: false,
            width: 600,
            title: dialogMsg.title,
            buttons: {
                "Sure": function() {
                    $(this).dialog("close");
                }
            }
        });

        // Dialog Link
        $('#dialog').html(dialogMsg.text).dialog('open');
    };
    
    account.prototype.loadFieldsFailed = function(errorCode){
      ih.plugins.rootPlugin.hideMaskSpinner();
      this.showMessage({title:"温馨提示", text:ih.plugins.rootViewController.errorInfo[errorCode]});
    };
    
    account.prototype.addRecordFailed = function(errorCode){
      ih.plugins.rootPlugin.hideMaskSpinner();
      this.showMessage({title:"温馨提示", text:ih.plugins.rootViewController.errorInfo[errorCode]});
    };
    
    account.prototype.addSalaryFailed = function(errorCode){
      ih.plugins.rootPlugin.hideMaskSpinner();
      this.showMessage({title:"温馨提示", text:ih.plugins.rootViewController.errorInfo[errorCode]});
    };
    
    account.prototype.loadAllAccountRecordFailed = function(errorCode) {
      ih.plugins.rootPlugin.hideMaskSpinner();
      this.showMessage({title:"温馨提示", text:ih.plugins.rootViewController.errorInfo[errorCode]});
    };
    
    account.prototype.loadWealthFailed = function(errorCode){
      ih.plugins.rootPlugin.hideMaskSpinner();
      this.showMessage({title:"温馨提示", text:ih.plugins.rootViewController.errorInfo[errorCode]});
    };
    

  });