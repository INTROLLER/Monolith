const toolsContainer = document.querySelector('#tools_container');

const loginInput = document.querySelector('#login_input');
const loginVisToggler = document.querySelector('#login_vis_toggler');
const passVisToggler = document.querySelector('#pass_vis_toggler');
const passwordInput = document.querySelector('#password_input');
const generateBtn = document.querySelector('#generate_btn');

const authPortalSelect = document.querySelector('#auth_portal_select');
const saveBtn = document.querySelector('#save_btn');

const createPortalBtn = document.querySelector('#create_portal_btn');
const authPortalInput = document.querySelector('#auth_portal_input');

const complexityContainers = document.querySelectorAll('.complexity_container')
const rangeSlider = document.querySelector('#length_range');

const portalSelect = document.querySelector('#auth_portal_select');

const authListHldr = document.querySelector('#auth_list_holder')
const portalDeleteBtns = document.querySelectorAll('.portal_delete_btn');
const portalEditBtns = document.querySelectorAll('.portal_edit_btn');
const portalAcceptBtns = document.querySelectorAll('.portal_submit_edit_btn');
const portalCancelBtns = document.querySelectorAll('.portal_cancel_edit_btn');
const portalCards = document.querySelectorAll('.auth_portal_card');
const portalTitles = document.querySelectorAll('.portal_title');
const noPortalsHldr = document.querySelector('#no_portals_hldr');

const passDisp = document.querySelector('#pass_disp_container');
const passDispClose = document.querySelector('#pass_disp_close');
const passListHldr = document.querySelector('#pass_list_hldr');
const noCredsHldr = document.querySelector('#no_creds_hldr');

function updateBarDisplay(bar) {
  const min = parseFloat(bar.min) || 0;
  const max = parseFloat(bar.max) || 100;
  const value = parseFloat(bar.value);

  const percentage = ((value - min) / (max - min)) * 100;

  bar.style.background = `linear-gradient(to right, #2cd472 0%, #2cd472 ${percentage}%, #121b29 ${percentage}%, #121b29 100%)`;
  document.querySelector('#length_disp').innerHTML = bar.value;
}

function handleEditPortalBtn(btn) {
  btn.addEventListener('click', (e) => {
    const card = btn.closest('.auth_portal_card');
    const input = card.querySelector('.portal_title');
    const editBtn = card.querySelector('.portal_edit_btn');
    const deleteBtn = card.querySelector('.portal_delete_btn');
    const acceptBtn = card.querySelector('.portal_submit_edit_btn');
    const cancelBtn = card.querySelector('.portal_cancel_edit_btn');

    e.stopPropagation();

    editBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
    acceptBtn.style.display = 'flex';
    cancelBtn.style.display = 'flex';
    input.removeAttribute('readonly');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    
    input.style.caretColor = input.style.color || '#fff';
    input.style.borderBottom = `1px solid ${input.style.color || '#fff'}`;
  });
}

function handleSumbitPortalEditBtn(btn) {
  btn.addEventListener('click', (e) => {
    const card = btn.closest('.auth_portal_card');
    const input = card.querySelector('.portal_title');
    const editBtn = card.querySelector('.portal_edit_btn');
    const deleteBtn = card.querySelector('.portal_delete_btn');
    const acceptBtn = card.querySelector('.portal_submit_edit_btn');
    const cancelBtn = card.querySelector('.portal_cancel_edit_btn');
    const portalName = card.id;
    const option = authPortalSelect.querySelector(`#${portalName}_option`);
    const newPortalName = input.value;

    e.stopPropagation();

    if (!newPortalName || newPortalName === "") return;
    else if (newPortalName !== portalName) {
      if (newPortalName !== null) {
        fetch('/api/edit_portal_name', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            oldName: portalName,
            newName: newPortalName
          }),
        });
      }
    }

    input.setAttribute('readonly', true);
    input.style.borderBottom = 'none';
    input.style.removeProperty('caret-color');

    editBtn.style.display = 'flex';
    deleteBtn.style.display = 'flex';
    acceptBtn.style.display = 'none';
    cancelBtn.style.display = 'none';

    card.id = newPortalName;
    option.value = newPortalName;
    option.innerHTML = newPortalName;
    option.id = `${newPortalName}_option`;
  });
}

