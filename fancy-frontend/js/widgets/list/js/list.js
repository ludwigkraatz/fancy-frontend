define(['fancyPlugin!fancyWidgetCore', 'fancyPlugin!introspective-api-handles'], function(fancyWidgetCore, apiHandles){
    var $ = fancyWidgetCore.$,
        config = fancyWidgetCore.getFrontendConfig(),
        widgetConfig = fancyWidgetCore.getWidgetConfig();

    fancyWidgetCore_list = fancyWidgetCore.derive('widget', {
        namespace: config.apps['fancy-frontend'].namespace,
        name: 'list',
        widget: {
                options: {
                    width: '100%',
                    pagination_asAlphabet: false,
                    pagination_asPages: false,
                    pagination_asInfinite: false,
                    entriesPerPage: null,
                    alphabet: ['-', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
                    use_view: true,
                    headerFields: null,
                    resource: null,
                    allowedRelationships: null,
                    resourceList: null,
                    source: null,
                    raw: false,
                    treeWalker: null,
                    entryWidget: null,
                    entryTemplate: null,
                    entryTag: null,
                    entryView: 'detail',
                    inline: false,
                    selected: false,
                    cache_entries: true,
                    html_id_attr: 'dynamic-list-entry-id'
                },
                /*
                 *
                 *<div id="order_by" class="" style="display:inline-block!important;">&nbsp;</div>
                    ui-icon2 ui-icon-triangle-1-n*/
                
                /*
                 **/
                
                _create: function() {
                    var $this = this;
                    this.asTable = !this.options.inline && !this.options.entryTemplate && this.options.asTable !== false;
                    //this.use_mixin('view');
                    //this.use_mixin('api');
                    this.options.allowedRelationships = this.options.allowedRelationships || ['-' + this._widgetConfig.relationships.child_of, '-' + this._widgetConfig.relationships.instance_of];
                    
                    if (!this.options.source)
                            this.options.source = [];
                    if (this.options.scope._resource && this.options.scope._resource.getContent('json').constructor === Array){
                        this.options.source = this.options.scope._resource.getContent('json');
                    }
                    
                    var tag = this.asTable ? 'table' : 'div';
                    this.page = null;
                    if (this.options.inline) {
                        this.$list = this.element.children('.' + widgetConfig.name_classes_body).size() ? this.element.children('.' + widgetConfig.name_classes_body) : this.element;
                    }else{
                        this.$list = $('<'+tag+'></'+tag+'>');
                        this.element.html(this.$list);
                    }
                    if (!this.asTable) {
                        this.$list.addClass(this._widgetConfig.name_mixin_container);
                    }
                    if (this.options.size === null) {
                        this.options.size = this._widgetConfig.name_size_full;
                    }
                    //if (this.options.shape === null) {
                    //    this.options.shape = this._widgetConfig.name_mixin_container;
                    //}
                    
                    
                    if (this.options.source instanceof apiHandles.ListHandler){
                        //this.use_mixin('preprocessor', {
                        //    option: 'source',
                        //    config: {
                        //        handler: apiHandles.ListHandler,
                        //    }
                        //})
                    }else{
                        //throw Error('unknown source: ' + this.options.source)
                    }
                    this.$container = $this.$list;
                    
                    this._superApply( arguments );
                    /*if (! this.element.hasClass('dynamic-list')) {
                        throw new Error('the target for "fancy_frontend.dynamic_list" widget needs to have a "dynamic-list" class');
                    }*/
                    
                    /*if (this.options.endpoint == undefined) {
                        throw new Error('"fancy_frontend.dynamic_list" needs to have an endpoint option');
                    }
                    
                    if (this.options.list_url == undefined) {
                        throw new Error('"fancy_frontend.dynamic_list" needs to have a list_url option');
                    }*/
                        
                    //this.element.data('current_page', 1);
                    //this.updatePagination(1, this.get_lastPage())
                    this.$list.off('.dynamic-list', this.get_reload_handler(this));
                    this.$list.addClass(this._widgetConfig.name_classes_list);
                    //this.$list.addClass(this._widgetConfig.name_mixin_container);
                    
                    this.$list.addClass(config.frontend_generateClassName('instance'));
                    
                    this.$list.on('dynamic-reload-list.dynamic-list.dynamic-widget', this.get_reload_handler(this));
                    this.$list.on('dynamic-zoom-list-entry.dynamic-list.dynamic-widget', this.get_zoomEntry_handler(this));
                    this.$list.on('dynamic-remove-list-entry.dynamic-list.dynamic-widget', this.get_removeEntry_handler(this));
                    this.$list.on('dynamic-unzoom-list-entry.dynamic-list.dynamic-widget', this.get_unzoomEntry_handler(this));
                    //todo: this.element.on('dynamic-notification.dynamic-widget.dynamic-list', fancy_frontend.get_notification_handler(this));
                    
                    // not used
                    this.on('updated', function(event, _data){
                        if (!!_data && _data.constructor == Array) {
                            $this.options.source = _data;
                            $this.options.resourceList = null;
                        }else if (!!_data) {
                            $this.options.resourceList = _data;
                            this.options.source.length = 0;
                        }else{
                            $this.options.resourceList = null;
                            this.options.source.length = 0;
                        }
                        $this.updateConfig();                        
                    });
                    // end not used
                    this.log('(list)', this.options);
                    if (this.options.resourceList && this.options.resourceList._replaced_with) {
                        // this is ugly, but because of the sequential processing, when an replacement event is fired while
                        // ??fixtures are being used??, the listView mixin already the blank object and this widget isn't initialized yet..
                        this.options.resourceList = this.options.resourceList._replaced_with;
                    }

                    if (this.options.resourceList != null && !this.options.resourceList.isBlank() && this.options.source != null){
                        this.options.source.length = 0; // this is done twice here, isn't it?
                    }
                    if (!!$this.options.source) {
                        this.options.scope._source = $this.options.source;
                        this.options.scope.$watch('_source', function(){
                            if (!$this.options.resourceList || $this.options.resourceList.isBlank())$this.updateConfig();
                        })
                    }
                    if ($this.options.resourceList) {
                        this.log('register list view event handler', $this.options.resourceList)
                        $this.options.resourceList.bind('replaced', function(event, resource){
                            if ($this.options.resourceList !== resource) {
                                $this.options.resourceList = resource;
                                $this.updateConfig();
                                this.log('fired list view event handler', $this.options.resourceList)
                            }
                        })
                    }
                    
                    $this.updateConfig();
                    /*
                    if ($this.options.scope._resourceList) {
                        this.trigger('resourcelist-updated', [$this.options.scope._resourceList])
                    }*/
                    /*function replaceHandler(event_name, args){
                        this.options.resourceList = args[0];
                        $this.updateConfig();
                    }
                    $this.options.resourceList.bind('replaced', replaceHandler);    */
                    /*if ($this.options.resourceList && !$this.options.resourceList.isBlank()) {
                        $this.updateConfig();
                    }*/
                },
                
                initWidgetStructure: function(){
                    if (!this.options.inline) {
                        if (!this.asTable){
                            this._superApply( arguments );
                        }else{
                            this.initHeader();
                            this.initBody();
                            this.initFooter();
                        }
                    }else{
                        if (this.element.children('.' + widgetConfig.name_classes_header).size() +
                            this.element.children('.' + widgetConfig.name_classes_body).size() +
                            this.element.children('.' + widgetConfig.name_classes_footer).size() < 3) {
                            return;
                        }
                        this.$header = this.element.children('.' + widgetConfig.name_classes_header);
                        this.$body = this.element.children('.' + widgetConfig.name_classes_body);
                        this.$footer = this.element.children('.' + widgetConfig.name_classes_footer);
                        this.$navi = this.element.children('.' + widgetConfig.name_classes_navi);
                            this.initHeader();
                            this.initBody();
                            this.initFooter();
                    }
                },
                
                patchCreateHeader: function(){
                    var $this = this,
                        class_name = config.frontend_generateClassName('action-add'),
                        target = this.asTable ? this.$header.find($this._widgetConfig.selector_elements_header) : this.$header;
                        
                    if (target && target.find('.' + class_name).size() == 0) {
                        var createLink = $('<a href="#" class="'+class_name+'"></a>');
                        target.append(createLink);
                        createLink.click(function(event){
                            event.preventDefault();
                            $this.createNew();
                            return;
                            var view;
                            if ($this.asTable) {
                                view = 'popup';
                            }else{
                                view = 'show';
                            }
                            $this.element.trigger(viewMixinEventPrefix + '-' + view, ['create', {relationship: resourceList}]);
                        })
                    }
                    
                },
                
                updateConfig: function(){
                    var $this = this;
                    var resourceList;
                    var viewMixinEventPrefix = $this.mixins.view.event_prefix;

                    if (this.options.resourceList && !this.options.resourceList.isBlank()) {
                        this.log('(list)', 'from resource');
                        resourceList = this.options.resourceList;
                        resourceList.discover({
                            callback: function(result){
                                var content = result.getContent();
                                var $body = $this.$body = $this.element.find($this._widgetConfig.selector_mixin_container);
                                if (content['Accept-Ranges'] !== undefined) {
                                    // config as discovered
                                    if (content) {
                                        if (content.name) {
                                            /*$this.$header.html('<h3>'+content.name+'</h3>');*/
                                        }
                                        // TODO: get this event_prefix better!!
                                        if (content['actions']['POST'] !== undefined) {
                                            $this.patchCreateHeader();
                                        }
                                        if ($this.options.allowedRelationships && $this.options.allowedRelationships.length > 1) {
                                            var selectRelationship = $('<select></select>');
                                            //$this.$header.append(selectRelationship); // TODO
                                            var output = '';
                                            for (var relation in $this.options.allowedRelationships){
                                                relation = $this.options.allowedRelationships[relation]
                                                output += '<option ' + (relation == $this.options.relationship?'selected':'') + '>'+
                                                            relation+
                                                            '</option>';
                                            }
                                            selectRelationship.html(output)
                                            selectRelationship.change(function(event){
                                                $this.trigger(viewMixinEventPrefix + '-show', ['fancy-frontend.list', {relationship: $($this).val()}]);
                                            })
                                        }
                                    }else{
                                        //TODO 
                                        $this.$body.html('error discovering');
                                    }
                                
                                    // show list
                                    resourceList.load(function(result){
                                            var content = result.getContent();//result.getResource().all();//result.getContent();
                                            $this.log('list content', content)
                                            $this.options.source.length = 0;
                                            $.each(content, function(index, element){
                                                $this.options.source.push(element)
                                            })
                                            if ($this.options.source.length == 0) {
                                                // TODO: make this less static: this.view('create', [resourceList])
                                                $this.trigger(viewMixinEventPrefix + '-show', ['create', {relationship: resourceList}]);
                                            }else{                                                
                                                $this.goToPage(1);  // TODO: remove this. this.options.source was changed - so it will reload
                                            }
                                        })
                                }
                            }
                        })
                        return
                    }
                    if (this.options.source instanceof apiHandles.ListHandler && !this.options.raw){
                        $this.log('(fancy-frontend)', '(list)', 'handler found');
                        this.options.source.getList().discover({callback: function(result){
                            content = result.getResponse();
                            if (content['actions']['POST'] !== undefined) {
                                $this.patchCreateHeader();
                            }
                        }})
                        //$this.$container.html('handler list');
                    }else if (this.options.source){
                        if (typeof this.options.source == 'object' && !Array.isArray(this.options.source)) {
                            $this.log('(fancy-frontend)', '(list)', 'object tree', this.options.source);
                            // this is an object. show tree
                            // TODO: set header of object
                            this.tree_source = this.options.source;
                            // this results in a new list refresh
                            this.options.source = Object.keys(this.tree_source);
                        }else if ($this.options.source.length == 0) {
                            $this.log('(fancy-frontend)', '(list)', 'plain empty source list', this.options.source);
                            // TODO: make this less static: this.view('create', [resourceList])
                            if (this.options.use_view){
                                $this.trigger(viewMixinEventPrefix + '-show', ['create', {relationship: resourceList}]);
                            };
                        }else{
                            $this.log('(fancy-frontend)', '(list)', 'plain source list', this.options.source);
                            $this.goToPage(1);
                        }
                    }else {
                        $this.log('(fancy-frontend)', '(list)', 'no source');
                        $this.$container.html('');
                    }
                },
                
                getHeaderFields: function(){
                    
                    return this.$header.children(this._widgetConfig.selector_elements_body)
                },
                
                addHeader: function(header, classes){
                    var tag = this.asTable ? 'th' : 'div';
                    $header = $('<'+tag+' class="'+(classes ? classes : '')+'"></'+tag+'>');
                    $header.attr(config.frontend_generateAttributeName('name'), header);
                    $header.html(header);
                    //$header.addClass(this._widgetConfig.name_shape_element);
                    this.$header.append($header);
                },
                
                initBody: function(){
                    if (!this.asTable) {
                        return this._superApply( arguments );
                    }
                    
                    var tag = this.asTable ? 'tbody' : 'article';
                    this.$container = this.$list.children(this._widgetConfig.selector_mixin_container);
                    this.$body = this.$container;
                    if (this.$container.size() <= 0) {
                        this.$container = $('<'+tag+' class="'+ this._widgetConfig.name_classes_body +' '+ this._widgetConfig.name_mixin_container +'"></'+tag+'>');
                        this.$container.insertAfter(this.$header);
                    }
                },
                
                initHeader: function(){
                    if (!this.asTable) {
                        return this._superApply( arguments );
                    }
                    
                    var tag = this.asTable ? 'thead' : 'header';
                    this.$header = this.$list.children(this._widgetConfig.selector_elements_header);
                    if (this.$header.size() == 0) {
                        this.$list.prepend('<'+tag+' class="'+ this._widgetConfig.name_classes_header +'"></'+tag+'>');
                        this.$header = this.$list.children(this._widgetConfig.selector_elements_header);
                    }
                    
                    this.addHeader('', this._widgetConfig.name_classes_header);
                    if (this.asTable) {
                        if (!this.options.headerFields) {
                            this.log('(fancy-frontend)', '(list)', 'setting header fields from source', this.options.source)
                            if (typeof(this.options.source) == 'object' && typeof(this.options.source.getResource) == 'function') {
                                this.options.headerFields = Object.keys(this.options.source.getResource().getAttributes());
                                if (!this.options.headerFields.length) {
                                    this.options.entryWidget = null;
                                }
                            }else if (!this.options.source || this.options.source.length == 0) {
                                this.options.headerFields = ['uuid', 'data']
                            }else if (typeof this.options.source[0] == 'object'){
                                this.options.headerFields = [];
                                for (var index in this.options.source[0]) {
                                    this.options.headerFields.push(index);
                                }
                            }else {
                                this.options.headerFields = [];
                            }
                        }
                        for (var header in this.options.headerFields){
                            this.addHeader(this.options.headerFields[header], this._widgetConfig.name_classes_body);
                        }
                    }
                    this.addHeader('', this._widgetConfig.name_classes_footer);
                    
                    var sortable_headers = this.$header.find(this._widgetConfig.selector_elements_sortable)
                    
                    if (sortable_headers.size() > 0) {
    
                        sortable_headers.wrapInner("<span/>");
                        sortable_headers.append('<span class="dynamic-icon"/>')
                        sortable_headers.on("click.dynamic-list.dynamic-widget", this.get_sortableHeaderClick_handler(this));
                        
                        var sorted = this.$header.find('.dynamic-list-entry-header-sorted-asc, .dynamic-list-entry-header-sorted-desc');
                        
                        if (sorted.size() > 1) {
                            throw Error("just one sorted header field allowed");
                        }else if (sorted.size() == 0) {
                            sorted = sortable_headers.find(':first');
                            sorted.addClass('dynamic-list-entry-header-sorted-asc');
                        }
                        
                        if (sorted.hasClass('dynamic-list-entry-header-sorted-asc')) {
                            this.$list.data('sorted-by', {'method':'asc', 'sorted-by':sorted.attr('data-sort-by-identifier') });
                        }else{
                            this.$list.data('sorted-by', {'method':'desc', 'sorted-by':sorted.attr('data-sort-by-identifier') } );
                        }
                    };
                    
                    if (this.$header.html() == "") {
                        this.$header.remove();
                    }
                    
                },
                
                get_sortableHeaderClick_handler: function($this){
                    return function(event){
                        event.stopImmediatePropagation();
                        
                        var $target = $(event.target).closest('.dynamic-list-entry-header-sortable');
                        var order_desc;
                        
                        
                        if ($target.hasClass('dynamic-list-entry-header-sorted-asc')) {
                            order_desc = true;
                        }else{
                            order_desc = false;
                        }
                        
                        var sorted = $this.$header.find('.dynamic-list-entry-header-sorted-asc, .dynamic-list-entry-header-sorted-desc');
                        
                        sorted.removeClass('dynamic-list-entry-header-sorted-asc').removeClass('dynamic-list-entry-header-sorted-desc');
                        
                        if (order_desc) {
                            $target.addClass('dynamic-list-entry-header-sorted-desc');
                            $this.$list.data('sorted-by',{'method':'desc', 'sorted-by':$target.attr('data-sort-by-identifier') });
                        }else{
                            $target.addClass('dynamic-list-entry-header-sorted-asc');
                            $this.$list.data('sorted-by', {'method':'asc', 'sorted-by':$target.attr('data-sort-by-identifier') });
                        }
                        
                        $this.reload();
                        
                    }
                },
                
                initFooter: function(){
                    if (!this.asTable) {
                        return this._superApply( arguments );
                    }
                    
                    var tag = this.asTable ? 'tfoot' : 'footer';
                    this.$footer = this.$list.children('.'+ this._widgetConfig.name_classes_footer);
                    if (this.$footer.size() == 0) {
                        this.$list.append('<'+tag+' class="'+ this._widgetConfig.name_classes_footer +'"></'+tag+'>');
                        this.$footer = this.$list.children('.'+ this._widgetConfig.name_classes_footer);
                    }
                    if (this.options.pagination_asInfinite) {
                        this.$footer.append('<div class="loading"></div>');
                    }else if (this.options.pagination_asPages && !this.options.use_view) {
                        this.$footer.append('<div class="dynamic-pagination">\
                    <div class="dynamic-left dynamic-pagination-pages">\
                        <span class="dynamic-pagination-link-topage-template" data-goto-page="0">\
                            <span style="display:none;">\
                                <strong></strong>\
                            </span>\
                            <a href=""></a>\
                        </span>\
                    </div>\
                    <div class="dynamic-right dynamic-pagination-browse">\
                        <div class="dynamic-left dynamic-pagination-link-left" style="display:none;">\
                            <a href="">\
                                <span class="dynamic-icon"></span> \
                                {% sitewording "widget:list_inquiries:pagination:recent_page" %}\
                            </a>\
                        </div>\
                        <div class="dynamic-right dynamic-pagination-link-right" style="display:none;">\
                            <a href="?page=2" data-goto-page="2">\
                                {% sitewording "widget:list_inquiries:pagination:next_page" %} \
                                <span class="dynamic-icon"></span>\
                            </a>\
                        </div>\
                <div class="dynamic-right dynamic-pagination-link-seperator">|</div>\
                        <div class="clearer">&nbsp;</div>\
                    </div>\
            <div class="clearer">&nbsp;</div>\
            </div>');
                    };
                    
                    if (this.$footer.html() == "") {
                        // this.$footer.remove();
                    }
                },
                
                get_zoomEntry_handler: function($this){
                    return function(event, attr_name, attr_value){
                        var $widget = $this.$list,
                            zoomTarget = $widget.find('.dynamic-list-entry[data-' + attr_name + '="' + attr_value + '"]');
                        $widget.find('.dynamic-list-entry:not([data-' + attr_name + '="' + attr_value + '"])').slideUp();
                        $widget.find('.dynamic-pagination').slideUp();
                        //zoomTarget.option('size', widgetConfig.name_size_full)
                    }
                },
                
                get_removeEntry_handler: function($this){
                    return function(event, attr_name, attr_value){
                        var $widget = $this.$list;
                        $widget.find('.dynamic-list-entry[data-' + attr_name + '="' + attr_value + '"]').remove();
                        $widget.data(attr_name, undefined);
                        $this.reload();                        
                    }
                },
                
                get_unzoomEntry_handler: function($this){
                    return function(event, attr_name, attr_value){
                        var $widget = $this.$list;
                        $widget.find('.dynamic-list-entry:not([data-' + attr_name + '="' + attr_value + '"])').slideDown();
                        $widget.find('.dynamic-pagination').slideDown();
                    }
                },
                
                get_lastPage: function(){
                    if (this.$list.find('.dynamic-pagination-link-topage:last').size()) {
                        return this.$list.find('.dynamic-pagination-link-topage:last').attr("data-goto-page")
                    }
                    return 1 // no pages at all
                    
                },
                
                get_clickOnPaginationLink_handler: function($this){
                    return function(event){
                        event.stopImmediatePropagation();
                        event.preventDefault();
                    
                        $this.goToPage($(event.target).attr('data-goto-page'), $(event.target).attr('data-filter-letter'));
                        
                        return false;
                    }
                },
                
                goToPage: function(page, letter){
                    var page_nr = parseInt(page);
                    this.log('page', page)
                    this.$list.data('current_page', page);
                    this.$list.data('current_letter', letter)
                        
                    this.loadPage(
                                            {page: page_nr, letter: letter},
                                            this.showList_handler.bind(this, page_nr, letter)
                    );
                },
                
                loadPage: function(settings, callback){
                    var result;
                    if (this.options.source instanceof apiHandles.ListHandler) {
                        if (this.options.entriesPerPag) {
                            console.warn('(fancy-frontend)', '(list)', 'ListHandler list doesnt support pagination yet.')
                        }
                        result = this.options.source.prepare(settings, callback)
                    }else{
                        var page = settings.page;
                        paginatedBy = this.options.entriesPerPage;
                        if (!paginatedBy) {
                            result = this.options.source;
                        }else{
                            result = this.options.source.slice((page-1)*paginatedBy, (page)*paginatedBy);
                        }
                    }
                    if (result !== undefined) {
                        callback(result);
                    }
                },
                getLastPageNumber: function(){
                    // TODO: use this.options.scope.resource.fullLength
                    var fullPages = parseInt(this.options.source.length / this.options.entriesPerPage);
                    var halfFullPage = this.options.source.length % this.options.entriesPerPage > 0 ? 1 : 0;
                    
                    return fullPages + halfFullPage
                },
                
                get_reload_handler: function($this){
                    return $this.reload;
                },
                
                refresh: function(event){
                    if (event && event.stopImmediatePropagation) {
                        event.stopImmediatePropagation();
                    }
                    
                    this.goToPage(this.$list.data('current_page'), this.$list.data('current_letter'));
                },
            
                pagination_showLeft: function(number_left, letter){
                    this.$list.find('.dynamic-pagination-link-left').show()
                    this.$list.find('.dynamic-pagination-link-left').find(
                        'a'
                        ).attr(
                               'data-goto-page', number_left
                        ).attr(
                               'data-filter-letter', letter
                        ).attr(
                               'href', '?'+(letter?('letter='+letter+'&'):'')+'page='+number_left
                        );
                    this.$list.find('.dynamic-pagination-link-right').hide()
                    this.$list.find('.dynamic-pagination-link-seperator').hide()
                },
                
                pagination_showRight: function(number_right, letter){
                    this.$list.find('.dynamic-pagination-link-left').hide()
                    this.$list.find('.dynamic-pagination-link-right').show()
                    this.$list.find('.dynamic-pagination-link-right').find(
                        'a'
                        ).attr(
                               'data-goto-page', number_right
                        ).attr(
                               'data-filter-letter', letter
                        ).attr(
                               'href','?'+(letter?('letter='+letter+'&'):'')+'page='+number_right
                        );
                    this.$list.find('.dynamic-pagination-link-seperator').hide()
                },
                
                pagination_showNone: function(){
                    this.$list.find('.dynamic-pagination-link-left').hide()
                    this.$list.find('.dynamic-pagination-link-right').hide()
                    this.$list.find('.dynamic-pagination-link-seperator').hide()
                },
                
                pagination_showBoth: function(number_right, number_left, letter){
                    this.$list.find('.dynamic-pagination-link-left').show()
                    this.$list.find('.dynamic-pagination-link-left').find(
                        'a'
                        ).attr(
                               'data-goto-page', number_left
                        ).attr(
                               'data-filter-letter', letter
                        ).attr(
                               'href', '?'+(letter?('letter='+letter+'&'):'')+'page='+number_left
                        );
                    this.$list.find('.dynamic-pagination-link-right').show()
                    this.$list.find('.dynamic-pagination-link-right').find(
                        'a'
                        ).attr(
                               'data-goto-page', number_right
                        ).attr(
                               'data-filter-letter', letter
                        ).attr(
                               'href', '?'+(letter?('letter='+letter+'&'):'')+'page='+number_right
                        );
                    this.$list.find('.dynamic-pagination-link-seperator').show()
                },
                
                buildEntry: function(elem, content){
                },
                
                /*scheduleContentFilling: function($entry_container, elem){
                    // todo: delete. not used
                    function fill_content(data, status, jqXHR){
                        $entry_container.html(data)
                        //update_bindings($entry_container)
                        $entry_container.children().show_inquiry({load_content:false})
                    }
                    var data = {};
                    data[this.options.entry_kwarg]=elem;
                    this.element.triggerHandler('dynamic-start-loading');
                    this.options.entry_entpoint.get({
                        url: this.options.entry_url,
                        done: fill_content,
                        data: data,
                        fail: fancy_frontend.get_failed_xhr_handler('{% sitewording "widget:list_inquiries:action:load_inquiry_content" %}', this),
                    })
                },*/
                
                getIdForEntry: function(entry){
                    if (['number', 'string'].indexOf(typeof entry) == -1) {
                        // .to_other is not nice...
                        return entry.to_other ? entry.to_other : (entry.uuid ? entry.uuid : (entry.__getID ? entry.__getID() : (entry.pk ? entry.pk : entry.id)));
                    }
                    return entry;//.__getID();
                },
                
                setEntryID: function($element, entry_id){
                    if (typeof($element) == 'string') {
                        $element += 'data-' + this.options.html_id_attr + '="'+entry_id+'"';
                        return $element;
                    }
                    $element.attr(config.frontend_generateAttributeName(this.options.html_id_attr), entry_id)
                    return $element
                },
                
                createEntry: function(elem){
                    var $this = this,
                        was_cached = false;
                    var tag = $this.options.entryTag ? this.options.entryTag : ($this.asTable ? 'tr' : 'div');
                    var curOutput = $('<'+tag+' class="dynamic-list-entry" ></' + tag + '>'),
                        elem_id = elem ? this.getIdForEntry(elem) : undefined,
                        cached_content,
                        isCreated = true;
                    if (elem_id === undefined || elem_id === null) {
                        isCreated = false;
                        elem_id = '!'
                    }
                    
                    if (elem && elem_id != '!') {
                        this.setEntryID(curOutput, elem_id);
                        
                        if ($this.options.cache_entries) {
                            if ($this.$list.data('entry-' + elem_id) != undefined) {
                                cached_content = $this.$list.data('entry-' + elem_id);
                                if (!$this.options.entryWidget){
                                    was_cached = true;
                                    curOutput.html(cached_content);
                                }
                            }
                        }
                    }
                    if (!was_cached) {
                        var entry_id = elem_id,
                            entry = elem,
                            $children_container,
                            tree;
                        if (this.options.treeWalker) {
                            var tree_elem =  entry != entry_id ? entry_id : null,
                                tree_source = entry;
                            if (this.tree_source) {
                                // when this widget displays a list displaying an object, it iterates through an array
                                // containing its attributes
                                tree_elem = entry;
                                tree_source = this.tree_source[tree_elem];
                            }
                            entry_id = tree_elem;
                            entry = tree_source;
                            tree_options = {};
                            for (var attr in this.options) {
                                if (['resource', 'resourceList', 'source'].indexOf(attr) == -1) {
                                    tree_options[attr] = this.options[attr];
                                }
                            }
                            tree_template = {
                                css_class: ['interaction-tree'],
                                widget_identifier: 'fancy-frontend.list?',
                                widget_options: tree_options
                            };
                            tree = tree_source ? this.options.treeWalker(tree_elem, tree_source, tree_template) : null;
                        }
                        
                        //curOutput.selectable();
                        //curOutput.attr('plugin-reference', '__id_'+elem_id);
                        //$this.options.scope['__id_'+elem_id] = elem;
                        var entryTemplate = this.options.entryTemplate ? (
                                                typeof(this.options.entryTemplate) == 'function' ?
                                                this.options.entryTemplate(entry, entry_id) :
                                                this.options.entryTemplate.replace(new RegExp('{index}', 'g'), entry_id)
                                            ) : null;
                        if ($this.options.entryWidget) {
                            $this.options.frontend.create_widget(
                                                                   curOutput,
                                                                   $this.options.entryWidget+':'+ elem_id + (elem_id == '!' ? (typeof elem == 'object' ? '#edit' : '#create') : ($this.options.entryView ? '#' + $this.options.entryView : '')),
                                                                   {
                                                                    content: cached_content ? cached_content : entryTemplate,
                                                                    source: typeof elem == 'object' ? elem : undefined
                                                                   });
                        }else if (this.options.entryTemplate){
                            if (entryTemplate)curOutput.html(entryTemplate)
                            else return entryTemplate;
                        }else if (elem){
                            var ret = [],
                                headers = $this.getHeaderFields();
                            var _ret = $('<td class="'+config.frontend_generateClassName('header')+'"></td>');
                            ret.push(_ret);
                            if (headers.size()) {
                                $.each(headers, function(index, header) {
                                    var $header = $(header);
                                    header = $header.html();
                                    _ret = $('<td></td>');
                                    _ret.html(elem[header]);
                                    ret.push(_ret);
                                });
                            }else{
                                _ret = $('<td></td>');
                                _ret.html(elem);
                                ret.push(_ret);
                            }
                            _ret = $('<td class="'+config.frontend_generateClassName('footer')+'"></td>');
                            ret.push(_ret);
                            curOutput.append(ret);
                        }
                    }
                    
                    if ($this.options.onSelect && isCreated && !this.asTable){ //  && (this.entryWidget || this.entryTemplate)
                        curOutput.on('click', function(){
                            $this.$container.children().removeClass(config.frontend_generateClassName('state-active'))
                            curOutput.addClass(config.frontend_generateClassName('state-active'))
                            if ($this.options.onSelect === true) {
                                $this.$list.trigger('dynamic-zoom-list-entry.dynamic-list.dynamic-widget', [this.options.html_id_attr, elem_id])
                            }else{
                                $this.options.onSelect(elem, elem_id);
                            }
                            
                            
                            $this.log('open ', elem_id);
                        });
                    }
                    
                    if (tree) {
                        var $children_container = this.newElement(tree).css('display', 'none');
                        curOutput = curOutput.append($children_container).prepend('<span class="'+config.frontend_generateClassName('interactive-tree')+' '+config.frontend_generateClassName('icon')+'"></span>');

                        var $widget = curOutput.find('.' + config.frontend_generateClassName('interaction-tree')),
                            $btn = curOutput.find('.' + config.frontend_generateClassName('interactive-tree'));

                        $btn.bind('click focus', function(){
                            if (!$widget.data('__initialized')) {
                                $widget.toggle();
                                $widget.click()
                            }else{
                                $widget.toggle();
                            }
                            $btn.toggleClass(config.frontend_generateClassName('state-extended'))
                        })
                        this.log('(fancy-frontend)', '(widgets)', '(list)', 'found additional source for:', tree_elem)
                    }
                    
                    if ((elem || !this.asTable) || elem_id == '!') {
                        return curOutput
                    }else{
                        this.apply(curOutput, function(content){
                            $this.$container.prepend(content);
                        })
                    }
                },
                
                createNew: function(){
                    this.log('(event)', '(fancy-frontend)', '(list)', 'create new list element')
                    var elem, is_resource = false;
                    if (this.options.source instanceof apiHandles.ListHandler){
                        elem = this.options.source.getList().new();
                        is_resource = true;
                    }
                    ret = this.createEntry(elem);
                    this.apply(ret, function(elem, is_resource, content){
                        this.$container.prepend(content);
                        if (is_resource) {
                            elem.bind('post-create', function($elem, event, result){
                                var resource = result.getResource();
                                this.setEntryID($elem, this.getIdForEntry(resource));
                                if (this.options.source instanceof apiHandles.ListHandler){
                                    this.options.source.getList().add(resource)
                                }
                            }.bind(this, content))
                        }
                    }.bind(this, elem, is_resource))
                },
                
                showList_handler: function(page, letter, data){
                    var $this = this;
                        
                        var $container = $this.$container;
                        $container.find('.dynamic-list-entry').each(function(index, elem){
                            var $elem = $(elem);
                            var content = $elem.html();//.get(0);
                            //content = content.outerHTML || new XMLSerializer().serializeToString(content);
                            $this.$list.data('entry-' + $elem.attr('data-dynamic-list-entry-id'), content);
                            $elem.remove();
                        })
                        var output = [];
                        $.each(data, function(index, elem){
                            var content = $this.createEntry(elem);
                            if (content)output.push(content);
                        });
                        $container.prepend(output);
                        $this.apply($container)
                        
                        if ($this.options.selected === 0) {
                            $container.children().first().click();
                        }else if ($this.options.selected) {
                            $container.children().filter(':eq('+$this.options.selected+')').click();
                        }
                        
                        var last_page = $this.getLastPageNumber();
                        
                        $this.updatePagination(page, last_page, letter);
                        $this.$list.triggerHandler('dynamic-end-loading');
                },
                    
                
                updatePagination: function(number, numbers, letter){
                    if (this.page == number)return;

                    var $this = this,
                        pages,
                        pages_length,
                        list_alphabet = this.options.alphabet,
                        pages_changed = false;

                    if (this.options.pagination_asPages){
                        pages = parseInt(numbers);
                        pages_length = pages;
                    }
                    else if (this.options.pagination_asAlphabet){
                        pages = list_alphabet;
                        pages_length = pages.length
                    }
                    
                    if (this.pages != pages)pages_changed = true;

                    this.page = number;
                    this.pages = pages;

                    if (this.options.use_view) {
                        if (this.view_pagination_handler){
                            if (pages_changed) {
                                update_pagination_handler(this.pages)
                            }
                        }else if (pages_length > 0){
                            this.newElement({ // todo: use this.use_mixin('view', {...}) so that existing views might be used
                                plugin_identifier: 'fancy-frontend.view',
                                plugin_options: {
                                    attached: true,
                                    initView: {
                                        name: null,
                                        data: null,
                                        //elements: this.initWidgetStructure.bind(this, ['body'], false),
                                        setContent: null,
                                        reloadContent: null,
                                        cache: true,
                                        popup: false,
                                        paginationConfig: {
                                            showPageHandler: this.goToPage.bind(this),
                                            pages: function(update_pagination_handler){
                                                $this.view_pagination_handler = update_pagination_handler;
                                                update_pagination_handler($this.pages)
                                            },
                                            target: this.$footer
                                        }
                                    },
                                },
                                target: this.element,
                                method: 'patch'
                            })
                        }
                    }else{
                        // create / delete the links as needed for maximum possible pages
                        var $number = this.$list.find('.dynamic-pagination-link-topage-template');
                        var output = new Array();
                        if (this.options.pagination_asPages) {                    
                            var number_tmp = 1;
                            var $number_tmp = this.$list.find('.dynamic-pagination-link-topage[data-goto-page="'+number_tmp+'"]');
                            while (number_tmp <= numbers || $number_tmp.get(0) != undefined){
                                if (number_tmp > numbers){
                                    $number_tmp.hide();
                                }else if ($number_tmp.get(0) != undefined){
                                    $number_tmp.show();
                                }else{
                                    $number.clone().insertBefore($number).after(" ");
                                    var insert = this.$list.find('.dynamic-pagination-link-topage-template[data-goto-page="0"]:first');
                                    insert.attr('data-goto-page', number_tmp).find('a').attr('href', '?page='+number_tmp).attr('data-goto-page', number_tmp).html(number_tmp);
                                    insert.find('span>strong').html(number_tmp);
                                    insert.show();
                                    insert.addClass('dynamic-pagination-link-topage').removeClass('dynamic-pagination-link-topage-template');
                                    //alert(insert);
                                }
                                number_tmp += 1;
                                $number_tmp = this.$list.find('.dynamic-pagination-link-topage[data-goto-page="'+number_tmp+'"]');
                            }
                            
                            if (numbers > 10){
                                var number_tmp=4;
                                while (number_tmp < numbers-3){
                                    var $number_tmp = this.$list.find('.dynamic-pagination-link-topage[data-goto-page="'+number_tmp+'"]');
                                    if ((number_tmp < 4) || (number_tmp > numbers -4) || ((number_tmp > number - 3) && (number_tmp < number + 3))){
                                        $number_tmp.show()
                                    }else{
                                        $number_tmp.hide()
                                        if (number_tmp == number -3 || number_tmp == number + 3 ){
                                            $number_tmp.before('<span class="dynamic-pagination-link-topage-seperator"> . . . </span>');
                                        }
                                    }
                                    number_tmp += 1;
                                }
                            }
                            var $numbers = this.$list.find('.dynamic-pagination-link-topage');
                            $numbers.find('span').hide()
                            $numbers.find('a').show()
                    
                            var $number = this.$list.find('.dynamic-pagination-link-topage[data-goto-page="'+number+'"]');
                            $number.find('span').show()
                            $number.find('a').hide()
                            
                        }else if (this.options.pagination_asAlphabet) {
                            
                            // styling needs 'undefined' to be string
                            // further processing needs the undefined object instead
                            if (letter == undefined) {
                                letter = 'undefined'
                            }
                            
                            var number_tmp = 1;
                            var $this = this;
                            $.each(list_alphabet, function(index, elem){
                                var $letter_tmp = $this.$list.find('.dynamic-pagination-link-topage[data-filter-letter="'+((elem!=list_alphabet[0])?elem:'undefined')+'"]');
                                if ($letter_tmp.get(0) != undefined){
                                    $letter_tmp.show();
                                }else{
                                    $number.clone().insertBefore($number).after(" ");
                                    var insert = $this.$list.find('.dynamic-pagination-link-topage-template[data-goto-page="0"]:first');
                                    insert.attr(
                                                'data-goto-page', number_tmp
                                            ).attr(
                                                   'data-filter-letter', (elem!=list_alphabet[0])?elem:'undefined'
                                            ).find(
                                            'a'
                                            ).attr(
                                                   'href', '?'+((elem!=list_alphabet[0])?('letter='+elem+'&'):'')+'page='+number_tmp
                                            ).attr(
                                                   'data-goto-page', number_tmp
                                            ).attr(
                                                   'data-filter-letter', (elem!=list_alphabet[0])?elem:'undefined'
                                            ).html(elem);
                                    insert.find('span>strong').html(elem);
                                    insert.show();
                                    insert.addClass('dynamic-pagination-link-topage').removeClass('dynamic-pagination-link-topage-template');
                                    //alert(insert);
                                }
                            });
                            var $numbers = this.$list.find('.dynamic-pagination-link-topage');
                            $numbers.find('span').hide()
                            $numbers.find('a').show()
                    
                            var $number = this.$list.find('.dynamic-pagination-link-topage[data-filter-letter="'+letter+'"]');
                            $number.find('span').show()
                            $number.find('a').hide()
                        }
                        
                        
                        // styling needs 'undefined' to be string
                        // further processing needs the undefined object instead
                        if (letter == 'undefined') {
                            letter = undefined
                        }
                        
                        this.$list.find('.dynamic-pagination a').off('.dynamic-pagination');
                        this.$list.find('.dynamic-pagination a').on('click.dynamic-widget.dynamic-list.dynamic-pagination', this.get_clickOnPaginationLink_handler(this))
                        
                        // show as for current page
                        this.$list.find('.dynamic-pagination-link-topage-seperator').remove();
                        
                
                        if (number == 1 && numbers > number){
                            this.pagination_showRight(number+1);
                        }else if (number == numbers && numbers > 1){
                            this.pagination_showLeft(number-1);
                        }else if (numbers == 1){
                            this.pagination_showNone();
                        }else{
                            this.pagination_showBoth(number+1, number-1);
                        }
                    }
                },
        }
    });

    return fancyWidgetCore_list
});
