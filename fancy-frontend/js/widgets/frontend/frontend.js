define(['fancyPlugin!fancyWidgetCore', 'fancyPlugin!fancyFrontendConfig', 'fancyPlugin!json', 'fancyPlugin!introspective-api-auth'], function(fancyWidgetCore, config, JSON, AuthProvider){
    var $ = fancyWidgetCore.$;

    frontend = fancyWidgetCore.derive('core', {
        namespace: config.apps['fancy-frontend'].namespace,
        name: 'frontend',
        widget: {
            options: {
                scope: null,
                popUp_from_body: true,
                auth: null,
                host: null,
                host_resolver: null,
                config: null,
                startup: null,
                deviceConfig: null,
                widget_structure: null
            },
            $: $,
            
            _create: function(){
                var settings=this.options.config,
                    coreApp;
                if (!this.options.host) {
                    if (settings.init.default_host) {
                        this.options.host = settings.init.default_host;
                    }else {
                        this.options.host = 'backend';
                    }
                }

                var $this = this;
                this.log_info('init frontendCore' + (coreApp ? ('with coreApp=' + coreApp) : ' as coreApp'))
                this.coreApp = coreApp || this;
                this.__scope = null;
                this.__log = null;
                this.__initialized = false;
                this._known_hosts = {};
                this.$root_element = null;
                //this.auth = {};
                
                var $this = this;
                if (settings) {
                    this.config = settings;
                }
                //this.refresh();
                this._superApply(arguments);
            },
            
            configurationDependencies: [
                'fancyPlugin!fancyAjax',
                'fancyPlugin!introspective-api-cache',
                'fancyPlugin!introspective-api-hosts',
                'fancyPlugin!css:core'
            ],
            
            parseConfiguration: function(){
                require(this.configurationDependencies, this.completeConfigurationHandler.bind(this))
                
            },
            
            completeConfigurationHandler: function(FrontendAjax, cacheClients, apiHosts){
                //var ApiEndpoint = apiHosts.ApiHost;
                //var useWindowNavigation = true; // TODO
                //app.$ = $;
                //app.FrontendAjax = FrontendAjax;
                
                /*$.extend(FrontendEndpoint.prototype, ApiEndpoint.prototype);
                $.extend(FrontendEndpoint.prototype, FrontendHostPrototype);
                FrontendEndpoint.prototype._parentClass = ApiEndpoint;*/
                //app.FrontendEndpoint = FrontendEndpoint;
                if (!this.options.host_resolver) {
                    this.options.host_resolver = function(identifier, config){
                        if (identifier == 'backend') {
                            return apiHosts.FrontendHost
                        }
                        return apiHosts.XhrHost
                    }
                }
                //apiCache.connect('frontend', app)
                // TODO: configure requirejs fancyPlugin to use the cache
                this.cache = this.cache || new cacheClients.DummyClient(this);
                this.startup();
            },

            startup: function(){
                config = this.options.config;
                app = this;//'fancyPlugin!fancyWidgetCore',

                elements_selector: "[xmlns='" + config.elementsXMLNSSelector + "']";

                // maybe check for cookies, if user has a preferred frontendFramework to run with
                // TODO
                this.options.auth = AuthProvider.newAuth()
                // END TODO

                app.$root_targets = app.$(config.frontend_generateSelector('widget-container'));

                app.init_coreWidget_bindings(app.$root_targets);

                //app.ajax = app.new_ajax();
                //dynamic_widgets = $this.ajax.access('dynamic-widgets');


                app.initHosts();
                
                app.options.auth.setup({
                    hosts: app.get_hosts_for('auth'),
                    default_host: this.options.host
                })

                if (app.config.start.apps) {
                    for (key in app.config.start.apps) {
                        require(['fancyPlugin!app:'+ key], function(app){
                            var selector = app.config.start.apps[key].root_selector ;
                            if (!selector) {
                                throw Error('cant start app without root_selector defined (yet)')
                            }
                            app.open(
                                {   // TODO
                                    startup: app.config.start.apps[key], // instanceConfig
                                    config: app.config.start.apps[key]
                                },
                                selector
                            )
                        })
                    }
                } else if (app.config.init) {
                    app.init_app()
                }

                app.init_language()
            },

            get_hosts_for: function(identifier){
                var hosts = {};
                $.each(this._known_hosts, function(index, elem){
                    if (
                        (index != 'backend' && identifier == 'auth')
                        || (index != 'static' && identifier == 'static')
                    ) {
                        return
                    }
                    hosts[index] = elem;
                });
                return hosts
            },
            
            sendAuthorizationFor: function(host){
                if (host == this.options.host) {
                    return true
                }
                return false
            },
            
            newWidget: function(configuration){
                var replaceCurrent = true;
                var target;
                
                if (replaceCurrent) {
                    var source = configuration.source && configuration.source.element ? configuration.source.element.parent() : configuration.source || this.element,
                        view = configuration.widget_identifier ? 'widget' : undefined;
                    delete configuration.source;

                    if (source.closest('.'+config.frontend_generateClassName('object-view')).size()) {
                        target = source.closest('.'+config.frontend_generateClassName('object-view'));
                    }
                    if (target) {
                        this.mixins.view.showView.call(this, target, view, configuration, false)
                    }else{
                        this.require_mixin('view', {full_page: true});
                        return this.showView([view, configuration])
                    }
                }else{
                    if (this.element.closest('.'+this._widgetConfig.name_shape_widget).size()) {
                        target = this.element.closest('.'+this._widgetConfig.name_shape_widget).after.call.bind(this.element.closest('.'+this._widgetConfig.name_shape_widget));
                    }
                    if (target === undefined && configuration.source.element) {
                        target = configuration.source.element.append;
                    }
                    if (target === undefined) {
                        target = this.element.append;
                    }
                    configuration.apply_to = target;
                    return  this.newElement.apply(this, arguments);
                }
            },
    
            get_host: function(identifier, config){
                var settings = this.options.config;
                if (identifier === undefined) {
                    identifier = this.options.host;
                }
                var host_id = identifier,
                    orig_config = this.options.config.init.hosts[host_id],
                    current_config = $.extend({}, orig_config, config),
                    host_config = {
                        name: host_id,
                        frontend: this,
                        interactionHandler: this.openPopupFromResponse.bind(this),
                        endpoint:   current_config.host,
                        crossDomain: current_config.crossDomain !== undefined ? current_config.crossDomain : false,
                        log: this.getLog(),
                        auth: this.sendAuthorizationFor(host_id) ? this.getAuth() : undefined,
                        cache: this.cache,
                        initCallback: function(){
                            // nothing.
                        }
                    };
                if (this._known_hosts[host_id] === undefined) {
                    var host = this.options.host_resolver.apply(this, arguments);
                    this._known_hosts[host_id] = new host(host_config);
                }else if (!this._known_hosts[host_id].ready()){
                    this._known_hosts[host_id].init(host_config)
                }
                return this._known_hosts[host_id]
            },

            initHosts: function(){
                var $this = this;
                $.each(this.options.config.init.hosts, function(name, config){
                    $this.get_host(name);
                })
                $this.get_host('statics', {
                    host: this.options.deviceConfig.statics_url
                })
            },
    
            //initEndpoints: function(callback){
            //    settings = this.config;
            //    this.log('(init)', '[frontendCore]:', this);
            //
            //    //this.options.auth.
            //    this.authEndpointHost = settings.init.host;
            //
            //    //this.endpoint = this.new_ajax({
            //    //    endpoint:   settings.init.host,
            //    //    crossDomain: settings.init.crossDomain,
            //    //    log: this.__log,
            //    //    callback: callback
            //    //});
            //    /*
            //    this.data = this.new_ajax({
            //        endpoint:   settings.init.host,
            //        type:       'data',
            //        crossDomain: settings.init.crossDomain
            //    });
            //    this.me = this.new_ajax({
            //        endpoint:   settings.init.host,
            //        type:       'me',
            //        crossDomain: settings.init.crossDomain
            //    });
            //    this.content = this.new_ajax({
            //        endpoint:   settings.init.content_host,
            //        type:       'content',
            //        crossDomain: settings.init.crossDomain,
            //        external:   true
            //    });*/
            //
            //},
            
            perform_init: function(){
                if (this.config.autoLogin){
                    var autoLogin = {
                        callback: function(result){
                            if (result && result.isAuthenticated()){
                                this._init_app();
                                this.__initialized = true;
                            }else{
                                console.log(autoLogin)
                                this.refreshCredentials($.extend({}, autoLogin));
                            }
                        }.bind(this)
                    };
                    this.refreshCredentials($.extend({}, autoLogin));
                }else{
                    this._init_app()
                    this.__initialized = true;
                }
            },
            
            init_app:function(){
                if (this.__initialized) {
                    console.error('already initialized')
                    return
                }
                if (this.validate_app()){
                    this.prepare_app();
                }else{
                    console.warn('not initialized')
                }
            },
            
            prepare_app: function(){
                // nothing to prepare
                this.perform_init();
            },
            
            set_options: function (widget, options){
                var $widget = this.$(widget);
                $widget.data(this.config.appName + '-widget-options', $.extend({}, options));
            },
            get_options: function (widget){
                var $widget = this.$(widget);
                return $widget.data(this.config.appName + '-widget-options') || {};
            },
            create_widget: function(widget, widgetName, options){
                var $widget = this.$(widget); 
                if (options)this.set_options(widget, options);
                if (this.__initialized) {
                    $widget.attr('load-widget', widgetName);
                }else{
                    $widget.attr('load-' + this.config.appName, widgetName);
                    this.init_app();
                }
            },
            create_plugin: function(widget, widgetName, options){
                var $widget = this.$(widget);
                $widget.attr('load-plugin', widgetName);
                if (options)this.set_options(widget, options);
            },
    
            _init_app: function(){
                var selector = this.config.selector;
    
                $(selector).each(function(index, element){
                    var $widget = $(element);
                    this.addWidget($widget);
                })
            },
    
            init_language: function(){
                this.$language_selector = this.$(config.frontend_generateSelector('SelectLanguage', 'id'));
    
                if (this.$language_selector.size() == 1){
                    var $this = this;
                    this.$language_selector.bind(
                        'change' + config.frontend_generateEventSelector('core') + config.frontend_generateEventSelector('language'),
                        function(){
                            var newVal = $this.$language_selector.val();
                            if (newVal) {
                                newVal = newVal.toLowerCase();
                                if ($this.active_language_code != newVal) {
                                    $this.active_language_code = newVal;
                                    $this.ajax.setLanguage($this.active_language_code);
                                    $this.refresh()
                                }
                            }
                    })
                    this.$language_selector.triggerHandler('change' + config.frontend_generateEventSelector('core') + config.frontend_generateEventSelector('language'));
                }
            },
    
            init_coreWidget_bindings: function($target){
    
                $target.data('fancyWidgetCore', this); // TODO: each target individually?
                // set the global handlers
                $target.off(config.frontend_generateEventSelector('global-handler'));
    
                $target.on(config.frontend_generateEventName('error') + config.frontend_generateEventSelector('global-handler'), this.get_globalError_handler(this));
                $target.on(config.frontend_generateEventName('warning') + config.frontend_generateEventSelector('global-handler'), this.get_globalWarning_handler(this));
    
                $target.on(config.frontend_generateEventName('notification') + config.frontend_generateEventSelector('global-handler'), this.get_notification_handler(this));
            },
    
            refreshCredentials: function(settings){
                //if (this.authEndpointHost == null) {
                //    throw Error("Refreshing Credentials needs the this.authEndpointHost to be set")
                //}
                return this.options.auth.refresh(settings)  // this.endpoint.refreshCredentials();
                var $this = this;
                if (! settings) {
                    settings = {};
                }
                var id = this.endpoint.ajax.ajax({
                    url: this.authEndpointHost + 'auth/',
                    type: 'post', //CSRF
                    data: settings.forceRefresh ? {action:'revalidate'} : {action:'get'},
                    addCsrfHeader: true,
                    ignoreLock: true,
                    success: function(response, status, xhr){
                        $this.setCredentials(response);
                        if (settings.callback){
                            if (settings.expectsResult) {
                                settings.callback({auth: true});
                            }else{
                                if (settings.applyThis) {
                                    settings.callback.apply($this)
                                }else{
                                    settings.callback();
                                }
                            }
                        }
                    },
                    error: function(xhr){
                        if (settings && settings.callback){
                            if (settings.expectsResult) {
                                settings.callback({auth: false});
                            }else{
                                // if callback doesnt handle result, it shouldn't be called on fail
                            }
                        }
    
                        $this.get_failed_xhr_handler(config.dialog_generateWording('API.CLIENT.ERROR.PLEASE_REFRESH'))(xhr)
                    }
                });
            },
    
            destroy: function(selector){
                
                var $this = this;
    
                // get the targets
                if (selector == undefined) {
                    var $targets = this.$root_targets;
                }else if (typeof selector == "string") {
                    var $targets = this.$(selector);
                }else if (selector instanceof this.$) {
                    var $targets = selector;
                }else{
                    throw new TypeError("parameter needs to be nothing, a selector string or a jQuery Selector")
                }
    
                // find in every target
                $.each($targets, function(index, target){
    
                    var $target = $(target);
    
                    if ($target.hasClass(config.frontend_generateClassName('widget'))) {
    
                        // a widget and destroy it
                        $this._detroy_widget($target);
    
                    }else if ($target.hasClass(config.frontend_generateClassName('widget-container'))) {
    
                        // every widget
                        $.each($(target).find(config.frontend_generateSelector('widget')), function(index, widget){
    
                            // and destroy it
                            $this._detroy_widget($(widget));
                        })
    
                    }else{
                        throw new TypeError("parameter needs to point to either a '" +
                                            config.frontend_generateClassName('widget') +
                                            "' class or '" +
                                            config.frontend_generateClassName('widget-container') + "'");
                    }
    
                })
    
            },
    
            addWidget: function(){
                return this._load_widget.apply(this, arguments);
            },
    
            _detroy_widget: function($widget){
                $widget.removeData();
                $widget.off(config.frontend_generateEventSelector('widget'));
                $widget.html("");
            },
    
            scan: function(selector, setRoot){
                /*
                 * Use this method when some content was changed dynamically and
                 * frontend objects might have been updated
                 */
    
                // get the targets
                if (selector == undefined) {
                    var $targets = this.$root_targets;
                }else if (typeof selector == "string") {
                    var $targets = this.$(selector);
                }else if (selector instanceof this.$) {
                    var $targets = selector;
                }else{
                    throw new TypeError("parameter needs to be nothing, a selector string or a jquery Selector");
                }
    
                if (setRoot==undefined) {
                    setRoot = false;
                }
    
                if (setRoot) {
                    this.$root_targets = $targets;
                }
    
                this.init_coreWidget_bindings($targets);
    
                var $ = this.$;
                var $this = this;
    
                // find in every target
                $.each($targets, function(index, target){
    
                    var $target = $(target);
    
                    if ($target.hasClass(config.frontend_generateClassName('widget'))) {
    
                        // a widget and load it
                        //$target.on('init-widget.core', $this.get_widgetInit_handler($widget));
                        $this._load_widget($target);
    
                    }else if ($target.hasClass(config.frontend_generateClassName('widget-container'))) {
                        // every widget
                        $.each($(target).find(config.frontend_generateClassName('widget')), function(index, widget){
                            var $widget = $(widget);
    
                            // and load it
                            //try {
                                // if not done,
                                if (! $widget.data('__initialized')) {
                                    $this._load_widget($widget);
                                }
                            //} catch(e) {
                            //    console.log(e.message);
                            //}
    
                        })
    
                    }else{
                        throw new TypeError("parameter needs to point to either '" +
                                            config.frontend_generateClassName('widget') +
                                            "' class or '" +
                                            config.frontend_generateClassName('widget-container') + "'");
                    }
    
                })
            },
    
            refresh_scope: function(selector, setRoot){
                //throw Error('TODO: implement frontend.refresh_scope()')
                
            },
    
            refresh: function(selector, setRoot){
                /*
                 * when a complete new widget loading is needed, refresh does the job
                 */
                var settings = this.config;
                if (settings) {
                    //Configuration.set(settings);
                    this.parseConfiguration()
                }else{
                    Configuration.load(function(config){
                        this.config = config;
                        this.parseConfiguration(config);
                    }.bind(this));
                };
                
                return // TODO: is this stuff needed?
                this.destroy(selector);
                this.scan(selector, setRoot);
            },
    
    
            _destroy_widget: function ($widget) {
                if ($widget.trigger(config.frontend_generateEventName('destroy-widget'))){
                    $widget.removeData().html("");
                }
                $widget.off(config.frontend_generateEventSelector('core'));
            },
    
    
    //        parseLinkHeader: function(link_header){
    //            link_header_expr = /<([a-z:/\-0-9\.?&_=]*)>; rel="([a-zA-Z0-9:/\-?= ]*)"(?:; title="([a-zA-Z0-9:/\-?= ]*)",?)*/g
    //            links = {}
    //            while (link = link_header_expr.exec(link_header)){
    //                name = link[3] ? link[3] : link[2];
    //                links[name] = link[1];
    //            }
    //            return links
    //        },
    
            get_failed_xhr_form_handler: function ($form, action, $widget){
                return this.get_failed_xhr_targeted_handler($form, config.frontend_generateEventName('save-failed') + config.frontend_generateEventSelector('form'), action, $widget)
            },
    
            get_failed_xhr_handler: function (action, $widget){
                return this.get_failed_xhr_targeted_handler(null, null, action, $widget)
            },
    
            get_failed_ajax_handler: function(){
                return this.get_failed_xhr_handler('', undefined)
            },
    
            get_failed_xhr_targeted_handler: function ($target, custom_event, action, $widget){
                var $this = this;
                function failed_contend(jqXHR, status, error){
    
                    // parse error
                    var error_data = new Array(null);
                    if (jqXHR.getResponseHeader('Content-Type')) {
                        if (jqXHR.getResponseHeader('Content-Type').indexOf('application/json') !== -1) {
                            var error_data = new Array(jqXHR.responseText ? JSON.parse(jqXHR.responseText) : null);
                        }else if (jqXHR.getResponseHeader('Content-Type').indexOf('text/html') !== -1) {
                            var error_data = [$this.ajax.translateResponse_toJSON(jqXHR)];
                        }
                    }else{
                        // Server not available
                        var error_data = null;
                    }
    
                    // stop loading status in widget
                    if ($widget != undefined) {
                        $widget.triggerHandler(config.frontend_generateEventName('end-loading'));
                    }
    
                    // show error
    
                    if ($target) {
                        // nothing
                    }else if ($widget) {
                        $target = $widget;
                    }else{
                        $target = $this.$root_targets;
                    }
    
                    if ($target) {
                        $target.trigger(config.frontend_generateEventName('errors'), [action, error_data, jqXHR]);
                        if (custom_event != null)
                            $target.trigger(custom_event);
                    }
    
    
                }
                return failed_contend;
            },
    
            get_globalError_handler: function($this){
                return function (event, action, errors, jqXHR){ // none form saving related stuff
                    var notification;
                    var $target = $(event.target);
                    if (errors) {
                        $this.$.each(errors, function(index, elem){
                            if (elem != null){
    
                                if (elem.html) {
                                    notification = '<div class="'+config.frontend_generateClassName('title') + '">'+action+'</div>'+elem.html;
                                }else{
                                    notification = '<div class="' + config.frontend_generateClassName('title') + '">'+action+'</div>';
                                    notification += '<div class="' + config.frontend_generateClassName('error') +'"><div class="'+config.frontend_generateClassName('msg') + '">'+elem.msg+'</div>';
                                    notification += '<div class="' + config.frontend_generateClassName('detail') + '">'+elem.detail+'</div>';
    
                                    if (jqXHR) {
                                        notification += '<div class="'+config.frontend_generateClassName('response')+'">'+jqXHR.responseText+'</div>';
                                    }
    
                                    notification += '</div>';
    
                                }
                            }
                            else{
    
                                notification = action + ': server nicht erreichbar';
                            }
                        });
                    }else{
    
                        notification = action + ': server error';
                    }
                    $target.triggerHandler(config.frontend_generateEventName('notification'), ['error', notification])
                    event.stopImmediatePropagation();
                    return false;
                };
            },
    
            get_notification_handler: function(){
                return function(event, type, message){
                    var $this = $(event.target);
                    var $notification = $('<div class="'+config.frontend_generateClassName('notification')+' '+config.frontend_generateClassName('notification-'+type)+'"><div class="'+config.frontend_generateClassName('actionbar')+'"></div><div class="'+config.frontend_generateClassName('content')+'">' + message +'</div></div>');
                    $this.prepend($notification);
                    var left = $this.innerWidth()/2 - ($notification.outerWidth())/2;
                    $notification.css("margin-left", left);
                    if (type == "success") {
                        setTimeout(function(){$notification.remove()}, 3500);
                    }else{
                        $notification.find(config.frontend_generateSelector('actionbar')).append(' <span class="'+config.frontend_generateClassName('icon-close')+'"></span> ');
                        $notification.find(config.frontend_generateSelector('icon-close')).on('click', function(){
                            $notification.remove();
                        })
                    }
    
                }
            },
    
            openPopupFromResponse: function(host, config){
                var code = config.interaction,
                    data = config.data,
                    context = config.context,
                    widgetOptions = {
                        auth: context.settings.auth || this.getAuth(),
                        host: host,
                        result: context.result,
                        callback: callback,
                        widgetCore: this,
                    },
                    callback = config.callback;
                var $this = this;
                code = code.replace(' ', '_').toLowerCase();
                if (code.indexOf('auth') != -1) {
                    code = 'fancy-frontend.auth';
                }
                if (code.indexOf('tos') != -1) {
                    code = 'fancy-frontend.tos';
                }
                
                this.openPopup(code, callback, {widgetIdentifier: code, callback: callback, options:$.extend({}, data, widgetOptions), target:config.source});
            },
    
            get_globalWarning_handler: function($this){
                return this.get_globalError_handler($this)
            },
    
            buildPopupWidget: function(){
                var ret  = '<div load-widget="fancy-frontend.popup" ';
                //ret     += config.frontend_generateAttributeName('widget-name') + '="popup"';
                ret     += ' ></div>';
    
                return ret;
            },
    
            appendElement: function(element, target){
                var $target,
                    scope = this.options.scope;
                
                
                if (this.options.popUp_from_body && !target){
                    $target = $('body')
                }else if (target){
                    $target = target.element ? $target.element : target;
                    if (target.options && target.options.scope) {
                        scope = target.options.scope;
                    }
                }else{
                    $target = $($this.$root_element);
                }
                
                if ($target.children('aside').size() == 0) {
                     $target.append('<aside></aside>');
                }
                $target = $target.children('aside').first();
    
                if (!scope){
                    $target.prepend(element)
                }else{
                    scope.apply(element, function(content){
                        $target.prepend(content)
                    },
                    true)
                }
            },
    
            openPopup: function(popupKind, _callback, params){
                var $this = this;
                if (!params) {
                    params = {}
                }
                _callback = _callback || params.callback;
                var callback = _callback
                    $popup = $('<div></div>'),
                    target = params.target;
                params.handled = false;
                if (params.widgetIdentifier) {
                    params.options.callback = function (result){
                        if (!params.handled && callback) {
                            params.handled = true;
                            callback(result);
                        }
                        $popup.remove();
                    }
                    $content = $('<div></div>');
                    this.create_plugin($content,  params.widgetIdentifier, params.options);
                    params.content = $content;
                    //$popup.append(params.content);
                    //delete params.content;
                }
                
                params.widgetCore = this;// TODO: do this with this.add_widget()
                params.callback = function (result){
                        if (!params.handled && callback) {
                            params.handled = true;
                            callback(result);
                        }
                    }
                this.create_plugin($popup, 'fancy-frontend.popup', params);
                this.appendElement($popup, target);
                return;
                require(['fancyPlugin!widget:fancy-frontend:popup'], function($){
                    var $popup = $this.$root_targets.find(config.frontend_generateSelector('popup-window'));
        
                    if (params == undefined) {
                        params = {};
                    }
        
                    if (callback != undefined) {
                        $.extend(params, {'callback': callback});
                    }
        
                    if ($popup.size() == 0){
                        var $target = $('body');//this.$root_targets.first();
                        
                        //$target.append();
                        $popup = $($this.buildPopupWidget());//this.$root_targets.find(config.frontend_generateSelector('popup-window'))
                        $popup.prependTo('body');
                    }
        
                    $popup = $popup.first();
    
                    $popup.popup(params);
                    return
                    if (popupKind == config.frontend_prefix_css() + 'content') {
                        $popup.popup(params);
                    }else if (popupKind == config.frontend_prefix_css() + 'tos-missing') {
                        $popup.tos_popup(params);
                    }else if (popupKind ==  'auth-missing') { //config.frontend_prefix_css() +
                        if (params.authMethod == config.frontend_prefix_css() + 'auth-saml2') {
                            $popup.saml2_popup(params);
                        }else if (params.authMethod == 'auth-password') { // config.frontend_prefix_css() + 
                            $popup.popup(params);
                        }else{
                            throw new Error('authentication method "'+params.authMethod+'" unknown')
                        }
                    }else{
                        throw new Error('Popup name "'+popupKind+'" unknown')
                    }
                })
    
            },
            
            popUp: function(options){
                return this.openPopup(config.frontend_prefix_css() + 'content', options.callback, options);
            },
    
            termsOfService_denied: function(){
                this.$root_targets.find(config.frontend_generateSelector('widget')).each(function(index, elem){
                    var $widget = this.$(elem);
    
                    $widget.trigger(config.frontend_generateEventName('tos-denied'));
                })
            },
    
            resolve_endpoint: function (endpoint){
                if (discovered_endpoints[endpoint] == undefined){
                    this.discover_endpoint(endpoint)
                }
    
                return discovered_endpoints[endpoint].url
                /*
                    namespace_expr = /([a-zA-Z0-9\-_ ]):/g
                    viewname_expr = /(?:[a-zA-Z0-9\-_ ]*:)*([a-zA-Z0-9\-_ ])/g
                    namespaces = {}
                    cur_position = this.discovered_urls
                    while (namespace = namespace_expr.exec(view_name)){
                        if (! cur_position[namespace[0]]){
                            // right now there is no knowledge of this namespace
                            // discover it
                            self.discover(cur_position,namespace[1])
                        }
                    }
                    return ""
                    this.links = links*/
            },
    
            discover: function(url, namespace){
    
            },
    
            parse_link_header: function(link_header){
                link_header_expr = /<([a-z:/\-0-9\.?_=]*)>; rel="([a-zA-Z0-9:/\-?= ]*)"(?:; title="([a-zA-Z0-9:/\-?= ]*)",?)*/g
                links = {}
                while (link = link_header_expr.exec(link_header)){
                    name = link[3] ? link[3] : link[2];
                    links[name] = link[1]
                }
                this.links = links
            },
            
            load_dependencies: function(){
                    throw Error("not implemented")
            },
    
            initEndpoints: function(){
                    throw Error("not implemented")
    
            },
    
            setCredentials: function(accessId, accessSecret, accessAlgorithm) {
                    throw Error("not implemented")
    
            },
    
            _load_widget: function ($widget, apply_method, js) {
                    throw Error("not implemented")
            },
            
            setScope: function($scope){
                if (!this.__scope) {
                    this.__scope = $scope;
                }
            },
            
            log: function(text){
                function prepareObject(obj) {
                    var value = '';
                    obj = obj.__proto__;
                    while (obj && obj.widgetFullName){
                        if (value.length > 0) {
                            value += '<-'
                        }
                        value += obj.widgetFullName
                        obj = obj.__proto__
                    }
                    return value
                }
                console.log(text, {'.': prepareObject(this)});
            },
            
            log_info: function(){
                return this.log.apply(this, arguments)
            },
            
            toString: function(){
                return this.constructor.name
            },
    
        }
        
    })
        
        
    return frontend;
//
//define(['fancyPlugin!jquery', 'fancyPlugin!fancyFrontendConfiguration', 'json'], function($, Configuration, JSON){
//    var config;

//
//
//    function FrontendCore() {
//        this.init.apply(this, arguments);
//    }

    //$.extend(FrontendCore.prototype, );
    //return FrontendCore
});