define(function(base){
  return {
    /**
     *
     * @param config
     * @param type
     */
    validate : function(config, type)
    {

      if (!config.hasOwnProperty('structure')){
        throw new Error('Structure should be defined');
      }

      var structure = config.structure;

      if (!structure.hasOwnProperty('module')
        || !structure.module.hasOwnProperty('path')
        || !structure.hasOwnProperty('prefix')){

        throw new Error('Modules structure should be defined');
      }

      this.validateType(structure, type);
    },

    /**
     *
     * @param structure
     * @param type
     */
    validateType: function(structure, type)
    {

      if (!structure.hasOwnProperty(type)
        && !structure[type].hasOwnProperty('path')){

        throw new Error('Structure for ' + type + ' should be defined');
      }
    },

    /**
     *
     * @param req
     * @returns {*}
     */
    getCurrentUrl: function(req)
    {
      if (req.hasOwnProperty('toUrl')){

        // toUrl
        return req.toUrl('.').split('?')[0];
      } else {

        // Normalize
        return req('.').split('?')[0];
      }

    },

    /**
     *
     * @param config
     * @returns {*}
     */
    getCurrentApp: function(config)
    {
        return config.config.currentApp
      var baseUrl = config.baseUrl;
      var prefix = config.structure.prefix;
      var appUrlTemplate = config.structure.app.path;
      var regex = baseUrl + prefix + appUrlTemplate.replace('{app}', '');

      var x = url.replace(
        new RegExp('^.*'+(regex)),
        '');
      console.log(url + '\n' + regex +'\n' + config.config.app);
      return x.split('/')[0];
    },

    /**
     *
     * @param config
     * @returns {*}
     */
    getCurrentTheme: function(config)
    {
        return null  // TODO: implement themes
    },

    /**
     *
     * @param module
     * @param path
     * @param config
     * @returns return the configured version of this file (path)
     */
    getVersion: function(module, path, config)
    {
        var paths = path.split('/');
        var fileName = paths[paths.length-1],
            //app = this.getCurrentApp(config),
            version;
        if (module == 'js' && path.indexOf('.json', path.length - '.json'.length) === -1) {
            path = path + '.js';
        }
        if (config.versions[path] !== undefined) {
            version = config.versions[path];
        }else{
            version = -1;
        }
        
        return version
    },

    /**
     *
     * @param module
     * @param path
     * @param config
     * @returns path for the configured version of this file
     */
    asVersioned: function(module, path, config)
    {
        var paths = path.split('/');
        var fileName = paths[paths.length-1];
        var version = this.getVersion(module, path, config);
        if (version == -1 || version === undefined) {
            return path
        }
        var version_root = config.structure.version.root || '';
        return version_root + path + '/' + version + '/' + fileName
    },

    /**
     *
     * @param module
     * @param path
     * @param config
     * @returns path for the configured version of this file
     */
    getParent: function(path)
    {
        var parentPath = '';
        var paths = path.split('/');
        for (var i=0; i<paths.length-1; i++){
            parentPath += paths[i] + '/'
        }
        return parentPath
    },

    /**
     *
     * @param path
     * @param config
     * @param url
     * @returns {string}
     */
    path: function(path, config, module)
    {
      var prefix = config.structure.prefix;
      path = prefix.replace(/{module}/g,
        (module || this.getCurrentModule(config))
      ) + path;
      return this.asVersioned(module, path, config);
    },

    /**
     *
     * @param name
     * @returns {*}
     */
    value: function(name)
    {
      var parts = name.split(':');
      var placeholder;

      if (parts.length == 1){
        placeholder = parts[0];
      } else if (parts.length == 2) {
        placeholder =  parts[1];
      } else {
        throw new Error('Invalid require path format ('+ name +') for structure plugin');
      }

      if (placeholder[0] == '@'){
        placeholder = placeholder.substr(1);
      }

      return placeholder;
    },

    /**
     *
     * @param name
     * @returns {*}
     */
    module: function(name)
    {
      var parts = name.split(':');

      if (parts.length != 2){
        return null;
      }

      return parts[0];
    },

    /**
     *
     * @param type
     * @param name
     * @param req
     * @param onload
     * @param config
     */
    process: function(type, name, req, onload, config)
    {
      var reqPath = this.reqPath(type, name, config);

      req([reqPath], function(value){
        onload(value);
      });
    },

    /**
     *
     * @param type
     * @param name
     * @param config
     * @param url
     * @returns {string}
     */
    reqPath: function (type, name, config)
    {
      this.validate(config, type);

      var structure = config.structure;

      var component = this.value(name);

      var path = structure[type].path
        .replace(new RegExp('{' + type + '}', 'g'), component);

      var module = this.module(name);

      return this.path(path, config, module);
    },

    /**
     *
     * @param name
     * @param normalize
     * @returns {*}
     */
    _normalize: function (name, normalize)
    {
      var normalized;

      if (name.split(':').length == 1){

        var config = requirejs.s.contexts._.config;

        //var module = this.getCurrentModule(config, config.baseUrl  + this.getCurrentUrl(normalize));

        normalized = name;//module + ':' + name;

      } else {
        normalized = name;
      }

      return normalized;
    },

    normalize: function (name, normalize) {

      return this._normalize(name, normalize);
    },

    load_css: function(config, name){

      this.validate(config, 'css');

        var structure = config.structure,
            app;
      parts = name.split(':');

      if (parts.length == 1) {
        var path = structure.css.path
          .replace(/{app}/g, app || this.getCurrentApp(config))
          .replace(/{path}/g, this.value(parts[0]));
      }else {
        var app = parts[0];
        var widget = parts[1];
        var file = parts.length > 2 ? parts[2] : null;
        var theme = this.getCurrentTheme(config);

        var path = structure.css.widget_path
          .replace(/{app}/g, app || this.getCurrentApp(config))
          .replace(/{widget}/g, widget)
          .replace(/{file}/g, file || widget)
          .replace(/{theme}/g, theme || '');
      }

      return {
        reqPath: this.path(path, config, 'css'),
        reqPlugin: this.load_plugin(config, 'css').reqPath
      }
    },

    load_template: function(config, name){

      this.validate(config, 'template');

      var structure = config.structure;

      var app = null,
      parts = name.split(':');
      
      if (parts.length > 1) {
        name = parts[1];
        app = parts[0];
      }
      var template = this.value(name);
      widget = template.split('.')[0];

      var theme = this.getCurrentTheme(config);

      var extension = 'html';
      if (structure.template.hasOwnProperty('extension')){
        extension = structure.template.extension;
      }

      var path = structure.template.path
        .replace(/{template}/g, template)
        .replace(/{extension}/g, extension)
        .replace(/{theme}/g, theme || '')
        .replace(/{widget}/g, widget)
        .replace(/{app}/g, app || this.getCurrentApp(config));

      return {
        reqPath: this.path(path, config, 'partials'),
        reqPlugin: this.load_plugin(config, 'text').reqPath
      }
    },

    load_fixture: function(config, name){ // TODO: the config of the resulting request contains path of css file?

      this.validate(config, 'fixture');

      var structure = config.structure;
    var app = this.getCurrentApp(config);

      var fixture = name;
      parts = fixture.split(':');
      
      if (parts.length > 1) {
        fixture = parts[1];
        app = parts[0];
      }
      widget = fixture.split('.')[0];

      var path = structure.fixture.path
        .replace(/{fixture}/g, fixture)
        .replace(/{widget}/g, widget)
        .replace(/{app}/g, app);

      return {
        reqPath: this.path(path, config, 'js'),
        reqPlugin: 'json'
      }
    },

    load_locale: function(config, name){
        var result = {};
        var container = config.structure.locale.container;
        var app = this.getCurrentApp(config);
        var parts = target.split(':');
        if (parts.length == 1) {
            locale = parts[0];
        }else if (parts.length == 2) {
            locale = parts[1];
            container = parts[0];
        }else if (parts.length == 3) {
            locale = parts[2];
            app = parts[0];
            container = parts[1];
        }else{
            throw Error ('"' + target + '" is not a valid locale target')
        }

        var path = config.structure.locale.path
          .replace(/{locale}/g, locale)
          .replace(/{container}/g, container)
          .replace(/{app}/g, app);

        result.reqPath = this.path(path, config, 'locales');
        result.reqPlugin = 'json';
        return result
    },

    load_plugin: function(config, target){
        var result = {};
        var container = config.structure.plugin.container;
        var parts = target.split(':');
        if (parts.length == 1) {
            plugin = parts[0];
        }else if (parts.length == 2) {
            plugin = parts[1];
            container = parts[0];
        }else{
            throw Error ('"' + target + '" is not a valid plugin target')
        }

        // TODO: not right, should be done as all other load_*** handle this?
        if (config.paths[plugin+'_fancyPlugin'] !== undefined) {
          plugin = config.paths[plugin+'_fancyPlugin'];
        };

        var path = config.structure.plugin.path
          .replace(/{plugin}/g, plugin)
          .replace(/{container}/g, container || '.').replace('/./', '/');

        result.reqPath = this.path(path, config, 'js');
        //result.reqPlugin = target
        return result
    },

    load_config: function(config, name){

        var data = this.resolveTargets(config, name+'.json');
        var data = this.handlePlugin(config, data.fancyPlugin, data.target);
        data.reqPlugin = 'json';
        return data
    },

    load_widget: function(config, name){

      this.validate(config, 'widget');

      var structure = config.structure;
        var parts = name.split(':');
        var app, name, file_name;
        if (parts.length == 1) {
            file_name = name = name;
            app = this.getCurrentApp(config);
        }else if (parts.length == 2) {
            file_name = name = parts[1];
            app = parts[0];
        }else if (parts.length == 3) {
            file_name = parts[2];
            name = parts[1];
            app = parts[0];
        }else{
            throw Error ('"' + name + '" is not a valid widget syntax')
        }

      var widget = this.value(name);
      var file = this.value(file_name);

      var path = structure.widget.path
        .replace(/{widget}/g, widget)
        .replace(/{file}/g, file)
        .replace(/{app}/g, app);

      return {
        reqPath: this.path(path, config, 'js')
      }
    },

    load_lib: function(config, name){

      this.validate(config, 'lib');

      var structure = config.structure;

      var lib = this.value(name);

      var path = structure.lib.path
        .replace(/{lib}/g, lib);

      return {
        reqPath: this.path(path, config, 'js')
      }
    },

    load_app: function(config, name){
      this.validate(config, 'app');
      // TODO: validate if structure.app.hasOwnProperty('mainFile')

      var structure = config.structure;
      var app, file;

      var parts = name.split(':');

      if (parts.length == 1 && name[0] != '@') {
        app = name;//base.value(name);
      }else if(parts.length == 2){
        app = parts[0];
        file = parts[1];
      }else{
        if (name[0] == '@') {
            name = name.substr(1)
        }
        file = name;
      }
      if (app === undefined){
        app = this.getCurrentApp(config);
      }
      if (file === undefined){
        file = structure.app.mainFile;
      }

      if (config.paths[file] !== undefined) {
        //file = config.paths[file]; // todo: is this allways wrong?? seems to be..
      }
      var path = structure.app.path
        .replace(/{app}/g, app)
        .replace(/{file}/g, file);
        /* TODO : reactivate?
        if (plugin == 'app' && target[0] != '@') {
           pluginConfig['currentApp'] = target;
                   //'currentFolder': reqParent
        }*/

      return {
        reqPath: this.path(path, config, 'js')
      }
    },

    resolveTargets: function (config, name){
        var resolvedTarget = {};
        var parts;
        var requested_target, requested, defaults_to, plugin, target, fancyPlugin;
        requested = name,
        defaults_to = this.resolveShortcut(config, requested, false);

        parts = name.split('!');
        if (parts.length > 1) {
            if (parts[0] != 'fancyPlugin') {
                plugin = parts[0];
            }
            name = parts[1];
        }

        parts = name.split(':');
        if (parts.length == 2) {
            fancyPlugin = parts[0];
            requested_target = parts[1];
            target = this.resolveShortcut(config, requested_target);
            if (target != requested_target) {
                _resolvedTarget = this.resolveTargets(config, target);
                if (_resolvedTarget.fancyPlugin) {
                    target = _resolvedTarget.fancyPlugin + ':' + _resolvedTarget.target;
                }else{
                    target = _resolvedTarget.target;
                }
                plugin = _resolvedTarget.plugin;
            }else if (defaults_to != requested){
                return this.resolveTargets(config, defaults_to);
            }

        }else if(parts.length == 1){
            requested_target = name;
            target = this.resolveShortcut(config, requested_target);
            if (target != requested_target) {
                _resolvedTarget = this.resolveTargets(config, target);
                target = _resolvedTarget.target;
                fancyPlugin = _resolvedTarget.fancyPlugin;
                plugin = _resolvedTarget.plugin;
            }else if (defaults_to != requested){
                return this.resolveTargets(config, defaults_to);
            }else{
                fancyPlugin = null
            }


        }else{  // parts.length > 2
             if (defaults_to != requested){
                return this.resolveTargets(config, defaults_to);
            }
            fancyPlugin = parts[0];
            requested_target = parts[parts.length-1];
            target = '';
            for (var i=1; i<parts.length; i++) {
                target += parts[i] + (i < parts.length-1 ? ':' : '');
            }
        }

        resolvedTarget.target = target;
        resolvedTarget.fancyPlugin = fancyPlugin;
        //resolvedTarget.requested = requested;
        //resolvedTarget.defaults_to = defaults_to;  // TODO?
        resolvedTarget.requested = requested_target
        resolvedTarget.plugin = plugin;

        return resolvedTarget;
    },

    handlePlugin: function(config, plugin, target){
        if (this.hasOwnProperty('load_'+plugin)) {
            return this['load_' + plugin](config, target);
        }else{
            return this.load_plugin(config, target);
        }
    },

    handleRequest: function(req, onload, config, name){
        var result = {
            reqPath: '',
            reqConfig: {},
            reqPlugin: undefined,
            reqTarget: ''
        }

        resolvedTarget = this.resolveTargets(config, name);
        if (resolvedTarget.fancyPlugin === null) {
            return null
        }
        target = resolvedTarget.target;
        plugin = resolvedTarget.fancyPlugin;
        if (plugin == 'lib') {
            result.reqTarget = resolvedTarget.requested;
        }

        result.reqPlugin = resolvedTarget.plugin;
        data = this.handlePlugin(config, plugin, target)
        result.reqPath = data.reqPath;
        result.reqPlugin = data.reqPlugin; // TODO: if already set: error
        result.reqConfig = data.reqConfig || result.reqConfig; // TODO: extend

        result.reqConfig['paths'] = result.reqConfig['paths'] || {};
        result.reqConfig['paths'][result.reqTarget] = result.reqPath;
        if (plugin != 'lib') {
            result.reqTarget = result.reqPath;
        }
        return result
    },

    resolveShortcut: function(config, name, complete){
        if ((complete !== false) && (config.paths[name] !== undefined)) {
            return config.paths[name];
          }
        if (config.defaults && config.defaults[name] !== undefined) {
            return config.defaults[name];
          }
          return name;  
    },
    
    simple_load: function(name, req, onload, config){
        require([name], function (value) {
            onload(value);
        });
    },

    load: function (name, req, onload, config) {
        var execute = true;
        if (name[name.length-1] == '?'  ) {
            name = name.slice(0, name.length -1);
            execute = false;
        }
        this.validate(config, 'plugin');
        var parseJson = false;

        result = this.handleRequest(req, onload, config, name);
        if (result === null) {
            return this.simple_load(name, req, onload, config)
        }
        if (result.reqPlugin == 'json') {
            result.reqPlugin = 'text';
            parseJson = true;
        }
        var dep = result.reqPlugin ? (result.reqPlugin +'!'+ result.reqTarget) : result.reqTarget;
        
        if (execute) {
            var error = function(name, result, e){
               console.log('(error)', '[fancy-frontend RequirePlugin]', 'loading "', name, '", config:', result.reqConfig, 'dependencies:', [dep]);
               if (e) {
                   //console.error(e, e.lineNumber || e.number, e.fileName, e.name, e.message);
                   console.error(e.stack);
               }else{
                   throw e
               }
            }
            require(result.reqConfig, [dep], function(value){
               var proceed = function(data){
                   onload(data);
               }
               
               if ((parseJson) && (typeof value == typeof 'string')) {
                   require(['json'], function(json){
                       value = json.parse(value);
                       proceed(value);
                   });
               }else{
                   proceed(value);
               }
              
            }, error.bind(null, name, result));
        }else{
            // return url instead of executing require. this way undef can be used... UGLY! (TODO: find better way?)
            onload(result.reqConfig.paths[""] ? result.reqConfig.paths[""] : result.reqConfig.paths[dep]);
            return result.reqConfig.paths[""] ? result.reqConfig.paths[""] : result.reqConfig.paths[dep]
        }
    }
  }
});
