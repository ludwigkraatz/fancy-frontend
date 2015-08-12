define(['fancyPlugin!jquery-ui', 'fancyPlugin!fancyWidgetMixins', 'fancyPlugin!fancyWidgetViews', 'fancyPlugin!introspective-api-handles', 'fancyPlugin!fancyFrontendConfig'], function($, mixins, views, apiHandles, config){

    var coreWidget_name = '',
        coreWidget_selector = '';

    var widgetConfig = {
        '_config': config
        };

    // config data
        widgetConfig.relationships = {
            instance_of: 'e001038c-0def-11e5-9a3e-78e3b5fc7f22',
            child_of: 'bf06381e-0def-11e5-82d3-78e3b5fc7f22',
        }
        widgetConfig.mixins = mixins;
        widgetConfig.views = views;
        widgetConfig.apiHandles = apiHandles;
        /* names */

        /* ->events */
        widgetConfig.name_event_close = config.frontend_generateEventName('close');
        widgetConfig.name_event_closed = config.frontend_generateEventName('closed');
        widgetConfig.name_event_preSave = config.frontend_generateEventName('pre-save');
        widgetConfig.name_event_save = config.frontend_generateEventName('save');
        widgetConfig.name_event_initiateSave = config.frontend_generateEventName('initiate-save');
        widgetConfig.name_event_postSave = config.frontend_generateEventName('post-save');
        widgetConfig.name_event_saveFailed = config.frontend_generateEventName('safe-failed');
        widgetConfig.name_event_notification = config.frontend_generateEventName('notification');
        widgetConfig.name_event_loading = config.frontend_generateEventName('loading');
        widgetConfig.name_event_loadingStart = config.frontend_generateEventName('start-loading');
        widgetConfig.name_event_loadingFinished = config.frontend_generateEventName('end-loading');
        widgetConfig.name_event_loadingFailed = config.frontend_generateEventName('loading-failed');
        widgetConfig.name_event_moved = config.frontend_generateEventName('moved');
        widgetConfig.name_event_reload = config.frontend_generateEventName('reload');
        widgetConfig.name_event_zoom = config.frontend_generateEventName('zoom');
        widgetConfig.name_event_unzoom = config.frontend_generateEventName('unzoom');
        widgetConfig.name_event_remove = config.frontend_generateEventName('remove');
        widgetConfig.name_event_tosDenied = config.frontend_generateEventName('tos-denied');
        widgetConfig.name_event_init = config.frontend_generateEventName('init');
        widgetConfig.name_event_preInit = config.frontend_generateEventName('pre-init');
        widgetConfig.name_event_warning = config.frontend_generateEventName('warning');
        widgetConfig.name_event_error = config.frontend_generateEventName('error');
        widgetConfig.name_event_checkInput = config.frontend_generateEventName('check-input');
        widgetConfig.name_event_mixin = 'dynamic-mixin';

        /* ->widgets */
        widgetConfig.name_widgets_core = config.frontend_generateName(config.widgets.defaults.core.name);
        widgetConfig.name_widgets_editor = config.frontend_generateName(config.widgets.defaults.editor.name);
        widgetConfig.name_widgets_form = config.frontend_generateName(config.widgets.defaults.form.name);
        widgetConfig.name_widgets_list = config.frontend_generateName(config.widgets.defaults.list.name);
        widgetConfig.name_widgets_popup = config.frontend_generateName(config.widgets.defaults.popup.name);

        /* ->classes */
        widgetConfig.name_classes_modalMask = config.frontend_generateClassName('modal-mask');
        widgetConfig.name_classes_close = config.frontend_generateClassName('action-close');
        widgetConfig.name_classes_accept = config.frontend_generateClassName('accept');
        widgetConfig.name_classes_add = config.frontend_generateClassName('add');
        widgetConfig.name_classes_cancel = config.frontend_generateClassName('cancel');
        widgetConfig.name_classes_save = config.frontend_generateClassName('save');
        widgetConfig.name_classes_edit = config.frontend_generateClassName('edit');
        widgetConfig.name_classes_right = config.frontend_generateClassName('right');
        widgetConfig.name_classes_left = config.frontend_generateClassName('left');
        widgetConfig.name_classes_icon =  config.frontend_generateClassName('icon');
        widgetConfig.name_classes_light = config.frontend_generateClassName('ui:icon-light');
        widgetConfig.name_classes_closeThick = config.frontend_generateClassName('ui:icon-closethick');
        widgetConfig.name_classes_body = config.frontend_generateClassName('body');
        widgetConfig.name_classes_header = config.frontend_generateClassName('header');
        widgetConfig.name_classes_navi = config.frontend_generateClassName('navigation');
        widgetConfig.name_classes_footer = config.frontend_generateClassName('footer');
        widgetConfig.name_classes_pagination = config.frontend_generateClassName('pagination');
        widgetConfig.name_classes_preview = config.frontend_generateClassName('preview');
        widgetConfig.name_classes_column = config.frontend_generateClassName('column');
        widgetConfig.name_classes_previewContent = widgetConfig.name_classes_content + ' ' + widgetConfig.name_classes_preview;
        widgetConfig.name_classes_active = config.frontend_generateClassName('active');
        widgetConfig.name_classes_loading = config.frontend_generateClassName('loading');
        widgetConfig.name_classes_loadingPlaceholder = config.frontend_generateClassName('loading-placeholder');
        widgetConfig.name_classes_invalid = config.frontend_generateClassName('invalid');
        widgetConfig.name_classes_descriptive = config.frontend_generateClassName('descriptive');
        widgetConfig.name_classes_deactivated = config.frontend_generateClassName('deactivated');
        widgetConfig.name_classes_sortable = config.frontend_generateClassName('sortable');
        widgetConfig.name_classes_list = config.frontend_generateClassName('object-list');
        widgetConfig.name_classes_title = config.frontend_generateClassName('title');
        widgetConfig.name_classes_log = config.frontend_generateClassName('log');

        widgetConfig.name_shape_element = config.frontend_generateClassName('shape-element');
        widgetConfig.name_shape_content = config.frontend_generateClassName('shape-content');
        widgetConfig.name_shape_page = config.frontend_generateClassName('shape-page');
        widgetConfig.name_shape_row = config.frontend_generateClassName('shape-row');
        widgetConfig.name_shape_widget = config.frontend_generateClassName('shape-widget');
        widgetConfig.name_shape_popup = config.frontend_generateClassName('shape-popup');
        widgetConfig.name_mixin_container = config.frontend_generateClassName('mixin-container');
        widgetConfig.name_shape_overlay = config.frontend_generateClassName('shape-overlay');
        widgetConfig.name_shape_icon = config.frontend_generateClassName('shape-icon');
        widgetConfig.name_size_sizeless = config.frontend_generateClassName('size-sizeless');
        widgetConfig.name_shape_shapeless = config.frontend_generateClassName('shape-shapeless');
        widgetConfig.name_size_small = config.frontend_generateClassName('size-small');
        widgetConfig.name_size_full = config.frontend_generateClassName('size-full');
        widgetConfig.name_state_active = config.frontend_generateClassName('state-active');

        /* -->widgets */
        widgetConfig.name_classes_widgets_core = config.frontend_generateClassName(config.widgets.defaults.core.css);
        widgetConfig.name_classes_widgets_editor = config.frontend_generateClassName(config.widgets.defaults.editor.css);
        widgetConfig.name_classes_widgets_form = config.frontend_generateClassName(config.widgets.defaults.form.css);
        widgetConfig.name_classes_widgets_list = config.frontend_generateClassName(config.widgets.defaults.list.css);
        widgetConfig.name_classes_widgets_popup = config.frontend_generateClassName(config.widgets.defaults.popup.css);

        /* selectors */

        /* ->widgets */
        widgetConfig.selector_widgets_core = '.' + widgetConfig.name_classes_widgets_core;
        widgetConfig.selector_widgets_editor = '.' + widgetConfig.name_classes_widgets_editor;
        widgetConfig.selector_widgets_form = '.' + widgetConfig.name_classes_widgets_form;
        widgetConfig.selector_widgets_list = '.' + widgetConfig.name_classes_widgets_list;
        widgetConfig.selector_widgets_popup = '.' + widgetConfig.name_classes_widgets_popup;

        /* ->elements */
        widgetConfig.selector_mixin_container = '.' + widgetConfig.name_mixin_container;
        widgetConfig.selector_elements_sortable = '.' + widgetConfig.name_classes_sortable;
        widgetConfig.selector_shape_element = '.' + widgetConfig.name_shape_element;
        widgetConfig.selector_elements_widget = '.' + widgetConfig.name_classes_widget;
        widgetConfig.selector_elements_column = '.' + widgetConfig.name_classes_column;
        widgetConfig.selector_elements_previewContent = '.' + widgetConfig.name_classes_preview + '.' + widgetConfig.name_classes_content;
        widgetConfig.selector_elements_header = '.' + widgetConfig.name_classes_header;
        widgetConfig.selector_elements_navi = '.' + widgetConfig.name_classes_navi;
        widgetConfig.selector_elements_footer = '.' + widgetConfig.name_classes_footer;
        widgetConfig.selector_elements_body = '.' + widgetConfig.name_classes_body;
        widgetConfig.selector_elements_pagination = '.' + widgetConfig.name_classes_pagination;
        widgetConfig.selector_elements_loading = '.' + widgetConfig.name_classes_loading;
        widgetConfig.selector_elements_save = '.' + widgetConfig.name_classes_save;
        widgetConfig.selector_elements_hideForLoading = '.' + config.frontend_generateClassName('hide-for-loading');

        /* -->form */
        widgetConfig.selector_elements_form = '';

        /* -->icons */
        widgetConfig.selector_elements_accept = '.' + widgetConfig.name_classes_accept;
        widgetConfig.selector_elements_edit = '.' + widgetConfig.name_classes_edit;
        widgetConfig.selector_elements_add = '.' + widgetConfig.name_classes_add;
        widgetConfig.selector_elements_cancel = '.' + widgetConfig.name_classes_cancel;
        widgetConfig.selector_elements_close = '.' + widgetConfig.name_classes_close;

    var CorePrototype = {
            options: {
                //auth: null, auth can be set. but here its not listed, as this would result in refresh_auth to be called on startup. but auth comes from scope.
                host: undefined,
                frontend: null,
                width: '100%',
                load_content: false,
                update_content: false,
                shape: null,
                size: null,
                closable: false,
                detachable: true, // TODO: plugin: default = false
                widget_structure: ['header', 'navi', 'body', 'footer'],
                auth_header: false
            },
            mixins: {
                draggable: mixins.DraggableMixin,
                popup: mixins.PopupMixin,
                api: mixins.ApiMixin,
                view: mixins.ViewMixin,
                loading: mixins.LoadingMixin,
                resource: mixins.ResourceMixin,
                tag_navigation: mixins.TagNavigationMixin,
                notification: mixins.NotificationMixin,
                actions: mixins.ActionsMixin,
                overlay: mixins.OverlayMixin,
                svg: mixins.SVGInjectorMixin,
                os: mixins.OSMixin,
                preprocessor: mixins.PreprocessorMixin
            },
            views: {
                template: views.TemplateView,
                widget: views.WidgetView
            },
            handles: {
                ApiHandle: apiHandles.ApiHandle,
                AutoHandle: apiHandles.AutoHandle,
                
                ListHandler: apiHandles.ListHandler,
                DetailHandler: apiHandles.DetailHandler,
                CreateHandler: apiHandles.CreateHandler,
            },
            _mixin_config: null,
            _locales: null,
            _libs: null,
            _css: null,
            _templates: null,
            _fixtures: null,
            _used_mixins: null,
            _widgetConfig: widgetConfig,
            _instanceSelector: null,
            _is_refreshing: false,
            _ignored_options: [],
            
            __reset_vars: function(){
                this._mixin_config = this._mixin_config || {};
                //this._ignored_options= [];  // TODO: this is weird. doesnt work with the aboves _ignore_options: null.
                this._used_mixins = this._used_mixins || [];
                this.__used_mixins = this.__used_mixins || [];
                this._started_mixins = this._started_mixins || {};
                this._appliedHandlerOnce = [];
            },

            log_event: function(){
                if (this.options && this.options.scope && this.options.scope.log) {
                    this.options.scope.log.event.apply(this, arguments)
                }else
                if (this.options.frontend) {
                    this.options.frontend.log.apply(this, arguments)
                }else{
                    console.log.apply(console, arguments);
                }
            },

            log: function(){
                if (this.options && this.options.scope && this.options.scope.log) {
                    var first = arguments[0],
                        substr = first.substr(1, first.length-2);
                    if (first[0] == '(' && first[first.length-1] == ')' && this.options.scope.log.hasOwnProperty(substr)) {
                        this.options.scope.log[substr].apply(this, [].splice.call(arguments, 1))
                    }else{
                        this.options.scope.log.debug.apply(this, arguments)
                    }
                }else
                if (this.options.frontend) {
                    this.options.frontend.log.apply(this, arguments)
                }else{
                    console.log.apply(console, arguments);
                }
            },

            error: function(){
                if (this.options && this.options.scope && this.options.scope.log) {
                    this.options.scope.log.error.apply(this, arguments)
                }else
                if (this.options.frontend) {
                    this.options.frontend.error.apply(this, arguments)
                }else {
                    console.error.apply(console, arguments);
                }
            },
            
            log_info: function(){
                return this.options.scope.log.debug.apply(this, arguments)
            },
            
            trigger: function(events, selector, data, handler){
                if (this._instanceSelector) {
                    //events += this._instanceSelector;
                    //events = this.widgetName + ':' + events
                    //console.log(events)
                }
                this.element.triggerHandler.call(this.element, events, selector, data, handler);
            },
            on: function(events, selector, data, handler){
                if (this._instanceSelector) {
                    //events += this._instanceSelector;
                    //events = this.widgetName + ':' + events
                    //console.log(events)
                }
                this.element.on.call(this.element, events, selector, data, handler);
            },

            use_mixin: function(mixin, config, execute, event_prefix){
                var mixin_package = [mixin, config];
                if (!event_prefix) {
                    event_prefix = this._widgetConfig.name_event_mixin;
                }

                if (event_prefix == this._widgetConfig.name_event_mixin) {
                    if (this._used_mixins === null) {
                        this._used_mixins = [];
                        this.__used_mixins = [];
                    }
                    if (this.__used_mixins.indexOf(mixin) == -1) {
                        if (this.element.data('__initialized')) {
                            execute = true;
                        }
                        
                        this.__used_mixins.push(mixin)
                        this._used_mixins.push(mixin_package)
                    }
                }else{
                    execute = true;
                }

                if (execute) {
                    this.trigger(event_prefix + '-found', mixin_package);
                }
            },

            require_mixin: function(mixin, config, event_prefix){
                if (!event_prefix) {
                    event_prefix = this._widgetConfig.name_event_mixin;
                }
                
                if ((this.__used_mixins.indexOf(mixin) == -1) || (!(this._started_mixins && this._started_mixins[event_prefix] && this._started_mixins[event_prefix][mixin]))) {
                    this.use_mixin(mixin, config, true, event_prefix);
                }else if (config) {
                    throw Error('TODO: implement require_mixin with config');
                }
            },

            use_mixin_config: function(mixin, config, mixin_class){
                mixin_class = mixin_class || this._widgetConfig.name_event_mixin;
                if (this._mixin_config === null) {
                    this._mixin_config = {};
                }
                if (this._mixin_config[mixin_class] === undefined) {
                    this._mixin_config[mixin_class] = {}
                }
                this._mixin_config[mixin_class][mixin] = config;
            },
            
            _getMixinConfig: function(mixin_class, mixin, data){
                if (this._mixin_config[mixin_class] && this._mixin_config[mixin_class][mixin]) {
                    return $.extend({}, data, this._mixin_config[mixin_class][mixin])
                }
                return data
            },

            use_css: function(name){
                if (this._css === null) {
                    this._css = [];
                }
                this._css.push(name);
            },

            use_locale: function(name, config){
                if (this._locales === null) {
                    this._locales = [];
                }
                this._locales.push(name);
                if (config && config.widget_prefix) {
                    if (this.translation_prefix && this.translation_prefix != config.widget_prefix) {
                        this.log('(error)', 'currently only supports one translation_prefix', this.translation_prefix)
                    }else{
                        this.translation_prefix = config.widget_prefix;
                    }
                }
            },

            use_template: function(name){
                if (this._templates === null) {
                    this._templates = [];
                }
                this._templates.push(name);
            },
            
            get_active_template: function(){
                if (this._templates.length > 0) {
                    return this._templates.slice(-1)[0]
                }
                return null;
            },

            use_lib: function(name){
                if (this._libs === null) {
                    this._libs = [];
                }
                this._libs.push(name);
            },

            use_fixture: function(name, config){
                if (this._fixtures === null) {
                    this._fixtures = [];
                }
                this._fixtures.push(name);
                if (config && config.uuid) {
                    attr_name = config.attr || 'resource';
                    this.options.scope['__' + attr_name + 'Id'] = config.uuid;
                    this.options.scope['__' + attr_name + 'Target'] = 'uuid';
                }
            },
            
            apply: function(){
                return this._appliedHandler()
            },

            _create: function() {
                this.__reset_vars();
                var $this = this;
                /*if (! this.element.hasClass('dynamic-widget')) {
                    throw new Error('the target for "fancy_frontend.dynamicet_widget" widget needs to have a "dynamic-widget" class');
                }
                
                if (this.options.load_content  && this.options.widget_url == undefined) {
                    throw new Error('"fancy_frontend.dynamicet_widget" needs to be initialized with an "widget_url" attribute');
                }
                
                if (this.element.css('position') == 'static'){
                    this.element.css('position', "relative")
                }*/
                //this.element.attr('_uuid', this.uuid)
                

                //this.element.off('.dynamic-dynamicet-widget');
                // init mixin bindings
                this.on(this._widgetConfig.name_event_init, this.get_initWidgetDone_handler(this));

                if (this.options.frontend) {
                    this.element.on(this.options.frontend.name_event_notification + this.options.frontend.selector_widgets_core, this.options.frontend.get_notification_handler(this));
                }
                
                this.translate = function(identifier, callback){
                    var $this = this;
                    this.options.scope.translate(identifier, callback);
                }
                
                
                this.on('start-initializing', this.startInitializingHandler.bind(this));
                this.on('end-initializing', this.endInitializingHandler.bind(this));
                this.element.on('asset-loaded.template', function(event, name, response){
                    event.stopPropagation();
                    $this.options.content = response;
                    $this.setupContent();
                })
                // TODO: if debug
                this.on('inspect', function(event, callback){
                    if (callback){
                        callback('widget', $this);
                    }else{
                        console.log('widget', $this)
                    }
                })
                
                this.element.on('close', function(event){
                    // dont stop propagation. parent widgets might want to know that this one closes
                    $this.destroy();
                });
                
                // start loading
                this.loadDependencies();
                
                // set shape before initWidgetStructure
                this.setShape();
                this.initWidgetStructure();
                this.element.trigger(this._widgetConfig.name_event_preInit + '');
                // init mixins
                this.setupMixinHandlers(this._widgetConfig.name_event_mixin, this.mixins);
                if (this._used_mixins) {
                    $.each(this._used_mixins.reverse(), function(index, mixin_package){
                        $this.trigger($this._widgetConfig.name_event_mixin + '-found', mixin_package);
                    });
                }
                //this.setupContent()
                // show widget content, because could be with content
                this.refresh()
                
                this.trigger('end-initializing');         
            },
            
            _setOptions: function( options ) {
                this._start_refreshing()
                this._superApply( arguments );
                this._stop_refreshing()
                return this;
            },
            
            _start_refreshing: function( options ) {
                this._is_refreshing = true;
                return this;
            },
            
            _stop_refreshing: function( options ) {
                this._is_refreshing = false;
                this.trigger('refreshing-done', [options])
                return this;
            },
            _setOption: function( key, value ) {
                var preprocessed = this._preprocess(key, value);
                if (preprocessed === this.options) {
                    // if a preprocessor returns this.options, this means this options should not be set.
                    // this happens silent
                    return this
                }
                this._superApply( [key, preprocessed] );
                if (this.options.scope && key != 'scope' && this.options.scope._setWidgetOption) {
                    this.options.scope._setWidgetOption(key, value)
                }
                this._refresh(key, value);
                return this;
            },
            
            _preprocess: function(key, value){                
                if (this._ignored_options.indexOf(key) == -1 && this['preprocess_' + key]) {
                    return this['preprocess_' + key](value)
                }
                return value
                
            },
            
            _refresh: function(key, value, event, options){
                if (this.options.disabled) {
                    return false
                }
                if (this.is_refreshing) {
                    return this.bind('refreshing-done', this._refresh.bind(this, key, value))
                }

                if (key) {
                    if (this['refresh_'+key]) {
                        if (this['refresh_'+key](value) !== false){
                            return true  // if a specific refresh method was found. others dont have to be called
                        };
                    }
                }
                this.refresh(options)
                return false
            },
            
            refresh_shape: function(value){
                return this.setShape(value);
            },
            
            refresh_size: function(value){
                return this.setShape(undefined, value);
            },
            
            refresh_widget_structure: function(){
                //this.initWidgetStructure();
            },
            
            refresh_activeView: function(value){
                if (this.showView) {
                    console.warn('options.activeView not compatible with handler right now...')
                    return false
                    this.showView(value);
                }
                return true
            },
            
            on_refresh: function(option, callback, before_super){
                this['refresh_' + option] = function(superCallback){
                    var ret, superRet;
                    if (before_super) {
                        ret = callback.apply(this, arguments);
                    }
                    
                    if (superCallback) {
                       superRet = superCallback.apply(this, arguments);
                    }
                    
                    if (!before_super) {
                        ret = callback.apply(this, arguments);
                    }
                    return superRet || ret
                }.bind(this, this['refresh_' + option])
            },
            
            refresh: function(options){
                var $this = this;
                if (options === undefined) {
                    // this means the widget as such should be refreshed
                    // including possible resources / api-dependencies
                    if (this.options.scope && key != 'scope' && this.options.scope.refresh) {
                        this.options.scope.refresh()
                    }
                    options = this.options;
                }
                
                $.each(options, function(name, value){
                    if ($this._ignored_options.indexOf(name) == -1 && $this['refresh_' + name]) {
                        $this['refresh_' + name](value)
                    }
                });
                this.setupContent()
                return this
            },
            
            startInitializingHandler: function(){
                this.element.addClass(config.frontend_generateClassName('state-initializing'));  
            },
            
            endInitializingHandler: function(){
                if (this.element.hasClass(config.frontend_generateClassName('state-initializing'))){
                    this.element.removeClass(config.frontend_generateClassName('state-initializing'));
                };     
                this.element.data('__initialized', true); // otherwise [fancy_frontend].scan() would initialize it again
            },
            
            loadDependencies: function(dependencyConfig){
                var $this = this;
                dependencyConfig = dependencyConfig || {
                    css: this._css ? this._css.reverse() : [],
                    libs: this._libs ? this._libs.reverse() : [],
                    locales: this._locales ? this._locales.reverse() : [],
                    templates: this.options.content ? [] : (this._templates ? this._templates.reverse() : []),
                    fixtures: this._fixtures ? this._fixtures.reverse() : [],
                }
                if (!dependencyConfig.scope) {
                    dependencyConfig.scope = this.options.scope
                }
                if (!dependencyConfig.callback) {
                    dependencyConfig.callback = function(type, name, response){
                        $this.trigger('asset-loaded.'+type, [name, response]);
                        $this.log_event('[fancy-frontend]', '[widget]', '[assets]', '['+type+']', 'loaded', name, {response: response})
                        /*if (type == 'fixture' && $this.options.scope.__widgetResource) {
                            $this.options.scope.updateResource({force: false});
                            //*for (var key in response) {
                                if (response[key].uuid == $this.options.scope.__widgetResource) {
                                    $this.options.scope._resource.fromFixture(response[key])
                                    $this.options.scope.$apply();
                                }
                            }//*
                            
                        }*/
                    };
                }
                if (typeof(this.load_dependencies) != 'function') {
                    return this.options.frontend.load_dependencies(dependencyConfig);
                }
                return this.load_dependencies(dependencyConfig);
            },
            
            popUp: function(callback, options){
                options = $.extend({}, options, {
                    body: this.$body,
                    callback: callback
                });
                this.options.frontend.popUp(options)
            },
            
            seperate: function(callback){
                this.options.frontend.newWidget({
                    source: this,
                    widget_identifier: this.generateStateIdentifier(),
                    widget_options: {
                        closable: true
                    }
                })
                
            },
            
            generateStateIdentifier: function() {
                var resource = (this.options.source && typeof(this.options.source.getResource) == 'function') ? this.options.source.getResource() : this.options.resource;
                if (!resource) {
                    console.warn(this, 'TODO: generateStateIdentifier isnt finished yet.', this.options['source'])
                }
                return (this.__proto__._namespace || this.__proto__.namespace) + '.' + (this.__proto__._widgetName || this.__proto__.widgetName) + (resource ? ':' + (resource.isCreated() ? resource.__getID() : '!') : '') + (this.options.activeView ? '#' + this.options.activeView : '')
            },
            
            _destroy: function(){
                var $this = this;
                if (this.element.data("__initialized")) {
                    // destroy mixins
                    $.each(this._used_mixins, function(index, mixin_package){
                        $this.trigger($this._widgetConfig.name_event_mixin + '-removed', mixin_package);
                    });
                    
                    this.element.off('.dynamic-dynamicet-widget');
                    //this.element.html('')
                    //this.element.remove();
                    this.element.removeData("__initialized");
                    this.element.remove();
                }
            
                return this._superApply( arguments );
            },

            setupMixinHandlers: function(event_prefix, mixin_dict){
                if (!this._started_mixins) {
                    this._started_mixins = {};
                }
                if (!this._started_mixins[event_prefix]) {
                    this._started_mixins[event_prefix] = {};
                }
                var $this = this;
                $.each(mixin_dict, function(name, mixin){
                    if (Array.isArray(mixin)) {
                        mixin_dict[name] = mixin[0];
                        $this.use_mixin_config(name, mixin[1], event_prefix);
                    }
                })
                function checkMixin(name) {
                    if (mixin_dict[name] === undefined) {
                        throw Error('Mixin "' + name + '" not found for event prefix "'+ event_prefix + '"');
                    }
                }
                this.on(event_prefix + '-found', function MixinCreateHandler(event, name, data){
                    event.stopImmediatePropagation();
                    $this.log('adding ' + event_prefix + ':', name, data);
                    checkMixin(name);
                    if (mixin_dict[name].init) {
                        var config = {
                            name: name,
                            data: $this._getMixinConfig(event_prefix, name, data !== undefined ? data : {})
                        }
                        mixin_dict[name].init.call($this, config)
                    }
                    $this._started_mixins[event_prefix][name] = config.data;
                    return false
                });
                this.on(event_prefix + '-removed', function MixinDestroyHandler(event, name, data){
                    event.stopImmediatePropagation();
                    $this.log('removing ' + event_prefix + ':', name);
                    checkMixin(name);
                    if (mixin_dict[name].destroy) {
                        var config = {
                            name: name,
                            data: $this._getMixinConfig(event_prefix, name, data !== undefined ? data : {})
                        }
                        mixin_dict[name].destroy.call($this, config)
                    }
                    delete $this._started_mixins[event_prefix][name];
                    return false
                });
            },
            
            start_loading: function(){
                this.element.trigger(this._widgetConfig.name_event_loading);
                
            },
            
            finished_loading: function(){
                this.element.trigger(this._widgetConfig.name_event_loadingFinished);
                
            },
            
            setupContent: function(){
                var frontend = this.options.frontend;
                var $this = this;
                if (this.options.load_content || this.options.update_content) {
                    $this.log('content loading')
                    if (! this.options.update_content) {
                        $this.start_loading()
                    }

                    var data = {}

                    if (this.options.widget_data) {
                        $.extend(data, this.options.widget_data);
                    }

                    this.start_loading()
                    // load and initialize it
                    frontend.widgets.get({
                        "url": this.options.widget_url + '/',
                        "data": data,
                        "done": function(response, text, xhr){
                                        $this.trigger($this._widgetConfig.name_event_init, [
                                                response, text, xhr
                                            ]
                                        );
                                        $this.finished_loading();
                                },
                        "fail": function(jqXHR, status, statusText){
                                        $this.element.trigger(
                                            $this._widgetConfig.name_event_loadingFailed, [
                                                jqXHR, status, statusText
                                            ]
                                        );
                                        $this.finished_loading();

                                }
                    });
                }else if (this.options.content) {
                        this.updateContent(this.options.content)
                }else if (this.element.contents().size()) {
                    //this.apply(this.element);
                }
                $this.trigger(this._widgetConfig.name_event_init);
            },

            get_initFailed_handler: function($this){
                return function (event, jqXHR, status, statusText){
                    event.stopPropagation();
                    error = fancy_frontend.ajax.translateResponse_toJSON(jqXHR);
                    $this.element.html(error.html || jqXHR.responseText ? "error loading" : "server unavailable"); // todo
                    fancy_frontend.get_failed_xhr_handler('{% sitewording "widget:load_widget" %}', $this.element)(jqXHR, status, statusText);
                }
            },

            get_initWidgetDone_handler: function($this){
                return function(event){
                }
            },
            
            //updateState: function(key, value){
            //    if (this.options.scope) {
            //        this.options.scope['__' + key] = value;
            //        this.refresh();
            //    }
            //},

            setShape: function(shape, size){
                var old_size = this.options.size,
                    old_shape = this.options.shape;
                if (shape) {
                    this.options.shape = shape;
                }
                if (size) {
                    this.options.size = size;
                }
                if (this.options.shape === null) {
                    if (this.element.attr('data-view-name')) {
                        this.options.shape = this._widgetConfig.name_shape_content;
                    }else
                    if (this.element.filter('body').size()) {
                        this.options.shape = this._widgetConfig.name_shape_page;
                    }else
                    if (this.element.parent('tbody' + this._widgetConfig.selector_mixin_container).size()) {
                        this.options.shape = this._widgetConfig.name_shape_row;
                    }else
                    if (this.element.parents('.' + this._widgetConfig.name_shape_widget).size()) {
                        this.options.shape = this._widgetConfig.name_shape_content;
                    }else
                    if (this.element.parents(this._widgetConfig.selector_mixin_container).size()) {
                        // TODO: get default shape from $element. else this._widgetConfig.name_shape_content
                        this.options.shape = this._widgetConfig.name_shape_widget;
                    }else{
                        this.options.shape = this._widgetConfig.name_shape_content;
                    }
                }
                if (this.options.shape === null) {
                    this.options.shape = this._widgetConfig.name_shape_shapeless;
                }else{
                    if (this.options.shape == this._widgetConfig.name_shape_widget && this.element.parents('.'+config.frontend_generateClassName('interaction-dragable-area')).size()) {
                        this.use_mixin('draggable');
                        //  attach to container
                    }
                    if ([this._widgetConfig.name_shape_widget, this._widgetConfig.name_mixin_container, this._widgetConfig.name_shape_page, this._widgetConfig.name_shape_popup].indexOf(this.options.shape) != -1) {
                        this.use_mixin('loading');
                    }
                    if (this.options.shape != this._widgetConfig.name_shape_icon && this.element.hasClass(this._widgetConfig.name_shape_icon)) {
                        this.element.removeClass(this._widgetConfig.name_shape_icon);
                    }
                }
                if (old_shape != this.options.shape || !this.element.hasClass(this.options.shape)) {
                    if (old_shape)this.element.removeClass(old_shape)
                    this.element.addClass(this.options.shape)
                }
                if (this.options.size === null) {
                    if (this.element.attr('data-view-name')) {
                        this.options.size = this._widgetConfig.name_size_full
                    }else
                    if (this.element.filter('body').size()) {
                        this.options.size = this._widgetConfig.name_size_full;
                    }else
                    if (this.element.filter('tr.' + this._widgetConfig.name_shape_content).size()) {
                        this.options.size = this._widgetConfig.name_size_full;
                    }else
                    if (this.element.parents(this._widgetConfig.selector_mixin_container).size()) {
                        this.options.size = this._widgetConfig.name_size_small;
                    }else{
                        this.options.size = this._widgetConfig.name_size_full;
                    }
                }
                if (this.options.size === null) {
                    this.options.size = this._widgetConfig.name_size_sizeless;
                }
                if (old_size != this.options.size || !this.element.hasClass(this.options.size)) {
                    if (old_size)this.element.removeClass(old_size)
                    this.element.addClass(this.options.size)
                }
            },
            
            initWidgetStructure: function(elements, clear){
                this.log('(fancy-frontend)', '(widgetsCore)', 'initWidgetStructure', elements, clear)
                clear = clear === undefined ? true : clear;
                var $this = this,
                    isTable = this.element.filter('table').size(),
                    footer_tag = isTable ? 'tfoot' : this.element.filter('tr').size() ? 'td' : 'footer',
                    header_tag = isTable ? 'thead' : this.element.filter('tr').size() ? 'td' : 'header',
                    navi_tag = 'nav',
                    body_tag = isTable ? 'tbody' : this.element.filter('tr').size() ? 'td' : 'article',
                    _body;
                var missingStructure = '',
                bodyClass = this._widgetConfig.name_classes_body,
                headerClass = this._widgetConfig.name_classes_header,
                naviClass = this._widgetConfig.name_classes_navi,
                footerClass = this._widgetConfig.name_classes_footer;
                
                if (!elements){
                    elements = this.options.widget_structure
                };
                if (!elements) {
                    return
                }
                ret = {};
                if (clear) {
                    this.clear(elements);
                }
                for (var _element in elements) {
                    var elem = elements[_element];
                    
                    if (elem == 'header') {
                        if (this.$header) {
                            if (!this.$header.hasClass(headerClass)) {  
                                this.$header.addClass(headerClass);
                            }
                        }else if (this.element.filter(header_tag + '.' + headerClass).size()){
                            this.$header = this.element.filter(header_tag + '.' + headerClass);
                        }else {
                            this.$header = $('<'+header_tag+' class="' + headerClass + '"></'+header_tag+'>');
                            this.element.prepend(this.$header);
                        }
                        this.initHeader();
                    }else if (elem == 'navi') {
                        if (this.$navi) {
                            if (!this.$navi.hasClass(naviClass)) {   
                                this.$navi.addClass(naviClass);
                            }
                        }else if (this.element.filter(navi_tag + '.' + naviClass).size()){
                            this.$navi = this.element.filter(navi_tag + '.' + naviClass);
                        }else {
                            this.$navi = $('<'+navi_tag+' class="' + naviClass + '"></'+navi_tag+'>');
                            if (this.$header) {
                                this.$header.after(this.$navi)
                            }else {
                                this.element.prepend(this.$navi);
                            }
                        }
                        this.initNavi();
                    }else if (elem == 'body') {
                        var _body = '<'+body_tag+' class="' + bodyClass + '"></'+body_tag+'>';

                        if (this.$body) {
                            if (!this.$body.hasClass(bodyClass)) {    
                                this.$body.addClass(bodyClass);
                            }
                        }else if (this.element.filter(body_tag + '.' + bodyClass).size()){
                            this.$body = this.element.filter(body_tag + '.' + bodyClass);
                        }else{
                            content = this.element.children(
                                                      ':not('+ this._widgetConfig.selector_elements_header +
                                                      '):not('+ this._widgetConfig.selector_elements_navi +
                                                      '):not(aside' +
                                                      '):not('+ this._widgetConfig.selector_elements_footer +
                                                      '):not(script)'   // ionic framework deployment on IOS
                                                      );
                            if (content.filter(body_tag + '.' + bodyClass).size()) {
                                this.$body = content.filter(body_tag + '.' + bodyClass);
                            }else{
                                this.$body = $(_body);
                                if (content.size() != 0) {
                                    content.wrapAll(this.$body);
                                }else{
                                    if (this.$navi) {
                                        this.$navi.after(this.$body);
                                    }else
                                    if (this.$footer) {
                                        this.$footer.before(this.$body);
                                    }
                                    else {
                                        this.element.append(this.$body);
                                    }
                                    
                                }
                            }
                        }
    
                        if (this.element.filter('.' + this._widgetConfig.name_shape_row).size()){
                            var first = true;
                            if (this.$body.size() != this.element.parent('.' + bodyClass).siblings('.' + headerClass).children('.' + bodyClass).size()){
                                this.element.parent('.' + bodyClass).siblings('.' + headerClass).children('.' + bodyClass).each(function() {
                                    if (first) {
                                        first = false;
                                    }else{
                                        var $body = $(_body);
                                        $this.$body.after($body);
                                    }
                                });
                                this.$body = this.element.children('.' + bodyClass);
                            };
                            
                        };
                        this.initBody();
                    }else if (elem == 'footer') {
                         if (this.$footer) {
                            if (!this.$footer.hasClass(footerClass)) {
                                this.$footer.addClass(footerClass);
                            }
                        }else if (this.element.children(footer_tag + '.' + footerClass).size()){
                            this.$footer = this.element.filter(footer_tag + '.' + footerClass);
                        }else{
                            this.$footer = $('<'+footer_tag+' class="' + footerClass + '"></'+footer_tag+'>');
                            this.element.append(this.$footer);
                        };
                        this.initFooter();
                    }
                    ret[elem] = this['$'+elem];
                    
                    this.trigger('init-widget-structure-done.' + elem)
                }

                return ret;
            },
            
            clear: function(elements){
                if (elements === true) {
                    this.element.contents().remove();
                    this.$body = null;
                    this.$footer = null;
                    this.$navi = null;
                    this.$header = null;
                }else{
                    if (!elements) {
                        elements = ['body']
                    }
                    for (var _element in elements) {
                        var element = elements[_element];
                        if (!this['$' + element]) {
                            continue
                        }
                        this['$' + element].remove(); // TODO: detach?
                        this['$' + element] = undefined;
                    }
                }
            },
            
            build_translation_id: function(identifier){
                if (identifier[0] == '.' ) {
                    if (!this.translation_prefix) {
                        return null;
                    }
                    identifier = this.translation_prefix + identifier;
                }
                return identifier
            },
            
            translate_to: function($elem, identifier, default_fallback){
                identifier = this.build_translation_id(identifier);
                if (identifier === null) {
                    $elem.html(default_fallback);
                    return 
                }
                $elem.attr('translate', identifier);
                this.apply($elem);
                return;
                return this.translate(identifier, function(translated){
                    if (translated != identifier) {
                        $elem.html(translated)
                    }else{
                        $elem.html(default_fallback || translated)
                    }
                })
            },

            initBody: function(){
            },

            initFooter: function(){
            },

            initNavi: function(){
            },
            
            setHeadline: function(text){
                var headline = this.$header.find('.' + this._widgetConfig.name_classes_title);
                if (!headline.size()){
                    headline = $('<h3  class="'+this._widgetConfig.name_classes_title+'"></h3>');
                }
                if (text){
                    if (text[0] == '<') {
                        this.apply(text, headline.html.bind(headline))
                    }else{
                        headline.html(text)
                    }
                }else{
                    this.translate_to(headline, '.TITLE', this.__proto__._widgetFullName || this.__proto__.widgetFullName);
                }
                //headline.html(this.__proto__.widgetFullName);
                this.$header.prepend(headline);
            },

            initHeader: function(){
                if (this.$header.find(':header').length == 0) {
                    this.setHeadline()
                }
                this.$headline = this.$header.children(':header');
                
                if (this.options.closable) {
                    var $closeBtn = $('<div class="' + this._widgetConfig.name_classes_close + ' "></div>');
                    this.$header.prepend($closeBtn);
                    var $this = this;
                    $closeBtn.click(function(){
                            $this.element.triggerHandler('close');
                        }
                    )
                }
                if (this.options.auth_header) {
                    this.addAuthInfo(this.$header);
                }
            },
            
            addAuthInfo: function(){
                // TODO
            },

            updateContent: function(data){/*
                var content, header,
                    hasBody = false,
                    hasHeader = false,
                    $data = $(data).filter('div');
                if ($data.size() > 0) {
                    $.each($data, function(index, element){
                        //TODO: fix ugly workaround
                        hasBody = hasBody || ($(element).attr('class').search('{{ frontendPrefix }}header') != -1);
                                                                           //(this._widgetConfig.name_classes_body);
                        hasHeader = hasHeader || ($(element).attr('class').search('{{ frontendPrefix }}body') != -1);
                    })
                }else{
                    hasBody = $data.hasClass(this._widgetConfig.name_classes_body) || $data.children('.' + this._widgetConfig.name_classes_body).size() == 1;
                    hasHeader = $data.hasClass(this._widgetConfig.name_classes_header) || $data.children('.' + this._widgetConfig.name_classes_header).size() == 1;
                }
                
                if (hasBody || hasHeader || (!this.$body)) {
                    this.element.html(data)
                }else{
                    this.$body.html(data)
                }*/
                var $this = this,
                    $data;
                if (data instanceof $){
                        $data = data;
                }else {
                    $data = $('<div>'+data+'</div>');
                    $data.find('[load-widget],[load-plugin]').each(function(index, element){
                        var $element = $(element);
                        $this.options.frontend.set_options($element, {content:$element.html()})
                        $element.contents().remove();
                    })
                };
                
                // handle them seperatly, to give mixins more control
                var $body, $header, $navi, $footer;
                if ($data.children('header').size()) {
                    $header = $data.children('header').contents();
                }
                if ($data.children('nav').size()) {
                    $navi = $data.children('nav').contents();
                }
                if ($data.children('article').size()) {
                    $body = $data.children('article').contents();
                }
                if ($data.children('footer').size()) {
                    $footer = $data.children('footer').contents();
                }
                if (!$body && !$navi && !$footer && !$header) {
                    $body = $data
                }
                
                if ($header) {
                    this.apply($header, function(content){
                        $this.$header.html(content)
                        $this.initWidgetStructure(['header'], false);
                    })
                }
                if ($navi) {
                    this.apply($navi, function(content){
                        $this.$navi.html(content)
                        $this.initWidgetStructure(['navi'], false);
                    })
                }
                if ($body) {
                    this.apply($body, function(content){
                        $this.$body.html(content);
                        $this.initWidgetStructure(['body'], false);
                    })
                    
                }
                if ($footer) {
                    this.apply($footer, function(content){
                        $this.$footer.html(content)
                        $this.initWidgetStructure(['footer'], false);
                    })
                }
                
                // apply changed content, because other framework might process the template
                //this.apply();  // TODO: ?
                //$this.initWidgetStructure();
            },
            
            getCurrentStateHash: function(){
                return this.options.scope.generateIdentifier()
            },
            
            reload: function(settings){
                var reload_code = settings.reload_code,
                    callback = settings.callback,
                    $this = this,
                    $parent = this.element.parent(),
                    position = this.element.offset(),
                    identifier = this.getCurrentStateHash();
                this.log('reloading as', identifier)
                if (reload_code === true || (reload_code && reload_code.length && reload_code.indexOf('js'))) {
                    this.options.scope.unload_required(function(){
                        $this.apply(undefined, undefined, true);
                        var tag = $this.element.prop("tagName");
                        var $clone = $('<'+tag+'></'+tag+'>');
                        $this.options.frontend.create_widget($clone, identifier, $this.options);
                        $this.apply($clone, function($content){
                            $this.destroy();
                            $parent.append($content);
                            $clone.offset(position);
                            if (callback) {
                                callback($clone)
                            }
                        })
                    });
                }
                
            },
            
            newElement: function(configuration){
                if (configuration.target) {
                    if (configuration.method == 'patch') {
                         configuration.apply_patch = configuration.target;
                    }else{
                        configuration.apply_to = configuration.target;
                    }
                    // TODO:depreciation warning
                }
                
                var class_name = '';
                if (configuration.css_class) {
                    css_class = configuration.css_class;
                    if (typeof css_class == 'string') {
                        css_class = [css_class]
                    }
                    for (var index in css_class) {
                        class_name += config.frontend_generateClassName(css_class[index]) + ' '
                    }
                }
                
                var tag = configuration.tag || 'div',
                    div;
                
                if (configuration.apply_patch) {
                    div = configuration.apply_patch;
                }else{
                    var content = '';
                    if (configuration.content) {
                        content = configuration.content;
                    }
                    div = $('<'+ tag +' class="' + class_name + '">' + content + '</'+ tag +'>');
                    if (configuration.translate_to) {
                        this.translate_to(div, configuration.translate_to, content || null)
                    }
                }
                if (configuration.icon) {
                    div.attr('action-icon', configuration.icon)
                }
                if (configuration.view) {
                    div.attr('view-container', configuration.view)
                }
                if (configuration.plugin_identifier) {
                    (this.options.frontend ? this.options.frontend : this).create_plugin(div, configuration.plugin_identifier, configuration.plugin_options);
                }else if (configuration.widget_identifier) {
                    (this.options.frontend ? this.options.frontend : this).create_widget(div, configuration.widget_identifier, configuration.widget_options);
                }
                if (configuration.apply_to || configuration.apply_patch) {
                    this.apply(div, configuration.apply_to ? function(content){
                        if (configuration.apply_to  instanceof Function) {
                            configuration.apply_to(content)
                        }else{
                            configuration.apply_to.append(content)
                        }
                    } : undefined, true);
                }
                return div
            },
            
            preprocess_auth: function(value){
                var update_successful = this.options.auth.update(value);
                
                // if update was successfull, pass the updated auth in order to refresh the page
                // if nothing was updated, skip updating options
                return update_successful ? this.options.auth : (update_successful === null ? this.options : value)
            },
            
            preprocess_host: function(value){
                value = value === undefined ? this.getHost() : value;
                if (value === this.options.host) {
                    value.registerInteractor(this)
                    return this.options
                }
                var update_successful = this.options.host.update(value);
                return update_successful ? this.options.host : (update_successful === null ? this.options : value.registerInteractor(this))
            },
            
            refresh_frontend: function(value){
                return false
            },
            
            refresh_auth: function(value){
                if (this.options.scope && this.options.scope.auth != value) {
                    this.options.scope.auth = value;
                    if (this.options.auth !== value)throw Error('TODO: implement an interaction, that asks the user if all dependent widgets (scopes) shall be updated as well, as they still proxy the old one.')
                }
                
                // allways refresh everything after refresh auth was called
                return false
            },
            
            refresh_host: function(value){
                if (this.options.scope && this.options.scope.host != value) {
                    this.options.scope.host = value;
                    if (this.options.host !== value)throw Error('TODO: implement an interaction, that asks the user if all dependent widgets (scopes) shall be updated as well, as they still proxy the old one.')
                }
                
                // allways refresh everything after refresh host was called
                return false
            },
            
            refresh_scope: function(){
                this.options.scope.$on('applied', this._appliedHandler.bind(this));
                // TODO: remove old handler.
                return false
            },
            
            getLog: function(){
                if (this.options.scope && this.options.scope.log) {
                    return this.options.scope.log
                }
                if (this.options.frontend && this.options.frontend.getLog()) {
                    return this.options.frontend.getLog()
                }
                return console
            },
            
            getAuth: function(){
                if (this.options.scope) {
                    return this.options.scope.auth
                }
                if (this.options.auth) {
                    if (this.options.scope){
                        this.options.scope.auth = this.options.auth;  // this shouldnt happen, because refresh_auth handles this case.
                    }
                    return this.options.auth;
                }
                return this.options.frontend.getAuth({log: this.getLog()})
            },
            
            getHost: function(){
                if (this.options.scope) {
                    return this.options.scope.host;
                }
                if (this.options.host) {
                    if (this.options.scope){
                        this.options.scope.host = this.options.host;// this shouldnt happen, because refresh_host handles this case.
                    }
                    return this.options.host; 
                }
                var auth = this.getAuth();
                if (!auth) {
                    var host = this.options.frontend.get_host().asProxy({log: this.getLog()}).registerInteractor(this);
                }else{
                    var host = tthis.options.frontend.get_host(auth.default_host).asProxy({log: this.getLog()}).registerInteractor(this);
                }
                this.options.host = host;  // host hasnt really changed, so dont use option('host', host)
                return host
            },
            
            _appliedHandler: function(){
                $.each(this._appliedHandlerOnce, function(index, elem){
                    elem();
                });
                this._appliedHandlerOnce.length = 0;
            },
            
            executeOnApply: function(callback, always){
                if (always) {
                    return this.options.scope.$on('applied', callback);
                }else{
                    this._appliedHandlerOnce.push(callback);
                }
            },
            
            initClasses: function(){
                // css widget stylesheet activation by adding widget specific class
                var widgetName = this.element.attr(config.frontend_generateAttributeName('widget-name'));
                if (!widgetName) {
                    console.log(this.element);
                    throw Error('no widget name found');
                }
                var elementClass = config.frontend_generateClassName('object-'+widgetName);
                this._instanceSelector = '.' + elementClass;
                if (!this.element.hasClass(elementClass)){
                    this.element.addClass(elementClass)
                };
                if (!this.element.hasClass(config.frontend_generateClassName('instance'))){
                    this.element.addClass(config.frontend_generateClassName('instance'));
                };
                return widgetName;
            }
    };
    
    //$.widget( config.apps['fancy-frontend'].namespace + ".plugin", CorePrototype);
    
    var WidgetPrototype = $.extend({}, CorePrototype, {
        _create: function(){
            this.init_widget()
            CorePrototype._create.apply(this, arguments)
        },
        
        init_widget: function(){
            var $this = this;
            if (this.options.draggable) {
                this.element.css('position', 'absolute');
                this.element.draggable({ snap: true });
            }
            if (this.options.use_os) {
                this.use_mixin('os')
            }
            
            var widgetName = this.initClasses();
            this.log('init widget', widgetName, this.options.source, this.options.resourceList)
        }
    })
    var PluginPrototype = $.extend({}, CorePrototype, {
        _create: function(){
            this.init_plugin()
            CorePrototype._create.apply(this, arguments)
        },
        
        init_plugin: function(){
            var widgetName = this.initClasses();
            this.log('init plugin', widgetName)
        }
    })
    var CompletePrototype = $.extend({}, PluginPrototype, WidgetPrototype, {
        _create: function(){
            CorePrototype._create.apply(this, arguments)
        },
    })
    
    //$.widget( config.apps['fancy-frontend'].namespace + ".widget", WidgetPrototype);

    $[config.apps['fancy-frontend'].namespace] = {};
    $[config.apps['fancy-frontend'].namespace]._widgetConfig = widgetConfig;
            


    function fancyWidgetCore(){
        this.init.apply(this, arguments);
    };
    
    $.extend(fancyWidgetCore.prototype, {
        namespace: 'fancy-frontendWidgets',

        init: function($, widgetConfig, namespace){
            if ($ instanceof fancyWidgetCore) {
                var _parent = $;
                $ = _parent.$;
                widgetConfig = _parent.widgetConfig;
                namespace = _parent.namespace;
            }
            this.widgetConfig = widgetConfig;
            this.$ = $;
            if (namespace) {
                this.namespace = namespace;
            }
            
        },

        getFrontendConfig: function(){
            return this.widgetConfig._config
        },

        getWidgetConfig: function(){
            return this.widgetConfig
        },

        unpack: function(namespace, identifier, source){
            if (source === undefined) {
                source = this.$;
            }else if (typeof source != 'function') {
                if (source instanceof fancyWidgetCore) {
                    var unpacked = source.unpack(namespace, identifier);
                    if (unpacked) {
                        return unpacked
                    }
                }
                
                if (source.$ && source.$() instanceof $) {
                    source = source.$;
                }else{
                    throw Error('"' + identifier +'" is no valid widget source [' + source + ']')
                }
            }
            source = source[namespace] ?
                source[namespace][identifier]
                : null/* || js[frontendConfig.widgets.defaults_namespace] ?
                    js[frontendConfig.widgets.defaults_namespace][widgetConfig.widgetType]
                    : null*/;
            return source
        },
        
        register: function(config){
            if (!config.widget) {
                config.widget = {};
            }
            config.widget._widgetName = config.name;
            config.widget._namespace = config.namespace;
            config.widget._widgetFullName = config.namespace + '.' + config.name;
            if (config.parent) {
                if (config.widget.views){
                    config.widget.views = $.extend({}, config.parent.views, config.widget.views);
                }
                if (config.widget.mixins){
                    config.widget.mixins = $.extend({}, config.parent.mixins, config.widget.mixins);
                }
                if (config.widget.handles){
                    config.widget.handles = $.extend({}, config.parent.handles, config.widget.handles);
                }
                this.$.widget( this.widgetNamespace + '.' + this.generateIdentifier(config.namespace, config.name), config.parent, config.widget)
            } else {
                this.$.widget( this.widgetNamespace + '.' + this.generateIdentifier(config.namespace, config.name), config.widget)
            }
            return this.returnConfig(config)
        },

        derive: function(parent_name, config){
            parent = this.get(config.namespace, parent_name);
            config.parent = parent;
            if (!config.name) {
                config.name = parent_name;
            }
            return this.register(config)
        },

        returnConfig: function(config){
            return new fancyWidgetConfig(this, config)
        },
        
        open: function(namespace, name, element_selector, options){
            return this.get(namespace, name)(options, this.$(element_selector))
        },
        
        get: function(namespace, identifier, source){
            return this.unpack(this.widgetNamespace, this.generateIdentifier(namespace, identifier), source)
        },
        
        generateIdentifier: function(namespace, name){
            return namespace + '__' + name
        }
        
    });

    function fancyWidgetConfig(){
        this.init.apply(this, arguments);
    };
    
    $.extend(fancyWidgetConfig.prototype, fancyWidgetCore.prototype);
    
    $.extend(fancyWidgetConfig.prototype, {
        init: function(widgetCore, config){
            this.widgetCore = widgetCore;
            this._config = config
            fancyWidgetCore.prototype.init.call(this, widgetCore)
        },
        open: function(options, $element){
            return fancyWidgetCore.prototype.open.call(this, this._config.namespace, this._config.name, $element, options)
        },
        derive: function(parent_or_config, config){
            var parent;
            if (typeof parent_or_config == 'string') {
                parent = this.get(this._config.namespace, parent_or_config);
            }else{
                parent = this.get(this._config.namespace, this._config.name);
                config = parent_or_config;
            }
            config.parent = parent;
            if (!config.namespace && !config.name) {
                throw Error('either specify a namespace or name or both.')
            }
            if (!config.namespace) {
                config.namespace = this._config.namespace;
            }
            if (!config.name) {
                config.name = this._config.name;
            }
            return this.register(config)
        },

        returnConfig: function(config){
            return new fancyWidgetConfig(this.widgetCore, config)
        },
    })

    return new fancyWidgetCore($, widgetConfig).register({
        namespace: config.apps['fancy-frontend'].namespace,
        name: "plugin",
        widget: PluginPrototype
    }).register({
        namespace: config.apps['fancy-frontend'].namespace,
        name: "core",
        widget: CorePrototype
    }).register({
        namespace: config.apps['fancy-frontend'].namespace,
        name: "complete",
        widget: CompletePrototype
    }).register({
        namespace: config.apps['fancy-frontend'].namespace,
        name: "widget",
        widget: WidgetPrototype
    });
});