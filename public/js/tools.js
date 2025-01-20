const loginInput = document.querySelector('#login_input');
const loginVisToggler = document.querySelector('#login_vis_toggler');
const passVisToggler = document.querySelector('#pass_vis_toggler');
const copyLoginBtn = document.querySelector('#copy_login_btn');
const copyPassBtn = document.querySelector('#copy_pass_btn');
const passwordInput = document.querySelector('#password_input');
const generateBtn = document.querySelector('#generate_btn');
const authPortalSelect = document.querySelector('#auth_portal_select');
const saveBtn = document.querySelector('#save_btn');
const complexityContainers = document.querySelectorAll('.complexity_container')
const lengthSlider = document.querySelector('#length_range');

import { handleCopyBtn, handleVisToggler, updateBarDisplay } from './main.js';

saveBtn.addEventListener('click', function () {
  const loginData = loginInput.value;
  const passwordData = passwordInput.value;
  const authPortal = authPortalSelect.value;

  if (!passwordData || !authPortal) {
    saveBtn.style.backgroundColor = 'rgb(255, 40, 40)';
    saveBtn.style.boxShadow = '0 0 5px 3px rgb(255, 40, 40)';
    setTimeout(() => {
      saveBtn.removeAttribute('style');
    }, 100);
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
    saveBtn.style.backgroundColor = '#2cd472';
    saveBtn.style.boxShadow = '0 0 5px 3px #2cd472';
    setTimeout(() => {
      saveBtn.removeAttribute('style');
    }, 100);
  })
  .catch((error) => console.error('Error:', error));
});

generateBtn.addEventListener('click', () => {
  const useUpper = document.querySelector('#uppercase_checkbox').checked;
  const useLower = document.querySelector('#lowercase_checkbox').checked;
  const useNumbers = document.querySelector('#numbers_checkbox').checked;
  const useSymbols = document.querySelector('#symbols_checkbox').checked;
  const length = lengthSlider.value;

  if (!useUpper && !useLower && !useNumbers && !useSymbols) return;
  
  fetch(`/api/generate?length=${length}&lowercase=${useLower}&uppercase=${useUpper}&numbers=${useNumbers}&symbols=${useSymbols}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(response => response.json())
  .then((data) => {
    passwordInput.value = data.password;
    generateBtn.style.backgroundColor = '#2cd472';
    generateBtn.style.boxShadow = '0 0 5px 3px #2cd472';
    setTimeout(() => {
      generateBtn.removeAttribute('style');
    }, 100);
  })
  .catch((error) => console.error('Error:', error));
})

complexityContainers.forEach((container) => {
  container.addEventListener('click', () => {
    container.getElementsByTagName('input')[0].checked = !container.getElementsByTagName('input')[0].checked
  })
})

lengthSlider.addEventListener('input', () => updateBarDisplay(lengthSlider));

authPortalSelect.selectedIndex = 0;

updateBarDisplay(lengthSlider);
handleCopyBtn(copyLoginBtn);
handleCopyBtn(copyPassBtn);
handleVisToggler(loginVisToggler);
handleVisToggler(passVisToggler);