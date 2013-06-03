
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 5/29/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

  ih.defineClass("ih.plugins.productsViewController", null, null, function(PRODUCT, product){
  
    product.prototype.init = function(){
      this.dm = new ih.plugins.productsDataModel();
      this.dm.delegate = this;
      this.loadContent();
    };
    
    product.prototype.loadContent = function(){
      this.accountHtml = '<div style="clear:both;"><h2>iHakula Store</h2><div id="ih-panelBody">'+
        '<table class="" cellpadding="0" cellspacing="0" style="margin-top:15px;">'+
        '<tbody>'+
          '<tr>'+
            '<td id="ih-navPanelContainer" class="OK" style="">'+
            '<div id="ih-newNavPanel" style="">'+
              '<div class="q"><div class="cC">产品列表</div>'+
              '<div class="Hc"><div id="ih-tally" class="P selecting"><div class="hm">精品推荐</div></div></div>'+
              '<div class="Hc"><div id="ih-statistics" class="P"><div class="hm">生活常用</div></div></div>'+
              '<div class="Hc"><div id="ih-analyse" class="P"><div class="hm">友情推荐</div></div></div>'+
           '</div>'+
           '</td>'+
           '<td id="ih-navToggle" class="St"><div class="Bmb"></div></td>'+
           '<td id="ih-view" class="BQ">'+
            '<div class="IJ">'+
              '<div class="mw">'+
                '<div id="ih-reportContainer" class="Ti">'+
                '</div>'+
              '</div>'+
            '</div>'+
           '</td>'+
           '</tr>'+
        '</tbody>'+
        '</table>'+
        '</div></div>';
        
      $("#content").html(this.accountHtml);
    };
    
    
  });