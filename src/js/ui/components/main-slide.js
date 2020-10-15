function fillMainSlide(data) {
  var imgSource = data.images[0].path;
  var title = data.name;
  var elLocation = [];

  data.filterLabels.forEach(function (elem) {
    if (elem.toLowerCase().includes('location')) {
      elLocation.push(elem);
    }
  });

  var date = new Date();
  var startHour = parseInt(data.startTime.split(':')[0]);
  var endHour = parseInt(data.endTime.split(':')[0]);

  var endValue = startHour > endHour ? (endHour + 24) * 60 + parseInt(data.endTime.split(':')[1]) : endHour * 60 + parseInt(data.endTime.split(':')[1]);
  var isPast = date.getHours() * 60 > endValue ? 'is-past' : '';

  var sliderHTML = `
      <div class="swiper-slide ${isPast}" data-start-hour="${data.startTime}" data-start-value="${data.startValue}" data-end-hour="${data.endTime}" data-end-value="${endValue}">
        <div class="resizable-div">
          <figure class="image poster swiper-image">
            <img src="${imgSource}" alt="${title.trim()}" />
          </figure>
          <figcaption>
            <h5 class="title">${title}</h5>
            <div class="form-row mt-auto">
              <div class="col-auto ${elLocation == '' ? 'd-none' : ''}">
                <a class="location" data-swiper-parallax-opacity="0" data-swiper-parallax-duration="500">${elLocation}</a>
              </div>
              <div class="col-auto">
                <p class="list" data-swiper-parallax-x="25" data-swiper-parallax-opacity="0" data-swiper-parallax-duration="500">
                  ${data.startTime} | ${data.endTime}
                </p>
              </div>
            </div>
          </figcaption>
         </div>
      </div>
      `;

  $('#mainSlider .swiper-wrapper').append(sliderHTML);
}

export default fillMainSlide = {
  fillMainSlide,
};
