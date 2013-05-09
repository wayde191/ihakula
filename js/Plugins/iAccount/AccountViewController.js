
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
//      this.loadProjects();
    };
    
    account.prototype.doSubscribes = function(){
      ih.plugins.rootViewController.dm.pubsub.subscribe("loginSucceed", this, this.loadProjects);
    };
    
    account.prototype.loadProjects = function(){
      if(ih.plugins.rootViewController.dm.sysUser.isLogin()){
        this.dm.doLoadProjects({"ihakulaID":ih.plugins.rootViewController.dm.sysUser.id});
      } else {
        this.showLoginDialog();
      }
    };
    
    account.prototype.updateProjectOptions = function(){
      var optionsHtml = "";
      for(var i = 0; i < this.dm.projects.length; i++) {
        var project = this.dm.projects[i];
        if(i == 0) {
          this.dm.selectedProject = project;
        }
        optionsHtml += "<option project_id='" + project.id
                    + "' value='" + project.name + "' index_id='" + i + "' >" +
                    project.name + "</option>";
      }
      $("#ih-project-select").html(optionsHtml);
      this.onProjectSelected();
    };
    
    account.prototype.updateTasks = function(){
      var data = [];
      for(var i = 0; i < this.dm.tasks.length; i++) {
        var item = this.dm.tasks[i];
        var task = {
          "工作任务":item.name,
          "开始时间":item.beginDate,
          "结束时间":item.endDate,
          "主要负责人":item.principal,
          "任务进度":item.schedule
        };
        data.push(task);
      }
      
      $('#ih-gantt-table').handsontable('loadData', data);
    };
    
    account.prototype.updateSuccess = function(){
      ih.plugins.rootPlugin.hideMaskSpinner();
    };
    
    account.prototype.onProjectSelected = function(){
      $("#ih-gantt-project-name").html(this.dm.selectedProject.name);
      this.dm.doLoadTasks();
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
      
    };
    
    account.prototype.onStatisticsClicked = function(){
      $("#ih-reportContainer").html("");
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
      
    };
    
    

  });