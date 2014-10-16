define(['fancyPlugin!widget:fancy-frontend:resource_interface', 'fancyPlugin!fancyFrontendConfig'], function($, config){
    $(function() {
        
        $.widget( config.apps['fancy-frontend'].namespace + '.development_interface', $[config.apps['fancy-frontend'].namespace].resource_interface, {

            _create: function(){
                this.use_mixin('view'); // to keep inter-mixin dependency order
                this.use_mixin('resource', {initialValue: this.object});//this._widgetConfig.mixins.DevelopmentResourceMixin);
                this._superApply( arguments );
            },

            setDefaultView: function(){
                if ((this.options.activeView == 'detail') || (!this.options.activeView && this.options.scope['__resourceTarget'] == 'uuid')) {
                    this.log('(view)', 'found list view', viewConfig)
                    this.trigger(this._widgetConfig.mixins.ViewMixin.event_prefix + '-show', ['detail']);
                }else if ((this.options.activeView == 'list') || (!this.options.activeView && this.options.scope['__resourceTarget'] == 'relationship')) {
                    var viewConfig = {relationship: '-' + this._widgetConfig.relationships.child_of}
                    this.log('(view)', 'found list view', viewConfig)
                    this.trigger(this._widgetConfig.mixins.ViewMixin.event_prefix + '-show', ['list', viewConfig]);
                }else {
                    this.log('(view)', 'couldnt figure out view here')
                    return false
                }
            }
        });
        

    })
    return $
});