$(function () {
    $('.col-check').hide();
    $('#btn-admin').on('click', function () {
        if ($("#toolbar-admin").is(":visible")) {
            $("#toolbar-admin").hide();
            $(".col-check").hide();
        }
        else {
            $("#toolbar-admin").show();
            $(".col-check").show();
        }
    });

    $('#btn-online').on('click', function () {
        $('table tr').filter(':has(:checkbox:checked)').find('td').parent().removeClass().addClass('success');
        $('table tr').filter(':has(:checkbox:checked)').find('td.status').text('online');
    });
    $('#btn-offline').on('click', function () {
        $('table tr').filter(':has(:checkbox:checked)').find('td').parent().removeClass().addClass('warning');
        $('table tr').filter(':has(:checkbox:checked)').find('td.status').text('offline');
    });
    $('#btn-out-of-order').on('click', function () {
        $('table tr').filter(':has(:checkbox:checked)').find('td').parent().removeClass().addClass('danger');
        $('table tr').filter(':has(:checkbox:checked)').find('td.status').text('out of order');
    });

});

$(document).ready(function () {
    getServers('id');
});

var html = '<tr class="STATUS">' +
    '<td class="col-check"><input type="checkbox" class="form-check-input"/></td>' +
    '<td>HOSTNAME</td>' +
    '<td>IP</td>' +
    '<td>MAC</td>' +
    '<td class="status">ONLINE</td>' +
    '<td>DESCRIPTION</td>' +
    '</tr>';

function getServers(column) {
    $.get("SqlInjectionMitigations/servers?column=" + column, function (result, status) {
        $("#servers").empty();
        for (var i = 0; i < result.length; i++) {
            var server = html.replace('ID', result[i].id);
            var status = "success";
            if (result[i].status === 'offline') {
                status = "danger";
            }
            server = server.replace('ONLINE', status);
            server = server.replace('STATUS', status);
            server = server.replace('HOSTNAME', result[i].hostname);
            server = server.replace('IP', result[i].ip);
            server = server.replace('MAC', result[i].mac);
            server = server.replace('DESCRIPTION', result[i].description);
            $("#servers").append(server);
        }

    });
}


//----------------------------------------------


  // "config" object contains default widget configuration
    // with any custom overrides defined in your admin settings.
    var config = oooUtil.getSignInWidgetConfig();
        config.i18n.en = {'oie.verification.switch.authenticator': ' ',
                    'primaryauth.username.placeholder': 'Username',
                    //'oform.errorbanner.title': 'It appears this email address is already registered with the the Official mmm App application, please use the same email to sign-in.',
                    'registration.signup.label': '<span style="font-size: 16px; font-weight: bold;">Don\'t have an account?</span>'
                    }
    config.i18n.en["help"] = " "; //Disable Help button
    config.i18n.en["unlockaccount"] = " ";
        //config.features.autoFocus[true]; // Enable autofocus
    config.features = {
        'hideSignOutLinkInMFA': 'false',
        'autoFocus': 'true'
    }
        
// Render the ooo Sign-In Widge
var oooSignIn = new oooSignIn(config);
oooSignIn.renderEl({ el: '#ooo-login-container' },
    oooUtil.completeLogin,
    function(error) {
        // Logs errors that occur when configuring the widget.
        // Remove or replace this with your own custom error handler.
        console.log(error.message, error);
    }
);

