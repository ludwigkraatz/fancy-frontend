define(['fancyPlugin!fancyWidgetCore', 'fancyPlugin!fancyFrontendConfig'], function($, config){
    $(function() {
        var widgetConfig = $[config.apps['fancy-frontend'].namespace]._widgetConfig;

        $.widget( config.apps['fancy-frontend'].namespace + '.os', $[config.apps['fancy-frontend'].namespace].core, { // 
            options: {
                shape: widgetConfig.name_shape_overlay,
                size: widgetConfig.name_size_small
            },
            
            _create: function(){
                var $this = this;
                //this._superApply( arguments );
                if (!this.options.inactive) {
                    this.element.addClass(this._widgetConfig.name_state_active)
                }
                this.element.on('blur', function(){
                    $this.element.removeClass($this._widgetConfig.name_state_active)
                })
                this.element.on('focus', function(){
                    $this.element.addClass($this._widgetConfig.name_state_active)
                })
                this.initWidget();
                this.initWidgetStructure();
                this.trigger('end-initializing');
            },
            
            initBody: function(){
                var settings = $('<ul></ul>'),
                    _settings = this.get_settings();
                for (index in _settings) {
                    var setting = _settings[index];
                    settings.append('<li>'+setting+'</li>')
                }
                this.$body.append(settings)
            },
            
            get_settings: function(){
                return [
                    'profile',
                    'privacy',
                    'help',
                    'remote',
                    'share'
                ]
            }
        });


    })
    return $
});