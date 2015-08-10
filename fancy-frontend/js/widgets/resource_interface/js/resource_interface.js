define(['fancyPlugin!fancyWidgetCore'], function(fancyWidgetCore){
    var $ = fancyWidgetCore.$,
        config = fancyWidgetCore.getFrontendConfig(),
        widgetConfig = fancyWidgetCore.getWidgetConfig(),
        views= widgetConfig.views;

    fancyWidgetCore_resource = fancyWidgetCore.derive('widget', {
        name: 'resource_interface',
        namespace: config.apps['fancy-frontend'].namespace,
        widget: {
            //defaultView: 'loading'
            _create: function(){          
                this.use_mixin('view');
                this.use_mixin('preprocessor');
                //this.use_mixin('resource');
                this._superApply( arguments );
            },
            views: {
                list: views.ListView,
                create: views.CreateView,
                edit: views.EditView,
                detail: views.DetailView
            },
            setDefaultView2: function(){
                if ((this.options.activeView == 'detail') || (!this.options.activeView && this.options.scope['__resourceTarget'] == 'uuid')) {
                    this.log('(view)', 'found detail view')
                    this.trigger(this._widgetConfig.mixins.ViewMixin.event_prefix + '-show', ['detail']);
                }else if ((this.options.activeView == 'list') || (!this.options.activeView && this.options.scope['__resourceTarget'] == 'relationship')) {
                    var viewConfig = {relationship: '-' + this._widgetConfig.relationships.instance_of};
                    this.log('(view)', 'found list view', viewConfig)
                    this.trigger(this._widgetConfig.mixins.ViewMixin.event_prefix + '-show', ['list', viewConfig]);
                }else {
                    this.log('(view)', 'couldnt figure out view here')
                    return false
                }
            }
        }
    });

    return fancyWidgetCore_resource
});