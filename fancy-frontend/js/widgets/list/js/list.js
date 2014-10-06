define(['fancyPlugin!fancyWidgetCore', 'fancyPlugin!fancyFrontendConfig'], function($, config){
    $(function() {
        
        widgetConfig = $[config.apps['fancy-frontend'].defaults_namespace]._widgetConfig;
        
       $.widget( config.apps['fancy-frontend'].namespace + '.list', $[config.apps['fancy-frontend'].defaults_namespace].core ,{
                options: {
                    width: '100%',
                    pagination_asAlphabet: false,
                    pagination_asPages: false,
                    pagination_asInfinite: false,
                    headerFields: ['uuid', 'data'],
                    resource: null,
                    allowedRelationships: ['-' + widgetConfig.relationships.child_of, '-' + widgetConfig.relationships.instance_of],
                    resourceList: null,
                    source: null,
                    entryWidget: null,
                    entryTemplate: null
                },
                /*
                 *
                 *<div id="order_by" class="" style="display:inline-block!important;">&nbsp;</div>
                    ui-icon2 ui-icon-triangle-1-n*/
                
                /*
                 **/
                
                _create: function() {
                    var $this = this;
                    this.asTable = !this.options.entryTemplate;
                    //this.use_mixin('view');
                    //this.use_mixin('api');
                    this.options.shape = widgetConfig.name_shape_container;
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
                    
                    var tag = this.asTable ? 'table' : 'div';
                    this.$list = $('<'+tag+'></'+tag+'>');
                    this.element.html(this.$list);
                    this.$list.off('.dynamic-list', this.get_reload_handler(this));
                    this.$list.addClass(widgetConfig.name_classes_list);
                    this.$list.addClass(widgetConfig.name_shape_container);
                    this.$list.addClass(widgetConfig.name_size_full);
                    this.$list.addClass(config.frontend_generateClassName('instance'));
                    
                    this.$list.on('dynamic-reload-list.dynamic-list.dynamic-widget', this.get_reload_handler(this));
                    this.$list.on('dynamic-zoom-list-entry.dynamic-list.dynamic-widget', this.get_zoomEntry_handler(this));
                    this.$list.on('dynamic-remove-list-entry.dynamic-list.dynamic-widget', this.get_removeEntry_handler(this));
                    this.$list.on('dynamic-unzoom-list-entry.dynamic-list.dynamic-widget', this.get_unzoomEntry_handler(this));
                    //todo: this.element.on('dynamic-notification.dynamic-widget.dynamic-list', fancy_frontend.get_notification_handler(this));
                    
                    this.on('updated', function(event, _data){
                        if (!!_data && _data.constructor == Array) {
                            $this.options.source = _data;
                            $this.options.resourceList = null;
                        }else if (!!_data) {
                            $this.options.resourceList = _data;
                            this.options.source = null;
                        }else{
                            $this.options.resourceList = null;
                            $this.options.source = null;
                        }
                        $this.updateConfig();                        
                    });
                    
                    if (this.options.resourceList && this.options.resourceList._replaced_with) {
                        // this is ugly, but because of the sequential processing, when an replacement event is fired while
                        // ??fixtures are being used??, the listView mixin already the blank object and this widget isn't initialized yet..
                        this.options.resourceList = this.options.resourceList._replaced_with;
                    }

                    if (this.options.resourceList != null && this.options.source != null){
                        this.options.source = null;
                    }
                    if (!!$this.options.source) {
                        this.options.scope._source = $this.options.source;
                        this.options.scope.$watch('_source', function(){
                            $this.updateConfig();
                        })
                    }
                    if ($this.options.resourceList) {this.log('register list view event handler', $this.options.resourceList)
                        $this.options.resourceList.bind('replaced', function(event, resource){
                            if ($this.options.resourceList !== resource) {
                                $this.options.resourceList = resource;
                                $this.updateConfig();
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
                
                updateConfig: function(){
                    var $this = this;
                    var resourceList;

                    if (this.options.resourceList && !this.options.resourceList.isBlank()) {
                        resourceList = this.options.resourceList;
                        resourceList.discover({
                            callback: function(result){
                                var content = result.getContent();
                                // TODO: do this via cores initWidgetStructure
                                $this.buildHeader();
                                $this.buildContainer();
                                $this.buildFooter();
                                var $body = $this.$body = $this.element.find(widgetConfig.selector_shape_container);
                                if (content['Accept-Ranges'] !== undefined) {
                                    // config as discovered
                                    if (content) {
                                        if (content.name) {
                                            /*$this.$header.html('<h3>'+content.name+'</h3>');*/
                                        }
                                        // TODO: get this event_prefix better!!
                                        var viewMixinEventPrefix = $this.mixins.view.event_prefix;
                                        if (content['actions']['POST'] !== undefined) {
                                            var createLink = $('<a href="#" class="'+config.frontend_generateClassName('action-add')+'"></a>');
                                            $this.$header.find(widgetConfig.selector_elements_header).append(createLink);
                                            createLink.click(function(event){
                                                event.preventDefault();
                                                var view;
                                                if ($this.asTable) {
                                                    view = 'popup';
                                                }else{
                                                    view = 'show';
                                                }
                                                $this.element.trigger(viewMixinEventPrefix + '-' + view, ['create', [resourceList]]);
                                            })
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
                                                $this.trigger(viewMixinEventPrefix + '-show', ['list', [$($this).val()]]);
                                            })
                                        }
                                    }else{
                                        //TODO 
                                        $this.$body.html('error discovering');
                                    }
                                    // show list
                                    resourceList.load(function(result){
                                            var content = result.getContent();//result.getObject().all();//result.getContent();
                                            $this.log('list content', content)
                                            $this.options.source = [];
                                            $.each(content, function(index, element){
                                                $this.options.source.push(element)
                                            })
                                            if ($this.options.source.length == 0) {
                                                // TODO: make this less static: this.view('create', [resourceList])
                                                $this.trigger(viewMixinEventPrefix + '-show', ['create', [resourceList]]);
                                            }else{                                                
                                                $this.goToPage(1);
                                            }
                                        })
                                }
                            }
                        })
                    }else if (this.options.source){
                        $this.element.html('TODO');
                        $this.options.scope.log.debug('TODO: implement plain source list');
                    }else{
                        $this.element.html('');
                        $this.options.scope.log.debug('emptying list');
                    }
                },
                
                getHeaderFields: function(){
                    return this.$header.children(widgetConfig.selector_elements_body)
                },
                
                addHeader: function(header, classes){
                    var tag = this.asTable ? 'th' : 'div';
                    $header = $('<'+tag+' class="'+(classes ? classes : '')+'"></'+tag+'>');
                    $header.attr(config.frontend_generateAttributeName('name'), header);
                    $header.html(header);
                    //$header.addClass(widgetConfig.name_shape_element);
                    this.$header.append($header);
                },
                
                buildContainer: function(){
                    var tag = this.asTable ? 'tbody' : 'div';
                    this.$container = this.$list.children(widgetConfig.selector_shape_container);
                    if (this.$container.size() <= 0) {
                        this.$container = $('<'+tag+' class="'+ widgetConfig.name_classes_body +' '+ widgetConfig.name_shape_container +'"></'+tag+'>');
                        this.$container.insertAfter(this.$header);
                    }
                },
                
                buildHeader: function(){
                    var tag = this.asTable ? 'thead' : 'div';
                    this.$header = this.$list.children(widgetConfig.selector_elements_header);
                    if (this.$header.size() == 0) {
                        this.$list.prepend('<'+tag+' class="'+ widgetConfig.name_classes_header +'"></'+tag+'>');
                        this.$header = this.$list.children(widgetConfig.selector_elements_header);
                    }
                    
                    this.addHeader('', widgetConfig.name_classes_header);
                    if (this.asTable) {
                        for (var header in this.options.headerFields){
                            this.addHeader(this.options.headerFields[header], widgetConfig.name_classes_body);
                        }
                    }
                    this.addHeader('', widgetConfig.name_classes_footer);
                    
                    var sortable_headers = this.$header.find(widgetConfig.selector_elements_sortable)
                    
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
                
                buildFooter: function(){
                    var tag = this.asTable ? 'tfoot' : 'div';
                    this.$footer = this.$list.children('.'+ widgetConfig.name_classes_footer);
                    if (this.$footer.size() == 0) {
                        this.$list.append('<'+tag+' class="'+ widgetConfig.name_classes_footer +'"></'+tag+'>');
                        this.$footer = this.$list.children('.'+ widgetConfig.name_classes_footer);
                    }
                    if (this.options.pagination_asInfinite) {
                        this.$footer.append('<div class="loading"></div>');
                    }else if (this.options.pagination_asPages) {
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
                        var $widget = $this.$list;
                        $widget.find('.dynamic-list-entry:not([data-' + attr_name + '="' + attr_value + '"])').slideUp();
                        $widget.find('.dynamic-pagination').slideUp();
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
                    
                    this.$list.data('current_page', page);
                    this.$list.data('current_letter', letter)
                        
                    this.loadPage(
                                            {page: page_nr, letter: letter},
                                            this.get_showList_handler(this, page_nr, letter)
                    );
                },
                
                loadPage: function(settings, callback){             
                    var page = settings.page;
                    paginatedBy = this.options.entriesPerPage;
                    result = this.options.source;// TODO: .slice((page-1)*paginatedBy, (page)*paginatedBy);
                    callback(result);
                },
                getLastPageNumber: function(){
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
                        return entry.to_other ? entry.to_other : (entry.uuid ? entry.uuid : entry.__getID());
                    }
                    return entry;//.__getID();
                },
                
                fillEntry: function(entry, domEntry){
                    var entry_id = this.getIdForEntry(entry);
                    var $this = this;
                    function update_content(content){
                        var ret = [];
                        $.each($this.getHeaderFields(), function(index, header) {
                            var $header = $(header);
                            header = $header.html();
                            var _ret = $('<td></td>');
                            _ret.html(content[header]);
                            ret.push(_ret);
                        });

                        $(domEntry).html(ret);
                    }
                    if (entry_id == entry) {
                        entry = this.api.object.get('uuid', entry_id);
                        entry.load(function(result){
                            if (result.wasSuccessfull) {
                                update_content(result.getContent());
                            }
                        })
                    }else{
                        update_content(entry)
                    }
                },
                
                get_showList_handler: function($this, page, letter){
                    return function(data){
                        
                        var $container = $this.$list.find(widgetConfig.selector_shape_container);
                        $container.find('.dynamic-list-entry').each(function(index, elem){
                            var $elem = $(elem);
                            var content = $elem.html();//.get(0);
                            //content = content.outerHTML || new XMLSerializer().serializeToString(content);
                            $this.$list.data('entry-' + $elem.attr('data-dynamic-list-entry-id'), content);
                            $elem.remove();
                        })
                        var output = [];
                        $.each(data, function(index, elem){
                            elem_id = $this.getIdForEntry(elem);
                            var tag = $this.asTable ? 'tr' : 'div';
                            var curOutput = '<'+tag+' class="dynamic-list-entry" data-dynamic-list-entry-id="'+elem_id+'">';
                            
                            if ($this.$list.data('entry-' + elem_id) != undefined) {
                                curOutput += $this.$list.data('entry-' + elem_id);
                            }
                            
                            curOutput += '</'+tag+'>'
                            curOutput = $(curOutput);
                            //curOutput.selectable();
                            //curOutput.attr('plugin-reference', '__id_'+elem_id);
                            //$this.options.scope['__id_'+elem_id] = elem;
                            $this.options.widgetCore.create_widget(
                                                                   curOutput,
                                                                   $this.options.entryWidget+':'+ elem_id,
                                                                   {
                                                                    content: $this.options.entryTemplate
                                                                   });
                            output.push(curOutput);
                        });
                        $container.prepend(output);
                        $this.apply($container)
                        /*
                        $.each(data, function(index, elem){
                            elem_id = $this.getIdForEntry(elem);
                            var entry = $container.find('.dynamic-list-entry[data-dynamic-list-entry-id="'+ elem_id +'"]');
                            
                            $this.fillEntry(elem, entry)
                        });*/
                        
                        var last_page = $this.getLastPageNumber();
                        
                        $this.updatePagination(page, last_page, letter);
                        $this.$list.triggerHandler('dynamic-end-loading');
                    };
                },
                    
                
                updatePagination: function(number, numbers, letter){                    
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
                        
                        var list_alphabet = ['-', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
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
                },
        });
               

    })
    return $
});
