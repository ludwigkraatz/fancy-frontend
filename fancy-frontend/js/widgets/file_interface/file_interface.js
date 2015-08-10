define(['fancyPlugin!widget:fancy-frontend:resource_interface'], function(fancyWidgetCore){
    var $ = fancyWidgetCore.$,
        config = fancyWidgetCore.getFrontendConfig(),
        widgetConfig = fancyWidgetCore.getWidgetConfig();

    fancyWidgetCore_os = fancyWidgetCore.derive('resource_interface', {
        namespace: config.apps['fancy-frontend'].namespace,
        name: 'file_interface',
        widget: { }
    });

    return fancyWidgetCore_os
});