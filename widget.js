/* global requirejs cprequire cpdefine chilipeppr THREE */
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
        // SmoothieCharts: '//smoothiecharts.org/smoothie',
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
    }
});

cprequire_test(["inline:com-chilipeppr-widget-spindlecontrol"], function(myWidget) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    // Please note that if you are working on multiple widgets at the same time
    // you may need to use the ?forcerefresh=true technique in the URL of
    // your test widget to force the underlying chilipeppr.load() statements
    // to referesh the cache. For example, if you are working on an Add-On
    // widget to the Eagle BRD widget, but also working on the Eagle BRD widget
    // at the same time you will have to make ample use of this technique to
    // get changes to load correctly. If you keep wondering why you're not seeing
    // your changes, try ?forcerefresh=true as a get parameter in your URL.

    console.log("test running of " + myWidget.id);

    $('body').prepend('<div id="testDivForFlashMessageWidget"></div>');

    chilipeppr.load(
        "#testDivForFlashMessageWidget",
        "http://raw.githubusercontent.com/chilipeppr/element-flash/master/auto-generated-widget.html",
        function() {
            console.log("mycallback got called after loading flash msg module");
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                //console.log("inside require of " + fm.id);
                fm.init();
            });
        }
    );

    // init my widget
    myWidget.init();
    $('#' + myWidget.id).css('margin', '20px');
    $('title').html(myWidget.name);

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-chilipeppr-widget-spindlecontrol", ["chilipeppr_ready", /* other dependencies here */ ], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-widget-spindlecontrol", // Make the id the same as the cpdefine id
        name: "Widget / spindlecontrol", // The descriptive name of your widget.
        desc: "This example widget gives you a framework for creating your own widget. Please change this description once you fork this template and create your own widget. Make sure to run runme.js every time you are done editing your code so you can regenerate your README.md file, regenerate your auto-generated-widget.html, and automatically push your changes to Github.", // A description of what your widget does
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
            '/onExampleGenerate': 'Example: Publish this signal when we go to generate gcode.'
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // '/onExampleConsume': 'Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it.'
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            // '/jsonSend': 'Example: We send Gcode to the serial port widget to do stuff with the CNC controller.'
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            // '/com-chilipeppr-elem-dragdrop/ondropped': 'Example: We subscribe to this signal at a higher priority to intercept the signal. We do not let it propagate by returning false.'
        },
        /**
         * All widgets should have an init method. It should be run by the
         * instantiating code like a workspace or a different widget.
         */
        init: function() {
            console.log("I am being initted. Thanks.");
            this.sliderSetup();
            this.setupUiFromLocalStorage();
            this.btnSetup();
            this.forkSetup();

            console.log("I am done being initted.");
        },
        /**
         * Call this method from init to setup all the buttons when this widget
         * is first loaded. This basically attaches click events to your 
         * buttons. It also turns on all the bootstrap popovers by scanning
         * the entire DOM of the widget.
         */
         
        //RPM slider selector setup
        sliderSetup: function() {
            var slider = document.getElementById("myRange");
            var output = document.getElementById("demo");
            output.innerHTML = slider.value;
          
            slider.oninput = function() {
            output.innerHTML = this.value;
            }
            var curSpeed = 0;
            document.getElementById("demo2").innerHTML = curSpeed;
        },
        
  
         
        btnSetup: function() {

            // Chevron hide/show body
            var that = this;
            $('#' + this.id + ' .hidebody').click(function(evt) {
                console.log("hide/unhide body");
                if ($('#' + that.id + ' .panel-body').hasClass('hidden')) {
                    // it's hidden, unhide
                    that.showBody(evt);
                }
                else {
                    // hide
                    that.hideBody(evt);
                }
            });

            // Ask bootstrap to scan all the buttons in the widget to turn
            // on popover menus
            $('#' + this.id + ' .btn').popover({
                delay: 1000,
                animation: true,
                placement: "auto",
                trigger: "hover",
                container: 'body'
            });

            // Init Say Hello Button on Main Toolbar
            // We are inlining an anonymous method as the callback here
            // as opposed to a full callback method in the Hello Word 2
            // example further below. Notice we have to use "that" so 
            // that the this is set correctly inside the anonymous method
            $('#' + this.id + ' .btn-sayhello').click(function() {
                console.log("saying hello");
                // Make sure popover is immediately hidden
                $('#' + that.id + ' .btn-sayhello').popover("hide");
                // Show a flash msg
                chilipeppr.publish(
                    "/com-chilipeppr-elem-flashmsg/flashmsg",
                    "Hello Title",
                    "Hello World from widget " + that.id,
                    1000
                );
            });

            // Init Hello World 2 button on Tab 1. Notice the use
            // of the slick .bind(this) technique to correctly set "this"
            // when the callback is called
            $('#' + this.id + ' .btn-spindleOn-CW').click(this.spindleOnCwBtnClick.bind(this));
            $('#' + this.id + ' .btn-spindleOn-CCW').click(this.spindleOnCcwBtnClick.bind(this));
            $('#' + this.id + ' .btn-spindleOff').click(this.spindleOffBtnClick.bind(this));
            $('#' + this.id + ' .btn-spindleMin').click(this.minSpeedBtnClick.bind(this));
            $('#' + this.id + ' .btn-spindleMax').click(this.maxSpeedBtnClick.bind(this));
            $('#' + this.id + ' .btn-tcStartPosition').click(this.tcStartPositionBtnClick.bind(this));
            $('#' + this.id + ' .btn-tcColletAlign').click(this.tcColletAlignBtnClick.bind(this));
            $('#' + this.id + ' .btn-tcColletDock').click(this.tcColletDockBtnClick.bind(this));
            $('#' + this.id + ' .btn-tcColletLoosen').click(this.tcColletLoosenBtnClick.bind(this));
            $('#' + this.id + ' .btn-spindleEngage').click(this.spindleEngageBtnClick.bind(this));
            $('#' + this.id + ' .btn-spindleDisengage').click(this.spindleDisengageBtnClick.bind(this)); 
            $('#' + this.id + ' .btn-colletLoosen').click(this.colletLoosenBtnClick.bind(this));
            $('#' + this.id + ' .btn-colletTighten').click(this.colletTightenBtnClick.bind(this)); 
            $('#' + this.id + ' .btn-tcUnload').click(this.tcUnloadBtnClick.bind(this)); 
        
            
        },
        /**
         * onHelloBtnClick is an example of a button click event callback
         */
          sendCtr: 0,
        spindleOnCwBtnClick: function(evt) {
            var gcode = "M3 ";
            var speed = document.getElementById('myRange').value; //the slider value is assigned to the speed variable
            gcode += "S" + speed;
            //gcode += "\nG90\n"; not needed
            var curSpeed = document.getElementById("demo2");
            // Set current speed to the last speed sent to board
                curSpeed.innerHTML = speed;
            // allows you to move slider to select new speed without forgetting what current spindle speed is
            speed.oninput = function() {
            curSpeed.innerHTML = this.value;
            };
            chilipeppr.publish("/com-chilipeppr-widget-serialport/send", gcode);       
            /*var jsonSend = {
                D: gcode,
                Id: "jog" + this.sendCtr
            };
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", jsonSend);
                 this.sendCtr++;
                 if (this.sendCtr > 999999) this.sendCtr = 0;
                 */
           // console.log("Spindle on at ----");
            chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Spindle On: Clockwise",
                "Speed set to: " + speed + " rpm",
                //+ jsonSend + this.id, 
                3000 /* show for 2 second */
            );
        },
        
            
        spindleOnCcwBtnClick: function(evt) {
            var gcode = "M4 ";
            var speed = document.getElementById('myRange').value; //the slider value is assigned to the speed variable
            gcode += "S" + speed;
            //gcode += "\nG90\n"; not needed
            var curSpeed = document.getElementById("demo2");
            // Set current speed to the last speed sent to board
                curSpeed.innerHTML = speed;
            // allows you to move slider to select new speed without forgetting what current spindle speed is
            speed.oninput = function() {
            curSpeed.innerHTML = this.value;
            };
            chilipeppr.publish("/com-chilipeppr-widget-serialport/send", gcode);       
            /*var jsonSend = {
                D: gcode,
                Id: "jog" + this.sendCtr
            };
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", jsonSend);
                 this.sendCtr++;
                 if (this.sendCtr > 999999) this.sendCtr = 0;
                 */
           // console.log("Spindle on at ----");
            chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Spindle On: Counter-Clockwise" ,
                "Speed set to: " + speed + " rpm",
                //+ jsonSend + this.id, 
                3000 /* show for 2 second */
            );
        },
            
        spindleOffBtnClick: function(evt) {
            var gcode = "M5 ";
            var speed = document.getElementById('myRange').value;
            gcode += "S" + speed;
            // set current speed to zero when off button clicked
            var curSpeed = document.getElementById("demo2"); 
                curSpeed.innerHTML = 0;
                //send Gcode to serialport
             chilipeppr.publish("/com-chilipeppr-widget-serialport/send", gcode);          
            chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Spindle Off",
                "Speed set to: 0 rpm",
                3000 /* show for 2 second */
            );
        },    
            
        minSpeedBtnClick: function(evt) {
            var slider = document.getElementById('myRange');            //find current slider element
            var minSpeed = document.getElementById('minSpeed').value;   //get new min speed from tab 3 text-input 
            minSpeed = Math.ceil(minSpeed/100)*100;                     //round speed-up to nearest 100
            var lessThanMax = slider.max;                               //find the value of current slider minimum
            if(minSpeed >= lessThanMax){
                  chilipeppr.publish(
                      
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Error: Invalid Input" ,
                "Min speed must be less than current max speed!",
                2500 )
            } else {
                slider.min = minSpeed; //set the slider's min attribute to the new speed value
                chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Speed Control Slider" ,
                "New minimum speed: " + minSpeed + " rpm",
                2500 /* show for 2 second */
            )}
            
        },
            maxSpeedBtnClick: function(evt) {
            var slider = document.getElementById('myRange');            //find current slider element
            var maxSpeed = document.getElementById('maxSpeed').value;   //get new max speed from tab 3 text-input 
            maxSpeed = Math.ceil(maxSpeed/100)*100;                     //round speed-up to nearest 100
            var greaterThanMin = slider.min;                            //find the value of current slider minimum
               if(maxSpeed <= greaterThanMin){
                  chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Error: Invalid Input" ,
                "Max speed must be greater than current min speed!",
                2500 );
            } else {
                slider.max = maxSpeed; //set the slider's max attribute to the new speed value
                chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Speed Control Slider" ,
                "New maximum speed: " + maxSpeed + " rpm",
                2500 /* show for 2 second */
            )}
        },
            tcStartPositionBtnClick: function(evt) {
            //var cmd = ["\nG53 G1 X279.2 Y16.6 F800\n", "\nG53 G1 Z-50 F500\n"]; //old position
            var cmd = ["\nG53 G1 X267.2 Y32.4 F1500\n", "\nG53 G1 Z-40 F500\n"]; //old position

            //var cmd = { "P": "/dev/ttyUSB0", "Data": [ { "D": "G53 G1 X25 Y25 F600\n", "Id": "222" }] };
           // var cmd =  {P: "/dev/ttyUSB0", D: "G1 x10 F600\n", Id: "222" };
            //var jsonSend = { "P": "/dev/ttyUSB0", "Data": [ { "D": " G53 X10 F600\n", "Id": "222" } ] };
            cmd.forEach(function(item, index, array) {
            chilipeppr.publish("/com-chilipeppr-widget-serialport/send", item);
           });
              chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "AutoToolChange" , "Moving to Tool Change Start Position" 
                  ,
                2000 /* show for 2 second */
            );
        },
            //move to point where collet just makes contact with wrench head
              tcColletAlignBtnClick: function(evt) {
            var cmd = ["\nG53 G1 Z-78 F250\n", "\nG53 G1 Z-85.5 F80\n"]; //collet should have just made contact with wrench head
            //var cmd = ["\nG53 G1 Z-81 F80\n", "\n!\n", "\n!\n", "\n!\n", "\n!\n", "\n~\n", "\nG53 G1 Z-82.2\n"]; //collet should have just made contact with wrench head

            var loosenNut = "4";     // couple feedholds to pause movement until wrench rotation stops and then start again
            var tightenNut = "5";   
           // var loosenNutBackoff = "41";
            
            cmd.forEach(function(item, index, array) {
            chilipeppr.publish("/com-chilipeppr-widget-serialport/send", item);
           });
          
           for(var i=0; i<3;  i++){
            chilipeppr.publish("/com-chilipeppr-widget-serialport/ws/send", "send /dev/ttyACM0 " + loosenNut + "\n");
           }
            chilipeppr.publish("/com-chilipeppr-widget-serialport/ws/send", "send /dev/ttyACM0 " + tightenNut + "\n");

              chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "AutoToolChange" , "Aligning Collet Nut", 2000 /* show for 2 second */
            );
        },
                //iff aligned properly move collet until full dock
        tcColletDockBtnClick: function(evt) {
            var cmd = ["\nG53 G1 Z-89.0 F50\n"]; //move to engage bottom portion of collet, leaving room for it to move down as it is loosened
            var loosenNutBackoff = "41";
            //execute loosen command ten times or until you heard the tool fall and make contact with the magnet
            //move up to z-40
            //disengage spindle shaft wrench
            //chilipeppr.publish("/com-chilipeppr-widget-serialport/ws/send", "send /dev/ttyACM0 " + loosenNutBackoff + "\n");
            cmd.forEach(function(item, index, array) {
            chilipeppr.publish("/com-chilipeppr-widget-serialport/send", item);
           });
          // var cmd2 = "4";
            //chilipeppr.publish("/com-chilipeppr-widget-serialport/ws/send", "send /dev/ttyACM0 " + cmd2 + "\n");
              chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "AutoToolChange" , "Docking Collet Nut", 2000 /* show for 2 second */
            );
        },
        
        tcColletLoosenBtnClick: function(evt) {
            var loosenNut = "4";                                                                             
            for(var i=0; i<12;  i++){
                chilipeppr.publish("/com-chilipeppr-widget-serialport/ws/send", "send /dev/ttyACM0 " + loosenNut + "\n");
            }  
     
              chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "AutoToolChange" , "looseing Collet Nut", 2000 /* show for 2 second */
            );
        },
            spindleEngageBtnClick: function(evt) {
              var cmd = "2";
             //chilipeppr.publish("/com-chilipeppr-widget-serialport/ws/send", "send /dev/ttyACM0 2\n"); 
              chilipeppr.publish("/com-chilipeppr-widget-serialport/ws/send", "send /dev/ttyACM0 " + cmd + "\n"); //syntax for sending to specifc port
              chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Spindle Control" , "cmd " + cmd,
                   ": Engaging Spindle",
                2000 /* show for 2 second */
            );
        },
        
           spindleDisengageBtnClick: function(evt) {
            var cmd = "3";
             chilipeppr.publish("/com-chilipeppr-widget-serialport/ws/send", "send /dev/ttyACM0 " + cmd + "\n");
              chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Spindle Control" , "cmd " + cmd 
                  + cmd + ": Disengaging Spindle",
                2000 /* show for 2 second */
            );
        },
        
        colletLoosenBtnClick: function(evt) {
            var cmd = "4";
            chilipeppr.publish("/com-chilipeppr-widget-serialport/ws/send", "send /dev/ttyACM0 " + cmd + "\n");
              chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Spindle Control" , "cmd " 
                  + cmd + ": Loosening collet",
                2000 /* show for 2 second */
            );
        },
        
        colletTightenBtnClick: function(evt) {
            var cmd = "5";
            chilipeppr.publish("/com-chilipeppr-widget-serialport/ws/send", "send /dev/ttyACM0 " + cmd + "\n");
              chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Spindle Control" , "cmd " 
                  + cmd + ": Tightening collet",
                2000 /* show for 2 second */
            );
        },
  
        /*
        //added below
        sendCtr: 0,
        sendMove: function (touchid, prevpos, newpos) {
            var gcode = "G91 G0 X1";
            gcode += "\nG90\n";
            //chilipeppr.publish("/com-chilipeppr-widget-serialport/send", gcode);          
            var jsonSend = {
                D: gcode,
                Id: "jog" + this.sendCtr
            };
            chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", jsonSend);
            this.sendCtr++;
            if (this.sendCtr > 999999) this.sendCtr = 0;
        },
        //added above
        
        /**
         * User options are available in this property for reference by your
         * methods. If any change is made on these options, please call
         * saveOptionsLocalStorage()
         */
        options: null,
        /**
         * Call this method on init to setup the UI by reading the user's
         * stored settings from localStorage and then adjust the UI to reflect
         * what the user wants.
         */
        setupUiFromLocalStorage: function() {

            // Read vals from localStorage. Make sure to use a unique
            // key specific to this widget so as not to overwrite other
            // widgets' options. By using this.id as the prefix of the
            // key we're safe that this will be unique.

            // Feel free to add your own keys inside the options 
            // object for your own items

            var options = localStorage.getItem(this.id + '-options');

            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            }
            else {
                options = {
                    showBody: true,
                    tabShowing: 1,
                    customParam1: null,
                    customParam2: 1.0
                };
            }

            this.options = options;
            console.log("options:", options);

            // show/hide body
            if (options.showBody) {
                this.showBody();
            }
            else {
                this.hideBody();
            }

        },
        /**
         * When a user changes a value that is stored as an option setting, you
         * should call this method immediately so that on next load the value
         * is correctly set.
         */
        saveOptionsLocalStorage: function() {
            // You can add your own values to this.options to store them
            // along with some of the normal stuff like showBody
            var options = this.options;

            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem(this.id + '-options', optionsStr);
        },
        /**
         * Show the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        showBody: function(evt) {
            $('#' + this.id + ' .panel-body').removeClass('hidden');
            $('#' + this.id + ' .panel-footer').removeClass('hidden');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = true;
                this.saveOptionsLocalStorage();
            }
            // this will send an artificial event letting other widgets know to resize
            // themselves since this widget is now taking up more room since it's showing
            $(window).trigger("resize");
        },
        /**
         * Hide the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        hideBody: function(evt) {
            $('#' + this.id + ' .panel-body').addClass('hidden');
            $('#' + this.id + ' .panel-footer').addClass('hidden');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = false;
                this.saveOptionsLocalStorage();
            }
            // this will send an artificial event letting other widgets know to resize
            // themselves since this widget is now taking up less room since it's hiding
            $(window).trigger("resize");
        },
        /**
         * This method loads the pubsubviewer widget which attaches to our 
         * upper right corner triangle menu and generates 3 menu items like
         * Pubsub Viewer, View Standalone, and Fork Widget. It also enables
         * the modal dialog that shows the documentation for this widget.
         * 
         * By using chilipeppr.load() we can ensure that the pubsubviewer widget
         * is only loaded and inlined once into the final ChiliPeppr workspace.
         * We are given back a reference to the instantiated singleton so its
         * not instantiated more than once. Then we call it's attachTo method
         * which creates the full pulldown menu for us and attaches the click
         * events.
         */
        forkSetup: function() {
            var topCssSelector = '#' + this.id;

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            var that = this;
            chilipeppr.load("http://raw.githubusercontent.com/chilipeppr/widget-pubsubviewer/master/auto-generated-widget.html", function() {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown-menu'), that);
                });
            });

        },
        
        
            

    };
    
    
});

           