function handleCancelPortalEditBtn(btn) {
  btn.addEventListener('click', (e) => {
    const card = btn.closest('.auth_portal_card');
    const input = card.querySelector('.portal_title');
    const editBtn = card.querySelector('.portal_edit_btn');
    const deleteBtn = card.querySelector('.portal_delete_btn');
    const acceptBtn = card.querySelector('.portal_submit_edit_btn');
    const cancelBtn = card.querySelector('.portal_cancel_edit_btn');
    const portalName = card.id;

    e.stopPropagation();

    input.setAttribute('readonly', true);
    input.style.borderBottom = 'none';
    input.style.removeProperty('caret-color');

    editBtn.style.display = 'flex';
    deleteBtn.style.display = 'flex';
    acceptBtn.style.display = 'none';
    cancelBtn.style.display = 'none';

    input.value = portalName;
  });
}

function handleDeletePortalBtn(btn) {
  btn.addEventListener('click', (e) => {
    const confirm = window.confirm('Are you sure you want to delete this portal?');
    if (!confirm) return;

    const card = btn.closest('.auth_portal_card');
    const portalName = card.id;

    e.stopPropagation();

    fetch('/api/delete_portal', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        portal: portalName
      }),
    });

    card.remove();
    const option = document.querySelector(`#auth_portal_select #${portalName}_option`);
    if (option) option.remove();
    portalSelect.selectedIndex = 0;
    if (authListHldr.children.length <= 1) noPortalsHldr.style.display = 'flex';
  });
}

function handleEditCredBtn(btn) {
  btn.addEventListener('click', (e) => {
    const card = btn.closest('.cred_card');
    const inputHldr = btn.closest('.input_hldr');
    const input = inputHldr.querySelector('.data_input');
    const editBtn = btn
    const deleteBtn = card.querySelector('.cred_delete_btn');
    const acceptBtn = inputHldr.querySelector('.cred_submit_edit_btn');
    const cancelBtn = inputHldr.querySelector('.cred_cancel_edit_btn');
    const visToggler = inputHldr.querySelector('.vis_toggler');
    const copyBtn = inputHldr.querySelector('.copy_btn');

    e.stopPropagation();

    if (input.classList.contains('pass_input')) {
      inputHldr.dataset.type = 'password';
    } else if (input.classList.contains('login_input')) {
      inputHldr.dataset.type = 'login';
    }

    inputHldr.dataset.oldValue = input.value;
    input.style.caretColor = input.style.color || '#fff';
    editBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
    visToggler.style.display = 'none';
    copyBtn.style.display = 'none';
    acceptBtn.style.display = 'flex';
    cancelBtn.style.display = 'flex';
    input.removeAttribute('readonly');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  });
}

function handleSumbitCredEditBtn(btn) {
  btn.addEventListener('click', (e) => {
    const card = btn.closest('.cred_card');
    const inputHldr = btn.closest('.input_hldr');
    const input = inputHldr.querySelector('.data_input');
    const editBtn = inputHldr.querySelector('.cred_edit_btn');
    const deleteBtn = card.querySelector('.cred_delete_btn');
    const acceptBtn = inputHldr.querySelector('.cred_submit_edit_btn');
    const cancelBtn = inputHldr.querySelector('.cred_cancel_edit_btn');
    const visToggler = inputHldr.querySelector('.vis_toggler');
    const copyBtn = inputHldr.querySelector('.copy_btn');
    const index = card.id;
    const newValue = input.value;

    e.stopPropagation();

    if (!newValue || newValue === "") return;
    else if (newValue !== inputHldr.dataset.oldValue) {
      if (newValue !== null) {
        fetch('/api/edit_credentials', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: inputHldr.dataset.type,
            index: index,
            newData: newValue,
            portalName: card.dataset.portalName
          }),
        });
      }
    }

    input.setAttribute('readonly', true);
    input.style.removeProperty('caret-color');

    inputHldr.removeAttribute('id');
    editBtn.removeAttribute('style');
    deleteBtn.removeAttribute('style');
    acceptBtn.removeAttribute('style');
    cancelBtn.removeAttribute('style');
    visToggler.removeAttribute('style');
    copyBtn.removeAttribute('style');
  });
}

