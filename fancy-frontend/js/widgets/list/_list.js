define(['fancyPlugin!fancyWidgetCore', 'fancyPlugin!introspective-api-handles'], function(fancyWidgetCore, apiHandles){
    var $ = fancyWidgetCore.$,
        config = fancyWidgetCore.getFrontendConfig(),
        widgetConfig = fancyWidgetCore.getWidgetConfig();
  

    return fancyWidgetCore.derive('core', {
        namespace: config.apps['fancy-frontend'].namespace,
        name: 'list',
        widget: {
            options: {
                source: null
            },
            _create: function(){
                //this.ignore_option('source')
                this.use_mixin('preprocessor', {
                    option: 'source',
                    config: {
                        handler: apiHandles.ListHandler,
                    }
                })
                this._superApply( arguments );
            },
            
            refresh: function(){
                this._superApply( arguments );
                if (this.options.source instanceof apiHandles.ListHandler){
                    console.log('open ListHandler')
                }else{
                    throw Error('unknown source: ' + this.options.source)
                }
                this.goToPage();
            }
        }
    });
})
