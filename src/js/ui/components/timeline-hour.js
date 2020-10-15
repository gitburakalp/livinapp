import 'jquery-ui';
import 'jquery-ui-touch-punch';
import Swiper from 'swiper/bundle';

function fillTimelineHour() {
  $('#timelineSection').append("<div id='timelineBlock'></div>");

  $('#timelineBlock').each(function () {
    var date = new Date();
    var $this = $(this);

    $this.addClass('swiper-container');
    $this.append("<div class='swiper-wrapper'></div>");

    for (var i = 1; i < 25; i++) {
      var hour = i;

      if (hour >= 24) {
        hour = hour - 24;
      }

      $(this).find('.swiper-wrapper').append(`
        <div class="swiper-slide font-weight-bold" data-hour="${hour}">${hour.toString().padStart(2, '0')}:00</div>
      `);
    }

    var config = {
      init: false,
      slidesPerView: 5.5,
      spaceBetween: 10,
      freeMode: true,
      speed: 600,
      slideToClickedSlide: true,
      on: {
        transitionEnd: function () {
          var thisHour = $this.find('.swiper-slide-active').data('hour') + ':00';

          var arr = [];

          $('#mainSlider .swiper-wrapper > *').each(function (idx, e) {
            arr.push(e);
          });

          var idx = arr.indexOf($(`#mainSlider .swiper-slide[data-start-hour="${thisHour}"]`)[0]);

          if (idx != -1) {
            $('#mainSlider')[0].swiper.slideTo(idx, 1000);
          }
        },
      },
    };

    var swiper = new Swiper($this[0], config);

    swiper.init();
    swiper.snapGrid = [...swiper.slidesGrid];
    swiper.slideTo(date.getHours() - 1, 1000);

    var thisHourSlide = $this.find(`.swiper-slide[data-hour=${date.getHours()}]`);
    window.thisHourSlide = thisHourSlide;
  });
}

function fillTimelineHour2() {
  var date = new Date();
  var thisHour = date.getHours() * 60 + date.getMinutes();
  var ww = $(window).outerWidth();

  $('#timelineBlock').append("<div class='swiper-wrapper'></div>");

  $('#timelineBlock').slider({
    min: 480,
    max: 1400,
    step: 30,
    step: 1,
    tooltips: true,
    value: thisHour,
    create: function () {
      var opt = $(this).data().uiSlider.options;
      var vals = (opt.max - opt.min) / 120;
      var currentTime = 0;

      for (var i = 0; i <= vals; i++) {
        var amount = (opt.min + currentTime) / 60;

        if (amount >= 24) {
          amount = amount - 24;
        }

        var el = $(`
          <span class="swiper-slide">
            ${amount}:00
          </span>`);

        currentTime = currentTime + 120;
        $(this).find('.swiper-wrapper').append(el);

        if (ww < 768) {
          $(this).on('click', function () {
            $(this).find('input[type="time"]').focus();
          });
        }
      }
    },
    slide: function (e, ui) {
      var hours = Math.floor(ui.value / 60);
      var minutes = ui.value - hours * 60;

      if (hours.toString().length == 1) hours = '0' + hours;
      if (minutes.toString().length == 1) minutes = '0' + minutes;
    },
  });
}

export default fillTimelineHour = {
  fillTimelineHour,
};