function handleCancelCredEditBtn(btn) {
  btn.addEventListener('click', (e) => {
    const card = btn.closest('.cred_card');
    const inputHldr = btn.closest('.input_hldr');
    const input = inputHldr.querySelector('.data_input');
    const editBtn = inputHldr.querySelector('.cred_edit_btn');
    const deleteBtn = card.querySelector('.cred_delete_btn');
    const acceptBtn = inputHldr.querySelector('.cred_submit_edit_btn');
    const cancelBtn = inputHldr.querySelector('.cred_cancel_edit_btn');
    const visToggler = inputHldr.querySelector('.vis_toggler');
    const copyBtn = inputHldr.querySelector('.copy_btn');
    const inputValue = input.value;

    e.stopPropagation();

    input.setAttribute('readonly', true);
    input.style.removeProperty('caret-color');

    inputHldr.removeAttribute('id');
    editBtn.removeAttribute('style');
    deleteBtn.removeAttribute('style');
    acceptBtn.removeAttribute('style');
    cancelBtn.removeAttribute('style');
    visToggler.removeAttribute('style');
    copyBtn.removeAttribute('style');

    input.value = inputValue;
  });
}

function handleDeleteCredBtn(btn) {
  btn.addEventListener('click', (e) => {
    const confirm = window.confirm('Are you sure you want to delete this credential?');
    if (!confirm) return;

    const card = btn.closest('.cred_card');
    const index = card.id;

    e.stopPropagation();

    fetch('/api/delete_credential', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        index: index,
        portalName: card.dataset.portalName
      }),
    });

    card.remove();
    if (passListHldr.children.length <= 1) noCredsHldr.style.display = 'flex';
  });
}

function handleCopyBtn(btn) {
  btn.addEventListener('click', (e) => {
    const input = btn.closest('.input_hldr').querySelector('.data_input');
    const data = input.value;
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

function handlePortalCard(card) {
  card.addEventListener('click', () => {
    const portalName = card.id;
    
    fetch(`/api/get_portal?portal=${portalName}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    .then(response => response.json())
    .then(data => {
      const cardIcon = card.querySelector('.portal_card_icon')
      const arrow = card.querySelector('.portal_card_arrow')
      const cardTitle = card.querySelector('.portal_title')
      const allCards = document.querySelectorAll('.auth_portal_card');

      if (card.dataset.active === 'true') {
        card.dataset.active = 'false';
        passDisp.removeAttribute('style');
        toolsContainer.removeAttribute('style');
        cardIcon.innerHTML = 'shield_locked';
        cardIcon.style.color = '#fff';
        cardTitle.style.color = '#fff';
        arrow.innerHTML = 'arrow_forward_ios';
        card.removeAttribute('style');
        return;
      }

      allCards.forEach((card) => {
        if (card.dataset.active === 'true') {
          card.querySelector('.portal_card_icon').innerHTML = 'shield_locked';
          card.querySelector('.portal_card_icon').style.color = '#fff';
          card.querySelector('.portal_title').style.color = '#fff';
          card.querySelector('.portal_card_arrow').innerHTML = 'arrow_forward_ios';
          card.removeAttribute('style');
          card.dataset.active = 'false';
          return;
        };
      })

      cardIcon.innerHTML = 'policy';
      cardIcon.style.color = '#2cd472';
      cardTitle.style.color = '#2cd472';
      arrow.innerHTML = 'close';
      card.dataset.active = 'true';
      card.style.backgroundColor = '#182436';

      passDisp.style.display = 'flex';
      toolsContainer.style.display = 'none';
      document.querySelector('#pass_disp_title').innerHTML = portalName;
      const credsLength = Object.values(data)[0].length;

      if (credsLength !== 0) {
        noCredsHldr.style.display = 'none';

        for (let i = 0; i < credsLength; i++) {
          const cardHtml = `
            <div id="${i}" class="cred_card" data-portal-name="${portalName}">
              <div class="cred_card_input_container">
                <div class="input_hldr">
                  <div class="input_cover">
                    <i class="material-symbols-rounded input_icon">person</i>
                    <input type="text" id="login_input_${i}" class="data_input login_input" readonly>
                  </div>
                  <button type="button" id="copy_login_btn_${i}" class="copy_btn default_btn"><i class="material-symbols-rounded btn_icon">content_copy</i></button>
                  <button type="button" id="login_vis_toggler_${i}" class="vis_toggler default_btn"><i class="material-symbols-rounded btn_icon">visibility_off</i></button>
                  <button type="button" id="login_edit_btn_${i}" class="cred_edit_btn default_btn"><i class="material-symbols-rounded btn_icon">stylus</i></button>
                  <button type="button" id="login_submit_edit_btn_${i}" class="cred_submit_edit_btn default_btn"><i class="material-symbols-rounded btn_icon">check</i></button>
                  <button type="button" id="login_cancel_edit_btn_${i}" class="cred_cancel_edit_btn default_btn"><i class="material-symbols-rounded btn_icon">close</i></button>
                </div>
                <div class="input_hldr">
                  <div class="input_cover">
                    <i class="material-symbols-rounded input_icon">encrypted</i>
                    <input type="password" id="password_input_${i}" class="data_input pass_input" readonly>
                  </div>
                  <button type="button" id="copy_pass_btn_${i}" class="copy_btn default_btn"><i class="material-symbols-rounded btn_icon">content_copy</i></button>
                  <button type="button" id="pass_vis_toggler_${i}" class="vis_toggler default_btn"><i class="material-symbols-rounded btn_icon">visibility</i></button>
                  <button type="button" id="pass_edit_btn_${i}" class="cred_edit_btn default_btn"><i class="material-symbols-rounded btn_icon">stylus</i></button>
                  <button type="button" id="pass_submit_edit_btn_${i}" class="cred_submit_edit_btn default_btn"><i class="material-symbols-rounded btn_icon">check</i></button>
                  <button type="button" id="pass_cancel_edit_btn_${i}" class="cred_cancel_edit_btn default_btn"><i class="material-symbols-rounded btn_icon">close</i></button>
                </div>
              </div>
              <button type="button" id="cred_delete_btn_${i}" class="cred_delete_btn default_btn"><i class="material-symbols-rounded btn_icon">delete_forever</i></button>
            </div>
          `
          passListHldr.insertAdjacentHTML('beforeend', cardHtml);
          passListHldr.querySelector(`#login_input_${i}`).value = Object.values(data)[0][i].login;
          passListHldr.querySelector(`#password_input_${i}`).value = Object.values(data)[0][i].password;
  
          handleCopyBtn(passListHldr.querySelector(`#copy_login_btn_${i}`));
          handleCopyBtn(passListHldr.querySelector(`#copy_pass_btn_${i}`));
  
          handleVisToggler(passListHldr.querySelector(`#login_vis_toggler_${i}`));
          handleVisToggler(passListHldr.querySelector(`#pass_vis_toggler_${i}`));
  
          handleEditCredBtn(passListHldr.querySelector(`#login_edit_btn_${i}`));
          handleEditCredBtn(passListHldr.querySelector(`#pass_edit_btn_${i}`));
  
          handleDeleteCredBtn(passListHldr.querySelector(`#cred_delete_btn_${i}`));
  
          handleSumbitCredEditBtn(passListHldr.querySelector(`#login_submit_edit_btn_${i}`));
          handleSumbitCredEditBtn(passListHldr.querySelector(`#pass_submit_edit_btn_${i}`));
  
          handleCancelCredEditBtn(passListHldr.querySelector(`#login_cancel_edit_btn_${i}`));
          handleCancelCredEditBtn(passListHldr.querySelector(`#pass_cancel_edit_btn_${i}`));
        }
      } else {
        noCredsHldr.style.display = 'flex';
      }
  })})
}

