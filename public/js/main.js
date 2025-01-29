const ANIMDURATION = 500;
let AnimTimeout;
let clearAnimTimeout;

function handleCopyBtn(btn) {
  btn.addEventListener('click', (e) => {
    const input = btn.closest('.input_hldr').querySelector('.data_input');
    const data = input.value;
    const icon = btn.querySelector('i');

    animateFadeEffect(icon, '#2cd472', true);
    navigator.clipboard.writeText(data);
  });
}

function handleVisToggler(btn) {
  btn.addEventListener('click', (e) => {
    const input = btn.closest('.input_hldr').querySelector('.data_input');
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.querySelector('i').innerHTML = input.type === 'password' ? 'visibility' : 'visibility_off';
  });
}

function updateBarDisplay(bar) {
  const min = parseFloat(bar.min) || 0;
  const max = parseFloat(bar.max) || 100;
  const value = parseFloat(bar.value);

  const percentage = ((value - min) / (max - min)) * 100;

  bar.style.background = `linear-gradient(to right, #2cd472 0%, #2cd472 ${percentage}%, #121b29 ${percentage}%, #121b29 100%)`;
  document.querySelector('#length_disp').innerHTML = bar.value;
}

function setIcon() {
  const icon = document.querySelector('#site_icon');
  
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    icon.href = '/media/monolith_main_logo_light.ico';
  } else {
    icon.href = '/media/monolith_main_logo_dark.ico';
  }
}

function animateFadeEffect(btn, color, isTransparent = false) {
  clearTimeout(AnimTimeout);
  clearTimeout(clearAnimTimeout);
  btn.removeAttribute('style');

  btn.style.transition = 'all 0.1s';
  if (!isTransparent) {
    btn.style.backgroundColor = color;
    btn.style.boxShadow = `0 0 20px 0.5px ${color}`;
  } else {
    btn.style.color = color;
  }

  AnimTimeout = setTimeout(() => {
    if (isTransparent) {
      btn.style.transition = `all 0.1s, color 0.${ANIMDURATION}s linear`;
      btn.style.color = 'white';
    } else {
      btn.style.transition = `all 0.1s, box-shadow 0.${ANIMDURATION}s linear, background-color 0.${ANIMDURATION}s linear`;
      btn.style.boxShadow = 'none';
      btn.style.backgroundColor = '#121b29';
    }

    clearAnimTimeout = setTimeout(() => {
      btn.removeAttribute('style');
    }, ANIMDURATION);
  }, 100);
}

setIcon();
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', setIcon);
export { handleCopyBtn, handleVisToggler, updateBarDisplay, animateFadeEffect };