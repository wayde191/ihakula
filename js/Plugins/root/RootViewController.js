/**
  *@Version : 1.0
  *@Author : Wayde Sun
  *@Time : 2010.3.4
  */

  ih.defineClass('ih.plugins.rootViewController', null, null, function(ROOT, root){
  
    root.prototype.init = function(){
      this.dm = new ih.plugins.rootDataModel();
      this.dm.delegate = this;
      this.initHtmls();
      this.setupLanguage();
      this.setupErrorinfo();
      this.buildMainPage();
      
      if(this.dm.sysUser.isLogin()) {
        this.setUserinfo();
      }
      
    };
    
    root.prototype.buildMainPage = function(){
      $("#content").html('<div id="ih-recommands"></div><hr><div id="ih-main" role="main"></div>');
      this.buildRecommands();
      this.buildMainContent();
    };
    
    root.prototype.buildMainContent = function(){
      this.localize();
      this.setupClickEvent();
    };
    
    root.prototype.setupClickEvent = function(){
      $("#ih-login-button").click(ih.$F(function(){
        this.onLoginBtnClicked();
      }).bind(this));
      $("#mask-button").click(ih.$F(function(){
        this.onCloseMaskBtnClicked();
      }).bind(this));
      
      $("#content-col-1-link").click(ih.$F(function(){
        this.showMessage({title:"温馨提示", text:"Coming soon"});
      }).bind(this));
      $("#content-col-2-link").click(ih.$F(function(){
        this.showMessage({title:"温馨提示", text:"Coming soon"});
      }).bind(this));
      $("#content-col-3-link").click(ih.$F(function(){
        this.showMessage({title:"温馨提示", text:"Coming soon"});
      }).bind(this));
      $("#mf-ihakula").click(ih.$F(function(){
        window.open(ih.hostRoot + "htmls/ihakula.html");
      }).bind(this));
      $("#mf-aboutme").click(ih.$F(function(){
        this.showMessage({title:"温馨提示", text:"Coming soon"});
      }).bind(this));
      $("#mf-privacy").click(ih.$F(function(){
        this.showMessage({title:"温馨提示", text:"Coming soon"});
      }).bind(this));
      
    };
    
    root.prototype.onRegisterBtnClicked = function(){
      $("#ds_container").html(this.registerHtml);
      
      $("#register-cancel").click(ih.$F(function(){
        this.onCloseMaskBtnClicked();
      }).bind(this));
      $("#register-sure").click(ih.$F(function(){
        this.onRegisterSureBtnClicked();
      }).bind(this));
    };
    
    root.prototype.onRegisterSureBtnClicked = function(){
      var accountName = $("#accountname")[0].value;
      var accountPassword = $("#accountpassword")[0].value;
      var confirmPassword = $("#confirmpassword")[0].value;
      
      if(!accountName || !accountPassword || !confirmPassword){
        this.showMessage({title:"温馨提示", text:"三项均不能为空"});
        return;
      } else if(accountPassword != confirmPassword) {
        this.showMessage({title:"温馨提示", text:"密码确认不相等，请重新输入"});
        $("#accountpassword").val("");
        $("#confirmpassword").val("");
        return;
      }
      
      var target = document.getElementById('ds_container');
      this.registerSpinner = new Spinner(ih.plugins.rootPlugin.spinnerDefaultOpts).spin(target);
      this.dm.doRegister({ihakulaID:accountName, password:accountPassword, confirmPwd:confirmPassword});
    };
    
    root.prototype.registerSuccess = function(){
      this.registerSpinner.stop();
      $("#ds_container").html(this.loginHtml);
      this.showMessage({title:"温馨提示", text:this.languages[this.selectedLanguage]["registerSucceed"]});
      
    };
    
    root.prototype.registerFailed = function(errorCode){
      this.registerSpinner.stop();
      this.showMessage({title:"温馨提示", text:this.errorInfo[errorCode]});
    };
    
    root.prototype.onSignInBtnClicked = function(){
      var accountName = $("#accountname")[0].value;
      var accountPassword = $("#accountpassword")[0].value;
      
      if(!accountName || !accountPassword){
        this.showMessage({title:"温馨提示", text:"请输入用户名和密码"});
        return;
      }
      
      var target = document.getElementById('ds_container');
      this.registerSpinner = new Spinner(ih.plugins.rootPlugin.spinnerDefaultOpts).spin(target);
      this.dm.doLogin({ihakulaID:accountName, password:accountPassword});
    };
    
    root.prototype.loginSuccess = function(){
      this.registerSpinner.stop();
      this.onCloseMaskBtnClicked();
      this.setUserinfo();
    };
    
    root.prototype.setUserinfo = function(){
      $("#ih-hi").html("hi," + this.dm.sysUser.name);
      $("#ih-login-button").html("Logout");
      $("#ih-login-button").unbind("click");
      $("#ih-login-button").click(ih.$F(function(){
      var me = this;
        $('#dialog').dialog({
            autoOpen: false,
            width: 600,
            title: "温馨提示",
            buttons: {
                "Ok": function() {
                  me.setUserLogout();
                  $(this).dialog("close");
                },
                "Cancel": function() {
                    $(this).dialog("close");
                }
            }
        });

        // Dialog Link
        $('#dialog').html("确认登出？").dialog('open');
      }).bind(this));
    };
    
    root.prototype.setUserLogout = function(){
      this.dm.sysUser.logout();
      $("#ih-hi").html("");
      $("#ih-login-button").html("Login");
      $("#ih-login-button").unbind("click");
      $("#ih-login-button").click(ih.$F(function(){
        this.onLoginBtnClicked();
      }).bind(this));
    };
    
    root.prototype.onForgetPwdMaskBtnClicked = function(){
      this.showMessage({title:"温馨提示", text:"Coming soon"});
    };
    
    root.prototype.onCloseMaskBtnClicked = function(){
      $("#ds_container").addAnimation("bounceOutUp");
      $("#ih-mask").addAnimation("fadeOut");
      var tempF = function(){
        $("#ih-mask").css("display", "none");
      };
      window.setTimeout(tempF, 2000);
      
    };
    
    root.prototype.onLoginBtnClicked = function(){
      $("#ih-mask").css("display", "block");
      $("#ih-mask").addAnimation("fadeIn");
      $("#ds_container").html(this.loginHtml);
      $("#ds_container").addAnimation("bounceInUp");
      
      $("#ih-register-btn").click(ih.$F(function(){
        this.onRegisterBtnClicked();
      }).bind(this));
      $("#ih-login-btn").click(ih.$F(function(){
        this.onSignInBtnClicked();
      }).bind(this));
      $("#ih-forgetPwd-btn").click(ih.$F(function(){
        this.onForgetPwdMaskBtnClicked();
      }).bind(this));
      
    };
    
    root.prototype.localize = function(){
      // Main content
      this.mainContent = this.mainContent.replace(/@content-title/i, this.languages[this.selectedLanguage]["content-title"]);
      this.mainContent = this.mainContent.replace(/@content-col-1-title/i, this.languages[this.selectedLanguage]["content-col-1-title"]);
      this.mainContent = this.mainContent.replace(/@content-col-1-description/i, this.languages[this.selectedLanguage]["content-col-1-description"]);
      this.mainContent = this.mainContent.replace(/@content-col-1-link/i, this.languages[this.selectedLanguage]["content-col-1-link"]);
      this.mainContent = this.mainContent.replace(/@content-col-2-title/i, this.languages[this.selectedLanguage]["content-col-2-title"]);
      this.mainContent = this.mainContent.replace(/@content-col-2-description/i, this.languages[this.selectedLanguage]["content-col-2-description"]);
      this.mainContent = this.mainContent.replace(/@content-col-2-link/i, this.languages[this.selectedLanguage]["content-col-2-link"]);
      this.mainContent = this.mainContent.replace(/@content-col-3-title/i, this.languages[this.selectedLanguage]["content-col-3-title"]);
      this.mainContent = this.mainContent.replace(/@content-col-3-description/i, this.languages[this.selectedLanguage]["content-col-3-description"]);
      this.mainContent = this.mainContent.replace(/@content-col-3-link/i, this.languages[this.selectedLanguage]["content-col-3-link"]);
        
      $("#ih-main").html(this.mainContent);
        
      // Footer
      this.mainFooter = this.mainFooter.replace(/@footer-ihakula/i, this.languages[this.selectedLanguage]["footer-ihakula"]);
      this.mainFooter = this.mainFooter.replace(/@footer-aboutme/i, this.languages[this.selectedLanguage]["footer-aboutme"]);
      this.mainFooter = this.mainFooter.replace(/@footer-privacy/i, this.languages[this.selectedLanguage]["footer-privacy"]);
      
      $("#ih-footer").html(this.mainFooter);
    };
    
    root.prototype.buildRecommands = function(){
      var target = document.getElementById('ih-recommands');
      var spinner = new Spinner(ih.plugins.rootPlugin.spinnerDefaultOpts).spin(target);
      
      var replacement = document.getElementById('ih-recommands');
			replacement.id = "ih-recommands";
			var el = document.getElementById('ih-recommands');
			el.parentNode.replaceChild(replacement, el);
      
			coverflow('ih-recommands').setup({
        width: '100%',
        item: 1,
        playlist: [
          {
          "title": "Gantts Everything",
          "description": "Don't just make a plan, just do it!",
          "image": "http://localhost/AppStore/iHakula/images/product-gantt.png",
          "link": "http://www.ihakula.com/",
          "duration": "183"
          },
          {
          "title": "Life Assistant",
          "description": "Account your life, it is a good life!",
          "image": "http://localhost/AppStore/iHakula/images/product-iaccount.png",
          "duration": "782"
          }
          ],
        coverwidth: 360,
        coverheight: 150,
        fixedsize: true,
        textoffset: 50,
        backgroundcolor:"ffffff",
        reflectionopacity:0.1,
        coverdepth:120,
        covergap:80

        })
        .on('ready', function(){
          spinner.stop();
          
          this.on('focus', function(index) {
            console.log(index);
          });
				
          this.on('click', function(index, link) {
            var ganttPlugin = ihSysEngine.root.findChildPluginById("ih.plugins.gantt");
            if(!ganttPlugin.scriptsLoaded) {
              ih.plugins.rootPlugin.showMaskSpinner();
              ganttPlugin.loadScripts();
            } else {
              ganttPlugin.pluginAnchor.scriptsLoaded();
            }
          });
        
        });
    
      window.onresize = function() {
        coverflow('ih-recommands').resize();
      };
    };
    
    root.prototype.showMessage = function(dialogMsg){
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
    
    root.prototype.setupErrorinfo = function(){
      this.errorInfo = {
        900 : this.languages[this.selectedLanguage]["errorcode_900"]
      };
    };
    
    root.prototype.setupLanguage = function(){
      this.selectedLanguage = "zh";
      
      this.languages = {
        "zh" : {
          "content-title":"让我们的生活从此变得简单",
          "content-col-1-title":"精品推荐",
          "content-col-1-description":"工作上我们可能会用到的",
          "content-col-1-link":"了解详情",
          "content-col-2-title":"生活常用",
          "content-col-2-description":"生活必需居于中心，一切以它展开",
          "content-col-2-link":"了解详情",
          "content-col-3-title":"友情推荐",
          "content-col-3-description":"不要对你的财富视而不见",
          "content-col-3-link":"了解详情",
          
          "footer-ihakula":"ihakula",
          "footer-aboutme":"关于我",
          "footer-privacy":"隐私权和条款",
          
          "registerSucceed":"恭喜，注册成功，请登录"
        },
        "en" : {
          
        }
      };
    };
    
    root.prototype.initHtmls = function(){
      this.mainContent = '<h3 class="secondary"> @content-title </h3><div class="main-cols"><div class="main-col"><h4>@content-col-1-title</h4><p>@content-col-1-description</p><p><a id="content-col-1-link">@content-col-1-link</a></p></div><div class="main-col"><h4>@content-col-2-title</h4><p>@content-col-2-description</p><p><a id="content-col-2-link">@content-col-2-link</a></p></div><div class="main-col"><h4>@content-col-3-title</h4><p>@content-col-3-description</p><p><a id="content-col-3-link">@content-col-3-link</a></p></div></div>';
      this.mainFooter = '<div class="ih-aux"><ul><li><a id="mf-ihakula">@footer-ihakula</a></li><li><a id="mf-aboutme">@footer-aboutme</a></li><li><a id="mf-privacy">@footer-privacy</a></li></ul></div>';
      this.logoHtml = '<div id="ih-logo"></div>';
      this.loginHtml = this.logoHtml + '<div id="ih-login" class="ih-dialog">' +
            '<header class="hero">' +
              '<hgroup>' +
                '<h3>Sign in</h3>' +
                '<p class="intro">Use the iHakula ID you used to register or register now.</p>' +
              '</hgroup>' +
            '</header>' +
            '<div class="dialog-cell">' +
              '<font size="2"><label for="accountname"><span class="dslabel">iHakula ID:</span></label></font>' +
              '<input size="30" autocapitalize="off" autocorrect="off" maxlength="128" id="accountname" type="text" value="" name="theAccountName"/>' +
            '</div>' +
            '<div class="dialog-cell">' +
              '<font size="2"><label for="accountpassword"><span class="dslabel">Password:</span></label></font>' +
              '<input size="30" autocapitalize="off" oncut="return false ;" oncopy="return false ;" autocorrect="off" maxlength="32" id="accountpassword" type="password" name="theAccountPW"/>' +
            '</div>' +
            '<div style="height:33px;">' +
              '<a id="ih-register-btn" class="button large register-button"><span>Register</span></a>' +
              '<a id="ih-login-btn" class="button large blue signin-button"><span>Sign In</span></a>' +
            '</div>' +
            '<div class="divider"></div>' +
            '<a id="ih-forgetPwd-btn" class="forgot-button">Forgot ID or Password?</a>' +
      
          '</div>';
    this.registerHtml = this.logoHtml + '<div id="ih-register" class="ih-dialog">' +
            '<header class="hero">' +
                '<hgroup>' +
                    '<h3>Register</h3>' +
                    '<p class="intro">Use email set as your iHakula ID.</p>' +
                '</hgroup>' +
            '</header>' +
            '<div class="dialog-cell">' +
                '<font size="2"><label for="accountname"><span class="dslabel">iHakula ID:</span></label></font>' +
                '<input size="30" autocapitalize="off" autocorrect="off" maxlength="128" id="accountname" type="text" value="" name="theAccountName"/>' +
            '</div>' +
            '<div class="dialog-cell">' +
                '<font size="2"><label for="accountpassword"><span class="dslabel">Password:</span></label></font>' +
                '<input size="30" autocapitalize="off" oncut="return false ;" oncopy="return false ;" autocorrect="off" maxlength="32" id="accountpassword" type="password" name="theAccountPW"/>' +
            '</div>' +
            '<div class="dialog-cell">' +
                '<font size="2"><label for="confirmpassword"><span class="dslabel">Confrim:</span></label></font>' +
                '<input size="30" autocapitalize="off" oncut="return false ;" oncopy="return false ;" autocorrect="off" maxlength="32" id="confirmpassword" type="password" name="confirmAccountPW"/>' +
            '</div>' +
            
            '<div style="height:33px;">' +
                '<a id="register-cancel" class="button large register-button"><span>Cancel</span></a>' +
                '<a id="register-sure" class="button large blue signin-button"><span>Sure</span></a>' +
            '</div>' +
            '<div class="divider"></div>' +
            
        '</div>';
    };

  });

  window.ihSysEngine.pubsub.publish("ihRootPluginReady");
