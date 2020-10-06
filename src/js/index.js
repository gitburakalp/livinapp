import Swiper from 'swiper';
import '../sass/main.scss';

const $sliders = $('[data-prop]');
const Sliders = [];

const returnedJson = '';

$.get('http://www.omdbapi.com/?apikey=10bc13f8&s=x-men&r=json', e => {
  var data = e.Search;

  $.each(data, (idx, el) => {
    var sliderHTML = `<div class="main-block-slide"><figure class="image poster"><img src="${el.Poster}" alt="${el.Title}" /></figure><figcaption><h5>${el.Title}</h5></figcaption></div>`;

    $sliders.find('> *').append(sliderHTML);
  });

  initSliders($sliders);
});

const initSliders = sliderList => {
  sliderList.each((idx, e) => {
    var $this = $(e);
    var containerClass = 'slider-container';
    var wrapperClass = 'slider-wrapper';
    var slideClass = 'slider-slide';

    $this.addClass(containerClass);
    $this.find('> *').addClass(wrapperClass);
    $this.find('> * > *').addClass(slideClass);

    var config = {
      slidesPerView: 2.75,
      spaceBetween: 10,
      freeMode: true,
      containerModifierClass: containerClass + '--',
      wrapperClass: wrapperClass,
      slideClass: slideClass,
      slideActiveClass: slideClass + '--active',
      slideNextClass: slideClass + '--next',
      slidePrevClass: slideClass + '--prev',
      on: {
        transitionStart: function (evt) {
          console.log('change');
        },
      },
    };

    Sliders.push(new Swiper(e, config));
  });
};

/* Window Declarations */
window.Sliders = Sliders;
