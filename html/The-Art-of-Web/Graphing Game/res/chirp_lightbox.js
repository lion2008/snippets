var mod_pagespeed_VhbgGels_h = "function LightBox(){var e,t,n,i=[],l=new Image,d=document.createElement(\"DIV\");d.id=\"lightbox_viewer\",d.appendChild(function(e){var t=document.createDocumentFragment(),n=document.createElement(\"DIV\");for(n.innerHTML=e;n.firstChild;)t.appendChild(n.firstChild);return t}('<div id=\"lightbox_image_container\"><img id=\"lightbox_image\"><div id=\"lightbox_loading\"></div><a id=\"lightbox_prev\"></a><a id=\"lightbox_next\"></a></div><div id=\"lightbox_details\"><a id=\"lightbox_close\" href=\"#\">Close</a><span id=\"lightbox_caption\"></span><span id=\"lightbox_counter\"></span></div>')),document.body.appendChild(d);var o,a=document.getElementById(\"lightbox_image\"),s=document.getElementById(\"lightbox_loading\"),r=document.getElementById(\"lightbox_prev\"),c=document.getElementById(\"lightbox_next\"),g=document.getElementById(\"lightbox_details\"),h=document.getElementById(\"lightbox_close\"),u=document.getElementById(\"lightbox_caption\"),x=document.getElementById(\"lightbox_counter\"),y=function(){e.style.display=\"none\",d.style.display=\"none\",document.removeEventListener(\"keydown\",m,!1),a.src=l.src=\"\"},m=function(e){e||(e=window.event),27==e.keyCode&&y(),37==e.keyCode&&t&&f(t),39==e.keyCode&&n&&f(n)},f=function(e){(l.src=e.src,l.complete?a.src=l.src:(g.style.maxHeight=0,u.style.display=\"none\",s.style.display=\"block\"),u.innerHTML=e.title,x.innerHTML=e.gallery&&i[e.gallery].length>1?\"Image \"+(e.index+1)+\" of \"+i[e.gallery].length:\"\",t=n=!1,e.gallery&&i[e.gallery].length>1)?(t=e.index>0?i[e.gallery][e.index-1]:i[e.gallery][i[e.gallery].length-1],n=e.index<i[e.gallery].length-1?i[e.gallery][e.index+1]:i[e.gallery][0],(new Image).src=n.src,r.className=\"\",c.className=\"\"):(r.className=\"nohover\",c.className=\"nohover\")};l.addEventListener(\"load\",function(){s.style.display=\"none\",d.style.width=\"auto\",a.style.maxHeight=\"none\",a.src=l.src,g.style.maxHeight=\"100px\",u.style.display=\"inline\",d.style.cssText+=\"top: \"+(window.innerHeight-d.offsetHeight)/2+\"px;\",d.style.cssText+=\"width: \"+a.width+\"px;\",d.style.cssText+=\"margin-left: \"+-d.offsetWidth/2+\"px;\";var e=g.offsetHeight;0==e&&(e=40),a.style.maxHeight=d.offsetHeight-e-24+\"px\"},!1),r.addEventListener(\"click\",function(e){t&&f(t),e.preventDefault()},!1),c.addEventListener(\"click\",function(e){n&&f(n),e.preventDefault()},!1);var v=function(e){o=e.changedTouches[0].pageX},p=function(e){var i=e.changedTouches[0].pageX-o,l=a.width/3;i>l?f(t):i<-l&&f(n)};r.addEventListener(\"touchstart\",v,!1),r.addEventListener(\"touchend\",p,!1),c.addEventListener(\"touchstart\",v,!1),c.addEventListener(\"touchend\",p,!1),h.addEventListener(\"click\",function(e){y(),e.preventDefault()},!1),this.flush=function(){i=[]},this.init=function(){for(var t=document.getElementsByTagName(\"A\"),n=0;n<t.length;n++)if(\"true\"!=t[n].getAttribute(\"data-lightbox-enabled\")){var l;if(t[n].hasAttribute(\"data-lightbox\"))l=t[n].getAttribute(\"data-lightbox\")||!1;else{var o=t[n].getAttribute(\"rel\");if(!o)continue;var a=o.match(/^lightbox(?:\\[(.*)\\])?/);if(!a)continue;l=a[1]||!1}l?(i[l]||(i[l]=[]),index=i[l].push({src:t[n].href,title:t[n].title,index:i[l].length,gallery:l})-1):(index=n,i[n]={src:t[n].href,title:t[n].title,index:!1,gallery:!1}),function(n,l,o){t[n].addEventListener(\"click\",function(t){f(l?i[l][o]:i[o]),void 0===e?((e=document.createElement(\"DIV\")).id=\"lightbox_overlay\",document.body.insertBefore(e,d),e.addEventListener(\"click\",y,!1)):e.style.display=\"block\",d.style.cssText=\"max-width: \"+.8*e.offsetWidth+\"px;\",d.style.cssText+=\"max-height: \"+.8*e.offsetHeight+\"px;\",d.style.cssText+=\"margin-left: \"+-d.offsetWidth/2+\"px;\",d.style.display=\"block\",d.scrollIntoView(!0),document.addEventListener(\"keydown\",m,!1),t.preventDefault()},!1),t[n].setAttribute(\"data-lightbox-enabled\",\"true\")}(n,l,index)}}}var lightbox=new LightBox;document.addEventListener(\"DOMContentLoaded\",function(){lightbox.init()},!1);";
var mod_pagespeed_pRKjWkw7ND = "function Suggestor(inputId,outputId,AjaxTarget,properties){this.timeoutInterval=10000;var input=document.getElementById(inputId);var output=document.getElementById(outputId);if(!input||!output){return false;}input.addEventListener(\"keyup\",this,false);output.addEventListener(\"keydown\",this,false);output.addEventListener(\"keyup\",this,false);var AjaxTarget=AjaxTarget;var regex=(properties&&properties.regex)?properties.regex:false;var delay=(properties&&properties.delay)?parseInt(properties.delay):250;var suggestIdx=0;var searchTimer;this.extraParams={};this.setParam=function(key,val){this.extraParams[key]=val;};this.clearParam=function(key){delete this.extraParams[key];};this.setTimeoutInterval=function(seconds){this.timeoutInterval=seconds*1000;};this.hide=function(setfocus){if(this.hideOutputTimer){window.clearTimeout(this.hideOutputTimer);}if(setfocus!==false){input.focus();}output.style.display=\"none\";};this.setvalue=function(newVal,submitForm){input.value=newVal;this.hide();if(submitForm===true){var event;if(typeof(Event)===\"function\"){event=new Event(\"submit\",{cancelable:true});}else{event=document.createEvent('Event');event.initEvent('submit',false,true);}if(input.form.dispatchEvent(event)){input.form.submit();}}};this.lookup=function(inputValue){if(!inputValue){this.hide();}if(regex!==false&&!inputValue.match(regex)){return false;}var params=[];params.q=inputValue;if(this.extraParams){for(var x in this.extraParams){params[x]=this.extraParams[x];}}if(typeof AjaxRequestXML==\"undefined\"){var script=document.createElement(\"script\");script.onload=function(){(new AjaxRequestXML()).get(AjaxTarget,params,this.setHideOutputTimer);};script.src=\"\/scripts/AjaxRequestXML.js\";document.head.appendChild(script);return true;}else{return(new AjaxRequestXML()).get(AjaxTarget,params,this.setHideOutputTimer);}};this.setHideOutputTimer=function(){if(this.hideOutputTimer){window.clearTimeout(this.hideOutputTimer);}if(this.timeoutInterval>0){this.hideOutputTimer=window.setTimeout(function(_this){_this.hide(false);},this.timeoutInterval,this);}}.bind(this);this.inputkeyup=function(e){var suggestArray;switch(e.keyCode){case 9:case 13:case 27:this.hide();return false;case 38:suggestArray=output.getElementsByTagName(\"a\");suggestIdx=suggestArray.length-1;suggestArray[suggestIdx].focus();this.setHideOutputTimer();return false;case 40:suggestArray=output.getElementsByTagName(\"a\");suggestIdx=0;suggestArray[suggestIdx].focus();this.setHideOutputTimer();return false;default:if(searchTimer){window.clearTimeout(searchTimer);this.setHideOutputTimer();}searchTimer=window.setTimeout(function(_this,_val){_this.lookup(_val);},delay,this,input.value);return true;}};this.outputkeydown=function(e){switch(e.keyCode){case 9:case 38:case 40:e.preventDefault();return false;}return true;};this.outputkeyup=function(e){switch(e.keyCode){case 27:this.hide();return false;case 38:suggestIdx--;this.setHideOutputTimer();break;case 40:suggestIdx++;this.setHideOutputTimer();break;}var suggestArray=output.getElementsByTagName(\"a\");if(suggestIdx<0){input.focus();}else if(suggestIdx>=suggestArray.length){suggestIdx=suggestArray.length-1;}else{suggestArray[suggestIdx].focus();}return false;};this.handleEvent=function(e){if(e.target===input&&e.type==\"keyup\"){return this.inputkeyup(e);}else{switch(e.type){case\"keydown\":return this.outputkeydown(e);case\"keyup\":return this.outputkeyup(e);}}};}(function(targetId,headingTag){var target=document.getElementById(targetId);var headings=document.getElementsByTagName(headingTag||\"h2\");if(headings.length>1){var menuList=document.createElement(\"OL\");var menuLink=document.createElement(\"A\");menuLink.setAttribute(\"href\",\"#\");menuLink.appendChild(document.createTextNode(\"\\u2630 Submenu\"));var listItem=document.createElement(\"LI\");listItem.id=\"submenu_trigger\";listItem.className=\"mobileonly\";listItem.appendChild(menuLink);menuList.appendChild(listItem);for(var i=0;i<headings.length;i++){var anchorName=\"\";if(headings[i].id){anchorName=headings[i].id;}else{anchorName=\"section_\"+i;headings[i].setAttribute(\"id\",anchorName);}var headingText=headings[i].firstChild.nodeValue\nheadings[i].firstChild.nodeValue=(i+1)+\". \"+headingText;var menuLink=document.createElement(\"A\");menuLink.setAttribute(\"href\",\"#\"+anchorName);menuLink.appendChild(document.createTextNode(headingText));var listItem=document.createElement(\"LI\");listItem.appendChild(menuLink);menuList.appendChild(listItem);(function(idx){menuLink.addEventListener(\"click\",function(e){headings[idx].scrollIntoView(true);e.preventDefault();},false);})(i);}while(target.hasChildNodes())target.removeChild(target.firstChild);target.appendChild(menuList);}else{target.parentNode.removeChild(target);}})(\"submenu\");var openModalWindow=function(el){var overlay=document.createElement(\"div\");overlay.style.cssText=\"position: absolute; top: 0; z-index: 1000; width: 100%; height: 100%; background: #000; opacity: 0.71; filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=70);\";document.body.appendChild(overlay);var container=document.getElementById(el);container.style.cssText=\"display: block; z-index: 1010; position: fixed; left: 50%; top: 50%; max-width: \"+(0.8*overlay.offsetWidth)+\"px; max-height: \"+(0.8*overlay.offsetHeight)+\"px; overflow: auto; box-shadow: 0 0 50px rgba(0,0,0,0.5);\";var overflow=container.offsetHeight-document.documentElement.clientHeight;if(overflow>0){container.style.maxHeight=(parseInt(window.getComputedStyle(container).height)-overflow)+\"px\";}container.style.marginLeft=(-container.offsetWidth/2)+\"px\";container.style.marginTop=(-container.offsetHeight/2)+\"px\";var closeModal=function(){document.body.removeChild(overlay);container.style.display=\"none\";document.removeEventListener(\"keydown\",overlayEscape,false);};var overlayEscape=function(e){if(e.keyCode==27)closeModal();}\noverlay.addEventListener(\"click\",closeModal,false);document.addEventListener(\"keydown\",overlayEscape,false);};window.addEventListener(\"DOMContentLoaded\",function(e){var arr=document.getElementsByClassName(\"show_feedback\");for(var i=0;i<arr.length;i++){arr[i].addEventListener(\"click\",function(){openModalWindow(\"feedback\");document.getElementById(\"field_name\").focus();},false);}var nameValidityMsg=\"Please enter your Name\";var emailValidityMsg=\"Please enter a valid Email address\";var websiteValidityMsg=\"Please enter a website URL starting with http://\";var messageValidityMsg=\"Please enter your comment or question\";var captchaValidityMsg=\"Please enter the five CAPTCHA digits (0-9) in the box provided\";if(document.getElementById(\"feedback_form\")){var checkFeedbackForm=function(e){if(this.name.value==\"\"){alert(nameValidityMsg);this.name.focus();e.preventDefault();}else if(this.email.value==\"\"){alert(emailValidityMsg);this.email.focus();e.preventDefault();}else if(this.message.value==\"\"){alert(messageValidityMsg);this.message.focus();e.preventDefault();}else if(!this.captcha.value.match(/^\\d{5}$/)){alert(captchaValidityMsg);this.captcha.focus();e.preventDefault();}};var feedbackForm=document.getElementById(\"feedback_form\");feedbackForm.addEventListener(\"submit\",checkFeedbackForm,false);var supports_input_validity=function(){var i=document.createElement(\"input\");return\"setCustomValidity\"in i;}\nif(supports_input_validity()){var fldName=feedbackForm.elements[\"name\"];fldName.setCustomValidity(nameValidityMsg);fldName.addEventListener(\"keyup\",function(){this.setCustomValidity(this.validity.valueMissing?nameValidityMsg:\"\");},false);var fldEmail=feedbackForm.elements[\"email\"];fldEmail.setCustomValidity(emailValidityMsg);fldEmail.addEventListener(\"keyup\",function(){this.setCustomValidity((this.validity.valueMissing||this.validity.typeMismatch)?emailValidityMsg:\"\");},false);var fldWebsite=feedbackForm.elements[\"website\"];fldWebsite.addEventListener(\"keyup\",function(){this.setCustomValidity((this.validity.typeMismatch||this.validity.patternMismatch)?websiteValidityMsg:\"\");},false);var fldMessage=feedbackForm.elements[\"message\"];fldMessage.setCustomValidity(messageValidityMsg);fldMessage.addEventListener(\"keyup\",function(){this.setCustomValidity(this.validity.valueMissing?messageValidityMsg:\"\");},false);var fldCaptcha=feedbackForm.elements[\"captcha_code\"];fldCaptcha.setCustomValidity(captchaValidityMsg);fldCaptcha.addEventListener(\"keyup\",function(e){this.value=this.value.replace(/[^\\d]+/g,\"\");this.setCustomValidity((this.validity.valueMissing||this.validity.patternMismatch)?captchaValidityMsg:\"\");},false);}}},false);function Hilitor(id,tag){var targetNode=document.getElementById(id)||document.body;var hiliteTag=tag||\"MARK\";var skipTags=new RegExp(\"^(?:\"+hiliteTag+\"|SCRIPT|FORM|SPAN)$\");var colors=[\"#ff6\",\"#a0ffff\",\"#9f9\",\"#f99\",\"#f6f\"];var wordColor=[];var colorIdx=0;var matchRegExp=\"\";var openLeft=false;var openRight=false;var endRegExp=new RegExp('^[^\\\\w]+|[^\\\\w]+$',\"g\");var breakRegExp=new RegExp('[^\\\\w\\'-]+',\"g\");this.setEndRegExp=function(regex){endRegExp=regex;return endRegExp;};this.setBreakRegExp=function(regex){breakRegExp=regex;return breakRegExp;};this.setMatchType=function(type){switch(type){case\"left\":this.openLeft=false;this.openRight=true;break;case\"right\":this.openLeft=true;this.openRight=false;break;case\"open\":this.openLeft=this.openRight=true;break;default:this.openLeft=this.openRight=false;}};this.setRegex=function(input){input=input.replace(endRegExp,\"\");input=input.replace(breakRegExp,\"|\");input=input.replace(/^\\||\\|$/g,\"\");if(input){var re=\"(\"+input+\")\";if(!this.openLeft){re=\"\\\\b\"+re;}if(!this.openRight){re=re+\"\\\\b\";}matchRegExp=new RegExp(re,\"i\");return matchRegExp;}return false;};this.getRegex=function(){var retval=matchRegExp.toString();retval=retval.replace(/(^\\/(\\\\b)?|\\(|\\)|(\\\\b)?\\/i$)/g,\"\");retval=retval.replace(/\\|/g,\" \");return retval;};this.hiliteWords=function(node){if(node===undefined||!node)return;if(!matchRegExp)return;if(skipTags.test(node.nodeName))return;if(node.hasChildNodes()){for(var i=0;i<node.childNodes.length;i++)this.hiliteWords(node.childNodes[i]);}if(node.nodeType==3){if((nv=node.nodeValue)&&(regs=matchRegExp.exec(nv))){if(!wordColor[regs[0].toLowerCase()]){wordColor[regs[0].toLowerCase()]=colors[colorIdx++%colors.length];}var match=document.createElement(hiliteTag);match.appendChild(document.createTextNode(regs[0]));match.style.backgroundColor=wordColor[regs[0].toLowerCase()];match.style.color=\"#000\";var after=node.splitText(regs.index);after.nodeValue=after.nodeValue.substring(regs[0].length);node.parentNode.insertBefore(match,after);}};};this.remove=function(){var arr=document.getElementsByTagName(hiliteTag);while(arr.length&&(el=arr[0])){var parent=el.parentNode;parent.replaceChild(el.firstChild,el);parent.normalize();}};this.apply=function(input){this.remove();if(input===undefined||!(input=input.replace(/(^\\s+|\\s+$)/g,\"\"))){return;}if(this.setRegex(input)){this.hiliteWords(targetNode);}return matchRegExp;};}(function(){var menuTrigger=document.getElementById(\"menu_trigger\");var menuNode=document.getElementById(\"menu\");var showHideMenu=function(e){if(menuNode.className==\"active\"){menuNode.className=\"\";}else{menuNode.className=\"active\";}e.preventDefault();};menuTrigger.addEventListener(\"click\",showHideMenu,false);var hideMenu=function(e){menuNode.className=\"menu\";};document.addEventListener(\"click\",hideMenu,false);var cancelBubble=function(e){e.stopPropagation();};menuTrigger.addEventListener(\"click\",cancelBubble,false);menuNode.addEventListener(\"click\",cancelBubble,false);})();(function(){var menuNode;var menuTrigger=document.getElementById(\"submenu_trigger\");var menuContainer=document.getElementById(\"submenu\");if(!menuContainer)return;if(menuContainer.getElementsByTagName(\"OL\")){menuNode=menuContainer.getElementsByTagName(\"OL\")[0];}else{return;}var showHideMenu=function(e){if(menuContainer.className==\"active\"){menuContainer.className=\"\";}else{menuContainer.className=\"active\";}e.preventDefault();};menuTrigger.addEventListener(\"click\",showHideMenu,false);var hideMenu=function(e){menuContainer.className=\"\";};document.addEventListener(\"click\",hideMenu,false);var cancelBubble=function(e){e.stopPropagation();};menuNode.addEventListener(\"click\",cancelBubble,false);})();";