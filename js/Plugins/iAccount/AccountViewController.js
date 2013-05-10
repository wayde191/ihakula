
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
        this.dm.doLoadFields();
      } else {
        this.showLoginDialog();
      }
    };
    
    account.prototype.updateFieldsOptions = function(){
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
    
    account.prototype.updateSuccess = function(){
      ih.plugins.rootPlugin.hideMaskSpinner();
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
        
        var paras = {"money":money,
                     "description":desc,
                     "fieldId":field,
                     "detailId":detail,
                     "userId":ih.plugins.rootViewController.dm.sysUser.id
                     };
        ih.plugins.rootPlugin.showMaskSpinner();
        this.dm.addRecord(paras);
        
        
      }).bind(this));
      
    };
    
    account.prototype.getAllRecordsSuccess = function(){
      var me = this;
      $('[rel*="data{menuitem}"]').setData({ menuitem : me.dm.allRecords });
      ih.plugins.rootPlugin.hideMaskSpinner();
    };
    
    account.prototype.onStatisticsClicked = function(){
      ih.plugins.rootPlugin.showMaskSpinner();
      this.dm.loadAllAccountRecord({"uid":ih.plugins.rootViewController.dm.sysUser.id});
      $("#ih-reportContainer").html(this.accountListHtml);
    };
    
    account.prototype.onAnalyseClicked = function(){
      $("#ih-reportContainer").html("");
    };
    
    account.prototype.onManagerClicked = function(){
      $("#ih-reportContainer").html("");
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
                  '<div id="scrollRight" style="position:absolute;top:0px;width:678px;height:300px;"></div>'+
                '</div>';
                
      this.accountListHtml = '<style>.account-list{color:#666}.account-list:hover{text-decoration: none;}</style><div style="padding:0 0 0 8px;"><li style="padding:0;" rel="data{menuitem}"><a class="account-list" rel="data{menuitem.text;menuitem.link@href;menuitem.id@id;menuitem.type@type}" type="" href="javascript:void(0)"></a></li></div>';
      
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
    

  });