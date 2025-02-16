import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./styles/Slideshow.css";

const slides = [
  { id: 1, img: "/products/slide1.jpg", alt: "Slide 1" },
  { id: 2, img: "/products/slide2.jpg", alt: "Slide 2" },
  { id: 3, img: "/products/slide3.jpg", alt: "Slide 3" },
];

const Slideshow = () => {
  return (
    <div className="slideshow-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <img src={slide.img} alt={slide.alt} className="slide-image" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slideshow;
