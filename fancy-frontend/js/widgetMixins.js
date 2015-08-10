define(['fancyPlugin!jquery', 'fancyPlugin!fancyFrontendConfig'], function($, config){
    var mixins = {}
    
        var Mixin = {};

        var ViewMixin = {
                event_prefix: 'fancy-frontend-ViewMixin',
                init: function(mixinConfig){
                    var $this = this,
                        $view;
                        
                    this._ignored_options.push('defaultView');
                    this._ignored_options.push('activeView');
                    
                    if (mixinConfig.data.full_page) {
                        // TODO: using this.element would also bubble up..
                        $view = this.element.closest('.' + config.frontend_generateClassName('object-view'));
                        if ($view.size() == 0) {
                            $view = this.element;
                        }
                    }else{
                        $view = this.element;
                    }
                    mixinConfig.view = $view;
                    mixinConfig.viewEventTarget = this.element;
                    mixinConfig.data.use_breadcrumb = mixinConfig.data.use_breadcrumb === undefined ? false : mixinConfig.data.use_breadcrumb;
                    mixinConfig.breadcrumbs = [];
                    
                    if (!this.showView) {
                        this.showView = ViewMixin.showView.bind(this, mixinConfig.viewEventTarget)
                    }
                    if (!this.closeView) {
                        this.closeView = ViewMixin.closeView.bind(this, mixinConfig)
                    }
                    
                    if (mixinConfig.data.views) {
                        this.views = $.extend({}, this.views, mixinConfig.data.views);          // make sure changes are just for this instance
                    }
                    if (mixinConfig.data.navigation) {
                        $.each(mixinConfig.data.navigation.choices || [], function(name, config){
                            if (config.view){
                                $this.views[name] = config.view;
                            }
                        })
                        //$.each(mixinConfig.data.navigation.menu || [], function(index, config){
                        //    if (config.view){
                        //        $this.views[name] = config.view;
                        //    }
                        //})
                    }
                    //this.addView = ViewMixin.addView.bind(this);
                    
                    mixinConfig.elements = mixinConfig.data.elements || ['body'];
                    if (mixinConfig.data.full_page) {
                        mixinConfig.data.lazy = false;
                    }
                    if (!mixinConfig.viewEventTarget.hasClass(config.frontend_generateClassName('object-view'))) {
                        mixinConfig.viewEventTarget.addClass(config.frontend_generateClassName('object-view'))
                    }
                    ViewMixin.setupLazyView.call($this, mixinConfig); 
                    
                    this.setupMixinHandlers(ViewMixin.event_prefix, this.views);                    
                    if (mixinConfig.data.navigation && false) {
                        ViewMixin.setupNavigation.call($this, mixinConfig.data.navigation);
                        this.on('init-widget-structure-done.header init-widget-structure-done.footer', function(event){
                            ViewMixin.setupNavigation.call($this, mixinConfig.data.navigation);
                        })
                    }                   
                    if (mixinConfig.data.choices && false) {
                        ViewMixin.setupChoices.call($this, mixinConfig.data.choices);
                        //this.on('init-widget-structure-done.header init-widget-structure-done.footer', function(event){
                        //    ViewMixin.setupChoices.call($this, mixinConfig.data.choices);
                        //})
                    }
                    
                    ViewMixin.finalizeInit.call($this, mixinConfig)
                },
                
                showView: function(target, view, config, local){
                    if (local === undefined) {
                        local = true;
                    }
                    if (Array.isArray(view)) {
                        config = view[1];
                        view = view[0];
                    }
                    if (config) {
                        //throw Error('TODO: is config arg for .showView() implemented??')
                    }
                    if (local && this[view + 'View']) {
                        this.initWidgetStructure(undefined, true);
                        if (!this[view + 'View'](config)){
                            this.apply(undefined, undefined, true)
                            return true
                        }
                    }
                    var ret = target.trigger(ViewMixin.event_prefix + '-show', [view, config]);
                    
                    if (local && this['post_' + view + 'View']) {
                        this['post_' + view + 'View'](config)
                    }
                    this.apply(undefined, undefined, true)
                    return ret
                },
                
                closeView: function(mixinConfig){
                    var target = mixinConfig.viewEventTarget,
                        closed_view = mixinConfig.breadcrumbs.pop();
                        ret = target.trigger(ViewMixin.event_prefix + '-remove', [closed_view[0]]);
                    if (mixinConfig.breadcrumbs.length) {
                        last_view = mixinConfig.breadcrumbs[mixinConfig.breadcrumbs.length -1];
                        this.showView(last_view[0], last_view[1]);
                    }else{
                        this.destroy()
                    }
                },
                
                finalizeInit: function(mixinConfig){
                    var $this = this;
                    // init active view
                    if (mixinConfig.data.show){
                        //this.showView(mixinConfig.data.show);
                    }else if (!$this.options.activeView) {
                        if ($this.options.defaultView) {
                            this.option('activeView', this.options.defaultView);
                            //this.showView($this.options.defaultView)
                        }else{
                            if ($this.setDefaultView) {
                                $this.setDefaultView()
                            }else{
                                if (ViewMixin.setDefaultView.call($this) === false){
                                    $this.setDefaultView()
                                }
                            }
                        }
                    }
                    
                },
                
                
                //
                //setupNavigationEntry: function(menu_attr_name, menu, index, translation){
                //    this.options.scope[menu_attr_name][index] = {
                //        id: index,
                //        label: translation,
                //        entry: menu[index]
                //    };
                //},
                //
                //setupNavigation: function(navigation){
                //    var $this = this,
                //        menu = navigation.menu || [],
                //        menu_translation_prefix = '',
                //        menu_attr_name = 'navigation';
                //    if (menu.length) {
                //        this.options.scope[menu_attr_name] = [];
                //        $this.$menu = this.newElement({
                //            css_class: 'navigation',
                //            tag: 'ul',
                //            widget_identifier: 'fancy-frontend.list',
                //            widget_options: {
                //                source: this.options.scope[menu_attr_name],
                //                onSelect: function(elem){
                //                    $this.element.trigger(ViewMixin.event_prefix + '-show', ['widget', elem.entry])
                //                },
                //                entryTemplate: '<a href="#" ><span class="'+config.frontend_generateClassName('action')+' '+config.frontend_generateClassName('action-')+'{{ _source.{index}.entry.icon }}"></span><span class="'+config.frontend_generateClassName('title')+'" translate="{{ _source.{index}.label }}"></span></a>',
                //                entryTag: 'li',
                //                inline: true,
                //                size: config.frontend_generateClassName('size-small'),
                //                selectFirst: navigation.full_page ? false : true,
                //                view: navigation.view,
                //            },
                //            target: navigation.target || $(this.$header, this.$footer),
                //        })
                //        for (var index=0; index < menu.length; index++) {
                //            //$this.translate(menu_translation_prefix + menu[index].translation_identifier,
                //            //                ViewMixin.setupNavigationEntry.bind($this, menu_attr_name, menu, index)
                //            //);
                //            var translation_id = this.build_translation_id(menu_translation_prefix + menu[index].translation_identifier);
                //            ViewMixin.setupNavigationEntry.call($this, menu_attr_name, menu, index, translation_id)
                //        }
                //    }
                //},
                
                addView: function(name, view){
                    this.views[name] = view;
                },
                

                setDefaultView: function(){
                    if (this.options.activeView) {
                        //this.showView(this.options.activeView);
                        //this.trigger(this._widgetConfig.mixins.ViewMixin.event_prefix + '-show', [this.options.activeView]);
                    }else {
                        this.log('no active view defined')
                    }
                },
                
                setupViewWidget: function(mixinConfig, $view){
                    var $this = this;
                    
                    mixinConfig.viewEventTarget.off(ViewMixin.event_prefix + '-popup');
                    mixinConfig.viewEventTarget.on(ViewMixin.event_prefix + '-popup', function MixinCreateHandler(event, name, data){
                        event.stopPropagation();
                        $this.log('show popup:', mixinConfig._activeView_package);
                        
                        mixinConfig.view.triggerHandler('popup', [
                                               name, //$this.generateStateIdentifier.bind($this),
                                               data,
                                               $this.initWidgetStructure.bind($this, mixinConfig.elements),
                                               function(newElements){
                                                    
                                                }, function(){
                                                    $this.trigger(ViewMixin.event_prefix + '-found', [name, data]);
                                                    
                                                    $this.popUp(function(){
                                                        if (typeof data == 'function') {
                                                            data.apply($this, arguments);
                                                        }
                                                        if (mixinConfig._activeView_package) {
                                                            $this.trigger(ViewMixin.event_prefix + '-show', mixinConfig._activeView_package);
                                                        }
                                                    });
                                                },
                                                true
                                            ]
                        )
                        
                    });
                    mixinConfig.viewEventTarget.off(ViewMixin.event_prefix + '-show');
                    mixinConfig.viewEventTarget.on(ViewMixin.event_prefix + '-show', function MixinCreateHandler(event, name, data){
                        event.stopPropagation();
                        mixinConfig._activeView_package = [name, data];
                        $this.log('(fancy-frontend)', '(widgetMixins)', '(view)', 'show view:', mixinConfig._activeView_package);
                        mixinConfig.breadcrumbs.push(mixinConfig._activeView_package);
                        mixinConfig.view.triggerHandler('show', [
                            ViewMixin.generateViewArgs.call($this,
                                                       mixinConfig,
                                                       mixinConfig._activeView_package[0],
                                                       mixinConfig._activeView_package[1]
                            )]
                        )
                        
                    });
                },
                
                generateViewArgs: function(mixinConfig, name, config){
                    var $this = this;
                    return {
                                name: name, //$this.generateStateIdentifier.bind($this),
                                data: config,
                                elements: $this.initWidgetStructure.bind($this, mixinConfig.elements),
                                setContent: function(newElements){
                                     
                                 },
                                reloadContent: function(){
                                     $this.trigger(ViewMixin.event_prefix + '-found', mixinConfig._activeView_package);
                                 },
                                cache: true,
                                paginationConfig: undefined
                    }
                },
                
                runViewWidget: function(mixinConfig, elements, showNewView, popup){
                    var $this = this;
                    ViewMixin.setupViewWidget.call($this, mixinConfig);
                    
                    if (mixinConfig.view != this.element) {
                        return
                    }
                    
                    (this.options.frontend ? this.options.frontend : this).create_plugin(
                                    mixinConfig.view,
                                    'fancy-frontend.view',
                                    {
                                        attached: true,
                                        initView: {
                                            name: mixinConfig._activeView_package ? mixinConfig._activeView_package[0] : (mixinConfig.data.show && mixinConfig.data.show[0]), //this.generateStateIdentifier.bind(this),
                                            data: mixinConfig._activeView_package ? mixinConfig._activeView_package[1] : (mixinConfig.data.show && mixinConfig.data.show[1]),
                                            elements: elements,
                                            setContent: function(newElements){
                                                
                                            },
                                            reloadContent: showNewView,
                                            cache: true,
                                            popup: popup
                                        },
                                        navigation: mixinConfig.data.navigation
                                    }
                    )
                    // setup view infrastructure
                    this.apply(this.element)
                },
                
                setupLazyView: function (mixinConfig){
                    var $this = this;
                    if (mixinConfig.data.lazy !== false){//(!mixinConfig.data.navigation || mixinConfig.data.lazy === true) && (mixinConfig.data.lazy !== false)){
                        mixinConfig.viewEventTarget.on(ViewMixin.event_prefix + '-popup', function MixinCreateHandler(event, name, data){
                            event.stopPropagation();
                            
                            elements = $this.initWidgetStructure.bind($this, mixinConfig.elements, false);//mixinConfig._activeView_package ? true : false);
                            
                            ViewMixin.runViewWidget.call($this, mixinConfig,
                                                    elements,
                                                    function(){ 
                                                       $this.trigger(ViewMixin.event_prefix + '-popup', [name, data]);
                                                       
                                                },
                                                true
                                              );
                        });
                        
                        mixinConfig.viewEventTarget.on(ViewMixin.event_prefix + '-show', function MixinCreateHandler(event, name, data){
                            event.stopPropagation();
                            $this.log('show view initial:', name, data);
                            //if (mixinConfig.hasOwnProperty('_activeView_package') && mixinConfig._activeView_package) {
                                ViewMixin.runViewWidget.call($this, mixinConfig,
                                                    $this.initWidgetStructure.bind($this, mixinConfig.elements, false),
                                                    function(){ 
                                                       $this.showView(name, data);//trigger(ViewMixin.event_prefix + '-show', [name, data]);
                                                    }
                                                  );
                            //}else{
                            //    mixinConfig._activeView_package = [name, data];
                            //    $this.trigger(ViewMixin.event_prefix + '-found', mixinConfig._activeView_package);
                            //}
                        });
                    }else{
                        ViewMixin.runViewWidget.call($this, mixinConfig,
                                                    $this.initWidgetStructure.bind($this, mixinConfig.elements, false),
                                                    function(){
                                                        if (mixinConfig.data.show) {
                                                            $this.showView(mixinConfig.data.show);
                                                        }
                                                    }
                                                  );
                    }
                    
                },
                
                /*
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
                        $this.log('popup view:', name);
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
                        $this.log('show view:', name, data);
                        $this._$body.find('[data-active=true]').removeAttr('data-active');
                        // TODO: show loading
                        setViewBody(name, data);
                    });
                    //this.$body = this.$activeView.find('.body');
                },*/
            };
        mixins.ViewMixin = ViewMixin;
        

        var DraggableMixin = {
            init: function(mixinConfig){
                var $this = this;
                //this.element.css('position', 'absolute');
                //this.element.css('top', this.element.parent().position().top + 15);
                this.element.draggable({
                    //snap: true,
                    //grid: [ this.element.outerWidth()+20, 1 ],
                    containment: this.element.closest('.' + this._widgetConfig.name_mixin_container),//$this._widgetConfig._config.frontend_generateID('dashboard'),
                    scroll: false,
                    handle: '>'+this._widgetConfig.selector_elements_header,//this.element.children(this._widgetConfig.selector_elements_header),//$this._widgetConfig.selector_elements_header,
                    //connectToSortable: "#dashboard .column",
                    //revert: "invalid",
                });
            }
        }
        mixins.DraggableMixin = DraggableMixin;
        

        var TagNavigationMixin = {
            init: function(mixinConfig){
                var $this = this;
                var target = mixinConfig.data.target || (this.$header || this.$footer)
                var $navigation = $('<nav></nav>').addClass(config.frontend_generateClassName('tag-navigation'));
                this.element.data('$TagNavigationTarget', target);
                this.element.data('$TagNavigation', $navigation);
                this.element.data('TagNavigationTags', []);
                this.element.data('TagNavigationActive', mixinConfig.data.active || []);
                target.prepend($navigation)
                this.addNavigationTag = TagNavigationMixin.addNavigationTag.bind(this);
                this.addNavigationTags = TagNavigationMixin.addNavigationTags.bind(this);
            },
            
            addNavigationTag: function(tag, $elem){
                tag = tag.toLowerCase();
                $elem.addClass(
                    config.frontend_generateClassName('tag-'+tag)
                )
                TagNavigationMixin.applyTag.call(this, tag)
            },
            
            clickTag: function(tag_name, event){
                var tag = $(event.target);
                var tag_class = config.frontend_generateClassName('tag-'+tag_name);
                if (!TagNavigationMixin.toggleTag.call(this, tag)) {
                    this.element.data('$TagNavigationTarget').find('.'+tag_class).css('display', 'none');
                }else{
                    this.element.data('$TagNavigationTarget').find('.'+tag_class).css('display', '');
                }
                
            },
            
            toggleTag: function(tag){
                var class_name = config.frontend_generateClassName('state-active');
                if (tag.hasClass(class_name)) {
                    tag.removeClass(class_name);
                    return false
                }else{
                    tag.addClass(class_name);
                    return true
                }
            },
            
            applyTag: function(tag_name){
                var tag = $('<div></div>'),
                    tag_class = config.frontend_generateClassName('tag-'+tag_name),
                    $this = this;
                tag.html(tag_name);
                tag.addClass(config.frontend_generateClassName('interactive-clickable'));
                tag.click(TagNavigationMixin.clickTag.bind(this, tag_name))
                this.element.data('$TagNavigation').append(tag)
                if ($this.element.data('TagNavigationActive').indexOf(tag_name) != -1){
                    tag.click();
                }else{
                    //this.element.data('$TagNavigationTarget').find('.'+tag_class).css('display', 'none');
                };
                this.element.data('TagNavigationTags').push(tag_name)
            },
            
            addNavigationTags: function(tags, $elem){
                var $this = this;
                $.each(tags, function(index, tag){
                    tag = tag.toLowerCase();
                    $elem.addClass(
                        config.frontend_generateClassName('tag-'+tag)
                    )
                    if ($this.element.data('TagNavigationTags').indexOf(tag) == -1) {
                        TagNavigationMixin.applyTag.call($this, tag);
                    }
                })
            }
        }
        mixins.TagNavigationMixin = TagNavigationMixin;
        

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
                this.element.on('dynamic-notification.dynamic-widget.dynamic-dynamicet-widget', (this.options.frontend ? this.options.frontend : this).get_notification_handler(this));
            },
            
            notify: function(){
                this.element.trigger(config.frontend_generateEventName('notification') + config.frontend_generateEventSelector('global-handler'), this.get_notification_handler(this));
            },
            
            warning: function(){
                this.element.trigger(config.frontend_generateEventName('notification') + config.frontend_generateEventSelector('global-handler'), this.get_notification_handler(this));
            }
        }
        
        var ApiMixin = {
            init: function(mixinConfig){
                var config = mixinConfig.data.config || {};
                
                config.host = this.getHost();
                config.auth = this.getAuth();
                config.log = this.getLog();
                
                this.api = new this.handles.ApiHandle(config)
            },
            
            _getApiAccess: function(){
                return this.options.scope._accessApiEndpoint.apply(null, arguments)
            }
        }
        mixins.ApiMixin = ApiMixin;
        
        var OSMixin = {
            init: function(mixinConfig){
                var $this = this;
                OSMixin.setup.call($this, mixinConfig);
                this.on('init-widget-structure-done.header', function(event){
                    OSMixin.setup.call($this, mixinConfig);
                })
            },
            
            setup: function(mixinConfig){
                var $settingsBtn = this.newElement({
                    plugin_identifier: 'fancy-frontend.os?',
                    plugin_options: {
                        owner: this
                    },
                    view: '',
                    icon: 'os',
                    target: this.$header
                });
            }
        }
        mixins.OSMixin = OSMixin;
        
        var SVGInjectorMixin = {
            init: function(mixinConfig){
                var $this = this,
                    selector = (mixinConfig.data ? mixinConfig.data.selector : null) || ('.' + config.frontend_generateClassName('action'));

                $this.element.addClass(config.frontend_generateClassName('fancyFrontendMixin-SVGInspector'));
                require(['fancyPlugin!lib:SVGInjector/svg-injector.min'], function(SVGInjector){
                    SVGInjectorMixin.inject.call($this, selector);

                    if (mixinConfig.data.watch !== false) {
                        $this.on('init-widget-structure-done init-widget-structure-done.header init-widget-structure-done.navi init-widget-structure-done.body init-widget-structure-done.footer asset-loaded.css',  function(event){
                            SVGInjectorMixin.inject.call($this, selector, $(event.target));
                            $this.log('(fancy-frontend)', '(widgetMixins)', '(SVGInjector)', ' - svg', $this, selector, event.target)
                        })
                        $this.executeOnApply(function(){
                            SVGInjectorMixin.inject.call($this, selector);
                            $this.log('(fancy-frontend)', '(widgetMixins)', '(SVGInjector)', ' + svg', $this, selector, event.target)
                        }, true)
                    }else{
                        $this.executeOnApply(function(event){
                            SVGInjectorMixin.inject.call($this, selector);
                        })
                    }
                })
            },
            
            inject: function(selector, $target){
                var $this = this;
                $.each(($target || $this.element).find(selector), function (index, element){
                    var $elem = $(element),
                        background_image = $elem.css('background-image'),
                        url_pattern = background_image.split('url('),
                        backgorund_url = url_pattern.length > 1 ? url_pattern[1].slice(0,-1) : url_pattern[0];
                    if (backgorund_url && backgorund_url != 'none') {
                        $elem.css('background-image', 'none')
                        $elem.attr('data-src', backgorund_url)
                        var events = $._data($elem[0], 'events');
                        SVGInjector = require('fancyPlugin!lib:SVGInjector/svg-injector.min');
                        SVGInjector(element, events ? {each: function(svg){
                            $.each(events, function(event, callbacks){
                                $.each(callbacks, function(index, callback){
                                    $(svg).on(event, callback)
                                })
                            })
                        }} : null);
                    }//console.log($target, element, background_image);
                });
            }
        }
        mixins.SVGInjectorMixin = SVGInjectorMixin;
        
        var ActionsMixin = {
            init: function(mixinConfig){
                var $target = mixinConfig.data.target || this.$footer;

                if ($target && $target.size()) {
                    ActionsMixin.initializeActionMixin.call(this, mixinConfig, $target)
                }else{
                    this.on('init-widget-structure-done.footer', function(){
                        ActionsMixin.initializeActionMixin.call(this, mixinConfig, this.$footer)
                    }.bind(this))
                }
                
            },

            initializeActionMixin: function(mixinConfig, $target){
                mixinConfig.$target = ActionsMixin.initActionContainer.call(this, $target);
                if (!this.element.data('fancy-frontend.mixins.ActionMixin.$target')){
                    this.element.data('fancy-frontend.mixins.ActionMixin.$target', mixinConfig.$target);
                }
                
                this.on_refresh('source', ActionsMixin.onRefresh.bind(this, mixinConfig))
            },
            
            onRefresh: function(mixinConfig){
                var $this = this,
                    discover = mixinConfig.data.discover !== undefined ? mixinConfig.data.discover : true,
                    resource = (this.options.source && typeof(this.options.source.getResource) == 'function') ? this.options.source.getResource() : this.options.resource || this.options.source,
                    $target = mixinConfig.$target;

                ActionsMixin.cleanActionContainer.call(this, mixinConfig);

                if (discover && resource && !resource.isBlank()) {
                    resource.discover(function(result){
                        var actions = result.getResponse()['actions'];
                        if (actions) {
                            $this.log('(fancy-frontend)', '(mixin)', '(actions)', 'found actions', actions);
                            for (var action in actions){
                                if (action.toUpperCase() == action) {
                                    // skip UppderCase Actions, as POST and PUT
                                    if (action == 'DELETE') {
                                        ActionsMixin.addAction.call($this, {label: action, css_class: 'action-delete'}, function(){
                                            resource.destroy();
                                            this.destroy()
                                        }.bind(this), $target)
                                    }
                                    if (action == 'POST' && false) {
                                        ActionsMixin.addAction.call($this, {label: action, css_class: 'action-add'}, function(){
                                            throw Error('TODO: create')
                                        }, $target)
                                    }
                                    if (['PATCH', 'PUT'].indexOf(action) != -1) {
                                        ActionsMixin.addAction.call($this, {label: action, css_class: 'action-edit'}, function(){
                                            this.showView('edit')
                                        }.bind(this), $target)
                                    }
                                    continue
                                }
                                var act = action;
                                ActionsMixin.addAction.call($this, action, function(){
                                    resource.execute(act)
                                }, $target)
                            }
                        }
                    }.bind(this))
                }
                
                ActionsMixin.completedActionContainer.call($this);
            },
            
            cleanActionContainer: function(mixinConfig) {
                var $target = mixinConfig ? mixinConfig.$target : this.element.data('fancy-frontend.mixins.ActionMixin.$target');
                $target.children('.' + config.frontend_generateClassName('action')).remove();
            },
            
            
            completedActionContainer: function() {
                this.trigger('init-widget-structure-done.navi');
            },
            
            initActionContainer: function($target, tag){
                var $actions, $container,
                    selector = (tag || '') + '.' + config.frontend_generateClassName('actions');

                if ($target.find(selector).size() != 0) {
                    $actions = $target.find(selector).first()
                }else{
                    $actions = $('<ul></ul>').addClass(config.frontend_generateClassName('actions'));
                    $container = tag ? $('<'+tag+'></'+tag+'>').html($actions) : $actions;
                    $target.append($container);
                }
                return $actions
            },
            
            addAction: function(action, handler, $target){
                var $this = this;
                var action_trigger = $this.newElement({
                        apply_to: $target,
                        css_class: action.css_class
                    });
                action_trigger.addClass(config.frontend_generateClassName('action'))
                if (typeof action == 'string') {
                    action_trigger.html(action);
                }else if (typeof action == 'object' && action.label) {
                    action_trigger.attr('title', action.label);
                }
                action_trigger.click(function(event){
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    handler(event)
                })
            }
        }
        mixins.ActionsMixin = ActionsMixin;

        var _AttrMixin = {
            init: function(mixinConfig, name, initialValue, attrReference, asPrimary, defaultRelationships, options){
                var $this = this;
                initialValue = initialValue !== undefined ? initialValue : mixinConfig.data.initialValue;
                
                if (!mixinConfig.data.autoSave || mixinConfig.data.autoSave.constructor != Array) {
                    mixinConfig.data.autoSave = mixinConfig.data.autoSave ? [mixinConfig.data.autoSave] : false
                }
                
                this.options.scope._prepareAttr(name, initialValue, attrReference, asPrimary, options)
                
                var accessables = [name, name +'List'];
                for (var index in accessables) {
                    var _name = accessables[index];
                    this.options[_name] = this.options.scope['_' + _name];
                    this.log('(fancy-frontend)', '(widgetMixins)', '(AttrMixin)', 'option', _name, this.options.scope['_' + _name]);
                    this.options.scope['_' + _name].bind('replaced', _AttrMixin.replacedHandler.bind(this, mixinConfig, _name));
                }
                if ($this.options.scope['__'+name+'Reference']) {
                    $this.options[name+'Relationship'] = $this.options.scope['__'+name+'Reference'];
                }
                if (!$this.options.hasOwnProperty(name + 'RelationshipsAllowed') && defaultRelationships) {
                    $this.options[name + 'RelationshipsAllowed'] = defaultRelationships;
                }
                this.options.scope._initAttr(name);

                var unwatch = [];  // TODO: is this needed at some point? unwatch[*]()
                for (var index in mixinConfig.data.autoSave) {
                    var attr = mixinConfig.data.autoSave[index];
                    if (!attr) {
                        continue
                    }
                    unwatch.push($this.options.scope.$watch(name + '.' + attr, function(){
                        var target = attr == '*' ? undefined : attr;
                        if (!$this.options[name].isBlank() && $this.options[name].needsSave(target)){
                            $this.options[name].save(target)
                        }
                    }, true))
                    unwatch.push($this.options.scope.$watch(name + '.' + attr + 'List', function(){
                        var target = attr == '*' ? undefined : attr;
                        if (!$this.options[name + 'List'].isBlank() && $this.options[name + 'List'].needsSave(target)){
                            $this.options[name + 'List'].save(target)
                        }
                    }, true))
                }
            },
            
            replacedHandler: function(mixinConfig, name, event, obj){
                var $this = this;
                $this.log('(fancy-frontend)', '(widgetMixins)', '(AttrMixin)', 'updating option "'+name+'" with', obj)
                
                var newObj = obj;//obj.isBlank() ? null : obj;
                if (newObj !== $this.options[name]) {
                    $this.options[name] = newObj;
                    $this.trigger('option-changed.' + name, [newObj]);
                    if (mixinConfig.data.autoLoad && !newObj.isBlank()) {
                        newObj.load({});
                    }
                }
            }
        };
        mixins._AttrMixin = _AttrMixin;

        var ResourceMixin = {
            init: function(mixinConfig, initialValue, asPrimary, defaultRelationships, options){
                var $this = this;
                
                this.options.scope.$watch('__resourceAsNew', function(val, oldVal){
                    if (val) {
                        $this.showView('create')
                        //$this.trigger($this._widgetConfig.mixins.ViewMixin.event_prefix + '-show', ['create']);
                    }else{
                        if (oldVal) { // TODO: show 'default'
                            $this.showView('detail')
                            //$this.trigger($this._widgetConfig.mixins.ViewMixin.event_prefix + '-show', ['detail']);
                        }
                    }
                })
                _AttrMixin.init.call(
                                     this,
                                     mixinConfig,
                                     'resource',
                                     initialValue,
                                     this.options.scope.__widgetReference,
                                     asPrimary,
                                     defaultRelationships,
                                     options
                                     )
                
                        
                
                return
                
            },
            
        };
        mixins.ResourceMixin = ResourceMixin;

        var PreprocessorMixin = {
            init: function(mixinConfig){
                var $this = this,
                    state = {};
                var init = mixinConfig.data.init;
                var config = mixinConfig.data.config || {},
                    proxy = config.proxy;
                var target = mixinConfig.data.option,
                    handle_class = mixinConfig.data.handle || this.handles.ApiHandle;
                
                config.host = this.getHost();
                config.auth = this.getAuth();
                config.log = this.getLog();
                config.source = this;
                
                if (!init) {
                    init = {};
                }

                init.refreshHandler = function(target, config){
                    var handled = false;
                    if (config){
                        if (config.view) {
                            if (config.source) {
                                this.option(target, config.source)
                            }
                            handled = true;
                            var view = config.view;
                            delete config.view;
                            if (!this.showView) {
                                this.log('(fancy-frontend)', '(widgetMixins)', '(preprocessor)', 'require mixin view for preprocessor mixin')
                                
                                this.require_mixin('view', {lazy: false, show: [view, config]});
                            }else{
                                this.showView(view, config);
                            }
                            
                            
                        }else 
                        if (config.source) {
                            handled = true;
                            this.option(target, config.source)
                        }
                    }
                    if (!handled) {
                        throw Error('not implemented yet: refreshHandler for config ')
                    }
                }.bind(this, target);
                
                
                

                //if (this.options.scope && init.initialValue){  // TODO: better..
                ////    _AttrMixin.init.call(
                ////                     this,
                ////                     mixinConfig,
                ////                     target,
                ////                     undefined,
                ////                     this.options.scope.__widgetReference
                ////                     )
                //
                //    var id = this.options.scope['__' + target + 'Id'];
                //    init.initialValue += id ? id + '/' : '';
                //    
                //    
                //}
                
                if (!init.initialValue && this.endpoint) {
                    init.initialValue = this.endpoint;
                }
                
                if (this.options.scope) {
                    if (this.options.scope.__state['.'][target]) {
                        state = this.options.scope.__state['.'][target];
                    }
                    else {
                        this.options.scope.__state['.'][target] = state;
                    }
                }

                var handle = new handle_class(config, state, init);
                this.refresh_host = PreprocessorMixin.refreshHostHandler.bind(this, handle, this.refresh_host)
                this.refresh_auth = PreprocessorMixin.refreshAuthHandler.bind(this, handle, this.refresh_auth)
                
                if (target){
                    this['preprocess_' + target] = PreprocessorMixin.preprocessHandler.bind(this, handle, proxy, target)
                    this['refresh_' + target] = PreprocessorMixin.refreshHandler.bind(this, handle, proxy, target, this['refresh_' + target])

                    if (this.options.scope) {
                        this.options.scope.$watch('_' + target, function(new_value, old_value){
                            if (old_value === new_value) {
                                return
                            }
                            this.log('(event)', 'scopes "', target, '" has changed. updating from', old_value, 'to', new_value)
                            if (new_value !== this.options[target]){
                                this.option(target, new_value);
                            }
                        }.bind(this))
                        this.options.scope.$watch('_' + target + '.getContent()', function(new_value, old_value){
                            this.options.scope[target] = new_value;
                        }.bind(this))
                    }

                    var initialValue = this['preprocess_' + target](this.options[target], true);
                    this.options[target] = initialValue === this.options ? undefined : initialValue;
                    //var ret = handle.handle(
                    //    this.options[target] === ,
                    //    undefined,  // handler
                    //    function(handle){$this.option(target, handle)}
                    //);
                    //if (ret) {
                    //    this.options[target] = ret
                    //}
                }

            },
            refreshAuthHandler: function(handle, superHandler, value){
                var ret = superHandler.call(this, value),
                    update_successful = handle.update('auth', this.getAuth())
                // complete refreh only done, when update was successful or superHandler demands it
                return ret === false ? ret : !update_successful
            },
            refreshHostHandler: function(handle, superHandler, value){
                var ret = superHandler.call(this, value),
                    update_successful = handle.update('host', this.getHost());
                // complete refreh only done, when update was successful or superHandler demands it
                return ret === false ? ret : !update_successful
            },
            refreshHandler: function(handle, proxy, target, superHandler, value){
                if (this.options.scope) {
                    if (typeof(value) == 'object' && value.__proto__.constructor !== Object && value.__proto__.constructor !== Array) {
                        this.options.scope['_' + target] = value;
                    }else{
                        this.options.scope[target] = value;
                    }
                }
                var ret = superHandler ? superHandler.call(this, value) : true;
                // when proxying,no refresh is required. (TODO: ??)
                return proxy ? false : ret;
            },
            preprocessHandler: function(handle, proxy, target, value, force_processing){
                
                var handler_class, conf;
                if (value === undefined && this.options.scope){
                     if (this.options.scope['_' + target]) {
                        value = this.options.scope['_' + target];
                    }
                    if (this.options.scope['__' + target + 'Id']) {
                        conf = {pk: this.options.scope['__' + target + 'Id']};
                        value = value && typeof(value.handle) == 'function' ? value.handle(conf) : conf;
                    }else
                    if (this.options[target] && value === undefined) {
                        value = this.options[target];
                    }
                }
                if (this.options.scope['__' + target + 'AsNew']) {
                    //value = value || ''; // TODO: this isnt good.?
                    handler_class = this.handles.CreateHandler;
                }
                if (value && value === this.options[target] && force_processing === false) {
                    return this.options
                }
                //if (this.generateStateIdentifier() == 'fancyOS.image') {
                //    throw Error()
                //}
                var $this = this,
                    returned = handle.handle(
                        value,
                        handler_class,
                        function(handler){
                            $this.option(target, handler);
                    });
                    // returns null if callback is provided and handler needs to be loaded.
                if (this.options.scope && returned) {
                    this.options.scope[target] = returned.__proto__ && returned.__proto__.constructor === Object ? returned : returned.getContent();
                }
                if (proxy || returned === undefined){
                    return this.options  // this tells the preprocessing routine, to skip the update
                }
                return returned
            }
        };
        mixins.PreprocessorMixin = PreprocessorMixin;

        var DevelopmentResourceMixin = {
            init: function(mixinConfig, initialValue, asPrimary, defaultRelationships, options){
                ResourceMixin.init.call(
                                        this,
                                        mixinConfig,
                                        initialValue || this.object,
                                        asPrimary,
                                        defaultRelationships || ['-' + this._widgetConfig.relationships.child_of, '-' + this._widgetConfig.relationships.instance_of],
                                        options
                                    );
            }
        };
        mixins.DevelopmentResourceMixin = DevelopmentResourceMixin;
        
        var OverlayMixin = {
            init: function(){
                var $this = this;
                this.setShape(this._widgetConfig.name_shape_overlay);
                
                if (!this.options.inactive) {
                    this.element.addClass(this._widgetConfig.name_state_active)
                }
                this.element.on('blur', function(){
                    $this.element.removeClass($this._widgetConfig.name_state_active)
                })
                this.element.on('focus', function(){
                    $this.element.addClass($this._widgetConfig.name_state_active)
                })
            }
        };
        mixins.OverlayMixin = OverlayMixin;
        
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
                                $this.element.removeClass(config.frontend_generateClassName('state-loading'));
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