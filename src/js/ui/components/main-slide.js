function fillMainSlide(itemLocation, sliderWrapper, imgSource, title, itemDate, itemTime, itemStartHour, itemEndHour) {
  itemLocation = itemLocation == '' ? 'DefaultLocation' : itemLocation;

  var date = new Date();
  var thisHour = date.getHours() * 60;
  var endHour = itemEndHour.split(':')[0] * 60 + itemEndHour.split(':')[1];

  var sliderHTML = `
      <div class="swiper-slide ${thisHour > endHour ? 'is-past' : ''}" data-date="${itemDate}" data-time="${itemTime}" data-end-time="${endHour}>
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
}

export default fillMainSlide = {
  fillMainSlide,
};
