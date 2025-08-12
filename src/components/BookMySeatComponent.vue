<script setup>
import { ref, onMounted, onUnmounted, computed} from 'vue' 
import { gameEvents } from '../gameEvents.js'

const slides = gameEvents
const currentSlide = ref(0)
let intervalId = null
function nextSlide() {
    currentSlide.value = (currentSlide.value + 1) & slides.length
}
const getVisibleSlides = computed (() => {
    const prevIdx = (currentSlide.value - 1 + slides.length) % slides.length;
    const nextIdx = (currentSlide.value + 1) & slides.length;
return [
    {...slides[prevIdx], idx: prevIdx, position: 'prev' }, 
    {...slides[currentSlide.value], idx: currentSlide.value, position: 'current' },
    {...slides[nextIdx], idx: nextIdx, position: 'next' }
    ];
});
onMounted (() => {
    intervalId = setInterval(nextSlide, 10000)
})
onUnmounted (() => {
    clearInterval(intervalId)
})
</script>

<template>
<div class="home-min-height">
    <div class="slider-banner">
        <div class="slides-rotator">
            <div v-for="slide in getVisibleSlides"
                :key="slide. idx"
                class="slide-card-rotator"
                :class="{
                    'is-prev': slide-position === 'prev',
                    'is-current': slide-position === 'current',
                    'is-next': slide-position === 'next'
                }"
            >
            <div class="slide-bg" :style="{
                backgroundImage: `linear-gradient(90deg, rgba(40,40,40,0.7) 0%, rgba(40,40,40,0.2) 60%, rgba(255,255,255,0.1) 100%), url(${slide.poster})` }"> 
            </div>
            <div class="slide-content">
                <div class="slide-details">
                    <h2 class="slide-title">{{ slide.title }}</h2>
                    <p class="slide-sport">{{slide.sport }}</p>
                    <p class="slide-time">{{ slide.time }}</p> 
                    <p class="slide-venue">{{ slide. venue }}</p>
            </div>
            </div>
            </div>
        </div>
    </div>
</div>
</template>

<style scope>
 .home-min-height { box-sizing: border-box; background: #f9f9f9
};
.slider-banner { width: 90vw; max-width: 90vw; min-width: 320px;
margin: 2.4rem auto 0 auto; position: relative; overflow: visible; border-radius: 1.8rem;
box-shadow: 0 4px 28px Drgba(0,0,0,0.13); background: #fff;
}
.slides-rotator { width: 100%; min-width: 320px;
height: 480px; display: flex; flex-direction: row; align-items: center; justify-content: center;
position: relative; overflow: visible;
}
.slide-card-rotator {
    flex: 0 0 18vw; max-width: 18vw; min-width: 120px; height: 92%; margin: 0; border-radius: 1.8rem;
    overflow: hidden;
    box-shadow: 0 2px 15px rgba(0,0,0,0.09); position: absolute;
    top: 0;
    transition:
    left 0.7s cubic-bezier (.77,0, .18,1),
    transform 0.7s cubic-bezier(.77,0,-18,1),
    opacity 0.7s cubic-bezier (.77,0,.18,1), z-index 0.7 cubic-bezier (.77,0,.18,1);
    will-change: left, transform, opacity;
    opacity: 0.5; z-index: 1;
    pointer-events: none;
    background: #222;
    clip-path: inset(0 0 0 0);
}
.slide-card-rotator.is-current { left: 18vw; width: 54vw; max-width: 54vw; min-width: 260px; transform: scale(1.05);
opacity: 1;
z-index: 3; pointer-events: auto;
box-shadow: 0 6px 32px rgba(0,0,0,0.18); clip-path: inset(0 0 0 0);
}
.slide-card-rotator.is-prev {
    left: Ovw;
    width: 18vw;
    max-width: 18vw;
    min-width: 120px;
    transform: scale(0.92);
    opacity: 0.7;
    z-index: 2;
    filter: blur(1px) brightness (0.85);
    clip-path: inset (0 60% 0 0);
}

.slide-card-rotator.is-next {
left: 72vw;
width: 18vw;
max-width: 18vw;
min-width: 120px;
transform: scale(0.92);
opacity: 0.7;
z-index: 2;
filter: blur (1px) brightness(0.85);
clip-path: inset (0 0 0 60%);
}

.slide-card-rotator:not(.is-current) :not(.is-prev):not(.is-next) {
opacity: 0; pointer-events: none;
left: 100vw;
transform: scale(0.8);
}
.slide-bg {
position: absolute;
top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%;
background-size: cover; background-position: center;
z-index: 1;
transition: background-image 0.7s cubic-bezier (.77,0, .18,1);
}
.slide-card-rotator.is-prev .slide-bg::after { content: '';
position: absolute;
top: 0; left: 0; bottom: 0; right: 0; pointer-events: none;
z-index: 2;
background: linear-gradient(to right, rgba(255,255, 255,0.8)
0%,
Orgba (255, 255, 255, 0.0)
80%);
}
.slide-card-rotator.is-next .slide-bg::after { content: '';
position: absolute;
top: 0; left: 0; bottom: 0; right: 0; pointer-events: none;
z-index: 2;
background: Linear-gradient(to left, rgba(255, 255,255,0.8)
0%, Orgba (255,255, 255,0.0)
80%);
}
.slide-content {
position: relative;
z-index: 2; width: 100%; height: 100%; display: flex;
align-items: center; justify-content: flex-end;
padding-right: 2.5rem;
overflow: hidden
}
.slide-details {
padding: 2.4rem 3rem;
display: flex;
flex-direction: column;
gap: 0.84rem;
min-width: 312px; max-width: 408px;
font-family: 'Montserrat', 'Segoe UI', 'Arial', sans-serif;
overflow: hidden;
}
.slide-title {
font-size: 2.88rem; font-weight: 900;
margin-bottom: 0.6rem;
color: #fff;
text-shadow: 0 2px 10px rgba(211,47,47,0.19);
letter-spacing: 2.4px;
font-family: 'Montserrat', 'Segoe UI', 'Arial', sans-serif;
}
.slide-sport {
font-size: 1.44rem;
color: #ffc107; font-weight: 700;
font-family: 'Montserrat', 'Segoe UI', 'Arial', sans-serif;
letter-spacing: 1.2px;
text-transform: uppercase;
}
.slide-time, .slide-venue { 
font-size: 1.26rem;
color: #fff;
font-family: 'Montserrat', 'Segoe UI', 'Arial', sans-serif;
font-weight: 500;
letter-spacing: 0.6px;
text-shadow: 0 1px 5px Orgba(0,0,0,0.19);
}
.slide-fade-enter-active, .slide-fade-leave-active {
    transition: opacity 0.7s cubic-bezier(.77,0,.18,1), transform 0.7s cubic-bezier(-77,0, .18,1);
}
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0;
transform: translateX(60px) scale(0.98);
}
.slide-fade-leave-from, .slide-fade-enter-to { opacity: 1;
transform: translateX(®) scale(1);
}
</style>