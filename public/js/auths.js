const toolsContainer = document.querySelector('#tools_container');

const createPortalBtn = document.querySelector('#create_portal_btn');
const authPortalInput = document.querySelector('#auth_portal_input');

const authListHldr = document.querySelector('#auth_list_holder')
const portalDeleteBtns = document.querySelectorAll('.portal_delete_btn');
const portalEditBtns = document.querySelectorAll('.portal_edit_btn');
const portalAcceptBtns = document.querySelectorAll('.portal_submit_edit_btn');
const portalCancelBtns = document.querySelectorAll('.portal_cancel_edit_btn');
const portalCards = document.querySelectorAll('.auth_portal_card');
const portalTitles = document.querySelectorAll('.portal_title');
const noPortalsHldr = document.querySelector('#no_portals_hldr');

const portalDropdown = document.querySelector('#portal_dropdown');
const portalDropdownText = document.querySelector('#portal_dropdown_disp_text');

const passDisp = document.querySelector('#pass_disp_container');
const passListHldr = document.querySelector('#pass_list_hldr');
const noCredsHldr = document.querySelector('#no_creds_hldr');

const authSearch = document.querySelector('#auth_search_input');

import { handleCopyBtn, handleVisToggler, animateFadeEffect } from './main.js';
import { handleEditCredBtn, handleSumbitCredEditBtn, handleCancelCredEditBtn, handleDeleteCredBtn, handleCredInputSubmit} from './pass_disp.js';

function handleEditPortalBtn(btn) {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    const card = btn.closest('.auth_portal_card');
    const input = card.querySelector('.portal_title');
    const editBtn = card.querySelector('.portal_edit_btn');
    const deleteBtn = card.querySelector('.portal_delete_btn');
    const acceptBtn = card.querySelector('.portal_submit_edit_btn');
    const cancelBtn = card.querySelector('.portal_cancel_edit_btn');

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
    e.stopPropagation();

    const card = btn.closest('.auth_portal_card');
    const input = card.querySelector('.portal_title');
    const editBtn = card.querySelector('.portal_edit_btn');
    const deleteBtn = card.querySelector('.portal_delete_btn');
    const acceptBtn = card.querySelector('.portal_submit_edit_btn');
    const cancelBtn = card.querySelector('.portal_cancel_edit_btn');
    const portalName = card.id;
    const option = portalDropdown.querySelector(`#${portalName}_option`);
    const newPortalName = input.value;

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

    editBtn.removeAttribute('style');
    deleteBtn.removeAttribute('style');
    acceptBtn.removeAttribute('style');
    cancelBtn.removeAttribute('style');

    card.id = newPortalName;
    option.value = newPortalName;
    option.innerHTML = newPortalName;
    option.id = `${newPortalName}_option`;
  });
}

function handleCancelPortalEditBtn(btn) {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();

    const card = btn.closest('.auth_portal_card');
    const input = card.querySelector('.portal_title');
    const editBtn = card.querySelector('.portal_edit_btn');
    const deleteBtn = card.querySelector('.portal_delete_btn');
    const acceptBtn = card.querySelector('.portal_submit_edit_btn');
    const cancelBtn = card.querySelector('.portal_cancel_edit_btn');
    const portalName = card.id;

    input.setAttribute('readonly', true);
    input.style.borderBottom = 'none';
    input.style.removeProperty('caret-color');

    editBtn.removeAttribute('style');
    deleteBtn.removeAttribute('style');
    acceptBtn.removeAttribute('style');
    cancelBtn.removeAttribute('style'); 

    input.value = portalName;
    adjustInputWidth(input);
  });
}

function handleDeletePortalBtn(btn) {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();

    const confirm = window.confirm('Are you sure you want to delete this portal?');
    if (!confirm) return;

    const card = btn.closest('.auth_portal_card');
    const portalName = card.id;

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
    portalDropdownText.textContent = 'Choose a portal';
    if (authListHldr.children.length <= 1) noPortalsHldr.style.display = 'flex';
  });
}

