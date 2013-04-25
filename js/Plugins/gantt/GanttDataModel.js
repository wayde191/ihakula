
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/29/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

  ih.defineClass("ih.plugins.ganttDataModel", null, null, function(DM, dm){
  
    dm.prototype.init = function(){
      this.request = new ih.Service();
      this.projects = [];
      this.tasks = [];
      this.selectedProject = null;
    };
    
    dm.prototype.doLoadProjects = function(paras){
      this.request.callService(paras, ih.$F(function(response){
        if (1 == response.status) {
            this.projects = response.data;
            this.delegate.updateProjectOptions();
        } else {
            
        }
      }).bind(this), ih.rootUrl + "project/getAllProjects", "POST");
    };
    
    dm.prototype.newProject = function(paras){
      this.request.callService(paras, ih.$F(function(response){
          if (1 == response.status) {
            this.delegate.updateSuccess();
          } else {
            this.delegate.updateSuccess();
          }
        }).bind(this), ih.rootUrl + "project/newProject", "POST");
    }
    
    dm.prototype.doLoadTasks = function(){
      paras = {
        rowsPerPage : 100,
        pageIndex: 1,
        projectID: this.selectedProject.id
      };
      this.request.callService(paras, ih.$F(function(response){
          if (1 == response.status) {
              this.tasks = response.data;
              this.delegate.updateTasks();
          } else {
              
          }
        }).bind(this), ih.rootUrl + "gantt/getTasks", "POST");
    }
    
    dm.prototype.doUpdateTask = function(paras){
      this.request.callService(paras, ih.$F(function(response){
          if (1 == response.status) {
            this.delegate.updateSuccess();
          } else {
            this.delegate.updateSuccess();
          }
        }).bind(this), ih.rootUrl + "gantt/update", "POST");
    }
    
    dm.prototype.insert = function(paras){
      this.request.callService(paras, ih.$F(function(response){
          if (1 == response.status) {
            this.delegate.updateSuccess();
          } else {
            this.delegate.updateSuccess();
          }
        }).bind(this), ih.rootUrl + "gantt/insert", "POST");
    }
    
    dm.prototype.deleteTask = function(paras){
      this.request.callService(paras, ih.$F(function(response){
          if (1 == response.status) {
            this.delegate.updateSuccess();
          } else {
            this.delegate.updateSuccess();
          }
        }).bind(this), ih.rootUrl + "gantt/delete", "POST");
    }
    
      
  });