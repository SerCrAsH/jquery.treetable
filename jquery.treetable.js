/***************************************************************/
/** Tree table JQuery plugin - Sercrash
*   Version :  v.1.0.1 
*   Author : Sercrash
*   URL : https://github.com/SerCrAsH/jquery.treetable
****************************************************************/
/***** Rules:
 parent row must be : 
 <tr data-tr-id="1" data-tr-level="1">
 children row must be : 
 <tr data-tr-id="1-1" data-tr-parent="1" data-tr-level="2">
 parent must have an ".carent" element = 
 <span class="caret expand"></span>
 ******/
/** Script code * */
// IIFE - Immediately Invoked Function Expression
(function(scriptCode) {
  scriptCode(window.jQuery, window, document);
}(function($, window, document) {

  // DOM is ready
  $(function() {
    $.fn.treeTable = TreeTable.init;
  });
  // Dependencies of DOM ready status
  var TreeTable = {};
  
  // Options
  TreeTable.opts = {
    classes : { // Class selectors
      // Table
      tableUniqueIds : 'treetable-unique-ids',
      // Tr
      trExpanded : 'expanded',
      trCollapsed : 'collapsed',
      // Caret
      caret : 'caret',
      caretExpanded : 'expand',
      caretCollapsed : 'collapsed'
    },
    attrs : { // Attributes
      trId : 'data-tr-id',
      trParentId : 'data-tr-parent-id',
      trLevel : 'data-tr-level'
    },
    events : { // Events
      loaded : 'treetable.loaded'
      
    }
  };
  
  /** Functions * */
  // Initialization and calls
  TreeTable.init = function(call, opts) {
    // Set settings
    var settings = $.extend(true, TreeTable.opts, opts);
    var $table = $(this);
    
    // Available functions
    var functions = {
      /** @function sart */
      start : function() {
        // Custom events
        $table
          .off('click treetable.toggle treetable.expand treetable.collapse', 'tr')
          .on('click treetable.toggle treetable.expand treetable.collapse', 'tr', functions.toggleRow);
        
        // Click Events
        $table.off('click', 'tr .expand').on('click', 'tr .expand', functions.expandRow);
        $table.off('click', 'tr .collapse').on('click', 'tr .collapse', functions.collapseRow);
        
        // Hide all childrens
        functions.hideAllChildrens();
        
        // Finish event & return
        return $table.trigger(settings.events.loaded);
      },
      
      /** @function toggleRow */
      toggleRow : function(event) {
        // (event || (event = window.event) , event.stopPropagation() ); // Event
        // Vars
        var $ele = $(this),
          $tr = $ele.is('tr')? $ele : $ele.closest('tr');
        
        // Check if is a tr to expand event else will be a collapse one
        var isExpandEvent = event.namespace === 'expand'? true : 
          event.namespace === 'collapse'? false :  undefined;
        // If expand event is undefined (its a click event)
        if(typeof isExpandEvent === 'undefined'){
          isExpandEvent = $tr.is('.treetable-collapsed') || !$tr.is('.treetable-expanded,.treetable-expanded') ;
        } 
        
        // Toggle childrens
        if(isExpandEvent){
          functions.showChildrens($tr);
        } else {
          functions.hideChildrens($tr);
        }
      },
      
      /** @function showChildrens */
      showChildrens : function($tr) {
        var id = $tr.attr('data-tr-id'), $childrens;
        $childrens = $tr.closest('tbody').find('tr[data-tr-parent="' + id + '"]');
        
        // Show inmediate childrens
        $childrens.show();
        // Update tr class
        $tr.addClass('treetable-expanded').removeClass('treetable-collapsed')
          .find('.caret').addClass('collapse').removeClass('expand');
      },
      
      /** @function hideChildrens */
      hideChildrens : function($tr) {
        var id = $tr.attr('data-tr-id'), $childrens;
        // If table must much by exact ids and not appended
        if($table.is('.' + settings.classes.tableUniqueIds)){
          $childrens = $tr.closest('tbody').find('tr[data-tr-parent="' + id + '"]');
          $.each($childrens, function(i,children){
            var $children = $(children);
            // Hide descendants
            functions.hideChildrens($children);
            
            // Hide
            $children.hide();
          });
          
        } else{
          $childrens = $tr.closest('tbody').find('tr[data-tr-parent^="' + id + '"]');
          $childrens.hide()
            .addClass('treetable-collapsed').removeClass('treetable-expanded')
            .find('.caret').addClass('expand').removeClass('collapse');
        }
          
        // Update tr class
        $tr.addClass('treetable-collapsed').removeClass('treetable-expanded')
          .find('.caret').addClass('expand').removeClass('collapse');
      },
      
      /** @function hideChildrens */
      showAllChildrens : function() {
        // Display all table elements
        $table.find('[data-tr-level][data-tr-level!=1]').show()
          .addClass('treetable-expanded').removeClass('treetable-collapsed')
          .find('.caret').addClass('collapse').removeClass('expand');
      },
      
      /** @function hideChildrens */
      hideAllChildrens : function() {
        // Reset table
        $table.find('[data-tr-level][data-tr-level!=1]').hide()
          .addClass('treetable-collapsed').removeClass('treetable-expanded')
          .find('.caret').addClass('expand').removeClass('collapse');
      },
      
      /** @function expandRow */
      expandRow : function(event) {
        (event || (event = window.event) , event.stopPropagation() );
        event.stopPropagation();
        
        $(this).closest('tr').trigger('treetable.expand');
      },
      /** @function collapseRow */
      collapseRow : function(event) {
        (event || (event = window.event) , event.stopPropagation() );
        event.stopPropagation();
        
        $(this).closest('tr').trigger('treetable.collapse');
      }
    };

    // Default function call
    call || (call = 'start');
    return functions[call]();
  };

}));
// End script
/** **************************************************************************************************** */
