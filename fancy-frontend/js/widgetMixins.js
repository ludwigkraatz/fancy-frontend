define(['fancyPlugin!jquery', 'fancyPlugin!fancyFrontendConfig'], function($, config){
    var mixins = {}
    
        var Mixin = {};

        var ViewMixin = {
                event_prefix: 'dynamic-view',
                init: function(mixinConfig){
                    
                    // setup view infrastructure
                    this.setupMixinHandlers(ViewMixin.event_prefix, this.views);
                    ViewMixin.setupView.apply(this);
                    
                    // init active view
                    if (this.options.defaultView) {
                        this.trigger(ViewMixin.event_prefix + '-show', [this.options.defaultView]);
                    }else{
                        if (this.setDefaultView) {
                            this.setDefaultView()
                        }else{
                            ViewMixin.setDefaultView.call(this);
                        }
                    }
                },
                

                setDefaultView: function(){
                    if (this.options.activeView) {
                        this.trigger(widgetConfig.mixins.ViewMixin.event_prefix + '-show', [this.options.activeView]);
                    }else {
                        this.log('no active view defined')
                    }
                },
                
                
                setupView: function (){
                    var $content = $('<div data-initial-view=true data-active=true></div>');
                    if (this.options.activeView) {
                        $content.attr('data-view-name', this.options.activeView)
                    }
                    this._$body = this.$body;
                    this._$body.wrapInner($content);
                    var $this = this;
                    
                    function setViewBody(name, data) {
                        var view_body = $this._$body.find('[data-view-name='+name+']');
                        if (view_body.size()==0 || view_body.attr('data-initial-view')) {
                            if (view_body.size()==0) {
                                view_body = $('<div></div>');
                                view_body.attr('data-view-name', name);
                                $this._$body.append(view_body);
                            }else{
                                view_body.removeAttr('data-initial-view');
                            }
                        }else{
                            $this.trigger(ViewMixin.event_prefix + '-removed', [name]);
                        }
                        $this.$body = $this._$body.children('[data-view-name='+ name +']');
                        $this.trigger(ViewMixin.event_prefix + '-found', [name, data]);
                        $this.$body.attr('data-active', true);
                        return view_body;
                    }
                    
                    this.on(ViewMixin.event_prefix + '-popup', function MixinCreateHandler(event, name, data){
                        event.stopPropagation();
                        $this.options.scope.log.debug('popup view:', name);
                        activeBody = $this.$body;
                        if (typeof data === 'function') {
                            var callback = data;
                            data = {
                            };
                        }
                        view_body = setViewBody(name, data);
                        $this.popUp(function(){
                            view_body.appendTo($this._$body);
                            if (! $this.$body.is(view_body)) {
                                view_body.removeAttr('data-active');
                            }
                            if (callback) {
                                callback.apply($this, arguments);
                            }
                        });
                        $this.$body = activeBody;
                    });
                    
                    this.element.on(ViewMixin.event_prefix + '-show.dynamic-widget.dynamic-dynamicet-widget', function MixinCreateHandler(event, name, data){
                        event.stopPropagation();
                        $this.options.scope.log.debug('show view:', name, data);
                        $this._$body.find('[data-active=true]').removeAttr('data-active');
                        // TODO: show loading
                        setViewBody(name, data);
                    });
                    //this.$body = this.$activeView.find('.body');
                },
            };
        mixins.ViewMixin = ViewMixin;
        

        var DraggableMixin = {
            init: function(mixinConfig){
                var $this = this;
                this.element.css('position', 'absolute');
                this.element.css('top', this.element.parent().position().top + 15);
                this.element.draggable({
                    //snap: true,
                    //grid: [ this.element.outerWidth()+20, 1 ],
                    containment: this.element.closest('.' + this._widgetConfig.name_shape_container),//$this._widgetConfig._config.frontend_generateID('dashboard'),
                    scroll: false,
                    handle: '>'+this._widgetConfig.selector_elements_header,//this.element.children(this._widgetConfig.selector_elements_header),//$this._widgetConfig.selector_elements_header,
                    //connectToSortable: "#dashboard .column",
                    //revert: "invalid",
                });
            }
        }
        mixins.DraggableMixin = DraggableMixin;
        

        var DetachableMixin = {
            init: function(mixinConfig){
                var $this = this;
                this.element.on('dragstart', function(event){
                    if (event.ctrlKey){
                        if ($this.options.detachable) {
                            event.stopImmediatePropagation();
                            // TODO: init for detachment
                            return false
                        }
                    }else if (event.altKey) {
                            event.stopImmediatePropagation();
                        // TODO: drag to add somewhere
                        // or to replace something
                        return false
                    }
                    return true
                })
            }
        }
        mixins.DetachableMixin = DetachableMixin;

        var NotificationMixin = {
            init: function(mixinConfig){
                this.element.on('dynamic-notification.dynamic-widget.dynamic-dynamicet-widget', this.options.widgetCore.get_notification_handler(this));
            }
        }
        
        var ApiMixin = {
            init: function(mixinConfig){
                this.api = {};
                this.api.object = this.options.scope.object;
                this.api.get = ApiMixin._getApiAccess.bind(this);
            },
            
            _getApiAccess: function(){
                return this.options.scope._accessApiEndpoint.apply(null, arguments)
            }
        }
        mixins.ApiMixin = ApiMixin;

        var ResourceMixin = {
            init: function(mixinConfig){
                var $this = this;/*
                function initResource() {
                    if ($this.options.scope._resource) {
                        $this.options.resource = $this.options.scope._resource;
                        if ($this.options.scope.__widgetReference) {
                            $this.options.relationship = $this.options.scope.__widgetData;
                        }
                    }
                    $this.trigger('resource-updated', [$this.options.resource])
                }
                function initResourceList() {
                    if ($this.options.scope._resourceList) {
                        $this.options.resourceList = $this.options.scope._resourceList;
                        if ($this.options.scope.__widgetReference) {
                            $this.options.relationship = $this.options.scope.__widgetData;
                        }
                    }
                    if ($this.options.scope.__defaultWidgetView == 'detail') {
                        $this.options.scope.log.debug('display list as the primary element')
                        $this.options.scope.__target = 'uuid';
                        $this.options.scope.__widgetResource = $this.options.scope.resourceList[0];
                        $this.options.scope.initResource();
                    }else{
                        $this.options.scope.log.debug('update list view')
                        $this.trigger('resourcelist-updated', [$this.options.resourceList])
                    }
                }
                $this.options.scope.log.debug('register scope watcher')
                this.options.scope.$watch('_resource', function(){
                    if ($this.options.scope._resource !== $this.options.resource){
                        $this.options.scope.log.debug('scope._resource changed', $this.options.scope.resource)
                        initResource();
                    }
                });  
                this.options.scope.$watch('_resourceList', function(){
                    if ($this.options.scope._resourceList !== $this.options.resourceList){
                        $this.options.scope.log.debug('scope._resourceList changed', $this.options.scope.resourceList)
                        initResourceList();
                    }else $this.options.scope.log.debug('watcher skipped updated list', $this.options.scope._resourceList, $this.options.resourceList)
                });     
                if ($this.options.scope.__widgetResource === null){
                    $this.log('setting default object, not instance')
                    $this.options.scope.__widgetResource = $this.object;
                    //$this.options.scope.updateResource($this.options.scope.object({target:'uuid', data:$this.object}));
                }
                $this.options.scope.log.debug('init resource')            
                this.options.scope.initResource();*/
                
                this.options.scope.prepareResource()
                if ($this.options.scope.__resourceId === null){
                    $this.log('setting default object, not instance')
                    $this.options.scope.__resourceId = $this.object;
                }
                
                this.options.resource = this.options.scope._resource;
                this.options.resourceList = this.options.scope._resourceList;
                
                this.options.scope._resource.bind('replaced', function(event, resource){
                    var newResource = resource.isBlank() ? null : resource;
                    if (newResource !== $this.options.resource) {
                        $this.options.resource = newResource;
                        $this.trigger('resource-updated', [$this.options.resource])
                    }
                });
                this.options.scope._resourceList.bind('replaced', function(event, resourceList){
                    var newResourceList = resourceList.isBlank() ? null : resourceList;
                    if (newResourceList !== $this.options.resourceList) {
                        $this.options.resourceList = newResourceList;
                        $this.trigger('resourcelist-updated', [$this.options.resourceList])
                    }
                });

                if ($this.options.scope.__widgetReference) {
                    $this.options.relationship = $this.options.scope.__resourceReference;
                }
                        
                if ($this.options.allowedRelationships === undefined) {
                    $this.options.allowedRelationships = ['-' + this._widgetConfig.relationships.child_of, '-' + this._widgetConfig.relationships.instance_of]
                }
                this.options.scope.initResource();
                
                    //this.options.instance = this.api.object.get($this.options.uuid);
                    // TODO: make sure this.options.resource is not just uuid
                
                /*
                $this.options.resource.all({
                    //target: $this.object,
                    data: {},
                    callback: function(result){   
                            console.log('a', result.getContent())
                        if (result.wasSuccessfull) {
                            this.options.source = result.getContent();
                        };
                    }
                });*/
                
            }
            
        };
        mixins.ResourceMixin = ResourceMixin;
        var TOSMixin = {
            init: function(mixinConfig){
                
                    this.element.on('dynamic-tos-denied.dynamic-widget.dynamic-dynamicet-widget', this.get_ToSDenied_handler(this));
            },
                
                get_ToSDenied_handler: function($this){
                    return function(event){
                        $this.$body('T.o.S.')
                    }
                },
            };
        var LoadingMixin = {
            
                init: function(mixinConfig){                    
                    this.$loading = null;
                    this.$loading_toggle = null;
                    //this.element.on('dynamic-loading-widget-failed.dynamic-widget.dynamic-dynamicet-widget', mixins.LoadingMixin.get_initFailed_handler(this));
                    //this.on(, LoadingMixin.get_loadingWidget_handler(this));
                    
                    //this.on(this._widgetConfig.name_event_init, LoadingMixin.get_loadingWidget_handler(this));
                    this.on(this._widgetConfig.name_event_init, LoadingMixin.get_initWidgetDone_handler(this));
                },
            

                get_initWidgetDone_handler: function($this){
                    return function(event){
                        // loading init
                        $this.$loading = $this.element;//.find('.dynamic-loading:first');
                        $this.$loading.data('activity_counter', 0);
                        $this.$loading_toggle = $this.$loading.parent().children('.dynamic-hide-for-loading');
                        
                        $this.on($this._widgetConfig.name_event_loading, LoadingMixin.get_startLoading_handler($this));
                        $this.on($this._widgetConfig.name_event_loadingFinished, LoadingMixin.get_endLoading_handler($this));
                               
                        //event.stopPropagation();
                        //todo
                    }
                },
                
                get_loadingWidget_handler: function($this){
                    return function(event){
                        event.stopPropagation();
                        $this.element.html('<div class="dynamic-loading-placeholder"/>'); //todo
                    }
                },
            
                
                get_startLoading_handler: function($this){
                    return function(event){
                        event.stopPropagation();
                        if ($this.$loading == null) {
                            return
                        }
                        if (!$this.$loading.hasClass('dynamic-active')){
                            $this.$loading.addClass('dynamic-active');
                            $this.$loading_toggle.hide()
                        }
                        $this.element.addClass(config.frontend_generateClassName('state-loading'))
                        $this.$loading.data('activity_counter', $this.$loading.data('activity_counter') + 1);
                    }
                },
                
                get_endLoading_handler: function($this){
                    return function(event){
                        event.stopPropagation();
                        if ($this.$loading == null) {
                            return
                        }
                        if ($this.$loading.hasClass(config.frontend_generateClassName('state-loading'))){
                            var counter = $this.$loading.data('activity_counter');
                            if (counter == 0) {
                                return;
                            }else if (counter == 1) {
                                $this.element.removeClass(config.frontend_generateClassName('state-loading'))
                                $this.$loading.removeClass('dynamic-active');
                                $this.$loading_toggle.show()
                            };
                            
                            $this.$loading.data('activity_counter', counter - 1);                            
                        }
                    }
                },
            };
            mixins.LoadingMixin = LoadingMixin;
            /*
             *
        
        var PopupMixin = {
                options: {
                    widget_url: null,
                    iframe_url: null,
                    ignoreLock: false
                },
                
                _create: function(){
                    
                    if (! this.element.hasClass('dynamic-popup-window')) {
                        throw new Error('the target for "fancy_frontend.popup" widget needs to have a "dynamic-popup" class');
                    }
                    if (this.options.widget_url == null && this.options.iframe_url == null) {
                        throw new Error('the "fancy_frontend.popup" needs a widget_url or iframe_url option');
                    }
                    
                    this.element.off('.dynamic-popup-window');
                    
                    var $this = this;
                    var $popup = this.element;
            
                    var $mask  =   $('<div class="dynamic-modal-mask">&nbsp;</div>');
                    $mask.insertAfter($popup);
                    this.$mask = $mask;
                    
                    var $content = $('<div class="dynamic-popup-content"></div>');
                    $popup.prepend($content);
                    this.$content = $content;
                    
                    
                    $popup.prepend('<div class="dynamic-popup-close right ui-icon-light ui-icon-closethick" style="margin-right:13px;margin-top: 7px;"></div>');
                    $popup.find(".dynamic-popup-close").click(function(){
                            $popup.triggerHandler('dynamic-close-popup');
                        }
                    )
                    
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
                        $mask.css({'width':maskWidth,'height':maskHeight});
                        
                        var winH = $(window).height();                    
                        var winW = $(window).width();
                        var top =  winH/2-$popup.height()/2;
                        var left =  winW/2-$popup.width()/2;        
        
                        //Set the popup window to center
                        $popup.css('top',  top);
                        $popup.css('left', left);
                    });
                    
                    $popup.on('dynamic-notification.dynamic-widget.dynamic-popup', fancy_frontend.get_notification_handler(this));
                    
                    $popup.on('dynamic-close-popup.dynamic-popup-window.dynamic-popup', function(event){
                        event.stopPropagation();
                        $mask.hide();
                        $popup.hide();
                        $popup.triggerHandler('dynamic-closed-popup');
                        $popup.remove();
                        $mask.remove();
                    });
                    
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
                    }
                    
                },
                
                getInitPopupHandler: function($this){
                    return function(response, text, xhr){
                
                        var $popup = $this.element;
                        var $mask = $this.$mask;
                        var $content = $this.$content;
                        
                        $content.html(response);
                        
                        $this.element.trigger('dynamic-init-popup', [
                                response, text, xhr
                            ]
                        );                        
                        
                        $popup.triggerHandler('dynamic-center-popup');
                        
                        //dynamic_modal_mask effect
                        $mask.fadeIn(500);
                        $mask.fadeTo("slow", 0.8);
                
                        //transition effect
                        $popup.fadeIn(1000);
                    }
                }
        };*/
        
        
        
        var form = {
                options:{
                    resetOn_postSave: true
                },
                
                _create: function() {
                    
                    if (! this.element.hasClass('dynamic-form')) {
                        throw new Error('the target for "fancy_frontend.form" widget needs to have a "dynamic-form" class');
                    }
                    
                    this.init_inputs();
                    
                    this.element.on('dynamic-pre-save.dynamic-form', this.get_preSave_handler(this));
                    this.element.on('dynamic-post-save.dynamic-form', this.get_postSave_handler(this));
                    this.element.find('.dynamic-save').on('click.dynamic-form', this.get_checkBeforeSave_handler(this));
                    this.element.on('dynamic-initiate-save.dynamic-form', this.get_checkBeforeSave_handler(this));
                    this.element.on('dynamic-save-failed.dynamic-form', this.get_submitFailed_handler(this));
                    this.element.on('dynamic-notification.dynamic-widget.dynamic-form', fancy_frontend.get_notification_handler(this));
                    this.element.on('dynamic-errors.dynamic-widget.dynamic-form', this.get_error_handler(this));
                    
                },
                
                get_error_handler: function($this){
                    return function(event, action, error_data, jqXHR){
                        if (jqXHR && jqXHR.status == 400) {
                            $.each(error_data, function(index, err){
                                $this.element.find('input, textarea, select').each(function(index, elem){
                                    var $elem = $(elem);
                                    if (err[$elem.attr("data-backend-attr")]) {
                                        event.stopImmediatePropagation();
                                        var msg = err[$elem.attr("data-backend-attr")];
                                        $elem.addClass("dynamic-invalid");
                                        alert(msg);
                                        $elem.removeClass("dynamic-invalid");
                                    }
                                }); 
                            })
                            if (event.isImmediatePropagationStopped()) {
                                $this.element.closest('.dynamic-widget').triggerHandler('dynamic-end-loading');
                            }
                            
                        }
                    }
                },
                
                get_checkBeforeSave_handler: function($this){
                    return function(event){
                        // no form submit shall be handled
                        event.preventDefault();
                        
                        // no customer specific, global, handlers should be alarmed
                        event.stopPropagation();
                        
                        var $form = $this.element;
                        
                        // do pre_save actions
                        $form.triggerHandler('dynamic-pre-save')
                        
                        // this is filled with data by form_validation mehtods
                        var check_form_result = {
                            form_is_valid: true,
                            errors: new Array(),
                            warnings: new Array()
                            };
                        
                        // handlerResult is undefined if no handler was executed
                        // might be helpfull if this someday is relevant
                        var handlerResult = $form.triggerHandler('dynamic-check-input', [check_form_result])
                        
                        var fakeXHR = {status: 400} // Bad Request: HTTP 400
                        
                        if (check_form_result.form_is_valid){
                                $form.trigger('dynamic-save');
                            }else{
                                if (handlerResult != undefined) {
                                    if (check_form_result.errors.length)
                                        $form.trigger(
                                            'dynamic-errors', [
                                                '{% sitewording_js "widget:new_inquiry:action:input:validation" %}',
                                                check_form_result.errors,
                                                fakeXHR
                                            ]
                                        );
                                    if (check_form_result.warnings.length)
                                        $form.trigger(
                                            'dynamic-warnings', [
                                                '{% sitewording_js "widget:new_inquiry:action:input:validation" %}',
                                                check_form_result.warnings,
                                                fakeXHR
                                            ]
                                        );  
                                }else{
                                    if (check_form_result.errors.length)
                                        $form.trigger(
                                            'dynamic-errors', [
                                                '{% sitewording_js "widget:new_inquiry:action:input:validation" %}',
                                                new Array({
                                                    'elem': $form,
                                                    'msg': '{% sitewording_js "widget:new_inquiry:action:input:validation:not_existing" %}'
                                                }),
                                                fakeXHR
                                            ]
                                        );
                                }
                                
                                $form.triggerHandler('dynamic-save-failed');
                            };
                    };
                },
                
                get_inputFocus_handler: function($this){
                    return function(event){
                        var $input = $(event.target);
                        event.stopPropagation();
                        
                        if($input.val() == $input.attr('data-descriptive-value')){
                            $input.val('');
                        }
                        $input.removeClass("dynamic-descriptive");
                    };
                },
                
                get_inputBlur_handler: function($this){
                    return function(event){
                        var $input = $(event.target);
                        event.stopPropagation();
                        
                        if(!$input.val()){
                            $input.val($input.attr('data-descriptive-value'));
                            $input.addClass("dynamic-descriptive");
                        }
                    };
                },
                
                get_preSave_handler: function($this){
                    return function(event){
                        var $form = $this.element;
                        
                        // deactivate save button
                        $this.deactivate_formButtons();
                        
                        // reset default values
                        $.each($form.find('input, textarea'), function(index, elem){
                            var $elem = $(elem);
                            if ($elem.attr('data-descriptive-value') == $elem.val()){
                                $elem.val('');
                            }
                        });
                    };
                },
                
                init_inputs: function(){
                    var $form = this.element;
                    var $this = this
                    
                    // reset default values
                    $.each($form.find('input, textarea, select'), function(index, elem){
                        var $elem = $(elem);
                        
                        if ($elem.attr('data-descriptive-value') != undefined){
                            if (!$elem.val()) {
                                // set value
                                $elem.val($elem.attr('data-descriptive-value'));
                                $elem.addClass("dynamic-descriptive");
                            }
                            
                            // set handlers
                            $elem.off('.dynamic-form-descriptive-value');
                            
                            $elem.on('focus.dynamic-form-descriptive-value', $this.get_inputFocus_handler($this));
                            $elem.on('blur.dynamic-form-descriptive-value', $this.get_inputBlur_handler($this));
                        }
                    });                    
                },
                
                get_postSave_handler: function($this){
                    return function(event){     
                        var $form = $this.element;
                        
                        if ($this.option('resetOn_postSave'))
                            $this.reset()
                        
                        $this.init_inputs()
                        
                        // activate save button
                        $this.activate_formButtons();
                    };
                },
                
                reset: function(){
                    
                    this.element.each(function(index, form){
                        var $form = $(form);
                        $form.get(0).reset();
                    });
                    
                },
                
                get_submitFailed_handler: function($this){
                    return function(event){
                        var $form = $this.element;
                        
                        // activate save button
                        $this.activate_formButtons();
                    }
                },
                
                deactivate_formButtons: function(){                    
                    var $save_button =  this.element.find('.dynamic-save');
                    $save_button.prop("disabled", true);
                    $save_button.addClass("deactivated");
                },
                
                activate_formButtons: function(){                    
                    var $save_button =  this.element.find('.dynamic-save');
                    $save_button.prop("disabled", false);
                    $save_button.removeClass("deactivated");
                }
            
            
        };
    
    return mixins;
});