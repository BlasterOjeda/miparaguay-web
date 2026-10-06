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

// Envío directo del formulario a un servicio de formularios (por ejemplo Formspree).
// Pegá acá la URL del formulario, con el formato https://formspree.io/f/XXXXXXXX
// Mientras esté vacía, el botón "Enviar mensaje" abre la aplicación de correo del visitante.
const FORM_ENDPOINT = '';

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

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitter = event.submitter;
    const data = new FormData(contactForm);
    const correo = String(data.get('correo') || '').trim();
    const telefono = String(data.get('telefono') || '').trim();

    // Campo trampa para robots: una persona real nunca lo completa.
    if (String(data.get('sitio_web') || '').trim() !== '') {
      return;
    }

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

    if (FORM_ENDPOINT) {
      const button = submitter;
      if (button) button.disabled = true;
      contactStatus.textContent = 'Enviando tu mensaje…';

      try {
        const response = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            _subject: subject,
            nombre: data.get('nombre'),
            organizacion: data.get('organizacion') || 'No indicada',
            email: correo || undefined,
            telefono: telefono || 'No indicado',
            motivo: data.get('motivo'),
            mensaje: data.get('mensaje'),
            consentimiento: 'Aceptó el uso de sus datos para responder la consulta',
            pagina: window.location.href
          })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        contactForm.reset();
        contactStatus.textContent = '¡Gracias! Recibimos tu mensaje y te vamos a responder pronto.';
      } catch (error) {
        contactStatus.textContent = 'No pudimos enviar el mensaje. Probá de nuevo o escribinos por WhatsApp o a yocreoen@miparaguay.com.py.';
      } finally {
        if (button) button.disabled = false;
      }
      return;
    }

    contactStatus.textContent = 'Abriendo tu aplicación de correo con la consulta preparada…';
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  });
}
