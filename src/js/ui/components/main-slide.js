function fillMainSlide(data) {
  var ww = $(window).outerWidth();
  var imgSource = data.images[0].path;
  var title = data.name;
  var elLocation = [];

  data.filterLabels.forEach(function (elem) {
    if (elem.toLowerCase().includes('location')) {
      elLocation.push(elem);
    }
  });

  var date = new Date();

  var thisHourValue = date.getHours() * 60 + date.getMinutes();
  var isPast = thisHourValue > data.endValue ? 'is-past' : '';
  var startEndTime = data.startValue == 1440 && data.endValue == 1439 ? 'All Day' : `${data.startTime} | ${data.endTime}`;

  var sliderHTML = `
      <div class="swiper-slide ${isPast}" data-start-hour="${data.startTime}" data-end-hour="${data.endTime}" data-start-value="${data.startValue}" data-end-value="${data.endValue}" >
        <div class="resizable-div">
          <figure class="image poster swiper-image">
            <img class="swiper-lazy" src="${imgSource.split(/.jpg/)[0] + '_thumb.jpg'}" data-src="${imgSource}" alt="${title.trim()}" />
          </figure>
          <figcaption>
            <h5 class="title">${title} ${isPast ? '<span class="list">(expired)</span>' : ''}</h5>
            <div class="form-row mt-auto">
              <div class="col-auto ${elLocation == '' ? 'd-none' : ''}">
                <a class="location" data-swiper-parallax-opacity="0" data-swiper-parallax-duration="500">${elLocation}</a>
              </div>
              <div class="col-auto">
                <p class="list" data-swiper-parallax-x="25" data-swiper-parallax-opacity="0" data-swiper-parallax-duration="500">
                  ${startEndTime}
                </p>
              </div>
            </div>
          </figcaption>
         </div>
      </div>
      `;

  $('#mainSlider .swiper-wrapper').append(sliderHTML);

  if (ww > 768) {
    var sliderContentHtml = `
      <div class="swiper-slide">
        <h2 class="title">
          ${title}
        </h2>
        <p class="description" data-swiper-parallax-y="75%" data-swiper-parallax-opacity="0" data-swiper-parallax-duration="350">
          ${data.description}
        </p>
      </div>
    `;

    $('#mainSliderContents .swiper-wrapper').append(sliderContentHtml);
  }
}

export default fillMainSlide = {
  fillMainSlide,
};
