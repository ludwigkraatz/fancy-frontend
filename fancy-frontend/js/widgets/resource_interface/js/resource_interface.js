define(['fancyPlugin!fancyWidgetCore', 'fancyPlugin!fancyFrontendConfig'], function($, config){
    $(function() {
        widgetConfig = $[config.apps['fancy-frontend'].defaults_namespace]._widgetConfig;

        $.widget( config.apps['fancy-frontend'].namespace + '.resource_interface', $[config.apps['fancy-frontend'].namespace].core, {
            _create: function(){          
                this.use_mixin('view');
                this.use_mixin('resource');
                this._superApply( arguments );
            },
            setDefaultView: function(){
                if ((this.options.activeView == 'detail') || (!this.options.activeView && this.options.scope['__resourceTarget'] == 'uuid')) {
                    this.trigger(this._widgetConfig.mixins.ViewMixin.event_prefix + '-show', ['detail']);
                }else if ((this.options.activeView == 'list') || (!this.options.activeView && this.options.scope['__resourceTarget'] == 'relationship')) {
                    this.trigger(this._widgetConfig.mixins.ViewMixin.event_prefix + '-show', ['list', {relationship: '-' + this._widgetConfig.relationships.instance_of}]);
                }else {
                    throw Error('unrecognized view');
                }
            }
        });


    })
    return $
});