//Custom begin for sign in trigger
    var parEnrollErroMsg1 = "Security method setup incomplete. Please check your email to finalize your setup.";
    var parEnrollErroMsg2 ="It appears this email address is already registered, please use the same email to sign-in."
    const parEnrollAuthErroMsg1 = "Unable to sign in";
    const parEnrollAuthErroMsg2 = "Authenticator enrollment is not allowed at this time. Please contact support for assistance.";
    const parEnrollAuthErroMsg3 = "We found some errors. Please review the form and make corrections.";

   function invokeWF() {
        //alert("Inside invokeWF")
        console.log("Inside invokeWF");
        var xhttp = new XMLHttpRequest();
        var elemform = document.forms[0];

 xhttp.onreadystatechange=function() {
            if (this.readyState == 4 && this.status == 200) {
                //alert("WF Respose = " + this.responseText);
                const wfJsonRes = JSON.parse(this.responseText); 
                //alert(wfJsonRes.ResponseCode);
                console.log(wfJsonRes.ResponseCode);
                if((wfJsonRes.ResponseCode == "SOCIAL_USER")|| (wfJsonRes.ResponseCode == "ooo_STAGED_USER") 
                    || (wfJsonRes.ResponseCode == "ooo_PROVISIONED_USER")) {
                    //if(wfJsonRes.ResponseCode == "SOCIAL_USER") {
                        var wfRespose = document.createElement("p");
                        wfRespose.id = "wfRes";
                        elemform.appendChild(wfRespose);
                        var objWfRes = document.getElementById("wfRes");
                        //var errorMsg = "Please check your email to activate your account for this app.\n" + this.responseText; //Add custom message here
                        var errorMsg = "Security method setup incomplete. Please check your email to finalize your setup ."; //Add custom message here
                        //var errorMsg = parEnrollErroMsg1; //Add custom message here
                        var btnEle = document.querySelector('button[type="submit"]');
                        //alert(btnEle)
                        console.log(btnEle);
                        if(btnEle != null) {
                            console.log(btnEle.innerHTML);
                            if(btnEle.innerHTML == "Next") {
                                //btnEle.style = "background-color: rgb(190,190,190) !important;color: black !important;";
                                btnEle.innerHTML = "Wait...";
                                //btnEle.disabled = true;
                                btnEle.style = "display: none"; 
                            }
                        } 

                                               for (var errMsgEle of document.getElementsByClassName('MuiBox-root')) {
                            //if(errMsgEle.textContent == "Unable to sign in") {
                            if(errMsgEle.textContent == parEnrollErroMsg1) {
                                var divErrorBlockEle = document.querySelector('div[data-se="infobox-error"]');
                                console.log(divErrorBlockEle);
                                divErrorBlockEle.style = "display: block";
                                console.log(errMsgEle);
                                console.log(errMsgEle.textContent);
                                errMsgEle.textContent = errorMsg;
                                //errMsgEle.style = "display: none";
                                break;
                            }
                        }
                    //alert(objWfRes.innerHTML);
                } 
            }
        };
          const objUsername = document.getElementById("identifier");
        var username;
        if(objUsername != null) {
            var username = objUsername.value;
        } else {
            var userEle = document.querySelector('div[data-se="identifier-container"]');
            console.log(userEle);
            console.log(userEle.title);
            username = userEle.title;
        }
         console.log("Username = " + username);
        var qparams = "&username=" + username + "&groupname=" + "EPA Dev Users"; //hardcoded to EPA Users group(in ooo)
        var wfInvokeUrl = "https://nymmm-dev.workflows.ooopreview.com/api/flo/0987654321/invoke?clientToken=123456789" + qparams;
        console.log("wfInvokeUrl = " + wfInvokeUrl);
        xhttp.open("GET", wfInvokeUrl, true);
        xhttp.send();
    }
    oooSignIn.on('afterRender', function (context) { 
        console.log("Inside: oooSignIn : afterRender");
        //alert("context.controller = " + context.controller); 
        console.log("context.controller = " + context.controller); 
        if (context.controller == 'primary-auth') { 
            /*
            var btnEle = document.querySelector('button[type="submit"]');
            //alert(btnEle.innerHTML);
            console.log(btnEle);
            console.log(btnEle.innerHTML); 
            
            if((btnEle.innerHTML == "Next") || (btnEle.innerHTML == "Sign Up")) { 
                console.log(btnEle.innerHTML); 
                btnEle.onclick = function triggerWF() { 
                    // Invoke workflow action 
                    console.log("About to Invoke Workflow"); 
                    invokeWF();
                }; 
            } 
            */
            return; 
        } 
    }); 

    oooSignIn.on('afterError', function (context, error) {
        console.log("Inside: oooSignIn : afterError");
        console.log(error);
        console.log(error.errorSummary);
        console.log(context.controller);

        if ((context.controller == null) || (context.controller == 'registration')) {
            if((error.errorSummary != null) && (error.errorSummary == "")) {
                waitForElm('div[role="alert"]').then((elm) => {
                    console.log('Element is ready');
                    console.log(elm.textContent);
                    var divErrorBlockEle = document.querySelector('div[data-se="infobox-error"]');
                    console.log(divErrorBlockEle);
                    //divErrorBlockEle.style = "display: none"; 
                    for (var errMsgEle of document.getElementsByClassName('MuiBox-root')) {
                        //console.log(errMsgEle);
                        if( (errMsgEle != null) && (errMsgEle.textContent == parEnrollAuthErroMsg3)) {
                            console.log("This is same session controller switch. Sign up to Sign in");
                            console.log(errMsgEle);
                            console.log(errMsgEle.textContent);
                            errMsgEle.textContent = parEnrollErroMsg2;
                            //errMsgEle.style = "display: none";
                            break;
                        }
                    }
                });
            }
        }

        if ((context.controller == null) || (context.controller == 'primary-auth')) {
            if((error.errorSummary != null) && (error.errorSummary == parEnrollAuthErroMsg1) || (error.errorSummary == parEnrollAuthErroMsg2)) {
                console.log("oooSignIn : afterError: primary-auth : Hide the error block");
                waitForElm('div[data-se="infobox-error"]').then((elm) => {
                    console.log('Element is ready');
                    console.log(elm.textContent);
                    var divErrorBlockEle = document.querySelector('div[data-se="infobox-error"]');
                    console.log(divErrorBlockEle);
                    //divErrorBlockEle.style = "display: none"; 
                    for (var errMsgEle of document.getElementsByClassName('MuiBox-root')) {
                        //console.log(errMsgEle);
                        if( (errMsgEle != null) && ((errMsgEle.textContent == parEnrollAuthErroMsg1) || (errMsgEle.textContent == parEnrollAuthErroMsg2))) {
                            //if((errMsgEle != null) && (errMsgEle.textContent == parEnrollAuthErroMsg2)) {
                                console.log("Inside: oooSignIn : afterError : About to Invoke Workflow from "); 
                                invokeWF();
                            //}

                            console.log(errMsgEle);
                            console.log(errMsgEle.textContent);
                            errMsgEle.textContent = parEnrollErroMsg1;

                            //errMsgEle.style = "display: none";
                            break;
                        }
                    }
                    

                    var btnSubmitEle = document.querySelector('button[type="submit"]');
                    console.log(btnSubmitEle);
                    if(btnSubmitEle != null) {
                        console.log(btnSubmitEle.textContent);
                        if(btnSubmitEle.textContent == "Next") { 
                            console.log("Ready to change text on Submit button.");
                            //btnSubmitEle.textContent = "Wait...";
                            btnSubmitEle.style = "display: none"; 
                            console.log(btnSubmitEle.textContent);
                            btnEle.disabled = true;
                        }
                    }
                });
            }
        }
    });

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

