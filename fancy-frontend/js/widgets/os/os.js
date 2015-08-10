define(['fancyPlugin!fancyWidgetCore'], function(fancyWidgetCore){
    var $ = fancyWidgetCore.$,
        config = fancyWidgetCore.getFrontendConfig(),
        widgetConfig = fancyWidgetCore.getWidgetConfig();

    fancyWidgetCore_os = fancyWidgetCore.derive('widget', {
        namespace: config.apps['fancy-frontend'].namespace,
        name: 'os',
        widget: { // 
            options: {
                shape: widgetConfig.name_shape_overlay,
                size: widgetConfig.name_size_small,
                owner: null
            },
            
            _create: function(){
                var $this = this;
                //this._superApply( arguments );
                if (!this.options.inactive) {
                    this.element.addClass(widgetConfig.name_state_active)
                }
                this.element.on('blur', function(){
                    $this.element.removeClass(widgetConfig.name_state_active)
                })
                this.element.on('focus', function(){
                    $this.element.addClass(widgetConfig.name_state_active)
                })
                this._superApply( arguments );
                //this.initWidget();
                this.initWidgetStructure();
                this.trigger('end-initializing');
            },
            
            initBody: function(){
                var settings = $('<ul></ul>'),
                    setting,
                    $this = this;
                $.each(this.get_settings(), function(index, setting) {
                    _setting = $('<li>'+setting.label+'</li>');
                    if (!setting.callback) {
                        throw Error('couldnt find settings callback for setting', setting)
                    }
                    _setting.click(setting.callback.bind($this.options.owner, $this));
                    settings.append(_setting)
                })
                this.$body.append(settings)
            },
            
            get_settings: function(){
                var $this = this;
                return [
                    {
                        'label': 'bigger',
                        'callback': function(){
                            if ($this.options.owner){
                                $this.options.owner.setShape(undefined, widgetConfig.name_size_full)
                                $this.element.trigger('blur');
                            }
                        }
                    }
                    //'profile',
                    //'privacy',
                    //'help',
                    //'remote',
                    //'share'
                ]
            }
        }
    });

    return fancyWidgetCore_os
});