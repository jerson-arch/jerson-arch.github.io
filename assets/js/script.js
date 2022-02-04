
document.addEventListener("DOMContentLoaded", function () {
  
    document.getElementsByClassName("page-loading")[0].classList.add("page-loading-none");
  
    var document_area_load = document.getElementById('container-load');
        body_bg            = document.querySelector('body');
        loaderhtml         = "<div class='loader'><div class='line'></div><div class='line'></div><div class='line'></div><div class='line'></div></div>";
        
    var config = {
      apiKey: "AIzaSyBufZ9C0HSICF9WdlgoAA3mN74m2rZl0zo",
      authDomain: "restaurantapi-1509180318122.firebaseapp.com",
      databaseURL: "https://restaurantapi-1509180318122.firebaseio.com",
      storageBucket: "restaurantapi-1509180318122.appspot.com",
      messagingSenderId: "190845212465"
    };
  
    firebase.initializeApp(config);
  
    /* LOAD AJAX HTML LINK
    ======================= */
  
    var getHtml = function (e) {
      document_area_load.innerHTML = loaderhtml;
      var http = new XMLHttpRequest();
  
      http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
          var indice = e.length > 2 ? e : 'profile';
          var regexp = new RegExp('/', 'ig');
          body_bg.className = 'nav-item-bg-' + (indice.replace('.', '')).replace(regexp, '');
            document_area_load.innerHTML = setHtml(http.responseText);   
        }
      };
      http.open("GET", e, true);
      http.send();
    }
  
    window.paceOptions = {
        document: true,
        eventLag: true,
        restartOnPushState: true,
        restartOnRequestAfter: true,
        ajax: {
            trackMethods: ['POST', 'GET'],
        }
    };
  
  
    page("/", function () {
        getHtml("./");
    });
  
    page("/portfolio", function () {
      getHtmlPortfolio();
    });

    page("/contact", function () {
      getHtmlContact("/contact/");
    });
  
    page("*", function () {
      getHtml("./404.html");
    });
  
    page();
 


    /*=============
      PORTFOLIO
    ===============*/
    function getHtmlPortfolio() {
      document_area_load.innerHTML = loaderhtml;  
      var http = new XMLHttpRequest();
  
      http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
          document_area_load.innerHTML = setHtml(http.responseText);
          body_bg.className = 'nav-item-bg-portfolio';
          PortfolioComponent();
        }
      };
      http.open("GET", "./portfolio/", true);
      http.send();
    }
  
    function PortfolioComponent(){
      var db_portfolio = firebase.database().ref('/portfolio/web');
      var thumb_area = document.querySelector('[data-ref="mix-thumbnials"]');
      var mixer = mixitupInit(thumb_area);
      lightgalleryInit(thumb_area);
  
      db_portfolio.on('value', function (snapshot) {
      var items = snapshot.val();
  
        if (items.length != 0) {
          mixer.append(portafolioItems(items));
          window.lgData[thumb_area.getAttribute('lg-uid')].destroy(true);
          lightGallery(thumb_area);
        } 
  
        if (items.length == 0) {
          alert('not found portfolio :(');
        }
  
      }, function (errorObject) {
        console.log("read failed: " + errorObject.code);
      });
  
  
       var selector = document.querySelector('.custom-select');
       selector.addEventListener("change", function() {
        var thumb_area = document.querySelector('[data-ref="mix-thumbnials"]');
        var mixer = mixitupInit(thumb_area);
        mixer.filter(selector.value);
        });
      }
  
      var portafolioItems = function (items) {
      var all_items = '';
      items.forEach(function (item) {
        all_items += '<div class="portfolio ' + item.filter_category
          + '" data-src=" '+ item.image +' " data-sub-html=" '+  item.html_desc +' ">'
          + '<div class="portfolio-wrapper" style="background: url(' + item.image + ') center/cover;">'
          + '<div class="label">'
          + '<div class="label-text">'
          + '<a class="label-text-title">' + item.name + '</a>'
          + '<span class="label-text-category">' + item.category + '</span>'
          + '</div>'
          + '<div class="label-bg"></div>'
          + '</div>'
          + '</div>'
          + '</div>';
      }, this);
      return all_items;
    }
  
  
    var setHtml = function (e) {
      return e.replace(/[\r\n]/g, ' ').match(/<section.*>(.*)<\/section>/);
    }
  
    var mixitupInit = function (e) {
      return mixitup(e, {
        selectors: {
          target: '.portfolio'
        }
      });
    }
  
    var lightgalleryInit = function (e) {
      lightGallery(e, {
        thumbnail:true,
        animateThumb: false,
        showThumbByDefault: false,
        mode: 'lg-slide-circular'
      }
      );
    }
  

    /*======================
             CONTACT 
    ========================*/
  
    /*settings values */
    var error_style = "1px solid #d51d00";
    var validate_messages = [
        "* Los campos marcados son obligatorios.",
        "* Por favor ingrese un email.",
        "* Ingrese un email valido.",
        "* Por favor ingrese un numero celular.",
        "* El numero celular ingresado no es correcto.",
        "* El numero celular es muy corto."
      ];
  
    function validateFormOnSubmit() {
      valid_all = "";
      valid_all += validateText(form[0]);
      valid_all += validateEmail(form[1]);
      valid_all += validatePhone(form[2]);
      valid_all += validateText(form[3]);
      valid_all += validateText(form[4]);
  
      var final_validate = !(valid_all.length > 0) ? contactSend() :  false;
      return final_validate;
    }
  
  
    function validateText(input) {
      var error_code = "";
      
      if (input.value.length == 0) {
          input.style.border = error_style;
          message.innerHTML = validate_messages[0];
          error_code = "*";
      } 
      else {
          input.style.border = "none";
      }
      return error_code;
    }
  
    function validateEmail(email) {
      var error_code = "";
  
      if (email.value == "") {
          email.style.border = error_style;
          message.innerHTML = validate_messages[1];
          error_code = "*";
      } 
      else if(!RegExpMail(email.value)) {
          email.style.border = error_style;
          message.innerHTML=  validate_messages[2];
           error_code = "*";  
      }
      else{
          email.style.border = "none";
      }
      return error_code;
    }
    
    function validatePhone(phone) {
      var error_code = "";
      var stripped = phone.value.replace(/[\(\)\.\-\ ]/g, '');
  
      if (phone.value == "") {
          
          phone.style.border = error_style;
          message.innerHTML = validate_messages[3];
          error_code = "*";
  
      } 
      else if (isNaN(parseInt(stripped))) {
  
          phone.style.border = error_style;
          message.innerHTML =  validate_messages[4];
          error_code = "*";
  
      } 
      else if (stripped.length < 9) {
  
          phone.style.border = error_style;
          message.innerHTML = validate_messages[5];
          error_code = "*"; 
  
      } else {
  
          phone.style.border = "none";
      }
      return error_code;
    }
  
    function RegExpMail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email.toLowerCase());
    }
  
  
    function getHtmlContact(e) {
      var http = new XMLHttpRequest();
  
      document_area_load.innerHTML = loaderhtml;
      body_bg.className = 'nav-item-bg-contact';
  
      http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            document_area_load.innerHTML =  setHtml(http.responseText);
            ContactComponent();
        } 
      };
      http.open("GET", e, true);
      http.send();
    };
  
    var ContactComponent = function(){
      form    = document.getElementsByClassName("form-contact")[0];
      message = document.getElementById("form-validate-error");
      document.getElementById("send_email").addEventListener('click', function(e){
          validateFormOnSubmit();
      });
    }
  
    function contactSend(){
      var http  = new XMLHttpRequest();
      var form = document.getElementsByClassName("form-contact");
      var url   = "https://send.pageclip.co/6jC2VZS2zbYoNpZyRHg1WKVk0Y6qHqLc/contacto";
      var params = "";
  
        for(var i = 0;  i < form[0].length; i++){ 
          params += form[0][i].name + "=" + form[0][i].value + "&";
        };
        params = params.trim("&");
  
        http.onreadystatechange = function (){
          
        if(http.readyState == 4 && http.status == 200){
          console.log(http.responseText);
        }
      };
  
      http.open("POST", url, true);
      http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      http.send(params);  
  
      message.innerHTML = "Mensaje enviado";
      setTimeout(function(){
        message.innerHTML = "";
        for(var i = 0;  i < form[0].length; i++){ 
          form[0][i].value  = "";
        };
      }, 5000);
    }
  
  
  });
  