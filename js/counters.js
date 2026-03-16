function iniciarContadores() {

const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {

const target = +counter.getAttribute('data-target');
let count = 0;

const updateCounter = () => {

const increment = target / 100;

count += increment;

if (count < target) {

counter.innerText = Math.floor(count);
requestAnimationFrame(updateCounter);

} else {

counter.innerText = target;

}

};

updateCounter();

});

}

document.addEventListener("DOMContentLoaded", iniciarContadores);
