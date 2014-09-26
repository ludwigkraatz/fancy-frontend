define(['fancyPlugin!fancyWidgetCore', 'fancyPlugin!fancyFrontendConfig'], function($, config){
    $(function() {
        widgetConfig = $[config.apps['fancy-frontend'].defaults_namespace]._widgetConfig;

        $.widget( config.apps['fancy-frontend'].namespace + '.resource_interface', $[config.apps['fancy-frontend'].namespace].core, {
            _create: function(){          
                this.use_mixin('view');
                this.use_mixin('resource');
                this.use_mixin('api');
                this._superApply( arguments );
            },
            setDefaultView: function(){
                if ((this.options.activeView == 'detail') || (!this.options.activeView && this.options.scope['__target'] == 'uuid')) {
                    this.trigger(widgetConfig.mixins.ViewMixin.event_prefix + '-show', ['detail']);
                }else if ((this.options.activeView == 'list') || (!this.options.activeView && this.options.scope['__target'] == 'relationship')) {
                    this.trigger(widgetConfig.mixins.ViewMixin.event_prefix + '-show', ['list', ['-' + widgetConfig.relationships.instance_of]]);
                }else {
                    throw Error('unrecognized view');
                }
            }
        });


    })
    return $
});