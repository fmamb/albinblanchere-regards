'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { menuButton?.setAttribute('aria-expanded', 'false'); navigation?.classList.remove('is-open'); }
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation?.classList.contains('is-open')) { closeMenu(); menuButton.focus(); } });
const captions = {attente:'« Il attend quelqu’un. »', depart:'« Il vient de faire ses adieux. »', neutre:'Un homme est assis sur un banc.'};
const captionButtons = Array.from(document.querySelectorAll('[data-caption]'));
captionButtons.forEach(button => button.addEventListener('click', () => {
  captionButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelector('#caption').textContent = captions[button.dataset.caption];
  if (button.dataset.caption !== 'attente') document.querySelector('#experiment-reveal').hidden = false;
}));
const form = document.querySelector('#contact-form');
const draft = document.querySelector('#draft');
if (form) form.hidden = false;
form?.addEventListener('input', event => event.target.setCustomValidity?.(''));
document.querySelectorAll('.choose-subject').forEach(link => link.addEventListener('click', () => {
  if (!form) return;
  const message = form.elements.message;
  const suggestion = 'Le sujet « ' + link.dataset.subject + ' » m’intéresse pour notre programmation.\n\n';
  if (!message.value.trim()) message.value = suggestion;
  form.hidden = false; draft.hidden = true;
}));
form?.addEventListener('submit', event => {
  event.preventDefault();
  for (const input of form.querySelectorAll('input[required],textarea[required]')) {
    input.setCustomValidity(input.value.trim() ? '' : 'Merci de compléter ce champ.');
  }
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const subject = 'Proposition de rencontre — ' + values.get('structure').trim();
  const message = 'Bonjour Albin,\n\n' + values.get('message').trim() + '\n\n' + values.get('nom').trim() + '\n' + values.get('structure').trim() + '\n' + values.get('email').trim();
  document.querySelector('#draft-text').textContent = message;
  document.querySelector('#draft-mail').href = 'mailto:albin.blanchere@ootbox.info?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(message);
  form.hidden = true; draft.hidden = false; draft.focus({preventScroll:true});
});
document.querySelector('#edit-draft')?.addEventListener('click', () => {draft.hidden = true;form.hidden = false;form.elements.message.focus({preventScroll:true});});
document.querySelector('#copy-draft')?.addEventListener('click', async () => {
  const text = document.querySelector('#draft-text').textContent;
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText(text); status.textContent = 'Message copié. Adresse : albin.blanchere@ootbox.info'; }
  catch { const range = document.createRange(); range.selectNodeContents(document.querySelector('#draft-text')); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); status.textContent = 'Le texte est sélectionné. Copiez-le avec le raccourci de votre appareil.'; }
});
document.querySelector('#print-sheet')?.addEventListener('click', () => window.print());