function adjustInputWidth(input) {
  const setWidth = () => {
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden'; // Make it invisible
    tempSpan.style.position = 'absolute'; // Prevent affecting layout
    tempSpan.style.whiteSpace = 'pre'; // Preserve spaces exactly as input
    tempSpan.style.font = getComputedStyle(input).font; // Match font styles
    tempSpan.textContent = input.value || input.placeholder || ''; // Use value or placeholder

    document.body.appendChild(tempSpan);
    input.style.width = `${tempSpan.offsetWidth + 2}px`; // Add slight buffer
    document.body.removeChild(tempSpan);
  };

  setWidth(); // Set initial width
  input.addEventListener('input', setWidth);
}

window.onload = () => {
  portalTitles.forEach((input) => {
    adjustInputWidth(input);
  
    input.addEventListener('click', (e) => e.stopPropagation());
  });
};

portalAcceptBtns.forEach((btn) => {
  handleSumbitPortalEditBtn(btn);
});

portalCancelBtns.forEach((btn) => {
  handleCancelPortalEditBtn(btn);
});

handleVisToggler(loginVisToggler);
handleVisToggler(passVisToggler);

saveBtn.addEventListener('click', function () {
  const loginData = loginInput.value;
  const passwordData = passwordInput.value;
  const authPortal = authPortalSelect.value;

  if (!passwordData || !authPortal) {
    saveBtn.style.backgroundColor = 'red';
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
    saveBtn.style.backgroundColor = '#2cd472';
    setTimeout(() => {
      saveBtn.removeAttribute('style');
    }, 100);
  })
  .catch((error) => console.error('Error:', error));
});

