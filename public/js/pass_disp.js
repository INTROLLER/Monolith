const toolsContainer = document.querySelector('#tools_container');

const passDisp = document.querySelector('#pass_disp_container');
const passListHldr = document.querySelector('#pass_list_hldr');
const noCredsHldr = document.querySelector('#no_creds_hldr');

const passDispCloser = document.querySelector('#pass_disp_closer');

const passSearch = document.querySelector('#pass_search_input');

function handleEditCredBtn(btn) {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();

    const inputHldr = btn.closest('.input_hldr');
    const input = inputHldr.querySelector('.data_input');
    const editBtn = btn
    const acceptBtn = inputHldr.querySelector('.cred_submit_edit_btn');
    const cancelBtn = inputHldr.querySelector('.cred_cancel_edit_btn');
    const copyBtn = inputHldr.querySelector('.copy_btn');

    if (input.classList.contains('pass_input')) {
      inputHldr.dataset.type = 'password';
    } else if (input.classList.contains('login_input')) {
      inputHldr.dataset.type = 'login';
    }

    inputHldr.dataset.oldValue = input.value;
    input.style.caretColor = input.style.color || '#fff';
    editBtn.style.display = 'none';
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
    e.stopPropagation();

    const card = btn.closest('.cred_card');
    const inputHldr = btn.closest('.input_hldr');
    const input = inputHldr.querySelector('.data_input');
    const editBtn = inputHldr.querySelector('.cred_edit_btn');
    const acceptBtn = inputHldr.querySelector('.cred_submit_edit_btn');
    const cancelBtn = inputHldr.querySelector('.cred_cancel_edit_btn');
    const copyBtn = inputHldr.querySelector('.copy_btn');
    const index = card.id;
    const newValue = input.value;

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
    acceptBtn.removeAttribute('style');
    cancelBtn.removeAttribute('style');
    copyBtn.removeAttribute('style');
  });
}

function handleCancelCredEditBtn(btn) {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();

    const inputHldr = btn.closest('.input_hldr');
    const input = inputHldr.querySelector('.data_input');
    const editBtn = inputHldr.querySelector('.cred_edit_btn');
    const acceptBtn = inputHldr.querySelector('.cred_submit_edit_btn');
    const cancelBtn = inputHldr.querySelector('.cred_cancel_edit_btn');
    const copyBtn = inputHldr.querySelector('.copy_btn');

    input.setAttribute('readonly', true);
    input.style.removeProperty('caret-color');

    inputHldr.removeAttribute('id');
    editBtn.removeAttribute('style');
    acceptBtn.removeAttribute('style');
    cancelBtn.removeAttribute('style');
    copyBtn.removeAttribute('style');

    input.value = inputHldr.dataset.oldValue;
  });
}

function handleCredInputSubmit(input) {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const card = input.closest('.cred_card');
      const inputHldr = input.closest('.input_hldr');
      const editBtn = inputHldr.querySelector('.cred_edit_btn');
      const acceptBtn = inputHldr.querySelector('.cred_submit_edit_btn');
      const cancelBtn = inputHldr.querySelector('.cred_cancel_edit_btn');
      const copyBtn = inputHldr.querySelector('.copy_btn');
      const index = card.id;
      const newValue = input.value;

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
      acceptBtn.removeAttribute('style');
      cancelBtn.removeAttribute('style');
      copyBtn.removeAttribute('style');
    }
  });
}

function handleDeleteCredBtn(btn) {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();

    const confirm = window.confirm('Are you sure you want to delete this credential?');
    if (!confirm) return;

    const card = btn.closest('.cred_card');
    const index = card.id;

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

passDispCloser.addEventListener('click', () => {
  passDisp.style.display = 'none';
  toolsContainer.style.display = 'flex';
  document.querySelectorAll('.auth_portal_card.active').forEach(card => card.classList.remove('active'));
})

passSearch.addEventListener('input', () => {
  const searchValue = passSearch.value.toLowerCase();
  const allCards = document.querySelectorAll('.cred_card');

  if (!searchValue == '') {
    const inputCleanser = passSearch.parentElement.querySelector('.input_cleanser');
    inputCleanser.style.display = 'flex';
  } else {
    const inputCleanser = passSearch.parentElement.querySelector('.input_cleanser');
    inputCleanser.style.display = 'none';
  }

  allCards.forEach((card) => {
    if (card.querySelector('.login_input').value.toLowerCase().includes(searchValue)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
})

export { handleEditCredBtn, handleSumbitCredEditBtn, handleCancelCredEditBtn, handleDeleteCredBtn, handleCredInputSubmit };