
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 5/8/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

  ih.defineClass("ih.plugins.accountDataModel", null, null, function(DM, dm){
  
    dm.prototype.init = function(){
      this.request = new ih.Service();
      this.fields = null;
      this.allRecords = [];
    };
    
    dm.prototype.doLoadFields = function(){
      this.request.callService({}, ih.$F(function(response){
        if (1 == response.status) {
            this.fields = response.data;
            this.delegate.updateFieldsOptions();
        } else {
            this.delegate.loadFieldsFailed(response.errorCode);
        }
      }).bind(this), ih.rootUrl + "account/getFields", "POST");
    };
    
    dm.prototype.addRecord = function(paras){
      this.request.callService(paras, ih.$F(function(response){
          if (1 == response.status) {
            this.delegate.updateSuccess();
          } else {
            this.delegate.addRecordFailed(response.errorCode);
          }
        }).bind(this), ih.rootUrl + "account/addRecord", "POST");
    };
    
    dm.prototype.addSalary = function(paras){
      this.request.callService(paras, ih.$F(function(response){
          if (1 == response.status) {
            this.delegate.updateSuccess();
          } else {
            this.delegate.addSalaryFailed(response.errorCode);
          }
        }).bind(this), ih.rootUrl + "account/addSalary", "POST");
    };
    
    
    dm.prototype.loadAllAccountRecord = function(paras){
      this.request.callService(paras, ih.$F(function(response){
          if (1 == response.status) {
            this.allRecords = response.data;
            this.delegate.getAllRecordsSuccess();
          } else {
            this.delegate.loadAllAccountRecordFailed(response.errorCode);
          }
        }).bind(this), ih.rootUrl + "account/loadAllAccountRecord", "POST");
    };
  });