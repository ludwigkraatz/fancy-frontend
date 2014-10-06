
define(['fancyPlugin!jquery', 'fancyPlugin!fancyFrontendConfiguration', 'json'], function($, Configuration, JSON){
    var config;
    function FrontendEndpoint() {
        this.init.apply(this, arguments);
    }
    var FrontendEndpointPrototype = {
        xhrFailHandlerMap: {
                503:{
                    'maintenance':function(context){
                        context.this.widgetCore.showMaintenance(responseJSON);
                    }
                },
                401:{
                    'auth missing':function(context){
                                        if (!context.apiClient.locked) {
                                                context.apiClient.lock();
                                                context.this.widgetCore.openPopupFromResponse(
                                                    context.error,
                                                    context.response,
                                                    context.methodMap.processInteraction
                                                )   
                                            }
                    },
                    'UNAUTHORIZED': function(context){
                        return context.methodMap.proceedFailure()
                    }
                }
            },
        
        init: function(){
            this.widgetCore = [].splice.call(arguments, 0, 1);
            this._parentClass.prototype.init.apply(this, arguments);
        },
        
    }


    function FrontendCore() {
        this.init.apply(this, arguments);
    }

    $.extend(FrontendCore.prototype, {
        $: $,

        init: function(settings, coreApp){
            var $this = this;
            this.log_info('init frontendCore' + (coreApp ? ('with coreApp=' + coreApp) : ' as coreApp'))
            this.coreApp = coreApp || this;
            
            var $this = this;
            if (settings) {
                this.config = Configuration.set(settings);
                this.parseConfiguration()
            }else{
                Configuration.load(function(config){
                    this.config = config;
                    $this.parseConfiguration(config);
                });
            }
        },
        
        parseConfiguration: function(){
            config = this.config;
            app = this;//'fancyPlugin!fancyWidgetCore', 
            require(['fancyPlugin!fancyAjax', 'introspective-api-endpoint', 'fancyPlugin!css:core'], function(FrontendAjax, ApiEndpoint){
                var useWindowNavigation = true; // TODO
                //app.$ = $;
                app.FrontendAjax = FrontendAjax;
                
                $.extend(FrontendEndpoint.prototype, ApiEndpoint.prototype);
                $.extend(FrontendEndpoint.prototype, FrontendEndpointPrototype);
                FrontendEndpoint.prototype._parentClass = ApiEndpoint;
                app.FrontendEndpoint = FrontendEndpoint;

                elements_selector: "[xmlns='" + config.elementsXMLNSSelector + "']";

                // maybe check for cookies, if user has a preferred frontendFramework to run with
                // TODO

                if (app.config.start.apps) {
                    for (key in app.config.start.apps) {
                        require(['fancyPlugin!app:'+ key], function(app){
                            app.init(
                                app.config.start.apps[key], // instanceConfig
                                app
                            )
                        })
                    }
                } else if (app.config.init) {
                    app.init_app()
                }
                // END TODO

                app.$root_targets = app.$(config.frontend_generateSelector('widget-container'));

                app.init_coreWidget_bindings(app.$root_targets);

                app.ajax = app.new_ajax();
                //dynamic_widgets = $this.ajax.access('dynamic-widgets');

                app.init_language()

                app.initEndpoints();

                if (app.config.autoLogin){
                    this.log_info('autoLogin')
                    app.refreshCredentials({callback: app.scan, applyThis: true});
                }
            })
        },
        
        init_app:function(){
            if (this.__initialized) {
                console.error('already initialized')
                return
            }
            if (this.validate_app()){
                this.prepare_app();
                this._init_app();
                this.__initialized = true;
            }else{
                console.warn('not initialized')
            }
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

        new_ajax: function(config){
            if (config) {
                return new this.FrontendEndpoint(this, config);
            }else{
                return new this.FrontendAjax();
            }
            
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
            var $this = this;
            if (! settings) {
                settings = {};
            }
            var $this = this;
            if (this.authEndpointHost == null) {
                throw Error("Refreshing Credentials needs the this.authEndpointHost to be set")
            }
            this.ajax.ajax({
                url: this.authEndpointHost + 'credentials/',
                type: 'post', //CSRF
                data: settings.forceRefresh ? {action:'revalidate'} : {action:'get'},
                addCsrfHeader: true,
                ignoreLock: true,
                done: function(response, status, xhr){
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
                fail: function(xhr){
                    if (settings && settings.callback){
                        if (settings.expectsResult) {
                            settings.callback({auth: false});
                        }else{
                            // if callback doesnt handle result, it shouldn't be called on fail
                        }
                    }

                    $this.get_failed_xhr_handler(config.dialog_generateWording('API.CLIENT.ERROR.PLEASE_REFRESH'))(xhr)
                }
            })
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

        refresh: function(selector, setRoot){
            /*
             * when a complete new widget loading is needed, refresh does the job
             */

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

        openPopupFromResponse: function(code, response, callback){
            return this.openPopup(code, callback, response);
        },

        get_globalWarning_handler: function($this){
            return this.get_globalError_handler($this)
        },

        buildPopupWidget: function(){
            var ret  = '<div class="'+config.frontend_generateClassName('popup-window')+'" ';
            ret     += config.frontend_generateAttributeName('widget-name') + '="popup"';
            ret     += ' ></div>';

            return ret;
        },

        openPopup: function(popupKind, callback, params){
            var $this = this;
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
    
                if (popupKind == config.frontend_prefix_css() + 'content') {
                    $popup.popup(params);
                }else if (popupKind == config.frontend_prefix_css() + 'tos-missing') {
                    $popup.tos_popup(params);
                }else if (popupKind == config.frontend_prefix_css() + 'auth-missing') {
                    if (params.authMethod == config.frontend_prefix_css() + 'auth-saml2') {
                        $popup.saml2_popup(params);
                    }else if (params.authMethod == config.frontend_prefix_css() + 'auth-password') {
                        // todo
                    }else{
                        throw new Error('authentication method "'+params.authMethod+'" unknown')
                    }
                }else{
                    throw new Error('Popup name "'+popupKind+'" unknown')
                }
            })

        },
        
        popUp: function(options){
            return this.openPopup(config.frontend_prefix_css() + 'content', undefined, options);
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

        initEndpoints: function(){
                throw Error("not implemented")

        },

        setCredentials: function(accessId, accessSecret, accessAlgorithm) {
                throw Error("not implemented")

        },

        _load_widget: function ($widget, apply_method, js) {
                throw Error("not implemented")
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
            //console.log(text, prepareObject(this));
        },
        
        log_info: function(){
            return this.log.apply(this, arguments)
        },
        
        toString: function(){
            return this.constructor.name
        },

    });
    return FrontendCore
});