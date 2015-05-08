define(['fancyPlugin!fancyWidgetCore', 'fancyPlugin!fancyFrontendConfig'], function($, config){
    $(function() {

        $.widget( config.apps['fancy-frontend'].namespace + '.view', $[config.apps['fancy-frontend'].namespace].core, { // 
            options: {
                attached: false,                                // tells whether the view is attached to an widget or standalone
                limit:  1,                                      // how many active view are allowed
                showEmpty: true,                                // whether to show or hide when no active views
                initView: null,
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
                this.element.on('page', this.updateViewHandler.bind(this));
                
                if (this.options.initView) {
                    this.log('(fancy-frontend)', '(widget)', '(view)', 'init view', this.options.initView)
                    this.element.trigger((this.options.initView.popup ? 'popup' : 'show'), [
                                          this.options.initView
                                          ])
                }
                
                if (!this.options.attached) {
                    this.element.removeClass(config.frontend_generateClassName('state-initializing'));
                }else{
                    this.element.trigger('end-initializing');
                }
            },
            
            updateViewHandler: function(
                                        event,
                                        currentViewIdentifier,  // see showViewHandler
                                        page                    // next | previous | A | 1 | 2 | 3.1 | 4.2.1 | ...
            ){
                event.stopImmediatePropagation();
                var view = this.views[ currentViewIdentifier ];
                view.paginationConfig.showPageHandler(page)
                var stateActive = config.frontend_generateClassName('state-active');
                this.$pagination.find('.' + stateActive).removeClass(stateActive);
                this.$pagination.find('[' + config.frontend_generateAttributeName('page-identifier') + '=' + page + ']').addClass(stateActive);
            },
            
            updatePaginationHandler: function(
                                        currentViewIdentifier,  // see showViewHandler
                                        pages                   // next | previous | A | 1 | 2 | 3.1 | 4.2.1 | ...
            ){
                var view = this.views[ currentViewIdentifier ];
                if (typeof pages == 'number') {
                    pages = Array.apply(null, Array(pages)).map(function (_, i) {return i+1;});
                }
                var display = view.paginationConfig.display || 'text';
                    currentPage = view.paginationConfig.currentPage !== null ? view.paginationConfig.currentPage | pages[0] : null
                
                if (!this.$pagination) {
                    var $pagination = $('<div class="'+config.frontend_generateClassName('navigation')+'"></div>');
                    for (var i in pages) {
                        var page = pages[i],
                            page_action = $('<div></div>');
                        page_action.addClass(config.frontend_generateClassName('action'));
                        if (page == currentPage) {
                            page_action.addClass(config.frontend_generateClassName('state-active'))
                        }
                        page_action.attr(config.frontend_generateAttributeName('page-identifier'), page)
                        
                        if (display == 'text') {
                            page_action.html(page);
                        } else if (display == 'dots') {
                            var dot = '<svg height="10" width="10"><circle cx="5" cy="5" r="4" stroke="black" stroke-width="1" />';
                            page_action.html(dot);
                        }
                        
                        page_action.click(this.element.trigger.bind(this.element, 'page', [currentViewIdentifier, page]))
                        $pagination.append(page_action);
                    }
                    this.$pagination = $pagination;

                    var $target = view.paginationConfig.target || this.element;
                    if ($target) {
                        $target.append($pagination);
                    }
                }
                
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
            
            hash_view: function(name, data){
                var hash = name;
                var keys = []
                for (var key in data) {
                    if(data.hasOwnProperty(key)){
                        keys.push(String(key));
                    }
                }
                for (var index in keys.sort()) {
                    var key = keys[index];
                    hash += ';' + key + ':' + JSON.stringify(data[key])
                }
                return hash
            },
            
            showViewHandler: function(  replace,                // whether or not to use a cashed view
                                        popup,                  // whther to show as popup
                                        event,
                                        viewIdentifier_or_config,
                                                                // config which contains the following settings or
                                                                // identifier that enables to cache this view
                                                                // might be a function to call dynamically
                                        viewData,               // data thats is used by view widget
                                        showElements,           // elements to view
                                                                // e.g. (this.$body, this.$header) or this.$body
                                        setContent,             // method that updates its own access, to the now cloned
                                                                // elements defined in showElements
                                        reloadContent,          // method that might be called if no cached content available
                                        cache,                  // boolean that tells whether to cache content or not
                                        paginationConfig        // object containing the following options:
                                                                // target:              - $() element
                                                                // display:
                                                                //      text:           - displays as text as given in paginationConfig.pages
                                                                //      breadcrumb      - like text, but as breadcrumbs
                                                                //      dots            - little dots, symbolizing the pages (use not recommended for pages.length > 10)
                                                                // detail:
                                                                //      -1:  isolated   - only show pagination of current view (default for popups)
                                                                //      0: | group      - only show pagination of available groups
                                                                //      1: | active     - only show pagination of available groups including subgroups for active group
                                                                //      2: | all        - show pagination for all groups and subgroups
                                                                // pages:               - list of available pages or integer defining [1,2,...].length
                                                                //                      - or handler, that accepts a view method to be called on pages updates/and initialization
                                                                // showPageHandler: (   - method to call on page change
                                                                //      page_identifier - one of the elements from the pages list
                                                                // )
                                                                // currentPage:         - default: first.
                                                                //                      - if function, a method changePage(page_identifier) is passed
                ){
                event.stopImmediatePropagation();

                var viewIdentifier;
                if (viewIdentifier_or_config && typeof viewIdentifier_or_config == 'object') {
                    viewIdentifier = viewIdentifier_or_config.name;
                    viewData = viewIdentifier_or_config.data;
                    showElements = viewIdentifier_or_config.elements;
                    setContent = viewIdentifier_or_config.setContent;
                    reloadContent = viewIdentifier_or_config.reloadContent;
                    cache = viewIdentifier_or_config.cache;
                    paginationConfig = viewIdentifier_or_config.paginationConfig;
                }else{
                    viewIdentifier = viewIdentifier_or_config;
                }

                var currentViewIdentifier = typeof viewIdentifier == 'function' ? viewIdentifier() : viewIdentifier;
                if (currentViewIdentifier == '') {
                    currentViewIdentifier = '.';
                }
                currentViewIdentifier = this.hash_view(currentViewIdentifier, viewData);
                this.log('(event)', '(fancy-frontend)', '(view)', '(show)', event, viewIdentifier_or_config)

                var needsReload = true,
                    attach = false,  // TODO: when true?
                    initializing = false;
                
                if (this.activeViews[currentViewIdentifier] !== undefined) {
                    this.log('(view)', 'cached', currentViewIdentifier, this.activeViews[currentViewIdentifier])
                    return false  // nothing to do
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
                        // view = undefined; // TODO: make normal caching work
                        //needsReload = false;
                    }
                }
                if (this.isFull()) {
                    this.element.trigger('clear', [1]);
                }
                if (typeof showElements == 'function'){
                    showElements = showElements();
                }
                if (view === undefined ){
                    view = {};
                    this.log('(view)', 'creating new view obj', currentViewIdentifier, view)
                    view['cache'] = cache;
                    view['origElements'] = showElements;
                    view['initialViewIdentifier'] = currentViewIdentifier;
                    view['initialViewData'] = viewData;
                    view['viewData'] = viewData;
                    view['viewIdentifier'] = viewIdentifier;
                    view['paginationConfig'] = paginationConfig
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
                if (paginationConfig) {
                    if (typeof paginationConfig.pages == 'function') {
                        paginationConfig.pages(this.updatePaginationHandler.bind(this, currentViewIdentifier))
                    }else{
                        this.updatePaginationHandler(currentViewIdentifier, paginationConfig.pages)
                    }
                    
                    if (typeof paginationConfig.currentPage == 'function') {
                        paginationConfig.currentPage(
                            this.element.trigger.bind(this.element, 'page', [
                                          currentViewIdentifier
                                          ])
                        )
                    }else if (paginationConfig.currentPage === null) {
                        this.element.trigger('page', [
                                      currentViewIdentifier,
                                      1
                                      ])
                    }
                }
                if (initializing) {
                    this.element.trigger('end-initializing');
                }
                this.log('(view)', 'showed', currentViewIdentifier, view);
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
                        this.clearViewHandler(remove, event, this.activeViews[this.active.pop()])// this.history.slice(-1 * this.options.limit)[0])
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
                viewIdentifier = this.hash_view(viewIdentifier, view.viewData);
                initialViewIdentifier = this.hash_view(initialViewIdentifier, view.initialViewData);
                
                this.active = this.active.splice(this.active.indexOf(initialViewIdentifier), 1);
                delete this.activeViews[initialViewIdentifier];
                this.log('(view)', 'deleted', initialViewIdentifier);
                if (view.cache && !remove ) {
                    // create a new reference (without cloning) this view.
                    // if the original wants to be clean by default
                    //   it should trigger the replace event
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
                    view.setContent(view.elements) // all elements are set to undefined now
                }
                
                return false
            }
        });


    })
    return $
});