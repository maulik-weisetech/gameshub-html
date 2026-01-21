/** Header js start **/
// ------------------------ Desktop view Hover start ----------------------------------
function mobileMenuBehavior() {
  if ($(window).width() >= 768) {
    $('.menu-sidebar li:first-child').addClass('active');
    $('.menu-panel:first-child').addClass('active');

    $('.menu-sidebar li').hover(function() {
      var tabId = $(this).data('tab');  
      $(this).addClass('active').siblings().removeClass('active');
      $('#' + tabId).addClass('active').siblings('.menu-panel').removeClass('active');
    });

    // Check all main submenus on load/resize
    $('.header .menu > ul > li').each(function() {
      var $submenu = $(this).find('.sub-menu');
      
      if ($submenu.length) {
        var submenuRight = $submenu.offset().left + $submenu.outerWidth();
        var windowWidth = $(window).width();
        var touchesEdge = submenuRight > windowWidth;
        
        $submenu.toggleClass('submenu-left', touchesEdge);
        $(this).toggleClass('has-submenu-left', touchesEdge);
      }
    });

    // Check all sub-sub-menus on load/resize
    $('.header .menu .sub-menu ul li').each(function() {
      var $subSubMenu = $(this).find('.sub-sub-menu.depth-1');
      
      if ($subSubMenu.length) {
        var subSubRight = $subSubMenu.offset().left + $subSubMenu.outerWidth();
        var windowWidth = $(window).width();
        var touchesEdge = subSubRight > windowWidth;
        
        $subSubMenu.toggleClass('submenu-left', touchesEdge);
        $(this).toggleClass('has-submenu-left', touchesEdge);
      }
    });


  } else {
    $('.menu-sidebar li, .menu-panel').removeClass('active');
    $('.sub-menu, .sub-sub-menu').removeClass('submenu-left');
    $('.menu li').removeClass('has-submenu-left');
  }
}
mobileMenuBehavior(); 
$(window).resize(mobileMenuBehavior);

// ------------------------ Desktop view Hover End ----------------------------------

// ------------------------ Responsive Menu ----------------------------------

$(".mobile-menu-trigger").click(function() {
   $(".menu-item-has-children").removeClass("active");
   $(".mobile-menu-head").removeClass("active-mobile-menu-head");
    $(".header").toggleClass("active-menu");
    $(".header-item.item-right").removeClass("search-open");    
    
});

$(".header-item.item-right span.icon").on("click", function() {
  $(".header-item.item-right").toggleClass("search-open");
  $(".header").removeClass("active-menu");
});

$('.header .toggle-arrow').on('click', function(e) {
  e.preventDefault();
  const parentLi = $(this).closest('.menu-item-has-children');  
  if (parentLi.hasClass('active')) {
    parentLi.removeClass('active');
  } else {
    parentLi.addClass('active').siblings('.menu-item-has-children').removeClass('active');
  }

  $(".mobile-menu-head").toggleClass("active-mobile-menu-head");
});

$(".header .go-back").on("click touchstart", function (e) {
  e.preventDefault();
   if ($("ul.sub-sub-menu").hasClass("active")) {
    $("ul.sub-sub-menu").removeClass("active");
  } else {
    if ($(".header .menu-content .menu-panel").hasClass("active")) {
      $(".header .menu-content .menu-panel").removeClass("active");
    } else {
      $(".mobile-menu-head").removeClass("active-mobile-menu-head");
      $(".menu-item-has-children").removeClass("active");
      $(".menu-panel").removeClass("active");
    }
  }
  $(".current-menu-title").text("Main Menu");
});

$('.header .angle-right').on('click', function(e) {
  e.preventDefault();
  const parentLi = $(this).closest('.menu-panel');  
  if (parentLi.hasClass('active')) {
    parentLi.removeClass('active');
  } else {
    parentLi.addClass('active').siblings('.menu-panel').removeClass('active');
  }
  const text = $(this).parent('.mobile-tab-arrow').contents().filter(function() {
      return this.nodeType === 3; 
    }).text().trim();
    $('.current-menu-title').text(text);    
});

$('.sub-menu-arrow').on('click', function (e) {
  $('.sub-sub-menu').toggleClass('active');
});

/** Header js End **/






/*** Mobile slider ***/ 
  function initSerieSlider() {
    if (
      window.innerWidth < 992 &&
      !$(".all-review-slider-slide").hasClass("slick-initialized")
    ) {
      $(".all-review-slider-slide").slick({
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
        variableWidth: true,
        autoplay: false,
        autoplaySpeed: 2000,
      });
    } else if (
      window.innerWidth >= 992 &&
      $(".all-review-slider-slide").hasClass("slick-initialized")
    ) {
      $(".all-review-slider-slide").slick("unslick");
    }
  }
  $(document).ready(function () {
    initSerieSlider();
  });
  $(window).on("resize", function () {
    initSerieSlider();
  });
