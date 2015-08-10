define(['fancyPlugin!fancyWidgetCore'], function(fancyWidgetCore){
    var $ = fancyWidgetCore.$,
        config = fancyWidgetCore.getFrontendConfig(),
        widgetConfig = fancyWidgetCore.getWidgetConfig();

    fancyWidgetCore_view = fancyWidgetCore.derive('widget', {
        name: 'view',
        namespace: config.apps['fancy-frontend'].namespace,
        widget: { // 
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
                this.$owner = this.options.scope['!private']["$owner"];
                this.$view = this.$owner || this;
                this._views = {}
                this.history = [];
                this.active = [];
                this.activeViews = {};
                
                if (!this.$owner) {
                    this.options.attached = false;
                }
                
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
                    //this.element.removeClass(config.frontend_generateClassName('state-initializing'));
                    this.$view = this;
                    this._superApply( arguments );
                    this.use_mixin('view', {view: this.element});
                }else{
                    this.element.trigger('end-initializing');
                }
                if (this.element.data('view-navigation')) {
                    this.options.navigation = this.element.data('view-navigation')
                }
                
                if (this.options.navigation) {
                    if (this.options.navigation.full_page) {
                        this.options.navigation.initial = this.options.navigation.initial || null;
                    }
                    this.setupNavigation(this.options.navigation)
                }
            },
            
            setupChoices: function(choices){
                    var options = [],
                        actions = [],
                        $this = this;
                    $.each(choices, function(name, config){
                        if (typeof config == 'string') {
                            var item = {
                                id: name,
                                label_id: config
                            };
                            options.push(item)
                        }else if (config.css_class) {
                            var item = {
                                id: name,
                                css_class: config.css_class
                            };
                            if (config.position) {
                                actions.splice(config.position, 0, item);
                            }else{
                                actions.push(item)
                            }
                        }else {
                            throw Error('dont know what to do with choices', config)
                        }
                    });
                    
                    if (actions.length) {
                        var $target = $this.$view.mixins.actions.initActionContainer.call($this.$view, $this.$view.$navi)
                        $.each(actions, function(index, action){
                            var view_id = action.id;
                            $this.$view.mixins.actions.addAction.call($this.$view, action, function(){
                                $this.$view.showView(view_id)
                                //$this.$view.trigger($this.$view.mixins.view.event_prefix + '-show', [view_id]);
                            }, $target)
                        })
                        $this.$view.mixins.actions.completedActionContainer.call($this.$view);
                    }
                    
                    if (options.length) {
                        var nav = $this.$view.$navi;
                        var select = $('<select></select>');
                        $.each(actions, function(index, elem){
                            select.append('<option vlaue="' + elem.id + '" translate="'+ elem.label_id +'"></option>')
                        })
                        nav.html(select);
                    }
            },
                
            setupNavigationEntry: function(menu_attr_name, menu, index, translation){
                this.options.scope[menu_attr_name][index] = {
                    id: index,
                    label: translation,
                    entry: menu[index]
                };
            },
            
            setupNavigation: function(navigation){
                var $this = this,
                    menu = navigation.menu || [],
                    menu_translation_prefix = '',
                    menu_attr_name = 'navigation';

                // menu
                if (menu.length) {
                    this.options.scope[menu_attr_name] = [];
                    var initial = parseInt(navigation.initial);
                    if (isNaN(initial)) {
                        initial = navigation.initial;
                        if (typeof initial == 'string') {
                            for (var index=0; index <= navigation.menu.length; index++){
                                if (menu[index].view == initial) {
                                    initial = index;
                                    break;
                                }
                            }
                        }
                    }
                    $this.$menu = this.$owner.newElement({
                        css_class: 'navigation',
                        tag: 'ul',
                        target: navigation.target || this.$view.$navi,
                        widget_identifier: 'fancy-frontend.list',
                        widget_options: {
                            source: this.options.scope[menu_attr_name],
                            onSelect: function(elem){
                                var conf;
                                if (elem.entry.view) {
                                    conf = [elem.entry.view, elem.entry.view_config]
                                }
                                if (elem.entry.template) {
                                    conf = ['template', elem.entry]
                                }
                                if (elem.entry.widget || elem.entry.plugin) {
                                    var identifier = elem.entry.widget ||elem.entry.plugin;
                                    var options = elem.entry.options;
                                    conf = ['widget', {widget_identifier: identifier, widget_options: options}]
                                }
                                $this.$view.showView(conf)
                                //$this.$view.element.trigger($this.$view.mixins.view.event_prefix + '-show', conf)
                            },
                            entryTemplate: '<a href="#" ><span class="'+config.frontend_generateClassName('action')+' '+config.frontend_generateClassName('action-')+'{{ _source.{index}.entry.icon }}"></span><span class="'+config.frontend_generateClassName('title')+'" translate="{{ _source.{index}.label }}"></span></a>',
                            entryTag: 'li',
                            inline: true,
                            size: config.frontend_generateClassName('size-small'),
                            selected: initial === undefined ? 0 : initial,
                            view: navigation.view,
                        }
                    })
                    for (var index=0; index < menu.length; index++) {
                        //$this.translate(menu_translation_prefix + menu[index].translation_identifier,
                        //                ViewMixin.setupNavigationEntry.bind($this, menu_attr_name, menu, index)
                        //);
                        var translation_id = this.$owner.build_translation_id(menu_translation_prefix + menu[index].translation_identifier);
                        this.setupNavigationEntry.call($this, menu_attr_name, menu, index, translation_id)
                    }
                    console.warn('svg in view navi doesnt work always!!')
                    this.$view.use_mixin('svg', {
                            watch: true,  // as we don't know when the css might be loaded. TODO: .onInitialized(function(){use_mixin()})
                        });
                    this.$view.apply($this.$menu, undefined, true)
                }

                // choices
                if (navigation.choices) {
                    this.setupChoices(navigation.choices);
                }
            },
            
            updateViewHandler: function(
                                        event,
                                        currentViewIdentifier,  // see showViewHandler
                                        page                    // next | previous | A | 1 | 2 | 3.1 | 4.2.1 | ...
            ){
                event.stopImmediatePropagation();
                var view = this._views[ currentViewIdentifier ];
                view.paginationConfig.showPageHandler(page)
                var stateActive = config.frontend_generateClassName('state-active');
                this.$pagination.find('.' + stateActive).removeClass(stateActive);
                this.$pagination.find('[' + config.frontend_generateAttributeName('page-identifier') + '=' + page + ']').addClass(stateActive);
            },
            
            updatePaginationHandler: function(
                                        currentViewIdentifier,  // see showViewHandler
                                        pages                   // next | previous | A | 1 | 2 | 3.1 | 4.2.1 | ...
            ){
                var view = this._views[ currentViewIdentifier ];
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
                if ( data && data.asIdentifier) {
                    hash += ';' + data.asIdentifier()
                }else{
                    for (var key in data) {
                        if(data.hasOwnProperty(key)){
                            keys.push(String(key));
                        }
                    }
                    for (var index in keys.sort()) {
                        var key = keys[index];
                        try {
                            hash += ';' + key + ':' + (typeof(data[key].asIdentifier) == 'function' ? data[key].asIdentifier() : JSON.stringify(data[key]))
                        } catch(e) {
                            throw e
                            console.log(key, data, e)
                            console.error('giving Object()  without asIdentifier method shouldnt be done. here is a circular structure. implement a asIdentifier() method')
                        }
                    }
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
                
                var view = this._views[ currentViewIdentifier ];
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
                    
                    this._views[ currentViewIdentifier ] = view;
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
                            this.clearViewHandler(remove, event, this.activeViews[view])
                        } catch(e) {
                            this.log('(error)', 'Couldnt clear view', view, e, e.stack, e.message);
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
                        this._views[ viewIdentifier ] = view;
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
        }
    });

    return fancyWidgetCore_view
});