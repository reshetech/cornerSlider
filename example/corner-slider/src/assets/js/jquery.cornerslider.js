(function ($, document, window) {   
$.fn.cornerSlider = function( options ) {

    var settings = $.extend({
        showAtScrollingHeight : 1300,
        elemToPresent         : "#presentSlider",
        directionEffect       : "right",
        bottom                : 6,
        right                 : 6,
        left                  : 6,
        top                   : 6,
        speedEffect           : 300,
        cookieMinutesToExpiry : 15,
		
		// callback functions that the user can use.
		onShow  : function(){},
		onHide  : function(){},
		onClose : function(){},
    }, options);

    
    /**
     * The 'cornerSliderHide' element
     * holds the html
     */
    var cornerSliderElem      = $(this),
        cornerSliderElemWidth = cornerSliderElem.outerWidth(),
        cornerSliderElemHeight= cornerSliderElem.outerHeight(),
        direction             = "right";
        
    
    /**
     * The 'cornerSliderHide' cookie is generated 
     * when a user chooses to close the slider 
     */
    var cookieName  = 'cornerSliderHide',
        cookieValue = 'hidden';

        
    /**
     * @desc  set any cookie with javascript
     * @param string name    - the cookie name
     * @param string value   - the cookie value
     * @param string minutes - the number of minutes to expiry
     */    
    function setCookie(name,value,minutes) {
        var expires,
            minutes = parseInt(minutes);
       
        if (minutes && minutes>0) {
            var date = new Date();
            date.setTime(date.getTime() + (minutes * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
        }
        else 
        {
            expires = '';
        }
        document.cookie = name + '=' + value + expires + '; path=/';
    }


    /**
     * @desc  check whether a cookie exists
     * @param  string cName - the cookie name
     * @return bool         - whether the cookie exists 
     */    
    function isValidCookie(cName) {
        var cStart,cEnd,cookieVal;
       
        if(document.cookie.length < 1) return false;
        
        cStart = document.cookie.indexOf(cName + '=');  
       
        if (cStart < 0)  return false;   

        cStart = cStart + cName.length + 1;
        
        cEnd = document.cookie.indexOf(';', cStart);
        
        if (cEnd == -1) cEnd = document.cookie.length;
           
        cookieVal = unescape(document.cookie.substring(cStart,cEnd));

        return(cookieVal.length>0);
    } 


    /**
     * @desc  checks whether to show the element
     * @param  obj  string - the cookie name
     * @return bool        - whether to show the element
     */
    function isAllowedCornerSlider(cookieName) {
		
        if(isValidCookie(cookieName)) return false;

        return true;
    }
    

    /**
     * @desc  display the element
     * @param obj elem - the 'cornerSliderHide' object 
     */ 
    function cornerSliderAppear(elem)  {
        elem.removeClass('hidden').addClass('shown').stop();
    
        if(settings.directionEffect=='right')
        {
            elem.animate({'right' : settings.right},settings.speedEffect,function (){});
        }
        else if(direction == 'bottom')
        {
            elem.animate({'bottom' : settings.bottom},settings.speedEffect,function (){});
        }  
        else
        {
            elem.animate({'left' : settings.left},settings.speedEffect,function (){});
        }
		
		// Callback
		settings.onShow.call(elem);
    }
    
    
    /**
     * @desc  hide the element
     * @param obj  elem     - the 'cornerSliderHide' object
     * @param int  width    - the element width
     * @param bool addClass - whether to add the class name hide to the element
     */
    function cornerSliderDisAppear(elem,width,close) {
        elem.stop();
    
        if(settings.directionEffect=='right')
        {
            elem.animate({'right' : -width},settings.speedEffect,function (){
                elem.removeClass('shown').addClass('hidden');
            });
        }
        else if(direction=='bottom')
        {
            height = cornerSliderElemHeight;
            
            elem.animate({'bottom' : -height},settings.speedEffect,function (){
                elem.removeClass('shown').addClass('hidden');
            });
        }
        else
        {
            elem.animate({'left' : -width},settings.speedEffect,function (){
                elem.removeClass('shown').addClass('hidden');
            });
        }
		
		// Callback
		if(close){
		    settings.onClose.call(elem);
		}else{
		    settings.onHide.call(elem);
		}
    }
    
    
    /**
     * Hide the cornerSlider on clicking the 'close' element.
     */
    cornerSliderElem.find('.close').on('click',function(){
        cornerSliderDisAppear(cornerSliderElem,cornerSliderElemWidth,true);

        setCookie(cookieName,cookieValue,settings.cookieMinutesToExpiry);
    });
    
    
    /**
     * Hide or show the cornerSlider on window scroll.
     */
    $(window).scroll(function() {
        var scrollTopInt = parseInt($(window).scrollTop());
        var winHeight    = parseInt(window.innerHeight);
        var h1           = scrollTopInt + winHeight ;
        var h2           = $(settings.elemToPresent).length==0 ? settings.showAtScrollingHeight : parseInt($(settings.elemToPresent).offset().top);

        if( h1 > h2  )  {
		
console.log(cornerSliderElem.hasClass('hidden'));	
console.log(isAllowedCornerSlider(cookieName));	
		
		
		
            if(cornerSliderElem.hasClass('hidden') && isAllowedCornerSlider(cookieName))
            {
                cornerSliderAppear(cornerSliderElem);
            }
        } else if(cornerSliderElem.hasClass('shown')) {
            cornerSliderDisAppear(cornerSliderElem,cornerSliderElemWidth,false);
        }
    });
    
    /**
     * Motion directions and starting position.
     */
    (function init(){
        width     = cornerSliderElemWidth;
        height    = cornerSliderElemHeight;
        direction = (settings.directionEffect == 'left' || settings.directionEffect == 'right')? settings.directionEffect : "bottom";
        
        cornerSliderElem.css({'bottom': settings.bottom});
        
        if(direction == 'left')     
            cornerSliderElem.css({'left': -width});
        else if(direction == 'right')
            cornerSliderElem.css({'right': -width});
        else {
        
            if(direction=='bottom')
                cornerSliderElem.css({'bottom': -height});
        
            if(settings.directionEffect == 'bottom left')
                cornerSliderElem.css({'left': settings.left});
            else if(settings.directionEffect == 'bottom center')
                cornerSliderElem.css({'margin-right' : 'auto' , 'margin-left' : 'auto' , 'right' : 0 , 'left' : 0});
            else if(settings.directionEffect == 'bottom right')
                cornerSliderElem.css({'right': settings.right});
            else
                cornerSliderElem.css({'right': settings.right});
        }
    }());
};
}(jQuery, document, window));