/*** Mobile end ***/ 

  
// $('.blue-card-slider').slick({
//   infinite: true,
//   autoplay: false,
//   slidesToScroll: 1,
//   slidesToShow: 5,
//   variableWidth: true,
//   // cssEase: 'ease-in-out',
//   responsive: [
//     {
//       breakpoint: 1024,
//       settings: {
//         slidesToShow: 3,
//       }
//     },
//     {
//       breakpoint: 992,
//       settings: {
//         slidesToShow: 2,
//       }
//     },
//   ]
// });

// $('.blue-card-slider').find('.slick-prev, .slick-next').off('click');
// $('.blue-card-slider').on('click', '.slick-prev, .slick-next', function (e) {
//   var next_prev_button=$(this);

//   var slick = $('.blue-card-slider').slick('getSlick');
//   var current = slick.currentSlide;var next = (current + 1) % total;
//   var total = slick.slideCount;
//   var next = (current + 1) % total;
//   var prev = (current - 1 + total) % total;
//   $(slick.$slides[current]).removeClass('slick-current');
//   if(next_prev_button.hasClass("slick-prev")){
//    if(current==0){
//     $(slick.$slides[prev]).addClass('slick-current');
//     setTimeout(() => {
//       slick.slickGoTo(prev);
//     }, 500);
//    }else{
//     slick.slickGoTo(prev);
//    }
//   }else{
//     $(slick.$slides[next]).addClass('slick-current');
//     setTimeout(() => {
//     slick.slickGoTo(next);
//     }, 500);
//   }
// });


$('.image-button-slider, .game-review-slider').slick({
  infinite: true,  
  slidesToScroll: 1,
  slidesToShow: 6,
  variableWidth: true,  
  autoplay: true,
});



$(".accordion-header").click(function () {
  const acc = $(this).closest(".accordion");
  const item = $(this).closest(".accordion-item");

  if ($(this).hasClass("active")) {
    $(this).removeClass("active").next(".accordion-content").slideUp();
    item.removeClass("open");
  } else {
    acc.find(".accordion-header").removeClass("active");
    acc.find(".accordion-content").slideUp();
    acc.find(".accordion-item").removeClass("open");

    $(this).addClass("active").next(".accordion-content").slideDown();
    item.addClass("open"); 
  }
});


  /*** Mobile slider ***/ 
  function newsSlide() {
    if (
      window.innerWidth < 992 &&
      !$(".news-slide").hasClass("slick-initialized")
    ) {
      $(".news-slide").slick({
        infinite: true,
        slidesToScroll: 1,
        slidesToShow: 2,
        variableWidth: true,
        autoplay: true,        
        arrows: false,
        // autoplaySpeed: 2000,
      });
    } else if (
      window.innerWidth >= 992 &&
      $(".news-slide").hasClass("slick-initialized")
    ) {
      $(".news-slide").slick("unslick");
    }
  }
  $(document).ready(function () {
    newsSlide();
  });
  $(window).on("resize", function () {
    newsSlide();
  });
/*** Mobile end ***/ 



 $(".footer-menu-title").click(function () {
  const menu = $(this).next(".footer-menu");

  if ($(this).hasClass("open")) {
    menu.slideUp();
    $(this).removeClass("open");
  } else {
    $(".footer-menu").not(menu).slideUp();
    $(".footer-menu-title").not(this).removeClass("open");

    menu.slideDown();
    $(this).addClass("open");
  }
});


  //** Read More start **//
 $(function () {
  $(".bio").each(function () {
    let full = $(this).text().trim();
    let short = full.substring(0, 300);

    // Store both versions in data attributes
    $(this).data("full", full);
    $(this).data("short", short);
    $(this).html(short + '... <a href="#" class="toggle">Show more</a>');
  });

  $(document).on("click", ".toggle", function (e) {
    e.preventDefault();
    let bio = $(this).closest(".bio");
    let isExpanded = $(this).text() === "Show less";

    if (isExpanded) {
      bio.html(bio.data("short") + '... <a href="#" class="toggle">Show more</a>');
    } else {
      bio.html(bio.data("full") + ' <a href="#" class="toggle">Show less</a>');
    }
  });
});

//** Read More End **//



/*** category-featured-guides slider ***/   
  $('.category-featured-guides-slider').slick({
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      variableWidth: true,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 0,
      speed: 4000,
      cssEase: 'linear',
      pauseOnHover: false,
      pauseOnFocus: false,
      responsive: [   
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          pauseOnHover: true,
          pauseOnFocus: true,
          pauseOnDotsHover: true,
        }
      },
    ]
  });
/*** Mobile end ***/ 


  $('.other-author-slider').slick({
  infinite: true,
  slidesToShow: 5,
  slidesToScroll: 1,
  variableWidth: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
      }
    },
  ]
});

 $('.games-bet-slide').slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        variableWidth: true,
      }
    },
  ]
  });


$('.featured-user-reviews-slider').slick({
  infinite: true,  
  slidesToScroll: 1,
  slidesToShow: 2,
  variableWidth: true,
});


$('.multilanguage-select').on('click', function (e) {
  e.stopPropagation();
  $(this).toggleClass('active');
});
$('body').on('click', function () {
  $('.multilanguage-select').removeClass('active');
});
$('.multilanguage-select ul').on('click', function (e) {
  e.stopPropagation();
});

