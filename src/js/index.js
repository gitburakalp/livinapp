import Swiper from 'swiper/bundle';
import '../sass/main.scss';

const DATE = new Date();
const LANG = $('html').attr('lang');
const CURRENTLANG = LANG != 'en' ? LANG + '-' + LANG.toUpperCase() : 'en-US';
const SLIDERS = $('[data-prop]');
const SLIDER_ARR = [];
const ROOT = document.documentElement;

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate() + ',' + new Date(year, month, 0).getDay();
}

function fillDays(month, year) {
  var days = {
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    tr: ['Pzr', 'Pzt', 'Sal', 'Çrş', 'Per', 'Cu', 'Cmt'],
  };

  var thisDays = parseInt(daysInMonth(month, year).split(',')[0]);
  var thisDayNames = daysInMonth(month, year).split(',')[1];

  var today = DATE.getDate();
  console.log(today);

  for (let i = today; i < thisDays + 1; i++) {
    $('#daysSlider .datetime-wrapper').each(function () {
      var d = new Date(year, month, i).getDay();

      $(this).append(`<div class='datetime-slide swiper-slide'>
        <span class="d-block">${days.tr[d]}</span>
        ${i}
      </div>`);
    });
  }

  $('#daysSlider').each(function () {
    var $this = $(this);

    var config = {
      slidesPerView: 5.5,
      spaceBetween: 10,
      speed: 600,
      slideToClickedSlide: true,
    };

    new Swiper($this[0], config);
  });
}

window.fillDays = fillDays;
window.daysInMonth = daysInMonth;

//#region FUNCTIONS

const parallaxSlides = () => {
  $('.swiper-container[data-prop="sliders"]').each((idx, e) => {
    var config = {
      slidesPerView: 1.5,
      speed: 600,
      // parallax: true,
      // loop: true,
      // effect: 'slide',
      mousewheelControl: 1,
    };

    new Swiper(e, config);
  });
};

const CONV_PAD = (padType, val) => {
  if (padType == 'start') {
    return val.toString().padStart(2, '0');
  } else {
    return val.toString().padEnd(2, 0);
  }
};

const GET_CURRENT_DATE = lang => {
  var dateArr1 = CONV_PAD('start', lang != 'en' ? DATE.getDate() : DATE.getMonth() + 1);
  var dateArr2 = CONV_PAD('start', lang != 'en' ? DATE.getMonth() + 1 : DATE.getDate());
  var dateArr3 = DATE.getFullYear();

  return `${dateArr1}.${dateArr2}.${dateArr3}`;
};

const FILL_AND_SET_SLIDES = (itemLocation, sliderWrapper, imgSource, title, itemDate, itemTime, itemStartHour, itemEndHour) => {
  itemLocation = itemLocation == '' ? 'DefaultLocation' : itemLocation;

  var sliderHTML = `
    <div class="swiper-slide" data-date="${itemDate}" data-time="${itemTime}">
      <div class="resizable-div">
        <figure class="image poster swiper-image">
          <img src="${imgSource}" alt="${title.trim()}" />
        </figure>
        <figcaption>
          <h5 class="title">${title}</h5>

          <div class="form-row mt-auto">
            <div class="col-auto">
              <a href="" class="location" data-swiper-parallax-opacity="0" data-swiper-parallax-duration="500">${itemLocation}</a>
            </div>
            <div class="col-auto">
              <p class="list" data-swiper-parallax-x="25" data-swiper-parallax-opacity="0" data-swiper-parallax-duration="500">${itemStartHour} | ${itemEndHour}</p>
            </div>
          </div>
          
        </figcaption>
      </div>
    </div>
    `;

  $(sliderWrapper).append(sliderHTML);
};

//#endregion

var returnedData = [];
var selectedDate = GET_CURRENT_DATE(LANG);
var selectedTime = '10:00';
var type = 'flavours';
var ww = $(window).outerWidth();
var url = `https://www.rubiplatinum.com/api/v1/services?lang=${CURRENTLANG}`;

let interleaveOffset = 0.5;

/* Window Declarations */
window.SLIDER_ARR = SLIDER_ARR;
window.returnedData = returnedData;

const GetData = new Promise(function (resolve, reject) {
  var request = new XMLHttpRequest();
  request.open('GET', url);

  request.onload = function () {
    if (request.status == 200) {
      resolve(JSON.parse(request.response).data);
    } else {
      reject(Error(request.statusText));
    }
  };

  request.send();
});

document.addEventListener('DOMContentLoaded', () => {
  GetData.then(function (x) {
    x.forEach(function (e) {
      if (e.serviceTypeName.toLowerCase() == 'flavours' && e.name.toLowerCase() == 'bars') {
        e.subTenantServices.forEach(function (e) {
          var elLocation = [];

          e.filterLabels.forEach(function (elem) {
            if (elem.toLowerCase().includes('location')) {
              elLocation.push(elem);
            }
          });

          returnedData.push(e);

          FILL_AND_SET_SLIDES(elLocation, '#mainSlider .swiper-wrapper', e.images[0].path, e.name, '', e.startValue, e.startTime, e.endTime);
        });
      }
    });

    $('#mainSlider').each((idx, e) => {
      var $this = $(e);

      var config = {
        slidesPerView: 1.15,
        speed: 600,
        centeredSlides: true,
        parallax: true,
        on: {
          init: function () {
            var $background = $('.backdrop-filter');
            var imgSource = $this.find('.swiper-slide-active img').attr('src').split(/.jpg/)[0] + '_thumb.jpg';

            $background.attr('style', `background-image:url("${imgSource}")`);
          },
          transitionStart: function () {
            var $background = $('.backdrop-filter');
            var imgSource = $this.find('.swiper-slide-active img').attr('src').split(/.jpg/)[0] + '_thumb.jpg';

            $background.removeClass('fadeIn');

            setTimeout(function () {
              $background.attr('style', `background-image:url("${imgSource}")`);
              $background.addClass('fadeIn');
            }, 25);
          },
        },
      };

      const swiper = new Swiper(e, config);
    });

    $('.fixed-menu ul').each(function () {
      $(this)
        .find('li')
        .on('click', function (e) {
          var $this = $(this);

          $('.fixed-menu ul li').removeClass('active');
          $this.addClass('active');
        });
    });
  });
});

$(window).on('load', function () {
  $('body').removeClass('is-loading');
  fillDays(DATE.getMonth(), 2020);
});
