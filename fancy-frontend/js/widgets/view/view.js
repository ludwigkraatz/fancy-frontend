define(['fancyPlugin!fancyWidgetCore', 'fancyPlugin!fancyFrontendConfig'], function($, config){
    $(function() {

        $.widget( config.apps['fancy-frontend'].namespace + '.view', $[config.apps['fancy-frontend'].namespace].core, { // 
            options: {
                attached: false,                                // tells whether the view is attached to an widget or standalone
                limit:  1,                                      // how many active view are allowed
                showEmpty: true,                                // whether to show or hide when no active views
                initView: null
            },
            
            _create: function(){
                if (!this.options.attached) {
                    this.element.addClass(config.frontend_generateClassName('proxy'))
                }
                
                //this._superApply( arguments ); -- dont use cores create method
                this.$view = null
                this.views = {}
                this.history = [];
                this.active = [];
                this.activeViews = {};
                
                this.element.on('popup', this.showViewHandler.bind(this, false, true));
                this.element.on('show', this.showViewHandler.bind(this, false, false));
                this.element.on('replace', this.showViewHandler.bind(this, true, false));
                this.element.on('clear', this.clearViewHandler.bind(this, false));
                this.element.on('remove', this.clearViewHandler.bind(this, true));
                
                if (this.options.initView) {
                    this.element.trigger((this.options.initView.popup ? 'popup' : 'show'), [
                                          this.options.initView.name,
                                          this.options.initView.elements,
                                          this.options.initView.setContent,
                                          this.options.initView.reloadContent,
                                          this.options.initView.cache
                                          ])
                }
                
                this.element.trigger('end-initializing');
            },
            
            isFull: function(){
                var counter = 0;
                for (var view in this.activeViews) {
                    counter++;
                    if (counter >= this.options.limit) {
                        return true
                    }
                }
                return false
                
            },
            
            isEmpty: function(){
                for (var view in this.activeViews) {
                    return false
                }
                return true
                
            },
            
            showViewHandler: function(  replace,                // whether or not to use a cashed view
                                        popup,                  // whther to show as popup
                                        event,
                                        viewIdentifier,         // identifier that enables to cache this view
                                                                // might be a function to call dynamically
                                        showElements,           // elements to view
                                                                // e.g. (this.$body, this.$header) or this.$body
                                        setContent,             // method that updates its own access, to the now cloned
                                                                // elements defined in showElements
                                        reloadContent,          // method that might be called if no cached content available
                                        cache                   // boolean that tells whether to cache content or not
                                        ){
                event.stopImmediatePropagation();
                var currentViewIdentifier = typeof viewIdentifier == 'function' ? viewIdentifier() : viewIdentifier;
                if (currentViewIdentifier == '') {
                    currentViewIdentifier = '.';
                }
                var needsReload = true,
                    attach = true,
                    initializing = false;
                
                if (this.activeViews[currentViewIdentifier] !== undefined) {
                    this.log('(view)', 'cached', currentViewIdentifier, this.activeViews[currentViewIdentifier])
                    return false// nothing to do
                }
                if (!this.options.attached && this.element.hasClass(config.frontend_generateClassName('state-active-proxy'))) {
                    this.element.addClass(config.frontend_generateClassName('state-active-proxy'));
                    this.element.trigger('start-initializing');
                    initializing = true;
                }
                
                if (! typeof showElements == 'object') {
                    if (showElements) {
                        showElements = {'.': showElements};
                    }else{
                        showElements = {};
                    }
                }
                
                var view = this.views[ currentViewIdentifier ];
                if (!popup) {
                    this.history.push(currentViewIdentifier);
                }
                
                if (view !== undefined) {
                    if (replace) {
                        this.element.trigger('remove', [view]);
                        view = undefined;
                    }else{
                        view = undefined; // TODO: make normal caching work
                        //needsReload = false;
                    }
                }
                if (this.isFull()) {
                    this.element.trigger('clear', [1]);
                }
                if (view === undefined ){
                    if (typeof showElements == 'function'){
                        showElements = showElements();
                    }
                    view = {};
                    view['cache'] = cache;
                    view['origElements'] = showElements;
                    view['initialViewIdentifier'] = currentViewIdentifier;
                    view['viewIdentifier'] = viewIdentifier;
                    var clonedElements = view['elements'] = {};
                    for (element in showElements){
                        var origElement = showElements[element],
                            clonedElement;
                        if (!origElement) {
                            origElement = 'div';
                        }
                        if (typeof origElement === 'string') {
                            clonedElement = $('<'+origElement+'></'+origElement+'>');
                        }else{
                            attach = false;
                            clonedElement = origElement;
                        }
                        clonedElements[element] = clonedElement;
                        
                    }
                    
                    this.views[ currentViewIdentifier ] = view;
                }

                if (attach) {
                    for (var element in view.elements){
                        this.element.append(view.elements[element])
                    }
                }
                if (!popup) {
                    this.active.push(currentViewIdentifier);
                    this.activeViews[currentViewIdentifier] = view;
                }
                
                if (setContent) {
                    setContent(view.elements)
                }
                if (needsReload && reloadContent) {
                    reloadContent()
                }
                if (initializing) {
                    this.element.trigger('end-initializing');
                }
                this.log('(view)', 'showed', currentViewIdentifier);
                return false;
            },
            
            clearViewHandler: function(remove, event, view){
                event.stopImmediatePropagation();
                if (view === undefined) {
                    for (view in this.activeViews){
                        try {
                            this.clearViewHandler(remove, event, this.acivteViews[view])
                        } catch(e) {
                            this.log('(error)', 'Couldnt clear view', view, e);
                        }
                    }
                    return false
                }
                if (typeof view === 'number') {
                    for (var _view=0; _view < view; _view++){
                        // TODO: allow protected views
                        this.clearViewHandler(remove, event, this.activeViews[this.active[0]])// this.history.slice(-1 * this.options.limit)[0])
                    }
                    return false
                }
                var viewIdentifier,
                    initialViewIdentifier;
                if (typeof view.viewIdentifier == 'function') {
                    viewIdentifier = view.viewIdentifier();
                    initialViewIdentifier = view.initialViewIdentifier;
                }else{
                    viewIdentifier = initialViewIdentifier = view.viewIdentifier;
                }
                
                this.active = this.active.splice(this.active.indexOf(initialViewIdentifier), 1);
                delete this.activeViews[initialViewIdentifier];
                this.log('(view)', 'deleted', initialViewIdentifier);
                if (view.cache && !remove ) {
                    // create a new reference (without cloning) this view. if the original wants to be clean by default
                    // it should trigger the replace event
                    if (initialViewIdentifier !== viewIdentifier){
                        this.views[ viewIdentifier ] = view;
                    }
                    for (element in view.elements){
                        view.elements[element].detach();
                    };
                }else{
                    for (element in view.elements){
                        view.elements[element].remove();
                    };
                }
                
                if (!this.options.attached && !this.options.showEmpty && this.isEmpty()) {
                    this.element.removeClass(config.frontend_generateClassName('state-active-proxy'));
                }
                
                if (view.setContent) {
                    view.setContent() // all elements are set to undefined now
                }
                
                return false
            }
        });


    })
    return $
});