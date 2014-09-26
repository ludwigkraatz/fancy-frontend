define(['fancyPlugin!jquery'], function($){
    var _config = undefined,
    ConfigPrototype = {
        _init: function(config){this._config = config;},
        "frontend_generateName": function(name){
            return this.frontend_generateFunctionName(name)
        },
        "frontend_generateSelector": function(name, selectorType){
            if (selectorType === undefined) {
                selectorType = 'class'
            }
            if (selectorType == 'class') {
                return "." + this.frontend_prefix_css() + name
            }else if (selectorType == 'id') {
                return '#' + this.frontend_prefix_css() + name
            }else{
                throw Error('unknown SelectorType "' + selectorType + '"')
            }
        },
        "frontend_generateFunctionName": function(name){
            return name
        },
        "frontend_prefix_js": function(){
            return this.widgets.prefix + "_"
        },
        "frontend_prefix_css": function(){
            return this.widgets.prefix + "-"
        },
        "frontend_generateEventName": function(name){
            return this.frontend_generateClassName(name)
        },
        "frontend_generateEventSelector": function(name, selectorType){
            return "." + this.frontend_prefix_css() + name
        },
        "frontend_generateClassName": function(name){
            if (name.search("ui:") != -1){
                return this.css.namespaces.ui.prefix + name
            }
            return this.frontend_prefix_css() + name
        },
        "frontend_generateID": function(name){
            return this.frontend_generateClassName(name)
        },
        "frontend_generateAttributeName": function(name){
            return "data-" + this.frontend_prefix_css() + name
        },
        "frontend_generateWording": function(id){
            return this.dialog_generateWording(id)
        },
        "dialog_generateWording": function(id){
            return "{{ " + id.replace(":", ",").toUpperCase() + " | translate }}"
        },
        "frontend_generateResponseAttributeName": function(name){
            return this.frontend_prefix_css() + name
        },
        'frontend_generateErrorCode': function(name){
            return this.frontend.generateClassName(name)
        },
        'forJS': function(){
            return {
                'frontendPrefix': this._config.prefix ? (this._config.prefix + '-') : this._config.prefix,
            }//convertToJS(this._config);
        },
    }
    function convertToJS(config) {
        var jsConfig = {};

        for (key in config) {
            var newKey = ' ';
            var isFirst = true;
            var keyParts = key.split('-');
            for (var keyPart in keyParts) {
                if (isFirst) {
                    if (keyParts[keyPart][0] == '$') {
                        keyParts[keyPart] = keyParts[keyPart].slice(1)
                    };
                    isFirst = false;
                }else{
                    keyParts[keyPart] = keyParts[keyPart][0].toUpperCase() + keyParts[keyPart].slice(1);
                }
                newKey += keyParts[keyPart];
            }
            jsConfig[newKey] = typeof(config[key]) == "object" ? convertToJS(config[key]) : config[key];
        }
        return jsConfig
    }

    function prepare_config(config){
        // TODO: add default values
        function Config() {
            this._init.apply(this, arguments);
        }
        $.extend(Config.prototype, ConfigPrototype);

        if (config.widgets.defaults === undefined) {
            config.widgets.defaults = {};
        }
        $.extend(config.widgets.defaults, {
            "editor": {
                "name": "editor",
                "css": "editor"
            },

            "list": {
                "name": "list",
                "css": "list"
            },

            "core": {
                "name": "core",
                "css": "core"
            },

            "form": {
                "name": "form",
                "css": "form"
            },

            "popup": {
                "name": "popup",
                "css": "popup-window"
            }
        });
        $.extend(Config.prototype, config);
        return new Config(config)
    }
    function init(callback) {
        require(['fancyPlugin!fancyFrontendConfigFile', 'json'], function(config, json){
            if (typeof config == typeof 'string') {
                config = JSON.parse(config);
            }
            _config = prepare_config(config);
            if (callback) {
                callback(_config);
            }
        });
    }
    return {
        get: function() {
            if (_config === undefined) {
                throw Error('Configuration not initilized yet. Call set(config) or load()')
            }
            return _config
        },
        set: function(config){
            _config = prepare_config(config);
            return _config
        },
        load: function(callback){
            init(callback);
        }
    }
});
