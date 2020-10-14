import Swiper from 'swiper/bundle';

function fillTimelineDate() {
  var date = new Date();
  var currentMonth = date.getMonth() + 1;
  var currentYear = date.getFullYear();

  var days = {
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    tr: ['Pzr', 'Pzt', 'Sal', 'Çrş', 'Per', 'Cu', 'Cmt'],
  };

  var thisMonthDayCount = new Date(currentYear, currentMonth, 0).getDate();
  var today = date.getDate();

  $('#timelineSection').append("<div id='daysSlider'></div>");

  $('#daysSlider').each(function () {
    var $this = $(this);
    $this.addClass('swiper-container');
    $this.append("<div class='swiper-wrapper'></div>");

    for (let i = today; i < thisMonthDayCount + 1; i++) {
      var dayIndex = new Date(currentYear, currentMonth, i).getDay();

      $(this).find('.swiper-wrapper').append(`<div class='datetime-slide swiper-slide'>
        <span class="d-block">${days.tr[dayIndex]}</span>
        ${i}
      </div>`);
    }
  });

  $('#daysSlider').each(function () {
    var $this = $(this);

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
  });
}

export default fillTimelineDate = {
  fillTimelineDate,
};
