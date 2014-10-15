define(['fancyPlugin!fancyWidgetCore', 'fancyPlugin!fancyFrontendConfig'], function($, config){
    $(function() {

       $.widget( config.apps['fancy-frontend'].namespace + '.login', $[config.apps['fancy-frontend'].defaults_namespace].core ,{
            
                options: {
                    successUrl:null,
                },
            
                _create: function(){
                    var $this = this;
                    
                    this._superApply( arguments );
                    require(['fancyPlugin!cookie'], function($a){
                        
                        $this.context = {
                            parentLanguages: {},
                            siteLanguages: []
                        }
                        $this.elements = {};
                        
                                            
                        var $content = $('<div/>');
                        $this.elements.content = $content;
                        $this.element.html($content);
                        
                        $this.elements.providerContainer = $this.options.providerContainer;
                        if (!$this.elements.providerContainer || $this.elements.providerContainer.size() == 0) {
                            var $container = $('<div class=""/>');
                            $this.element.prepend($container);
                            $this.elements.providerContainer = $container;
                        }
                        
                        
                        if ($.cookie('resourceaccess-identity') && false) { //this._hasUser
                            $this.options.widgetCore.endpoint.getAuthStatus(function(result){
                                if (result.auth) {
                                    $this.confirm();
                                }else{
                                    $this.login();
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
                
                confirm: function(){
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
                    
                    var $this = this;
                    this.elements.content.html('');
                    
                    var $login = $('<p/>');
                    $login.append('<label for="id_login">E-mail:</label>');
                    $login.append('<input id="id_login" name="login" placeholder="E-mail address" type="text" />');
                    this.elements.content.append($login);
                    
                    var $password = $('<p/>');
                    $password.append('<label for="id_password">Password:</label>');
                    $password.append('<input id="id_password" name="password" placeholder="Password" type="password" />');
                    this.elements.content.append($password);                    
                    
                    this.elements.content.append('<a class="secondaryAction reset-password" href="/accounts/password/reset/">Forgot Password?</a>');
                    this.elements.content.append('<input type="button" name="submit" value="Login" class="login-button button" />')
                    
                    this.elements.content.append('<br /><a href="#" class="change-register">Register</a>');
                    
                    
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
                
                completed: function(){                    
                    this.options.callback(true);
                    this.destroy();
                },
                
                executeLogin: function(){
                    var $this = this;
                    this.options.widgetCore.endpoint.login({
                        auth:     'credentials',
                        username: this.elements.content.find('#id_login').val(),
                        password: this.elements.content.find('#id_password').val(),
                    }, function(result){
                        if (result.isAuthenticated) {
                            $this.completed();
                            require(['fancyPlugin!cookie'], function($a){
                                    $.cookie('resourceaccess-identity', true, { path: '/', expires: 14 });
                            });    
                        }else{
                            // todo
                            alert('wrong credentials')
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
                    
                    var $this = this;
                    this.elements.content.html('');
                    
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
                    
                    this.elements.content.append('<input type="button" name="submit" value="Register" class="register" />')
                    
                    this.elements.content.append('<br /><a href="#" class="change-login">Login</a>');
                    this.elements.content.find('.change-login').bind('click', function(event){
                        $this.login();
                        event.stopImmediatePropagation();
                        
                        return false;
                    });
                    
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
        });


    })
    return $
});
    