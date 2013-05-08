
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
//      this.setupEvents();
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
    
    account.prototype.setupEvents = function(){
      
      $("#ih-new-project-button").click(ih.$F(function(){
        $("#ih-gantt-content").html(this.projectHtml);
        $("#ih-create-project-button").click(ih.$F(function(){
          var projectName = $("#newprojectname")[0].value;
          if(projectName) {
            var paras = {
              "name":projectName,
              "userID":ih.plugins.rootViewController.dm.sysUser.id
            };
            ih.plugins.rootPlugin.showMaskSpinner();
            this.dm.newProject(paras);
          }
        }).bind(this));
      }).bind(this));
      
      $("#ih-draw-gantt-button").click(ih.$F(function(){
        $("#ih-gantt-content").html(this.ganttHtml);
        this.ganttTable = new ih.Gantt(document.all.GanttChart);
        for(var i = 0; i < this.dm.tasks.length; i++){
          var task = this.dm.tasks[i];
          this.ganttTable.addTaskDetail(new this.ganttTable.task(task.beginDate, task.endDate, task.text, task.principal, task.schedule));
        }
        this.ganttTable.draw();
      }).bind(this));
      
      var me = this;
      $("#ih-project-select").change(function(){
        var indexId = $("#ih-project-select").find("option:selected").attr("index_id");
        me.dm.selectedProject = me.dm.projects[indexId];
        me.onProjectSelected();
      });
    };
    
    account.prototype.onTableValueChanged = function(selectedValue){
      if(selectedValue[2] && selectedValue[2] != selectedValue[3]) {
        // index 3 is new data
        var refreshedData = this.dm.tasks[selectedValue[0]];
        var columnName = selectedValue[1];
        var tableName = this.columnAdapter[columnName];
        refreshedData[tableName] = selectedValue[3];
        ih.plugins.rootPlugin.showMaskSpinner();
        this.dm.doUpdateTask(refreshedData);
        
      } else if(!selectedValue[2]){
        var row = selectedValue[0];
        var name = $('#ih-gantt-table').handsontable('getDataAtCell', row, 0);
        var beginDate = $('#ih-gantt-table').handsontable('getDataAtCell', row, 1);
        var endDate = $('#ih-gantt-table').handsontable('getDataAtCell', row, 2);
        var principal = $('#ih-gantt-table').handsontable('getDataAtCell', row, 3);
        var schedule = $('#ih-gantt-table').handsontable('getDataAtCell', row, 4);
        
        if(name && beginDate && endDate && principal && schedule) {
          var newRow = {
            "name":name,
            "beginDate":beginDate,
            "endDate":endDate,
            "principal":principal,
            "schedule":schedule,
            "projectID":this.dm.selectedProject.id
          };
          ih.plugins.rootPlugin.showMaskSpinner();
          this.dm.insert(newRow);
        }
      }
    };
    
    account.prototype.onDeleteBtnClicked = function(row){
      var refreshedData = this.dm.tasks[row];
      if(refreshedData) {
        var paras = {
          "id":refreshedData.id,
          "projectID":this.dm.selectedProject.id
        };
        ih.plugins.rootPlugin.showMaskSpinner();
        this.dm.deleteTask(paras);
      }
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
                '<div id="ID-reportContainer" class="Ti"></div>'+
              '</div>'+
            '</div>'+
           '</td>'+
           '</tr>'+
        '</tbody>'+
        '</table>'+
        '</div></div>';
      $("#content").html(this.accountHtml);
    };
    
    

  });