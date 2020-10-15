import Swiper from 'swiper/bundle';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import '../sass/main.scss';

// Components
import mainSlide from './ui/components/main-slide';
import timelineDate from './ui/components/timeline-date';
import timelineHour from './ui/components/timeline-hour';

const DATE = new Date();
const LANG = $('html').attr('lang');

var flavoursData = [];
var spaData = [];

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

function compare(a, b) {
  var aData = a.startValue;
  var bData = b.startValue;

  if (a.startHour < a.endHour && a.startValue > a.endValue && !(a.startValue == 1440 && a.endValue == 1439)) {
    return -1;
  }

  if (aData < bData) {
    return -1;
  }
  if (aData > bData) {
    return 1;
  }
  return 0;
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

function GenerateArrayData(thisData, thisType) {
  var arr = [];

  thisData.forEach(e => {
    if (e.serviceTypeName.toLowerCase() == thisType) {
      e.subTenantServices.forEach(j => {
        j.endHour = parseInt(j.endTime.split(':')[0]);
        j.endMinute = parseInt(j.endTime.split(':')[1]);
        j.endValue = j.startHour > j.endHour ? (j.endHour + 24) * 60 + j.endMinute : j.endHour * 60 + j.endMinute;

        arr.push(j);
      });

      arr.sort(compare);
    }
  });

  switch (thisType) {
    case 'flavours':
      flavoursData = arr;
      break;

    case 'regius spa':
      spaData = arr;
      break;

    case 'entertainment':
      entertainmentData = arr;
      break;
  }
}

const initSliderSlides = data => {
  $('#mainSlider').find('.swiper-wrapper').empty();

  data.forEach(e => {
    mainSlide.fillMainSlide(e);
  });

  MainSliderInit();
};

const GetAllData = selectedType => {
  var url = `http://www.rubiplatinum.com/api/v1/services?lang=${LANG != 'en' ? LANG + '-' + LANG.toUpperCase() : 'en-US'}`;

  GetDataFromUrl(url).then(x => {
    var data = JSON.parse(x).data;
    var thisData;

    GenerateArrayData(data, 'flavours');
    GenerateArrayData(data, 'regius spa');

    isFirstView = false;

    initSliderSlides(flavoursData);

    $('body').removeClass('is-loading');
  });
};

const MainSliderInit = () => {
  var mainSlider = $('#mainSlider')[0].swiper;

  var config = {
    slidesPerView: 1.15,
    speed: 600,
    centeredSlides: true,
    parallax: true,
    on: {
      init: function () {
        var $background = $('.backdrop-filter');
        var imgSource = $('#mainSlider').find('.swiper-slide-active img').attr('src').split(/.jpg/)[0] + '_thumb.jpg';

        $background.attr('style', `background-image:url("${imgSource}")`);
      },
      transitionStart: function () {
        var $background = $('.backdrop-filter');
        var imgSource = $('#mainSlider').find('.swiper-slide-active img').attr('src').split(/.jpg/)[0] + '_thumb.jpg';

        $background.removeClass('fadeIn');

        setTimeout(function () {
          $background.attr('style', `background-image:url("${imgSource}")`);
          $background.addClass('fadeIn');
        }, 25);
      },
    },
  };

  var arr = [];

  $('#mainSlider .swiper-wrapper > *').each(function (idx, e) {
    arr.push(e);
  });

  if (mainSlider != undefined) {
    mainSlider.destroy();
    var swiper = new Swiper('#mainSlider', config);
    swiper.slideTo(arr.indexOf($('#mainSlider .swiper-slide:not(.is-past)')[0]), 2500);
  } else {
    var swiper = new Swiper('#mainSlider', config);
    swiper.slideTo(arr.indexOf($('#mainSlider .swiper-slide:not(.is-past)')[0]), 2500);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  GetAllData(type);

  $('.fixed-menu ul').each(function () {
    $(this)
      .find('li')
      .on('click', function (e) {
        var $this = $(this);
        var thisType = $this.data('type');
        var selectedData;

        if (thisType == 'flavours') {
          selectedData = flavoursData;
        } else if (thisType == 'regius spa') {
          selectedData = spaData;
        }

        $('.fixed-menu ul li').removeClass('active');
        $this.addClass('active');

        initSliderSlides(selectedData);
      });
  });
});

$(window).on('load', function () {
  initTimeline('flavours');
});
