
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 5/29/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

  ih.defineClass("ih.plugins.productsDataModel", null, null, function(DM, dm){
  
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
            this.delegate.serviceCallFailed(response.errorCode);
        }
      }).bind(this), ih.rootUrl + "project/getAllProjects", "POST");
    };
      
  });