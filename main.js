const car = document.getElementById('car');
const trackWidth = 600; // same as #track width
const steps = 4; // total steps

function moveCar(step) {
  if (step < 0 || step > steps) return;

  // Calculate new left position based on step (evenly spaced)
  const newPosition = ((trackWidth - car.width) / steps) * step;
  car.style.left = newPosition + 'px';
}
