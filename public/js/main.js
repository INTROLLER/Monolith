function handleCopyBtn(btn) {
  btn.addEventListener('click', (e) => {
    const input = btn.closest('.input_hldr').querySelector('.data_input');
    const data = input.value;
    const icon = btn.querySelector('i');

    icon.style.color = '#2cd472';
    navigator.clipboard.writeText(data);

    setTimeout(() => {
      icon.removeAttribute('style');
    }, 100);
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

setIcon();
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', setIcon);
export { handleCopyBtn, handleVisToggler, updateBarDisplay };