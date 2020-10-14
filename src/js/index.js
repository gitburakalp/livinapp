import Swiper from 'swiper/bundle';
import '../sass/main.scss';

// Components
import mainSlide from './ui/components/main-slide';
import timelineDate from './ui/components/timeline-date';
import timelineHour from './ui/components/timeline-hour';

const DATE = new Date();
const LANG = $('html').attr('lang');

var isFirstView = true;
var type = 'flavours';
var returnedData = [];
var ww = $(window).outerWidth();

/**
 * Timeline Init
 * @param {{dataType:string}=}
 * dataType: Data Type must be "flavours","spa","entertaiment"
 */
function initTimeline(dataType) {
  if (dataType != 'entertainment') {
    timelineHour.fillTimelineHour();
  } else {
    timelineDate.fillTimelineDate();
  }
}

//#region FUNCTIONS

/**
 * Convert Single Digit Number to Double With Pad Left or Right
 * @param {{padType:string}=}
 * padType: This must be "start" or "end"
 * @param {{val:int}=}
 * val: Single Digit Number
 */
function convertTwoPad(padType, val) {
  padType = padType.toLowerCase();

  if (padType == 'start') {
    return val.toString().padStart(2, '0');
  } else {
    return val.toString().padEnd(2, 0);
  }
}

/**
 * Function return to Current Date from Language Format
 */
function getCurrentDate() {
  var dateArr1 = convertTwoPad('start', LANG != 'en' ? DATE.getDate() : DATE.getMonth() + 1);
  var dateArr2 = convertTwoPad('start', LANG != 'en' ? DATE.getMonth() + 1 : DATE.getDate());
  var dateArr3 = DATE.getFullYear();

  return `${dateArr1}.${dateArr2}.${dateArr3}`;
}

//#endregion

/* Window Declarations */
window.returnedData = returnedData;

/**
 * Get Json data From Url
 * @param {string} dataUrl
 */
function GetDataFromUrl(dataUrl) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', dataUrl);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };
    xhr.send();
  });
}

/**
 * Api Url must be string
 * @param {string} url
 * @param {string} type
 */
const GetData = url => {
  var url = `http://www.rubiplatinum.com/api/v1/services?lang=${LANG != 'en' ? LANG + '-' + LANG.toUpperCase() : 'en-US'}`;

  if (isFirstView && (type == 'flavours' || type == 'spa')) {
    GetDataFromUrl(url).then(x => {
      var data = JSON.parse(x).data;

      data.forEach(function (e) {
        returnedData.push(e);
      });

      returnedData.forEach(e => {
        if (e.serviceTypeName.toLowerCase() == type) {
          e.subTenantServices.forEach(function (e) {
            var elLocation = [];

            e.filterLabels.forEach(function (elem) {
              if (elem.toLowerCase().includes('location')) {
                elLocation.push(elem);
              }
            });

            mainSlide.fillMainSlide(elLocation, '#mainSlider .swiper-wrapper', e.images[0].path, e.name, '', e.startValue, e.startTime, e.endTime);
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
    });
  }

  isFirstView = false;
};

document.addEventListener('DOMContentLoaded', () => {
  GetData();

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

$(window).on('load', function () {
  initTimeline('flavours');
  $('body').removeClass('is-loading');
});
