
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
      this.analyseYears = null;
      this.yearsRecords = {};
      this.allRecords = [];
      this.wealth = null;
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
    
    dm.prototype.doLoadAnalyseYears = function(paras){
      this.request.callService(paras, ih.$F(function(response){
        if (1 == response.status) {
            this.analyseYears = response.data;
            this.delegate.updateYearsOptions();
        } else {
            this.delegate.loadFieldsFailed(response.errorCode);
        }
      }).bind(this), ih.rootUrl + "account/getAnalyseYears", "POST");
    };
    
    dm.prototype.doLoadYearRecord = function(paras){
      this.request.callService(paras, ih.$F(function(response){
        if (1 == response.status) {
            this.yearsRecords[paras.year] = response.data;
            this.delegate.getYearRecordSuccess();
        } else {
            this.delegate.loadFieldsFailed(response.errorCode);
        }
      }).bind(this), ih.rootUrl + "account/getAnalyse", "POST");
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
    
    dm.prototype.getWealth = function(paras){
      this.request.callService(paras, ih.$F(function(response){
          if (1 == response.status) {
            this.wealth = response.data;
            this.delegate.getWealthSuccess();
          } else {
            this.delegate.loadWealthFailed(response.errorCode);
          }
        }).bind(this), ih.rootUrl + "account/getWealth", "POST");
    };
    
    dm.prototype.investment = function(paras){
      this.request.callService(paras, ih.$F(function(response){
          if (1 == response.status) {
            this.wealth = response.data;
            this.delegate.getWealthSuccess();
          } else {
            this.delegate.loadWealthFailed(response.errorCode);
          }
        }).bind(this), ih.rootUrl + "account/investment", "POST");
    };
    
    
  });