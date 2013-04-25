
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/29/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

  ih.defineClass("ih.plugins.rootDataModel", null, null, function(DM, dm){
  
    dm.prototype.init = function(){
      this.request = new ih.Service();
      this.sysUser = new ih.User();
      this.pubsub = new ih.PubSub();
      this.delegate = null;
      this.awards = null;
    };
    
    dm.prototype.doLogin = function(paras){
      this.request.callService(paras, ih.$F(function(response){
        if (1 == response.status) {
            this.sysUser.setUserInfo(response);
            this.delegate.loginSuccess();
            this.pubsub.publish("loginSucceed");
        } else {
            
        }
      }).bind(this), ih.rootUrl + "user/login", "POST");
    };
    
    dm.prototype.doRegister = function(paras){
      this.request.callService(paras, ih.$F(function(response){
              console.log(response);
              if (1 == response.status) {
                  this.delegate.registerSuccess();
              } else {
                  this.delegate.registerFailed(response.errorCode);
              }
          }).bind(this), ih.rootUrl + "user/register", "POST");
    };

  });