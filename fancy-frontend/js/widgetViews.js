define(['fancyPlugin!jquery', 'fancyPlugin!fancyFrontendConfig'], function($, config){
    var views = {
        
        ListView: {
            destroy: function(){
                this.$body.list('destroy');
            },
            init: function(mixinConfig){
                var _data = mixinConfig.data ? (mixinConfig.data.source || mixinConfig.data.relationship) : undefined,
                    configuration = mixinConfig.data,
                    $this = this,
                    asTable = configuration && configuration.asTable !== undefined ? configuration.asTable : undefined,
                    inline = configuration.inline ? true : false,
                    $container = (inline ? null : (asTable || true ? this.$body : null)) || this.element,
                    reference = undefined,
                    resourceList,
                    source = null,
                    handler = null,
                    _relationship,
                    create_as = 'plugin',
                    cache = true,
                    listConfig = (mixinConfig.data ? (mixinConfig.data.listConfig) : null) || {};

                if (!!_data && _data.constructor == Array) {
                    sources = _data;
                }else if (!!_data) { // string
                    var updateResourceList = true;
                    _relationship = _data;
                    reference = _relationship;
                    if (this.options.resource &&
                        !this.options.resource.isBlank() &&
                        this.options.scope.__resourceRelationships[_relationship] === undefined) {
                        //throw Error; // TODO
                            //this.options.scope.__resourceRelationships[_relationship] =
                        resourceList = this.options.resource.get('relationship', _relationship);
                    }else if (this.options.scope._resource && !this.options.scope._resource.isBlank()){
                        resourceList = this.options.scope._resource.get('relationship', _relationship);
                    }else if (this.options.scope.__endpoint && _relationship == ('-' + this._widgetConfig.relationships.instance_of)){
                        resourceList = this.options.scope.object({target: 'relationship', data: null});
                        _relationship = null;
                    }else {
                        handler = _data;
                        source = _data;//handler.asIdentifier();
                        updateResourceList = false;
                        _relationship = null;
                        //var e = Error('missing resource');
                        //this.error('(error)', 'missing resource', mixinConfig, e)
                        //throw e
                    }
                    if (updateResourceList) {
                        this.log('(fancy-frontend)', '(view)', '(list)', 'resourcelist from somewhere by relationship', resourceList, _relationship)
                        resourceList = resourceList ? resourceList : this.options.scope.__resourceRelationships[_relationship];
                    }
                    
                }else if ($this.options.resource && $this.options.resource.getContent('json').constructor === Array){
                    source = $this.options.resource.getContent('json');
                    cache = false;
                    this.log('(fancy-frontend)', '(view)', '(list)', 'source from resource', $this.options.resource, source)
                }else if ($this.options.resourceList){/*
                    $this.options.scope.log.debug('setting up list view event proxy');
                    $this.element.on('resourcelist-updated', function(event, resourceList){
                        $this.options.scope.log.debug('redirecting update to list view');
                    });*/
                    this.log('(fancy-frontend)', '(view)', '(list)', 'resourcelist from options', $this.options.resourceList)
                    resourceList = $this.options.resourceList;
                }else{
                    var e = Error('missing list source');
                    this.log('(error)', 'missing list source', e, _data)
                    throw e
                }
                var _listConfig = {},
                    widgetIdentifier = this.options.scope.__widgetNamespace + '.' + this.options.scope.__widgetName;
                $.extend(_listConfig, {
                    resourceList: resourceList,
                    source: source,
                    handler: handler,
                    asTable: asTable,
                    entryWidget: widgetIdentifier,
                    entryTemplate: this.options.content ? this.options.content : null,
                    allowedRelationships: this.options.resourceRelationshipsAllowed,
                    onSelect: function(source_data, source_id){
                        if (source) {
                            $this.option('source', source_id);
                        }else{
                            $this.showView(
                                                                             'widget', {
                                                                                widget_identifier: widgetIdentifier + ':' + source_id,
                                                                                
                                                                            })
                        }
                        
                        
                        },
                    cache_entries: cache,
                    size: this._widgetConfig.name_size_full,
                    shape: this._widgetConfig.name_shape_element,
                    pagination_asPages: configuration.pagination || false,
                    entriesPerPage: (configuration.pagination ? configuration.pagination.per_page : null) || 10,
                    inline: inline,
                }, listConfig);

                $this.options.frontend['create_' + create_as](
                                                       $container,
                                                       'fancy-frontend.list'+(_relationship ? '<'+_relationship+'>' : '')+'' + (_relationship ? ':'+_relationship : ''),
                                                       _listConfig);
                
                $this.apply($container);
                /*if ($this.options.resourceList) {
                    $this.options.scope.log.debug('initializing list view with current resourceList');
                    $body.triggerHandler('resourcelist-updated', [$this.options.resourceList])
                }*/
            }
        },
        
        DetailView: {
            destroy: function(){
            },
            init: function(mixinConfig){
                var $this = this,
                    source = mixinConfig.data.source || this.options.source,
                    resource = mixinConfig.data.resource || this.options.resource;
                if (source){
                    resource = source.getResource();
                }
                
                if (resource && !resource.isBlank()) {
                    this.log('(fancy-frontend)', '(widgetViews)', '(detail)', 'found ', resource)
                    
                    resource.load(function (result){
                        var content = result.getContent('json');
                        if ($this.element.hasClass($this._widgetConfig.name_shape_row)){
                            $this.log('(fancy-frontend)', '(view)', '(detail)', 'as table entry')
                            var bodyClass = $this._widgetConfig.name_classes_body,
                                headerClass = $this._widgetConfig.name_classes_header;

                            $this.$body.each(function(index, elem) {
                                var header = $this.element.parent('.' + bodyClass).siblings('.' + headerClass).children('.' + bodyClass).get(index),
                                    header_name = $(header).attr(config.frontend_generateAttributeName('name')),
                                    value = content[header_name];
                                if (!header_name) {
                                    return
                                }
                                //$this.log('(fancy-frontend)', '(view)', '(detail)', 'entry', header_name, value)
                                $(elem).html(value)
                            });
                            
                            
                            //$this.element.selectable()
                            /*$this.$body.click(function(){
                                $this.options.scope.log.debug('todo: zoom into this entry');
                            })*/
                            var $focus = $('<a href="#"></a>');
                            $focus.addClass(config.frontend_generateClassName('action-focus'));
                            $focus.click(function(event){
                                $this.seperate();
                                event.preventDefault();
                                //event.stopImmediatePropagation();
                                return false
                            })
                            $this.$footer.append($focus)
                        }else{
                            //if (!$this.$body.html()) {
                            var $content = $('<table></table>');
                            $.each(resource.getContent('json'), function(key, value){
                                $content.append('<tr><td>'+key+'</td><td>'+value+'</td></tr>')
                            })
                            $this.$body.append($content)
                            //}else $this.log('using existing view')
                        }
                    });
                }else {
                    var viewMixinEventPrefix = 'dynamic-view' // TODO: get from this._widgetConfig
                    this.log('show create view, cause no resource found')
                    //$this.trigger(viewMixinEventPrefix + '-show.dynamic-widget.dynamic-dynamicet-widget', ['create']);
                }
                if (resource) {
                    resource.bind('replaced', function(event, resource){
                        if ($this.options.resource !== resource) { // TODO: is this need still? this isnt good like this.
                            views.DetailView.init.call($this, mixinConfig);// todo: unbind?
                        }
                    })
                }
            }
        },
        
        CreateView: {
            init: function(mixinConfig){
                var relationship = mixinConfig.data.relationship,
                    $this = this;
                var $body = this.$body;
                //var relationship = this.options.resource.get('relationship', _relationship);
                if (relationship) {
                    //this.options.lookupObject
                    relationship.load({
                        format: 'html',
                        callback: function(content){// TODO: fix id
                            $this.apply($(content.getContent()).find('#object-form'), function(content){
                                $body.html(content)//'+$this.object+'
                                var create = $this.options.resource.__new();
                                create.connect($body, function(){
                                    // init done
                                });
                            })
                        }
                    })
                }else{
                    //TODO
                    $this.log('(error)', 'cannot create resource if not defined with relationship. YET')
                    $body.html('see log');
                }
            }
        },
        
        EditView: {
            init: function(mixinConfig){
                var $this = this,
                    source = mixinConfig.data.source || this.options.source,
                    resource = mixinConfig.data.resource || this.options.resource;
                if (source){
                    resource = source.getResource();
                }
                
                if (resource) {
                    var $btn = $('<input type="submit" value="'+ (mixinConfig.data.submit_label ? mixinConfig.data.submit_label : resource.isCreated() ? 'ok' : 'create') +'" />'),
                        autoSubmit = resource.isCreated();
                    if ($this.element.filter('.' + $this._widgetConfig.name_shape_row).size()){
                        $this.log('(fancy-frontend)', '(view)', '(edit)', 'as table entry')
                        var bodyClass = $this._widgetConfig.name_classes_body,
                            headerClass = $this._widgetConfig.name_classes_header;

                        $this.$body.each(function(index, elem) {
                            var header = $this.element.parent('.' + bodyClass).siblings('.' + headerClass).children('.' + bodyClass).get(index),
                                header_name = $(header).attr(config.frontend_generateAttributeName('name'));
                            if (!header_name) {
                                return
                            }
                            //$this.log('(fancy-frontend)', '(view)', '(detail)', 'entry', header_name, value)
                            
                            $(elem).html(resource.get(header_name).asForm(autoSubmit, true, autoSubmit))
                        });
                        
                        
                        //$this.element.selectable()
                        /*$this.$body.click(function(){
                            $this.options.scope.log.debug('todo: zoom into this entry');
                        })*/
                        
                        $this.$footer.append($btn)
                        resource.connect(this.element);
                    }else{
                        var $form = $('<form></form>');
                        var $content = $('<table></table>'),
                            row, val;
                            console.log(resource, resource.getAttributes(), $.extend({},resource.__info))
                        $.each(resource.getAttributes(), function(key, attr){
                            row = $('<tr></tr>');
                            row.append('<td>'+(attr.getLabel() || key)+'</td>');
                            val = $('<td></td>');
                            val.append(attr.asForm(autoSubmit, undefined, autoSubmit))
                            row.append(val)
                            $content.append(row)
                        })
                        // TODO: wordings
                        
                        //$btn.bind('click', function(event){
                        //    event.preventDefault()
                        //    return false
                        //})
                        $form.append($content);
                        $form.append($btn);
                        resource.connect($form);  // TODO: apply?
                        this.$body.append($form)
                    }
                    return
                }else{
                    this.log('(error)', 'cannot edit resource YET')
                }
            }
        },
        
        TemplateView: {
            configure: function(config){
                return [views.TemplateView, config]
            },
            init: function(mixinConfig){
                var $this = this;
                var $body = this.$body;
                template = mixinConfig.data.template || (this.get_active_template()  + '.' + mixinConfig.name);
                if (mixinConfig.name == 'detail' && this.element.filter('.' + $this._widgetConfig.name_shape_row).size()) {
                    return views.DetailView.init.call(this, mixinConfig);
                }
                if (!template) {
                    this.log('(error)', 'invalid template');
                    return
                }
                this.loadDependencies({
                    templates: [template]
                })
            }
        },
        
        WidgetView: {
            init: function(mixinConfig){
                var $this = this;
                var $body = this.$body;
                var config = $.extend({target: this.$body}, mixinConfig.data || {});
                if (config.widget_options) {  // TODO: this has to be true. this tells the ViewMixin to use existing parent view
                    config.widget_options.full_page = false;
                }
                if (config.plugin_options) {
                    config.plugin_options.full_page = false;
                }
                this.log('(fancy-frontend)', '(widgetViews)', '(WidgetView)', 'creating', config)
                var $widget = this.newElement(config);
                $widget.on('close', function(event){
                    this.closeView()
                }.bind(this))
            }
        }
    }
    
        
        var lookup_list = {
                options: {
                    source: [],
                    entriesPerPage: 1,
                    lookupTarget: null,
                },
                _create: function(){
                    var $this = this;
                    this.element.dynamic_list({
                        fillEntry: function(entry, domEntry){ 
                            var dynamic_list = this; // because its called from within the dynamic_list obj
                            entry = lookupObject.get($this.options.lookupTarget, entry);
                            
                            entry.load(function(result){
                                if (result.wasSuccessfull) {
                                    var ret = [];
                                    $.each($this.element.dynamic_list('getHeaderFields'), function(index, header) {
                                        header = $(header);
                                        var _ret = $('<div width="' + header.width() + '"/>')
                                        _ret.html($this.options.getContentForHeader(result, header));
                                        ret.push(_ret);
                                    });

                                    $(domEntry).html(ret);  
                                }
                            })
                        },
                        loadPage: function(settings, callback){             
                            var page = settings.page;
                            
                            paginatedBy = $this.options.entriesPerPage;
                            result = $this.options.source.slice((page-1)*paginatedBy, (page)*paginatedBy);
                            callback(result);
                        },
                        getLastPageNumber: function(){
                            var fullPages = parseInt($this.options.source.length / $this.options.entriesPerPage);
                            var halfFullPage = $this.options.source.length % $this.options.entriesPerPage > 0 ? 1 : 0;
                            
                            return fullPages + halfFullPage
                        },                        
                        getIdForEntry: function(entry){
                            return $this.options.getIdForEntry(entry);
                        }
                    })
                },
                
                setSource: function(source){
                    this.options.source = source;
                    this.element.dynamic_list('goToPage', 1)
                }
                
                
                
        };
        
        //$.extend(
        var widget_list = {
                options: {},
                _create: function(){
                    var $this = this;
                    function getEntryId(entry) {
                        return entry.id
                    }
                    this.element.dynamic_list({
                        fillEntry: function(entry, domEntry){      
                            var dynamic_list = this; // because its called from within the dynamic_list obj                      
                            var ret = '<div class="dynamic-widget" data-widget-name="'+this.options.element_widgetName+'" data-uuid="' + elem.id + '">'
                            ret += '</div>'
                            $(domEntry).html(ret);
                            
                            
                            $this.options.entryCallback(entry, {
                                // update but show the inquiry if its in store
                                load_content: dynamic_list.element.data('entry-' + getEntryId(elem)) === undefined
                                });
                        },
                        loadPage: function(settings, callback){
                            var dynamic_list = this; // because its called from within the dynamic_list obj
                            var data = {
                                'page': settings.page_nr
                            }
                            
                            if (dynamic_list.element.data('sorted-by') != undefined) {
                                data['sort-method'] = dynamic_list.element.data('sorted-by')['method']; // asc|desc
                                data['sort-by'] = dynamic_list.element.data('sorted-by')['sorted-by']; // identifier
                                if (settings.letter && settings.letter != "undefined") {
                                    data['startswith']= settings.letter;
                                }   
                            }
                            
                            this.element.triggerHandler('dynamic-start-loading');
                            $this.options.lookupObject.get(
                                null,
                                data,
                                function(result){
                                    this.element.triggerHandler('dynamic-stop-loading');
                                    if (result.wasSuccessfull) {
                                                           
                                        var links = fancy_frontend.parseLinkHeader(jqXHR.getResponseHeader('Link'));
                                        var last_page = 1
                                        if (links.last != undefined) {
                                            last_page = parseInt( links.last.split('page=')[1].split("&")[0] )
                                        }
                                        $this.element.data('last-page-nr',last_page);
                                        
                                        callback(result.getContent());
                                    }
                                })             
                        },
                
                        getLastPageNumber: function(){
                            return $this.element.data('last-page-nr') || 1;
                        },
                        
                        getIdForEntry: function(entry){
                            return getEntryId(entry)
                        }
                    })
                },
            };
        
    return views;
});