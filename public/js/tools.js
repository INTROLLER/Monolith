const loginInput = document.querySelector('#login_input');
const loginVisToggler = document.querySelector('#login_vis_toggler');
const passVisToggler = document.querySelector('#pass_vis_toggler');
const copyLoginBtn = document.querySelector('#copy_login_btn');
const copyPassBtn = document.querySelector('#copy_pass_btn');
const passwordInput = document.querySelector('#password_input');
const generateBtn = document.querySelector('#generate_btn');
const portalDropdownText = document.querySelector('#portal_dropdown_disp_text');
const saveBtn = document.querySelector('#save_btn');
const complexityContainers = document.querySelectorAll('.complexity_container')
const lengthSlider = document.querySelector('#length_range');
const lengthDisp = document.querySelector('#length_disp');

import { handleCopyBtn, handleVisToggler, updateBarDisplay, animateFadeEffect,  } from './main.js';
import { adjustInputWidth } from './auths.js';

saveBtn.addEventListener('click', function () {
  const loginData = loginInput.value;
  const passwordData = passwordInput.value;
  const authPortal = portalDropdownText.textContent;

  if (!passwordData || authPortal === 'Choose a portal') {
    animateFadeEffect(saveBtn, 'rgb(255, 40, 40)');
    return;
  }

  fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login: loginData,
        password: passwordData,
        auth: authPortal
      }),
  })
  .then((response) => {
    response.json()
    passwordInput.value = '';
    loginInput.value = '';
    animateFadeEffect(saveBtn, '#2cd472');
  })
  .catch((error) => console.error('Error:', error));
});

generateBtn.addEventListener('click', () => {
  const useUpper = document.querySelector('#uppercase_checkbox').checked;
  const useLower = document.querySelector('#lowercase_checkbox').checked;
  const useNumbers = document.querySelector('#numbers_checkbox').checked;
  const useSymbols = document.querySelector('#symbols_checkbox').checked;
  const length = lengthSlider.value;

  if (!useUpper && !useLower && !useNumbers && !useSymbols) {
    animateFadeEffect(generateBtn, 'rgb(255, 40, 40)');
    return;
  };
  
  fetch(`/api/generate?length=${length}&lowercase=${useLower}&uppercase=${useUpper}&numbers=${useNumbers}&symbols=${useSymbols}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(response => response.json())
  .then((data) => {
    passwordInput.value = data.password;
    animateFadeEffect(generateBtn, '#2cd472');
  })
  .catch((error) => console.error('Error:', error));
})

complexityContainers.forEach((container) => {
  const checkbox = container.getElementsByTagName('input')[0];
  container.addEventListener('click', () => {
    if (!checkbox.checked) animateFadeEffect(container, '#2cd472', false);
    else animateFadeEffect(container, 'rgb(255, 40, 40)', false);
    container.classList.toggle('inactive_complexity');
    checkbox.checked = !checkbox.checked
  })

  if (checkbox.checked) container.classList.remove('inactive_complexity');
  else container.classList.add('inactive_complexity');;
})

lengthSlider.addEventListener('input', () => updateBarDisplay(lengthSlider));

document.querySelectorAll('.dropdown').forEach((dropdown) => {
  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });
})

document.querySelectorAll('.dropdown_option').forEach((option) => {
  option.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelector('#portal_dropdown').classList.remove('open');
    option.closest('.dropdown').querySelector('.dropdown_disp_text').textContent = option.querySelector('.dropdown_option_value').textContent;
  });
})

document.addEventListener('click', (e) => {
  document.querySelectorAll('.dropdown').forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  })

  if (!lengthDisp.contains(e.target)) {
    lengthSlider.value = lengthDisp.value;
    updateBarDisplay(lengthSlider);
    lengthDisp.blur();
  }
});

window.onload = () => {

  document.querySelectorAll('.dropdown_menu').forEach((menu) => {
    let rect = menu.getBoundingClientRect();
    console.log((
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&     
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    ))
  })

  document.querySelectorAll('.dropdown_menu').forEach((menu) => {
    if (menu.children.length >= 4) {
      let height = 0;
      const children = menu.children;

      for (let i = 0; i < 4; i++) {
        height += parseInt(children[i].offsetHeight);
      }

      menu.style.maxHeight = `${height}px`;
    }
  })
}

lengthDisp.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (lengthDisp.value == '') lengthDisp.value = lengthSlider.value;
    else lengthSlider.value = lengthDisp.value;
    updateBarDisplay(lengthSlider);
    lengthDisp.blur();
  }
});

adjustInputWidth(lengthDisp);

updateBarDisplay(lengthSlider);
handleCopyBtn(copyLoginBtn);
handleCopyBtn(copyPassBtn);
handleVisToggler(loginVisToggler);
handleVisToggler(passVisToggler);