define(['fancyPlugin!fancyWidgetCore', 'fancyPlugin!fancyFrontendConfig'], function($, config){
    $(function() {
        widgetConfig = $[config.apps['fancy-frontend'].defaults_namespace]._widgetConfig;

       $.widget( config.apps['fancy-frontend'].namespace + '.popup', $[config.apps['fancy-frontend'].defaults_namespace].core, {
                options: {
                    widget_url: null,
                    iframe_url: null,
                    ignoreLock: false,
                    closable: true
                },
                
                _destroy: function(){
                    if (this.element.data("__initialized") && this.options.callback) {
                        this.options.callback();
                    }
                    
                    this._superApply( arguments );
                },
                
                _create: function(){
                    /*
                    if (! this.element.hasClass('dynamic-popup-window')) {
                        throw new Error('the target for "fancy_frontend.popup" widget needs to have a "dynamic-popup" class');
                    }
                    if (this.options.widget_url == null && this.options.iframe_url == null) {
                        throw new Error('the "fancy_frontend.popup" needs a widget_url or iframe_url option');
                    }*/
                    this.options.shape = this._widgetConfig.name_shape_popup;
                    this._superApply( arguments );
                    
                    var $this = this;
                    var $popup = this.element;
            
                    //var $mask  =   $('<div class="dynamic-modal-mask">&nbsp;</div>');
                    //$mask.insertAfter($popup);
                    //this.$mask = $mask;
                    
                    /*var $content = $('<div class="dynamic-popup-content"></div>');
                    $popup.prepend($content);*/
                    this.$content = this.$body;
                    
                    $(document).resize(function(event){
                        $popup.trigger('dynamic-center-popup');
                    });
                    $(window).resize(function(event){
                        $popup.trigger('dynamic-center-popup');
                    });
                      
                    $popup.on('dynamic-center-popup.dynamic-popup-window.dynamic-popup', function(event){
                        event.stopPropagation();
                        
                        var maskHeight = $(document).outerHeight();
                        var maskWidth = $(window).outerWidth();

                        //Set height and width to mask to fill up the whole screen
                        //$mask.css({'width':maskWidth,'height':maskHeight});
                        
                        var winH = $(window).height();                    
                        var winW = $(window).width();
                        var top =  winH/2-$popup.height()/2;
                        var left =  winW/2-$popup.width()/2;        

                        //Set the popup window to center
                        //$popup.css('top',  top);
                        //$popup.css('left', left);
                    });
                    
                    if (this.options.widgetCore) {
                        $popup.on('dynamic-notification.dynamic-widget.dynamic-popup', this.options.widgetCore.get_notification_handler(this));
                    }
                    
                    if (this.options.widget_url) {
                        fancy_frontend.ajax.get({
                            "url": this.options.widget_url + '/',
                            "done": this.getInitPopupHandler(this),
                            "fail": function(jqXHR, status, statusText){
                                            $this.element.trigger(
                                                'dynamic-loading-popup-failed', [
                                                    jqXHR, status, statusText
                                                ]
                                            );
                                    },
                            "ignoreLock": $this.options.ignoreLock
                        });     
                    }else if (this.options.iframe_url){
                        var response = '<div><iframe style="height:150px;width:550px;margin-top:-40px;" src="'+this.options.iframe_url+'"/></div>';
                        this.getInitPopupHandler(this)(response)
                    }else if (this.options.body) {
                        this.$body.append(this.options.body);
                    }
                    
                },
                
                getInitPopupHandler: function($this){
                    return function(response, text, xhr){
                
                        var $popup = $this.element;
                        //var $mask = $this.$mask;
                        var $content = $this.$content;
                        
                        $content.html(response);
                        
                        $this.element.trigger('dynamic-init-popup', [
                                response, text, xhr
                            ]
                        );                        
                        
                        $popup.triggerHandler('dynamic-center-popup');
                        
                        //dynamic_modal_mask effect
                        /*$mask.fadeIn(500);
                        $mask.fadeTo("slow", 0.8);*/
                
                        //transition effect
                        $popup.fadeIn(1000);
                    }
                }
        });


    })
    return $
});
    