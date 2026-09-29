const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.navigation');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
    }
  });
}

const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#form-status');
const contactEmail = 'yocreoen@miparaguay.com.py';
const whatsappNumber = '595981402416';

if (contactForm && contactStatus) {
  document.querySelectorAll('[data-contact-motive]').forEach((link) => {
    link.addEventListener('click', () => {
      contactForm.elements.motivo.value = link.dataset.contactMotive;
      contactStatus.textContent = `Motivo seleccionado: ${link.dataset.contactMotive}.`;
    });
  });

  contactForm.addEventListener('input', () => {
    contactForm.elements.correo.setCustomValidity('');
    contactForm.elements.telefono.setCustomValidity('');
    contactStatus.textContent = '';
  });

  contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const submitter = event.submitter;
  const data = new FormData(contactForm);
  const correo = data.get('correo').trim();
  const telefono = data.get('telefono').trim();

  if (!correo && !telefono) {
    contactForm.elements.correo.setCustomValidity('Ingresá un correo electrónico o un número de teléfono.');
    contactForm.elements.correo.reportValidity();
    return;
  }

  const lines = [
    'Hola Mi Paraguay,',
    '',
    `Nombre: ${data.get('nombre')}`,
    `Organización: ${data.get('organizacion') || 'No indicada'}`,
    `Correo: ${correo || 'No indicado'}`,
    `Teléfono: ${telefono || 'No indicado'}`,
    `Motivo: ${data.get('motivo')}`,
    '',
    'Mensaje:',
    data.get('mensaje')
  ];
  const message = lines.join('\n');

  if (submitter?.dataset.channel === 'whatsapp') {
    contactStatus.textContent = 'Abriendo WhatsApp con tu consulta preparada…';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    return;
  }

  const subject = `Consulta desde la web — ${data.get('motivo')}`;
  contactStatus.textContent = 'Abriendo tu aplicación de correo con la consulta preparada…';
  window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  });
}
