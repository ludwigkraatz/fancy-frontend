define(['fancyPlugin!widget:fancy-frontend:resource_interface'], function(fancyWidgetCore){
    var $ = fancyWidgetCore.$,
        config = fancyWidgetCore.getFrontendConfig(),
        widgetConfig = fancyWidgetCore.getWidgetConfig();

    fancyWidgetCore_login = fancyWidgetCore.derive('resource_interface', {
        namespace: config.apps['fancy-frontend'].namespace,
        name: 'login',
        widget: {
            
                options: {
                    successUrl:null,
                    shape: 'content'
                },
                
                initBody: function(){
                    this._superApply(arguments);
                    this.elements.content = this.$body;
                },
                
                _create: function(){
                    var $this = this;
                    this.use_mixin('view');
                    this.context = {
                        parentLanguages: {},
                        siteLanguages: []
                    }
                    this.elements = {};
                    this._superApply( arguments );
                    require(['fancyPlugin!cookie'], function($a){
                        
                        
                                            
                        //var $content = $('<div/>');
                        //$this.elements.content = $content;
                        //$this.$body = $content;
                        //$this.element.html($content);
                        
                        $this.elements.providerContainer = $this.options.providerContainer;
                        if (!$this.elements.providerContainer || $this.elements.providerContainer.size() == 0) {
                            var $container = $('<div class=""/>');
                            $this.$body.prepend($container);
                            $this.elements.providerContainer = $container;
                        }
                        
                        current_identity = $.cookie('resourceaccess-identity');
                        if (current_identity && $this.getAuth().isAuthenticated() !== false) {
                            $this.log('(login)', 'found identity. try to use it', current_identity)
                            console.error('not implemented yet');
                            return $this.login();
                            $this.getAuth().refresh({
                                callback: function(result){
                                    if (result.isAuthenticated()) {
                                        $this.confirm(result);
                                    }else{
                                        $this.login();
                                    }
                                }
                            })  
                        }else{
                            $this.login();
                        }
                        
                    });
                },
                
                _destroy: function(){
                    this.elements.providerContainer.empty();
                    this.element.remove()
                },
                
                getCurrentLocation: function() {
                    return this.options.successUrl || window.location.href;//window.location.pathname +  window.location.search +  window.location.hash;
                },
                
                confirm: function(auth){confirm('confirm profile' + auth.profile)
                    var $this = this;
                    this.elements.content.append('<input type="button" value="Ok" class="accept-button button" />')
                    
                    this.elements.content.find('.accept-button').bind('click', function(event){
                        $this.completed()
                        event.stopImmediatePropagation();
                        
                        return false;
                    });
                    
                    this.elements.content.append('<br /><a href="#" class="change-login">Login</a>');
                    this.elements.content.find('.change-login').bind('click', function(event){
                        $this.login();
                        event.stopImmediatePropagation();
                        
                        return false;
                    });
                },
                
                login: function(){
                    
                    var $this = this,
                        $form = $('<form action="" method="post"></form>');
                    this.elements.content.html($form);
                    
                    var $login = $('<p></p>');
                    $login.append('<label for="id_login">E-mail:</label>');
                    $login.append('<input id="id_login" name="login" placeholder="E-mail address" type="text" />');
                    $form.append($login);
                    
                    var $password = $('<p/>');
                    $password.append('<label for="id_password">Password:</label>');
                    $password.append('<input id="id_password" name="password" placeholder="Password" type="password" />');
                    $form.append($password);                    
                    
                    $form.append('<a class="secondaryAction reset-password" href="/accounts/password/reset/">Forgot Password?</a>');
                    $form.append('<input type="submit" name="submit" value="Login" class="login-button button" />')
                    
                    $form.append('<br /><a href="#" class="change-register">Register</a>');
                    
                    
                    $form.bind('submit', function(event){
                        $this.executeLogin();
                        event.stopImmediatePropagation();
                        event.preventDefault();
                        return false;
                    });
                    this.elements.content.find('.login-button').bind('click', function(event){
                        $this.executeLogin();
                        event.stopImmediatePropagation();
                        
                        return false;
                    });
                    this.elements.content.find('.change-register').bind('click', function(event){
                        $this.register();
                        event.stopImmediatePropagation();
                        
                        return false;
                    });
                    this.elements.content.find('.reset-password').bind('click', function(event){
                        $this.forgottPassword();
                        event.stopImmediatePropagation();
                        
                        return false;
                    });
                    
                    
                    this.showSocialProviders(false);
                },
                
                completed: function(result){
                    var callback = this.options.callback;
                    delete this.options.callback;
                    this.destroy();
                    if (callback) {
                        callback(result);
                    }
                },
                
                executeLogin: function(){
                    var $this = this,
                        host = undefined;
                    this.getAuth().login({
                        method: 'credentials',
                        host: host,
                        username: this.elements.content.find('#id_login').val(),
                        password: this.elements.content.find('#id_password').val(),
                        callback: function(result){
                            var is_authenticated = false;
                            if (result && typeof(result.isAuthenticated) == 'function') {
                                is_authenticated = result.isAuthenticated(host)
                            }else if (result) {
                                is_authenticated = result
                            }
                            if (is_authenticated) {
                                $this.completed(result);
                                require(['fancyPlugin!cookie'], function($a){
                                        $.cookie('resourceaccess-identity', result.getProfile(), { path: '/', expires: 14 });
                                });    
                            }else{
                                // todo
                                alert('wrong credentials')
                            }
                        }
                    });
                },
                
                executeRegister: function(){
                    
                },
                
                executePasswordReset: function(){
                    
                },
                
                forgottPassword: function(){
                    var $this = this;
                    
                    var $email = $('<p/>');
                    $email.append('<label for="id_login">E-mail:</label>');
                    $email.append('<input id="id_login" name="login" placeholder="E-mail address" type="text" />');
                    this.elements.content.html($email);
                    
                    this.elements.content.append('<input type="button" value="Senden" class="send-button button" />')
                    this.elements.content.find('.send-button').bind('click', function(event){
                        $this.executePasswordReset();
                        event.stopImmediatePropagation();
                        
                        return false;
                    });
                    
                    this.elements.content.append('<br /><a href="#" class="change-login">Login</a>');
                    this.elements.content.find('.change-login').bind('click', function(event){
                        $this.login();
                        event.stopImmediatePropagation();
                        
                        return false;
                    });
                    
                    this.emptySocialProviders();
                },
                
                register: function(){
                    this.showView('register');
                },
                    
                registerView: function(){
                    this.elements.content.html('');
                    var $this = this;
                    this.require_mixin('api');
                    this.api.discover({
                        uri: 'auth/profiles/?action=register',
                        // TODO: action: 'register',
                        source: this,
                        done: function(result){
                            
                            var resource = result.getResource()
                            this.require_mixin('edit', {source: resource}, this.mixins.view.event_prefix);
                            this.require_mixin('edit', {source: resource}, this.mixins.view.event_prefix);
                            
                            var $login = $('<p/>');
                            $login.append('<label for="id_login">E-mail:</label>');
                            $login.append('<input id="id_login" name="login" placeholder="E-mail address" type="text" />');
                            this.elements.content.append($login);
                            
                            var $password = $('<p/>');
                            $password.append('<label for="id_password">Password:</label>');
                            $password.append('<input id="id_password" name="password" placeholder="Password" type="password" />');
                            this.elements.content.append($password);   
                            
                            var $password = $('<p/>');
                            $password.append('<label for="id_password2">Password Confirm:</label>');
                            $password.append('<input id="id_password2" name="password2" placeholder="Password" type="password" />');
                            this.elements.content.append($password);   
                            
                            var $btn = $('<input type="button" name="submit" value="Register" class="register" />');
                            this.elements.content.append($btn);
                            $btn.click(function(event){
                                event.preventDefault();
                                this.executeRegister();
                            }.bind(this))
                            
                            this.elements.content.append('<br /><a href="#" class="change-login">Login</a>');
                            this.elements.content.find('.change-login').bind('click', function(event){
                                $this.login();
                                event.stopImmediatePropagation();
                                
                                return false;
                            });
                            
                        }.bind(this)
                    })
                    this.showSocialProviders(true);
                },
                
                emptySocialProviders: function(){                    
                    this.elements.providerContainer.empty();
                },
                
                showSocialProviders: function(register){
                    if (register === undefined) {
                        register = false;
                    };return; // TODO
                    var login = !register;
                    this.emptySocialProviders();
                    var providers = [
                        {
                            title:  "Google",
                            href:   "http://localhost:8123/accounts/google/login/?process=",
                            divClass:"google",
                            prepend: "",
                            forRegister: true,
                            forLogin: true,
                        },
                        {
                            title:  "Facebook",
                            href:   "javascript:allauth.facebook.login('"+this.getCurrentLocation()+"', 'authenticate', 'login')",
                            divClass:"facebook",
                            prepend: '<div id="fb-root"></div>'+
'<script type="text/javascript">'+
"require(['fancyPlugin!authHelpers'], function (allauth){"+
"if (allauth.facebook.init){"+
"allauth.facebook.init({ appId: '',"+
"  locale: 'en_US',"+
'  loginOptions: {"scope": "email"},'+
"  loginByTokenUrl: '/accounts/facebook/login/token/',"+
"  channelUrl : 'http://localhost:8123/accounts/facebook/channel/',"+
"  cancelUrl: '/accounts/social/login/cancelled/',"+
"  logoutUrl: '/accounts/logout/',"+
"  errorUrl: '/accounts/social/login/error/',"+
"  csrfToken: 'u7qw6fTuMXjpFRwx00psxWtk2DnCj7X6' });"+
"}});"+
'</script>',
                            forRegister: true,
                            forLogin: true,
                        },
                    ];
                    
                    this.elements.providerContainer.append('<hr />');
                    
                    var content = '<center>';
                    
                    for (var providerID in providers) {
                        var provider = providers[providerID];
                        
                        if (!((provider.forRegister && register) || (provider.forLogin && login))) {
                            continue
                        }
                        if (provider.href.indexOf('javascript:') === -1) {
                            //window.location.href
                            var nextUrl = this.getCurrentLocation();
                            var href = this.addUrlKwarg(provider.href, 'next', nextUrl);
                        }else{
                            var href = provider.href;
                        }
                        
                        
                        this.elements.providerContainer.prepend(provider.prepend);
                        content += '<a title="'+provider.title+'" href="'+href+'">'+
                                                                    '<div class="socialaccount_provider '+provider.divClass+' user-icon"></div>'+
                                                               '</a>';
                    }
                    content += '</center>';
                    this.elements.providerContainer.append(content);
                    
                    if (providers.length > 0) {
                        this.elements.providerContainer.append('<hr />');
                    }
                },
                
                
                addUrlKwarg: function(url, name, value){
                    var ret = url+'&'+name+'='+encodeURIComponent(value);
                    return ret
                }
        }
    });

    return fancyWidgetCore_login
});
    