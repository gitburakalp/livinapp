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

    for (var i = 8; i < 25; i++) {
      $(this).find('.swiper-wrapper').append(`
        <div class="swiper-slide font-weight-bold" data-hour="${i}">${i}:00</div>
      `);
    }

    var config = {
      init: false,
      slidesPerView: 5.5,
      spaceBetween: 10,
      freeMode: true,
      speed: 600,
      slideToClickedSlide: true,
    };

    var swiper = new Swiper($this[0], config);

    swiper.init();
    swiper.snapGrid = [...swiper.slidesGrid];
    swiper.slideTo(date.getHours() - 8, 1000);

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
