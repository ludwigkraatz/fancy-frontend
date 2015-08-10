
define(["jquery", "fancyPlugin!introspective-api-hosts--original"], function($, hosts){
    var IntrospectiveApiHost = hosts.IntrospectiveApiHost;

    function FrontendHost() {
        this.init.apply(this, arguments); 
    }
    
    /* prototype extension */
    $.extend(FrontendHost.prototype, IntrospectiveApiHost.prototype);
    $.extend(FrontendHost.prototype, {

        
    });
    
    hosts.FrontendHost = FrontendHost;
    
    return hosts
});