createPortalBtn.addEventListener('click', function () {
  const authPortal = authPortalInput.value;

  if (!authPortal || authPortal === "") return

  if (!authPortal) {
    createPortalBtn.style.backgroundColor = 'red';
    setTimeout(() => {
      createPortalBtn.removeAttribute('style');
    }, 100);
    return;
  }

  fetch('/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth: authPortal
      }),
  })
  .then((response) => {
    if (noPortalsHldr.style.display !== 'none') noPortalsHldr.style.display = 'none';

    response.json()
    createPortalBtn.style.backgroundColor = '#2cd472';
    authPortalInput.value = '';
    authPortalInput.focus();

    const newCard = document.createElement('div');
    newCard.id = authPortal;
    newCard.classList.add('auth_portal_card');

    newCard.innerHTML = `<div class="portal_name_hldr">
                        <i class="material-symbols-rounded portal_card_icon">shield_locked</i>
                        <input type="text" class="portal_title" readonly value="${authPortal}">
                        <div class="portal_btns_hldr">
                            <button type="button" class="portal_edit_btn transparent_btn"><i class="material-symbols-rounded btn_icon">stylus</i></button>
                            <button type="button" class="portal_delete_btn transparent_btn"><i class="material-symbols-rounded btn_icon">delete_forever</i></button>
                            <button type="button" class="portal_submit_edit_btn transparent_btn"><i class="material-symbols-rounded btn_icon">check</i></button>
                            <button type="button" class="portal_cancel_edit_btn transparent_btn"><i class="material-symbols-rounded btn_icon">close</i></button>
                        </div>
                        </div>
                        <i class="material-symbols-rounded portal_card_arrow">arrow_forward_ios</i>
                        `

    authListHldr.appendChild(newCard);

    const editBtn = newCard.querySelector('.portal_edit_btn');
    const deleteBtn = newCard.querySelector('.portal_delete_btn');
    const portalTitle = newCard.querySelector('.portal_title');

    authPortalSelect.innerHTML += `
      <option id="${authPortal}_option" value="${authPortal}">${authPortal}</option>
    `

    adjustInputWidth(portalTitle);
    portalTitle.addEventListener('click', (e) => e.stopPropagation());
    handlePortalCard(newCard);
    handleEditPortalBtn(editBtn);
    handleDeletePortalBtn(deleteBtn);
    
    setTimeout(() => {
      createPortalBtn.removeAttribute('style');
    }, 100);
  })
  .catch((error) => console.error('Error:', error));
});

generateBtn.addEventListener('click', () => {
  const useUpper = document.querySelector('#uppercase_checkbox').checked;
  const useLower = document.querySelector('#lowercase_checkbox').checked;
  const useNumbers = document.querySelector('#numbers_checkbox').checked;
  const useSymbols = document.querySelector('#symbols_checkbox').checked;
  const length = rangeSlider.value;

  if (!useUpper && !useLower && !useNumbers && !useSymbols) return;
  
  fetch(`/api/generate?length=${length}&lowercase=${useLower}&uppercase=${useUpper}&numbers=${useNumbers}&symbols=${useSymbols}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(response => response.json())
  .then((data) => {
    passwordInput.value = data.password;
  })
  .catch((error) => console.error('Error:', error));
})

passDispClose.addEventListener('click', () => {
  const allCards = document.querySelectorAll('.auth_portal_card');

  passDisp.removeAttribute('style');
  toolsContainer.removeAttribute('style');

  allCards.forEach((card) => {
    if (card.dataset.active === 'true') {
      card.querySelector('.portal_card_icon').innerHTML = 'shield_locked';
      card.querySelector('.portal_card_icon').style.color = '#fff';
      card.querySelector('.portal_title').style.color = '#fff';
      card.querySelector('.portal_card_arrow').innerHTML = 'arrow_forward_ios';
      card.dataset.active = 'false';
      card.removeAttribute('style');
      return;
    };
  })
})

complexityContainers.forEach((container) => {
  container.addEventListener('click', () => {
    container.getElementsByTagName('input')[0].checked = !container.getElementsByTagName('input')[0].checked
  })
})

portalEditBtns.forEach(handleEditPortalBtn);
portalDeleteBtns.forEach(handleDeletePortalBtn);
portalCards.forEach(handlePortalCard);

rangeSlider.addEventListener('input', () => updateBarDisplay(rangeSlider));

if (authListHldr.children.length <= 1) noPortalsHldr.style.display = 'flex';

portalSelect.selectedIndex = 0;

// Initialize the position on page load
updateBarDisplay(rangeSlider);