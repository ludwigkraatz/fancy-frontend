define(['fancyPlugin!widget:fancy-frontend:resource_interface', 'fancyPlugin!fancyFrontendConfig'], function($, config){
    $(function() {
        
        widgetConfig = $[config.apps['fancy-frontend'].defaults_namespace]._widgetConfig;

        $.widget( config.apps['fancy-frontend'].namespace + '.development_interface', $[config.apps['fancy-frontend'].namespace].resource_interface, {

            setDefaultView: function(){
                if ((this.options.activeView == 'detail') || (!this.options.activeView && this.options.scope['__target'] == 'uuid')) {// TODO
                    this.trigger(widgetConfig.mixins.ViewMixin.event_prefix + '-show', ['detail']);
                }else if ((this.options.activeView == 'list') || (!this.options.activeView && this.options.scope['__target'] == 'relationship')) {
                    this.trigger(widgetConfig.mixins.ViewMixin.event_prefix + '-show', ['list', ['-' + widgetConfig.relationships.child_of]]);
                }else {
                    throw Error('unrecognized view');
                }
            }
        });
        

    })
    return $
});