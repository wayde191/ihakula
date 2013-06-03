/**
  *@Version : 1.0
  *@Author : Wayde Sun
  *@Time : 2010.3.4
  */

  ih.defineClass('ih.plugins.productsPlugin', null, null, function(PLUGIN, plugin){
  
    plugin.prototype.init = function(){
    }
    
    plugin.prototype.scriptsLoaded = function(){
      ih.plugins.rootPlugin.hideMaskSpinner();
      ih.plugins.products = new ih.plugins.productsViewController();
    };
    
  });