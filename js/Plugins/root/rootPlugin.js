
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 4/11/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

  ih.defineClass("ih.plugins.rootPlugin", null, null, function(PLUGIN, plugin){
  
    plugin.prototype.init = function(){
      ih.rootUrl = "http://localhost/AppStore/iHakula/api/index.php/";
      ih.hostRoot = "http://localhost/AppStore/iHakula/";
      this.setupSysConfigurations();
    };
    
    plugin.prototype.setupSysConfigurations = function(){
      this.spinnerDefaultOpts = {
        lines: 11, // The number of lines to draw
        length: 1, // The length of each line
        width: 6, // The line thickness
        radius: 12, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        color: '#000', // #rgb or #rrggbb
        speed: 0.9, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: true, // Whether to render a shadow
        hwaccel: true, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
      };
    };
    
    plugin.prototype.showMaskSpinner = function(){
      $("#ih-mask").css("display", "block");
      $("#ih-mask").addAnimation("fadeIn");
      var target = document.getElementById('ds_container');
      this.spinnerDefaultOpts.color = '#ffffff';
      this.spinnerDefaultOpts.top = '200px';
      this.spinner = new Spinner(ih.plugins.rootPlugin.spinnerDefaultOpts).spin(target);
    };
    
    plugin.prototype.hideMaskSpinner = function(){
      this.spinner.stop();
      $("#ih-mask").addAnimation("fadeOut");
      var tempF = function(){
        $("#ih-mask").css("display", "none");
      };
      window.setTimeout(tempF, 2000);
    };
    
    plugin.prototype.scriptsLoaded = function(){
      ih.plugins.rootViewController = new ih.plugins.rootViewController();
    };
    
    
    
  });