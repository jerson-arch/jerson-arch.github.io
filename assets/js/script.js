
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
  

    page("/blog", function () {
      getHtmlBlog("/blog/");
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
  
    
    /*=================
            BLOG 
    ===================*/
    function getHtmlBlog(e) {
      document_area_load.innerHTML = loaderhtml;
      var http = new XMLHttpRequest();
  
      http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
          body_bg.className = 'nav-item-bg-blog';
          document_area_load.innerHTML =  setHtml(http.responseText); 
          BlogComponent();
        }
      };
      
      http.open("GET", e, true);
      http.send();
    };
    
  
    var BlogComponent = function () {
      var url_api = "https://www.googleapis.com/blogger/v3/blogs/"
      + "495127046846381233"
      + "/posts?fields="
      + "items(title,content,updated,url,author(displayName),replies(totalItems))"
      + "&key="
      + "AIzaSyDolWqUukODwRYvdrUD6MRpAwRCvWhItl4";
  
      var xhr_blog = new XMLHttpRequest();
  
      xhr_blog.onreadystatechange = function () {
        if (xhr_blog.readyState == 4 && xhr_blog.status == 200) {
          var posts = JSON.parse(xhr_blog.response).items;
          posts.forEach(function (post) {
            itemsBlog(post);
          })
        }
      };
  
      xhr_blog.open("GET", url_api, true);
      xhr_blog.send();
    }
  
    var itemsBlog = function (e) {
      var postArea = document.querySelector('.posts');
      var img = e.content.match(/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i) != null ? e.content.match(/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i)[0] : 'https://i.ytimg.com/vi/dIiwFzFvsmw/0.jpg';
      var desc = e.content.replace(/<[^>]*>?/g, '').substr(0, 190);
      var date = e.updated.substr(0, 10);
      try {
        html_item = '<a href=' + e.url + ' target="_blank" class="item wow fadeInDown">'
        + '<span class="title-image" style="background: url(' + img + ') center/cover no-repeat #441e53;"><span class="item-category"><i class="icon-document-alt-stroke"></i></span></span>'
        + '<span class="item-content">'
        + '<div class="post-meta">'
        + '<span> <i class="icon-clock"></i> - ' + date + '</span> / '
        + '<span><i class="icon-user"></i> - ' + e.author.displayName + '</span>'
        + '<span class="right-comment"><i class="icon-bubble"></i> - ' + e.replies.totalItems + ' Comments</span></div>'
        + '<h5 class="item-title">' + e.title + '</h5>'
        + '<p class="item-desc"> ' + desc + ' ...</p>'
        + '<span class="more-info">abrir enlace : <i class="icon-arrow-right"></i></span>'
        + '</a>';
      postArea.innerHTML += html_item;
      } catch (error) {
        alert('api blogger data not found =(');
      }
  
    };
  
  
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
      var url   = "https://script.google.com/macros/s/AKfycby9J77Fgq4JJDtGKaqD4Z2bHmpTCibsC2uidXJpU_WGx7DIe_E8/exec";
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
  