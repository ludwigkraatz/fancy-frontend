define(['fancyPlugin!widget:fancy-frontend:resource_interface', 'fancyPlugin!fancyFrontendConfig'], function($, config){
    $(function() {
        
        $.widget( config.apps['fancy-frontend'].namespace + '.development_interface', $[config.apps['fancy-frontend'].namespace].resource_interface, {

            _create: function(){
                this.mixins.resource = this._widgetConfig.mixins.DevelopmentResourceMixin;
                this._superApply( arguments );
            },

            setDefaultView: function(){
                if ((this.options.activeView == 'detail') || (!this.options.activeView && this.options.scope['__resourceTarget'] == 'uuid')) {// TODO
                    this.trigger(this._widgetConfig.mixins.ViewMixin.event_prefix + '-show', ['detail']);
                }else if ((this.options.activeView == 'list') || (!this.options.activeView && this.options.scope['__resourceTarget'] == 'relationship')) {
                    this.trigger(this._widgetConfig.mixins.ViewMixin.event_prefix + '-show', ['list', {relationship: '-' + this._widgetConfig.relationships.child_of}]);
                }else {
                    this.log('(error)', 'unrecognized view', this.options.activeView)
                    throw Error('unrecognized view');
                }
            }
        });
        

    })
    return $
});