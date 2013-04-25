/**
  *@Version : 1.0
  *@Author : Wayde Sun
  *@Time : 2010.3.4
  */

  ih.defineClass("ih.plugins.ganttViewController", null, null, function(GANTT, gantt){
  
    gantt.prototype.init = function(){
      this.dm = new ih.plugins.ganttDataModel();
      this.dm.delegate = this;
      this.doSubscribes();
      this.loadContent();
      this.setupEvents();
      this.loadProjects();
    };
    
    gantt.prototype.doSubscribes = function(){
      ih.plugins.rootViewController.dm.pubsub.subscribe("loginSucceed", this, this.loadProjects);
    };
    
    gantt.prototype.loadProjects = function(){
      if(ih.plugins.rootViewController.dm.sysUser.isLogin()){
        this.dm.doLoadProjects({"ihakulaID":ih.plugins.rootViewController.dm.sysUser.id});
      } else {
        this.showLoginDialog();
      }
    };
    
    gantt.prototype.updateProjectOptions = function(){
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
    
    gantt.prototype.updateTasks = function(){
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
    
    gantt.prototype.updateSuccess = function(){
      ih.plugins.rootPlugin.hideMaskSpinner();
    };
    
    gantt.prototype.onProjectSelected = function(){
      $("#ih-gantt-project-name").html(this.dm.selectedProject.name);
      this.dm.doLoadTasks();
    };
    
    gantt.prototype.showLoginDialog = function(){
      window.setTimeout(ih.$F(ih.plugins.rootViewController.onLoginBtnClicked).bind(ih.plugins.rootViewController), 2000);
    };
    
    gantt.prototype.setupEvents = function(){
      
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
    
    gantt.prototype.onTableValueChanged = function(selectedValue){
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
    
    gantt.prototype.onDeleteBtnClicked = function(row){
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
    
    gantt.prototype.loadContent = function(){
      this.ganttHtml = '<h3>Gantt Table</h3><div style="position:relative;" class="Gantt" id="GanttChart"></div>';
      this.projectHtml = '<font size="2"><label for="projectname"><span class="dslabel">Project Name:</span></label></font>' +
              '<input size="30" autocapitalize="off" autocorrect="off" maxlength="128" id="newprojectname" type="text" value="" name="theProjectName"/><a id="ih-create-project-button" class="button-fillet" style="text-decoration: none;float:right; margin-left:8px;">New</a>';
      this.tableStyle = '<style class="common">' +
                          '.handsontable .currentRow {' +
                            'background-color: #E7E8EF;' +
                          '}' +
                          '.handsontable .currentCol {' +
                            'background-color: #F9F9FB;' +
                          '}' +
                        '</style>';
      this.contentHtml = '<div style="clear:both">' +
                            '<h2>Gantt</h2>' +
                            '<span id="ih-gantt-project-name">Project Name</span>' +
                            '<a id="ih-draw-gantt-button" class="button-fillet" style="text-decoration: none;float:right; margin-left:8px;">Draw Gantt</a>' +
                            '<a id="ih-new-project-button" class="button-fillet" style="text-decoration: none;float:right; margin-left:8px;">New Project</a>' +
                            '<select id="ih-project-select" style="float:right;"><option>good game</option><option>good choice</option></select>' +
                            '<div id="ih-gantt-table" style="margin-top:20px;"></div><hr>' +
                            '<div id="ih-gantt-content" style="margin-top:20px;min-height:200px;">' +
                            '</div>' +
                          '</div>';
      $("#content").html(this.tableStyle + this.contentHtml);

      this.columnAdapter = {
        "工作任务":"name",
        "开始时间":"beginDate",
        "结束时间":"endDate",
        "主要负责人":"principal",
        "任务进度":"schedule"
      };
      var me = this;
      $('#ih-gantt-table').handsontable({
          colWidths: [140, 140, 140, 140, 140],
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
          colHeaders: ["工作任务", "开始时间", "结束时间", "主要负责人", "任务进度"],
          columns: [
              {
                data: "工作任务"
                //readOnly: true
              },
              {
                data: "开始时间"
              },
              {
                data: "结束时间"
              },
              {
                data: "主要负责人"
              },
              {
                data: "任务进度"
              }
            ],
            rowHeaders: true,
            RemoveRow: true,
            minSpareRows: 1
        });
        
        window.ihSysEngine.pubsub.subscribe("ih-gantt-tableSubject", this, this.onDeleteBtnClicked);
    };
    
    

  });