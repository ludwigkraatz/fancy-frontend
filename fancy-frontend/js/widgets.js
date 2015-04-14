define(['fancyPlugin!jquery-ui', 'fancyPlugin!fancyWidgetMixins', 'fancyPlugin!fancyWidgetViews', 'fancyPlugin!fancyFrontendConfig'], function($, mixins, views, config){
    $(function() {

    
        var coreWidget_name = '',
            coreWidget_selector = '';

        var widgetConfig = {
            '_config': config
            };

        // config data
            widgetConfig.relationships = {
                instance_of: '127',
                child_of: '124',
            }
            widgetConfig.mixins = mixins;
            widgetConfig.views = views;
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
    
        $.widget( config.apps['fancy-frontend'].namespace + ".core",{
                options: {
                    width: '100%',
                    load_content: false,
                    update_content: false,
                    mixins: [],
                    shape: null,
                    size: null,
                    closable: false,
                    detachable: true, // TODO: plugin: default = false
                },
                mixins: {
                    draggable: mixins.DraggableMixin,
                    popup: mixins.PopupMixin,
                    api: mixins.ApiMixin,
                    view: mixins.ViewMixin,
                    loading: mixins.LoadingMixin,
                    resource: mixins.ResourceMixin,
                },
                views: {
                    template: views.TemplateView,
                    widget: views.WidgetView
                },
                _locales: null,
                _libs: null,
                _css: null,
                _templates: null,
                _fixtures: null,
                _used_mixins: null,
                _widgetConfig: widgetConfig,
                _instanceSelector: null,

                log: function(){
                    if (this.options && this.options.scope && this.options.scope.log) {
                        this.options.scope.log.debug.apply(this, arguments)
                    }else
                    if (this.options.widgetCore) {
                        this.options.widgetCore.log.apply(this, arguments)
                    }else{
                        console.log.apply(console, arguments);
                    }
                },

                error: function(){
                    if (this.options && this.options.scope && this.options.scope.log) {
                        this.options.scope.log.error.apply(this, arguments)
                    }else
                    if (this.options.widgetCore) {
                        this.options.widgetCore.error.apply(this, arguments)
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

                use_mixin: function(mixin, config){
                    if (this._used_mixins === null) {
                        this._used_mixins = [];
                        this.__used_mixins = [];
                    }
                    if (this.__used_mixins.indexOf(mixin) == -1) {
                        this.__used_mixins.push(mixin)
                        var mixin_package = [mixin, config];
                        this._used_mixins.push(mixin_package)
                        if (this.element.data('__initialized')) {
                            this.trigger(this._widgetConfig.name_event_mixin + '-found', mixin_package);
                            
                        }
                    }
                },

                use_css: function(name){
                    if (this._css === null) {
                        this._css = [];
                    }
                    this._css.push(name);
                },

                use_locale: function(name){
                    if (this._locales === null) {
                        this._locales = [];
                    }
                    this._locales.push(name);
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

                use_fixture: function(name){
                    if (this._fixtures === null) {
                        this._fixtures = [];
                    }
                    this._fixtures.push(name);
                },

                _create: function() {
                    /*if (! this.element.hasClass('dynamic-widget')) {
                        throw new Error('the target for "fancy_frontend.dynamicet_widget" widget needs to have a "dynamic-widget" class');
                    }
                    
                    if (this.options.load_content  && this.options.widget_url == undefined) {
                        throw new Error('"fancy_frontend.dynamicet_widget" needs to be initialized with an "widget_url" attribute');
                    }
                    
                    if (this.element.css('position') == 'static'){
                        this.element.css('position', "relative")
                    }*/
                    var $this = this;
                    
                    this.element.attr('_uuid', this.uuid)
                    this.apply = function($target){
                        //if (!$target.data('__initialized')) {
                            var ret = this.options.scope.apply.apply(this, arguments);
                            if ($this.updatedContent)$this.updatedContent();
                            return ret;
                        //}
                    }
                    
                    if (this.options.scope) {
                        this.options.scope.init(this);
                    }
                    

                    //this.element.off('.dynamic-dynamicet-widget');
                    // init mixin bindings
                    this.on(this._widgetConfig.name_event_init, this.get_initWidgetDone_handler(this));

                    if (this.options.widgetCore) {
                        this.element.on(this.options.widgetCore.name_event_notification + this.options.widgetCore.selector_widgets_core, this.options.widgetCore.get_notification_handler(this));
                    }

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
                    this.log('init widget', widgetName, this.options.source, this.options.resourceList)
                    
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
                        event.stopPropagation();
                        $this.destroy();
                    });
                    
                    
                    // start loading
                    this.loadDependencies();
                    this.initWidgetStructure();
                    this.element.trigger(this._widgetConfig.name_event_preInit + '');
                    // init mixins
                    this.setupMixinHandlers(this._widgetConfig.name_event_mixin, this.mixins);
                    if (this._used_mixins) {
                        $.each(this._used_mixins.reverse(), function(index, mixin_package){
                            $this.trigger($this._widgetConfig.name_event_mixin + '-found', mixin_package);
                        });
                    }
                    
                    this.setupContent()
                    // show widget content, because could be with content
                    
                    this.trigger('end-initializing');         
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
                    this.options.widgetCore.load_dependencies(dependencyConfig);
                },
                
                popUp: function(callback, options){
                    options = $.extend({}, options, {
                        body: this.$body,
                        callback: callback
                    });
                    this.options.widgetCore.popUp(options)
                },
                
                seperate: function(callback){
                    var clone = $('<div></div>');
                    this.options.widgetCore.create_widget(clone, this.generateStateIdentifier(), {closable: true});
                    var $this = this;
                    this.apply(clone, function(content){
                        $this.element.closest('.'+$this._widgetConfig.name_shape_widget).after(content);
                    })
                    
                },
                
                generateStateIdentifier: function() {
                    return 'object:' + this.options.scope.resource.uuid + '#detail'
                },
                
                _destroy: function(){
                    if (this.element.data("__initialized")) {
                        // destroy mixins
                        $.each(this.options.mixins, function(index, element){
                            $this.element.trigger('dynamic-mixin-removed', [element]);
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
                    var $this = this;
                    function checkMixin(name) {
                        if (mixin_dict[name] === undefined) {
                            throw Error('Mixin "' + name + '" not found for event prefix "'+ event_prefix + '"');
                        }
                    }
                    this.on(event_prefix + '-found', function MixinCreateHandler(event, name, data){
                        event.stopImmediatePropagation();
                        $this.options.scope.log.debug('adding ' + event_prefix + ':', name, data);
                        checkMixin(name);
                        if (mixin_dict[name].init) {
                            var config = {
                                name: name,
                                data: data !== undefined ? data : {}
                            }
                            mixin_dict[name].init.call($this, config)
                        }
                        return false
                    });
                    this.on(event_prefix + '-removed', function MixinDestroyHandler(event, name, data){
                        event.stopImmediatePropagation();
                        $this.options.scope.log.debug('removing ' + event_prefix + ':', name);
                        checkMixin(name);
                        if (mixin_dict[name].destroy) {
                            var config = {
                                name: name,
                                data: data !== undefined ? data : {} 
                            }
                            mixin_dict[name].destroy.call($this, config)
                        }
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
                    var widgetCore = this.options.widgetCore;
                    var $this = this;
                    if (this.options.load_content || this.options.update_content) {
                        $this.options.scope.log.debug('content loading')
                        if (! this.options.update_content) {
                            $this.start_loading()
                        }

                        var data = {}

                        if (this.options.widget_data) {
                            $.extend(data, this.options.widget_data);
                        }

                        this.start_loading()
                        // load and initialize it
                        widgetCore.widgets.get({
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

                setShape: function(shape, size){
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
                    }
                    this.element.addClass(this.options.shape)
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
                    this.element.addClass(this.options.size)
                },
                
                initWidgetStructure: function(elements, clear){
                    this.log('(fancy-frontend)', '(widgetsCore)', 'initWidgetStructure')
                    clear = clear === undefined ? true : clear;
                    this.setShape();
                    var $this = this,
                        footer_tag = this.element.filter('table').size() ? 'tfoot' : this.element.filter('tr').size() ? 'td' : 'div',
                        header_tag = this.element.filter('table').size() ? 'thead' : this.element.filter('tr').size() ? 'td' : 'div',
                        body_tag = this.element.filter('table').size() ? 'tbody' : this.element.filter('tr').size() ? 'td' : 'div',
                        _body;
                    var missingStructure = '',
                    bodyClass = this._widgetConfig.name_classes_body,
                    headerClass = this._widgetConfig.name_classes_header,
                    footerClass = this._widgetConfig.name_classes_footer;
                    /*if (content) {
                        this.element.append(content)
                    }*/
                    if (!elements){
                        elements = ['header', 'body', 'footer']
                    }
                    ret = {};
                    if (clear) {
                        this.clear(elements);
                    }
                    for (var _element in elements) {
                        var elem = elements[_element];
                            
                        
                        if (elem == 'header') {
                            if (this.$header) {
                                this.$header.addClass(headerClass);
                            }else{
                                this.$header = $('<'+header_tag+' class="' + headerClass + '"></'+header_tag+'>');
                                this.element.prepend(this.$header);
                            }
                            this.initHeader();
                        }else if (elem == 'body') {
                            var _body = '<'+body_tag+' class="' + bodyClass + '"></'+body_tag+'>';
                            //if (this.element.children('.' + bodyClass).size() == 0) {
                            if (this.$body) {
                                this.$body.addClass(bodyClass);
                            }else{
                                this.$body = $(_body);
                                content = this.element.children(
                                                          ':not('+ this._widgetConfig.selector_elements_header +
                                                          '):not('+ this._widgetConfig.selector_elements_footer +')'
                                                          );
                                if (content.size() != 0) {
                                    content.wrapAll(this.$body);
                                }else{
                                    this.$header.after(this.$body);
                                }
                            }
                            //};
        
                            if (this.element.filter('.' + this._widgetConfig.name_shape_row).size()){
                                var first = true;
                                
                                this.element.parent('.' + bodyClass).siblings('.' + headerClass).children('.' + bodyClass).each(function() {
                                    if (first) {
                                        first = false;
                                    }else{
                                        var $body = $(_body);
                                        $this.$body.after($body);
                                        $this.$body = $this.$body.add($body);
                                    }
                                });
                            };
                        }else if (elem == 'footer') {
                            //if (this.element.children('.' + footerClass).size() == 0) {
                                if (this.$footer) {
                                    this.$footer.addClass(footerClass);
                                }else{
                                    this.$footer = $('<'+footer_tag+' class="' + footerClass + '"></'+footer_tag+'>');
                                    this.element.append(this.$footer);
                                };
                            //};
                        }
                        ret[elem] = this['$'+elem];
                        
                    }
                    //this.apply(this.element);
                    return ret;
                },
                
                clear: function(elements){
                    if (elements === true) {
                        this.element.contents().remove();
                        this.$body = null;
                        this.$footer = null;
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

                initHeader: function(){
                    if (this.$header.find(':header').length == 0) {
                        this.$header.html('<h3  class="'+this._widgetConfig.name_classes_title+'">'+this.__proto__.widgetFullName+'</h3>');
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
                            $this.options.widgetCore.set_options($element, {content:$element.html()})
                            $element.contents().remove();
                        })
                    };
                    
                    // handle them seperatly, to give mixins more control
                    var $body, $header, $footer;
                    if ($data.children('header').size()) {
                        $header = $data.children('header').contents();
                    }
                    if ($data.children('article').size()) {
                        $body = $data.children('article').contents();
                    }
                    if ($data.children('footer').size()) {
                        $footer = $data.children('footer').contents();
                    }
                    if (!$body && !$footer && !$header) {
                        $body = $data
                    }
                    
                    if ($header) {
                        this.apply($header, function(content){$this.$header.html(content)})
                    }
                    if ($body) {
                        this.apply($body, function(content){$this.$body.html(content)})
                    }
                    if ($footer) {
                        this.apply($footer, function(content){$this.$footer.html(content)})
                    }
                    
                    // apply changed content, because other framework might process the template
                    //this.options.scope.$apply();  // TODO: own method
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
                    this.options.scope.log.debug('reloading as', identifier)
                    if (reload_code === true || (reload_code && reload_code.length && reload_code.indexOf('js'))) {
                        this.options.scope.unload_required(function(){
                            $this.options.scope.$apply();
                            var tag = $this.element.prop("tagName");
                            var $clone = $('<'+tag+'></'+tag+'>');
                            $this.options.widgetCore.create_widget($clone, identifier, $this.options);
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
                    
                }
        });
    
        $[config.apps['fancy-frontend'].namespace]._widgetConfig = widgetConfig

    });

    return $;
});