export function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitText = document.getElementById('submit-text');
  const submitIcon = document.getElementById('submit-icon');
  const submitLoading = document.getElementById('submit-loading');
  const formSuccess = document.getElementById('form-success');
  const formError = document.getElementById('form-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitText.textContent = 'Enviando...';
    submitIcon.classList.add('hidden');
    submitLoading.classList.remove('hidden');
    formSuccess.classList.add('hidden');
    formError.classList.add('hidden');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('https://formspree.io/f/your-form-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        formSuccess.classList.remove('hidden');
        form.reset();
      } else {
        throw new Error('Erro no envio');
      }
    } catch (error) {
      formError.classList.remove('hidden');
    } finally {
      submitText.textContent = 'Enviar Mensagem';
      submitIcon.classList.remove('hidden');
      submitLoading.classList.add('hidden');
    }
  });
}