function handlePortalInputSubmit(input) {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const card = input.closest('.auth_portal_card');
      const editBtn = card.querySelector('.portal_edit_btn');
      const deleteBtn = card.querySelector('.portal_delete_btn');
      const acceptBtn = card.querySelector('.portal_submit_edit_btn');
      const cancelBtn = card.querySelector('.portal_cancel_edit_btn');
      const portalName = card.id;
      const option = portalDropdown.querySelector(`#${portalName}_option`);
      const newPortalName = input.value;

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

      editBtn.removeAttribute('style');
      deleteBtn.removeAttribute('style');
      acceptBtn.removeAttribute('style');
      cancelBtn.removeAttribute('style');

      if (portalDropdownText.textContent === portalName) portalDropdownText.textContent = newPortalName;
      card.id = newPortalName;
      option.querySelector('.dropdown_option_value').textContent = newPortalName;
      option.id = `${newPortalName}_option`;
    }
  })
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
        cardIcon.innerHTML = 'folder';
        cardIcon.style.color = '#fff';
        cardTitle.style.color = '#fff';
        arrow.innerHTML = 'arrow_forward_ios';
        card.removeAttribute('style');
        return;
      }

      allCards.forEach((card) => {
        if (card.dataset.active === 'true') {
          card.querySelector('.portal_card_icon').innerHTML = 'folder';
          card.querySelector('.portal_card_icon').style.color = '#fff';
          card.querySelector('.portal_title').style.color = '#fff';
          card.querySelector('.portal_card_arrow').innerHTML = 'arrow_forward_ios';
          card.removeAttribute('style');
          card.dataset.active = 'false';
          return;
        };
      })

      cardIcon.innerHTML = 'folder_open';
      cardIcon.style.color = '#2cd472';
      cardTitle.style.color = '#2cd472';
      arrow.innerHTML = 'close';
      card.dataset.active = 'true';
      card.style.backgroundColor = '#182436';

      passDisp.style.display = 'flex';
      toolsContainer.style.display = 'none';

      document.querySelector('#pass_disp_title').innerHTML = portalName;
      const credsLength = Object.values(data)[0].length;

      const renderedCreds = passListHldr.querySelectorAll('.cred_card');
      const renderedCredsLength = renderedCreds.length
      for (let i = 0; i < renderedCredsLength; i++) {
        renderedCreds[i].remove();
      }

      if (credsLength !== 0) {
        noCredsHldr.style.display = 'none';

        for (let i = 0; i < credsLength; i++) {
          const cardHtml = `
            <div id="${i}" class="cred_card" data-portal-name="${portalName}">
              <button type="button" id="cred_delete_btn_${i}" class="cred_delete_btn transparent_btn"><i class="material-symbols-rounded btn_icon">do_not_disturb_on</i></button>
              <div class="cred_card_input_container">
                <div class="input_hldr">
                  <div class="input_cover">
                    <i class="material-symbols-rounded input_icon">person</i>
                    <input type="text" id="login_input_${i}" class="data_input login_input" readonly>
                    <button type="button" id="login_vis_toggler_${i}" class="vis_toggler transparent_btn"><i class="material-symbols-rounded btn_icon">visibility_off</i></button>
                  </div>
                  <button type="button" id="copy_login_btn_${i}" class="copy_btn transparent_btn"><i class="material-symbols-rounded btn_icon">content_copy</i></button>
                  <button type="button" id="login_edit_btn_${i}" class="cred_edit_btn transparent_btn"><i class="material-symbols-rounded btn_icon">stylus</i></button>
                  <button type="button" id="login_submit_edit_btn_${i}" class="cred_submit_edit_btn transparent_btn"><i class="material-symbols-rounded btn_icon">check</i></button>
                  <button type="button" id="login_cancel_edit_btn_${i}" class="cred_cancel_edit_btn transparent_btn"><i class="material-symbols-rounded btn_icon">close</i></button>
                </div>
                <div class="input_hldr">
                  <div class="input_cover">
                    <i class="material-symbols-rounded input_icon">encrypted</i>
                    <input type="password" id="password_input_${i}" class="data_input pass_input" readonly>
                    <button type="button" id="pass_vis_toggler_${i}" class="vis_toggler transparent_btn"><i class="material-symbols-rounded btn_icon">visibility</i></button>
                  </div>
                  <button type="button" id="copy_pass_btn_${i}" class="copy_btn transparent_btn"><i class="material-symbols-rounded btn_icon">content_copy</i></button>
                  <button type="button" id="pass_edit_btn_${i}" class="cred_edit_btn transparent_btn"><i class="material-symbols-rounded btn_icon">stylus</i></button>
                  <button type="button" id="pass_submit_edit_btn_${i}" class="cred_submit_edit_btn transparent_btn"><i class="material-symbols-rounded btn_icon">check</i></button>
                  <button type="button" id="pass_cancel_edit_btn_${i}" class="cred_cancel_edit_btn transparent_btn"><i class="material-symbols-rounded btn_icon">close</i></button>
                </div>
              </div>
            </div>
          `
          passListHldr.insertAdjacentHTML('beforeend', cardHtml);

          const logInput = passListHldr.querySelector(`#login_input_${i}`);
          const passInput = passListHldr.querySelector(`#password_input_${i}`);

          logInput.value = Object.values(data)[0][i].login;
          passInput.value = Object.values(data)[0][i].password;

          handleCredInputSubmit(logInput);
          handleCredInputSubmit(passInput);
  
          handleCopyBtn(passListHldr.querySelector(`#copy_login_btn_${i}`));
          handleCopyBtn(passListHldr.querySelector(`#copy_pass_btn_${i}`));
  
          handleVisToggler(passListHldr.querySelector(`#login_vis_toggler_${i}`));
          handleVisToggler(passListHldr.querySelector(`#pass_vis_toggler_${i}`));
  
          handleEditCredBtn(passListHldr.querySelector(`#login_edit_btn_${i}`));
          handleEditCredBtn(passListHldr.querySelector(`#pass_edit_btn_${i}`));
  
          handleSumbitCredEditBtn(passListHldr.querySelector(`#login_submit_edit_btn_${i}`));
          handleSumbitCredEditBtn(passListHldr.querySelector(`#pass_submit_edit_btn_${i}`));
  
          handleCancelCredEditBtn(passListHldr.querySelector(`#login_cancel_edit_btn_${i}`));
          handleCancelCredEditBtn(passListHldr.querySelector(`#pass_cancel_edit_btn_${i}`));

          handleDeleteCredBtn(passListHldr.querySelector(`#cred_delete_btn_${i}`));
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

authPortalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const authPortal = authPortalInput.value;

    if (!authPortal || authPortal === "") {
      animateFadeEffect(createPortalBtn, 'rgb(255, 40, 40)');
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
      animateFadeEffect(createPortalBtn, '#2cd472');

      authPortalInput.value = '';
      authPortalInput.focus();

      const newCard = document.createElement('div');
      newCard.id = authPortal;
      newCard.classList.add('auth_portal_card');

      newCard.innerHTML = `<div class="portal_name_hldr">
                          <i class="material-symbols-rounded portal_card_icon">folder</i>
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

      portalDropdownText.innerHTML += `
        <div id="${authPortal}_option" class="dropdown_option">${authPortal}</div>
      `

      adjustInputWidth(portalTitle);
      handlePortalInputSubmit(portalTitle);
      portalTitle.addEventListener('click', (e) => e.stopPropagation());
      handlePortalCard(newCard);
      handleEditPortalBtn(editBtn);
      handleDeletePortalBtn(deleteBtn);
    })
    .catch((error) => console.error('Error:', error));
  }
})

createPortalBtn.addEventListener('click', function () {
  const authPortal = authPortalInput.value;

  if (!authPortal || authPortal === "") {
    animateFadeEffect(createPortalBtn, 'rgb(255, 40, 40)');
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
    animateFadeEffect(createPortalBtn, '#2cd472');

    authPortalInput.value = '';
    authPortalInput.focus();

    const newCard = document.createElement('div');
    newCard.id = authPortal;
    newCard.classList.add('auth_portal_card');

    newCard.innerHTML = `<div class="portal_name_hldr">
                        <i class="material-symbols-rounded portal_card_icon">folder</i>
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

    portalDropdownText.innerHTML += `
      <div id="${authPortal}_option" class="dropdown_option">${authPortal}</div>
    `

    adjustInputWidth(portalTitle);
    handlePortalInputSubmit(portalTitle);
    portalTitle.addEventListener('click', (e) => e.stopPropagation());
    handlePortalCard(newCard);
    handleEditPortalBtn(editBtn);
    handleDeletePortalBtn(deleteBtn);
  })
  .catch((error) => console.error('Error:', error));
});

authSearch.addEventListener('input', () => {
  const searchValue = authSearch.value.toLowerCase();

  authListHldr.querySelectorAll('.auth_portal_card').forEach((card) => {
    if (card.id.toLowerCase().includes(searchValue)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
});

window.onload = () => {
  portalTitles.forEach((input) => {
    adjustInputWidth(input);
    handlePortalInputSubmit(input);
  
    input.addEventListener('click', (e) => e.stopPropagation());
  });
};

if (authListHldr.children.length <= 1) noPortalsHldr.style.display = 'flex';

portalAcceptBtns.forEach(handleSumbitPortalEditBtn);
portalCancelBtns.forEach(handleCancelPortalEditBtn)
portalEditBtns.forEach(handleEditPortalBtn);
portalDeleteBtns.forEach(handleDeletePortalBtn);
portalCards.forEach(handlePortalCard);