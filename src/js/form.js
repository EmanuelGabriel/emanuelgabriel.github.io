export function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitText = document.getElementById('submit-text');
  const submitIcon = document.getElementById('submit-icon');
  const submitLoading = document.getElementById('submit-loading');
  const formSuccess = document.getElementById('form-success');
  const formError = document.getElementById('form-error');

  function validateField(field) {
    if (field.tagName === 'SELECT') return true;

    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    if (!value) {
      isValid = false;
      errorMessage = 'Este campo é obrigatório';
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      isValid = false;
      errorMessage = 'E-mail inválido';
    }

    const errorEl = field.parentElement.querySelector('.field-error');
    if (!isValid) {
      field.classList.add('border-red-500');
      field.classList.remove('border-dark-600', 'border-primary');
      if (!errorEl) {
        const error = document.createElement('p');
        error.className = 'field-error text-red-500 text-xs mt-1';
        error.textContent = errorMessage;
        field.parentElement.appendChild(error);
      } else {
        errorEl.textContent = errorMessage;
      }
    } else {
      field.classList.remove('border-red-500');
      field.classList.add('border-dark-600');
      if (errorEl) errorEl.remove();
    }

    return isValid;
  }

  const fields = form.querySelectorAll('input, textarea');
  fields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('border-red-500')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isFormValid = true;
    fields.forEach(field => {
      if (!validateField(field)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      formError.classList.remove('hidden');
      formError.textContent = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    submitText.textContent = 'Enviando...';
    submitIcon.classList.add('hidden');
    submitLoading.classList.remove('hidden');
    formSuccess.classList.add('hidden');
    formError.classList.add('hidden');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const subject = encodeURIComponent(`Contato via Portfólio: ${data.name}`);
    const contactType = data['contact-type'] ? `\nTipo de Contato: ${data['contact-type']}` : '';
    const body = encodeURIComponent(
      `Nome: ${data.name}\nE-mail: ${data.email}${contactType}\n\nMensagem:\n${data.message}`
    );
    const mailtoLink = `mailto:emanuel.gabriel.sousa@hotmail.com?subject=${subject}&body=${body}`;

    try {
      window.location.href = mailtoLink;

      formSuccess.classList.remove('hidden');
      form.reset();
      fields.forEach(field => {
        field.classList.remove('border-red-500', 'border-primary');
        field.classList.add('border-dark-600');
      });
    } catch (error) {
      formError.classList.remove('hidden');
      formError.textContent = 'Erro ao enviar mensagem. Tente novamente.';
    } finally {
      submitText.textContent = 'Enviar Mensagem';
      submitIcon.classList.remove('hidden');
      submitLoading.classList.add('hidden');
    }
  });
}
