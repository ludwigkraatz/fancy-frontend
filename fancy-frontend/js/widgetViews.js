define(['fancyPlugin!jquery'], function($){
    var views = {
        
        ListView: {
            destroy: function(){
                this.$body.list('destroy');
            },
            init: function(_data){
                var $this = this,
                    $body = this.$body,
                    resourceList,
                    source = null,
                    _relationship,
                    create_as = 'plugin';

                if (!!_data && _data.constructor == Array) {
                    sources = _data;
                }else if (!!_data) {
                    _relationship = _data;
                    $body.attr(create_as + '-reference', _relationship);
                    if (this.options.scope._resource && this.options.scope._relationships[_relationship] === undefined) {
                        this.options.scope._relationships[_relationship] = this.options.scope._resource.get('relationship', _relationship);
                    }else if (!this.options.scope._resource){
                        var e = Error('missing resource');
                        this.log_error('missing resource', e)
                        throw e
                    }
                    resourceList = this.options.scope._relationships[_relationship];
                }else if ($this.options.resourceList){/*
                    $this.options.scope.log.debug('setting up list view event proxy');
                    $this.element.on('resourcelist-updated', function(event, resourceList){
                        $this.options.scope.log.debug('redirecting update to list view');
                    });*/
                    resourceList = $this.options.resourceList;
                }else{
                    var e = Error('missing list source');
                    this.log_error('missing list source', e, _data)
                    throw e
                }

                $this.options.widgetCore['create_' + create_as](
                                                       $body,
                                                       'fancy-frontend.list' + (_relationship ? ':'+_relationship : ''),
                                                       {
                                                            resourceList: resourceList,
                                                            source: source,
                                                            entryWidget: this.options.scope.__widgetNamespace + '.' + this.options.scope.__widgetName,
                                                            entryTemplate: this.options.content ? this.options.content : null
                                                        });
                
                $this.apply($body);
                /*if ($this.options.resourceList) {
                    $this.options.scope.log.debug('initializing list view with current resourceList');
                    $body.triggerHandler('resourcelist-updated', [$this.options.resourceList])
                }*/
            }
        },
        
        DetailView: {
            destroy: function(){
            },
            init: function(){
                var $this = this;
                if (this.options.resource) {
                    this.options.resource.load(function (result){
                        if ($this.element.filter('tr.' + $this._widgetConfig.name_shape_content).size()){
                                bodyClass = $this._widgetConfig.name_classes_body,
                                headerClass = $this._widgetConfig.name_classes_header;
                            $this.$body.each(function(index, elem) {
                                header = $this.element.parent('.' + bodyClass).siblings('.' + headerClass).children('.' + bodyClass).get(index);
                                $(elem).html($this.options.scope.resource[$(header).html()])
                            });
                            
                            
                            $this.element.selectable()
                            $this.$body.click(function(){
                                $this.options.scope.log.debug('todo: zoom into this entry');
                            })
                            
                            var $seperate = $('<a href="#"> > </a>');
                            $seperate.click(function(event){
                                $this.seperate();
                                event.preventDefault();
                                //event.stopImmediatePropagation();
                                return false
                            })
                            $this.$footer.html($seperate)
                        }else{
                            if (!$this.$body.html()) {
                                $this.$body.html($this.options.scope.resource.uuid)
                            }else $this.options.scope.log.debug('using existing view')
                        }
                    });
                }
                
            }
        },
        
        CreateView: {
            init: function(relationship){
                var $this = this;
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
                    $body.html('error');
                }
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