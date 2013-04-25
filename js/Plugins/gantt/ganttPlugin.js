
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 4/11/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

  ih.defineClass("ih.plugins.ganttPlugin", null, null, function(PLUGIN, plugin){
  
    plugin.prototype.init = function(){
    };
    
    plugin.prototype.scriptsLoaded = function(){
      ih.plugins.rootPlugin.hideMaskSpinner();
      ih.plugins.ganttViewController = new ih.plugins.ganttViewController();
    };
    
    
    
  });