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
                        callback(this.options.result, view);
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
                    this.discover_state(function(result, view){
                        var resource = result.getResource(true);
                        resource.discover(function(result){
                            if (view) {
                                this.showView(view, {resource: resource});
                            }
                            this.use_mixin('actions', {resource: resource}, true);
                        }.bind(this));
                    }.bind(this));
                },
                
                authenticateView: function(config){
                    this.setHeadline('Login')
                    var resource = config.source && typeof(config.source.getResource) == 'function' ? config.source.getResource() : config.resource,
                        attributes = resource.getAttributes()
                        $this = this,
                        choices = attributes.method && attributes.method.getConfig('choices');
                    
                    config = {resource: resource, submit_label: 'Login'};
                    
                    if (choices) {
                        $.each(choices, function(name){
                            if (name  > 0) {
                                return  // TODO
                            }
                            resource.get('method', choices[name]).discover(function(config, result){
                                config.resource = result.getResource();
                                config.resource.bind('post-create', this.saved_handler.bind(this));
                                $this.use_mixin('edit', config, true, $this.mixins.view.event_prefix);
                            }.bind($this, config))
                        })
                    }else{
                        config.resource.bind('post-create', this.saved_handler.bind(this));
                        this.use_mixin('edit', config, true, this.mixins.view.event_prefix);
                    };
                },
        
                saved_handler: function(event, result){console.log(arguments);
                    if (this.options.callback) {
                        this.options.callback(result)
                    }
                    this.destroy();
                },
        },
    });

    return fancyWidgetCore_auth
});
    