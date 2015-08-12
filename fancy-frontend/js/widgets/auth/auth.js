define(['fancyPlugin!widget:fancy-frontend:resource_interface'], function(fancyWidgetCore){
    var $ = fancyWidgetCore.$,
        config = fancyWidgetCore.getFrontendConfig(),
        widgetConfig = fancyWidgetCore.getWidgetConfig();

    fancyWidgetCore_auth = fancyWidgetCore.derive('resource_interface', {
        namespace: config.apps['fancy-frontend'].namespace,
        name: 'auth',
        widget: {
                options: {
                    successUrl:null,
                    shape: 'content',
                    show_plugins_as_overlay: true,
                    auth_header: false
                },
                _create: function(){
                    this._superApply(arguments);
                },
                
                discover_state: function(callback){
                    var view;
                    if (this.options.code == 'AUTHENTICATION MISSING') {
                        view = 'authenticate';
                    }
                    
                    if (this.options.result) {
                        var url = this.options.result.getRequest().url,
                            xhr = this.options.result.getXhr(),
                            locationHeader = xhr && xhr.getResponseHeader('Location');
                        if (locationHeader && url != locationHeader) {
                            this.getHost().discover({
                                url: locationHeader,
                                done: callback.bind(this, view)
                            })
                        }else{
                            callback(view, this.options.result);
                        }
                    }else{
                        this.require_mixin('overlay');
                        this.initOverlay()
                    }
                    
                },
            
                initOverlay: function(){
                    var settings = $('<ul></ul>'),
                        setting,
                        $this = this;
                    $.each(this.get_settings(), function(index, setting) {
                        _setting = $('<li>'+setting.label+'</li>');
                        if (!setting.callback) {
                            throw Error('couldnt find settings callback for setting', setting)
                        }
                        _setting.click(setting.callback.bind($this));
                        settings.append(_setting)
                    })
                    this.$body.append(settings)
                },
                
                get_settings: function(){
                    var $this = this;
                    return [
                        {
                            'label': 'logout',
                            'callback': function(){
                                this.getAuth().logout(this.getHost(), {source: this.options.scope['!private'].$owner}, function(){});
                                this.element.blur();
                            }
                        },
                        {
                            'label': 'Login other profile',
                            'callback': function(){
                                //this.getAuth().logout();
                                this.element.blur();
                            }
                        }
                    ]
                },
                
                refresh: function(){
                    this._superApply(arguments);
                    this.discover_state(this.handle_state.bind(this));
                },
                
                handle_state: function(view, result){
                    var resource = result.getResource(true);
                    resource.discover(function(result){
                        var actions = {};
                        if (view) {
                            this.showView(view, {resource: resource});
                        }
                        if (resource.__links['register']){
                            actions['register'] = {
                                action: {'translate_to': 'FANCY-FRONTEND.AUTH.REGISTER'},
                                callback: function(resource){
                                    resource.get('register').discover(this.handle_state.bind(this, 'authenticate'))
                                }.bind(this, resource)
                            }
                        }
                        if (resource.__links['request']){
                            actions['request'] = {
                                action: {'translate_to': 'FANCY-FRONTEND.AUTH.REQUEST'},
                                callback: function(resource){
                                    resource.get('request').discover(this.handle_state.bind(this, 'authenticate'))
                                }.bind(this, resource)
                            }
                        }
                        if (resource.__links['authenticate']){
                            actions['authenticate'] = {
                                action: {'translate_to': 'FANCY-FRONTEND.AUTH.AUTHENTICATE'},
                                callback: function(resource){
                                    resource.get('authenticate').discover(this.handle_state.bind(this, 'authenticate'))
                                }.bind(this, resource)
                            }
                        }
                        this.use_mixin('actions', {resource: resource, actions: actions, show: ['authenticate', 'register', 'register']}, true);
                    }.bind(this));
                },
                
                authenticateView: function(config){
                    this.setHeadline('Login')
                    var resource = config.source && typeof(config.source.getResource) == 'function' ? config.source.getResource() : config.resource,
                        attributes = resource.getAttributes()
                        $this = this,
                        choices = attributes.method && attributes.method.getConfig('choices'),
                        primary_actions = {};
                    
                    config = {resource: resource, submit_label: 'Login'};
                    
                    if (choices) {
                        $.each(choices, function(index, name){
                            if (index  > 0) {
                                primary_actions[name] = {
                                    action: {'translate_to': 'FANCY-FRONTEND.AUTH.METHOD.' + name.toUpperCase()},
                                    callback: function(resource){
                                        resource.get('method', name).discover(this.handle_state.bind(this, 'authenticate'))
                                    }.bind($this, resource)
                                }
                                return  // TODO
                            }
                            resource.get('method', name).discover(function(config, result){
                                config.resource = result.getResource();
                                config.resource.bind('post-create', this.saved_handler.bind(this));
                                $this.use_mixin('edit', config, true, $this.mixins.view.event_prefix);
                            }.bind($this, config))
                        })
                        this.use_mixin('actions', {resource: resource, actions: primary_actions, show: ['Password', 'Guest'], target: this.$header}, true);
                    }else{
                        config.resource.bind('post-create', this.saved_handler.bind(this));
                        this.use_mixin('edit', config, true, this.mixins.view.event_prefix);
                    };
                },
        
                saved_handler: function(event, result){
                    this.getAuth().authenticate(result.settings, result);
                    if (this.options.callback) {
                        this.options.callback(result)
                    }
                    this.destroy();
                },
        },
    });

    return fancyWidgetCore_auth
});
    