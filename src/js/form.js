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

    const subject = encodeURIComponent(`Contato via Portfólio: ${data.name}`);
    const body = encodeURIComponent(
      `Nome: ${data.name}\nE-mail: ${data.email}\n\nMensagem:\n${data.message}`
    );
    const mailtoLink = `mailto:emanuel.gabriel.sousa@hotmail.com?subject=${subject}&body=${body}`;

    try {
      window.location.href = mailtoLink;

      formSuccess.classList.remove('hidden');
      form.reset();
    } catch (error) {
      formError.classList.remove('hidden');
    } finally {
      submitText.textContent = 'Enviar Mensagem';
      submitIcon.classList.remove('hidden');
      submitLoading.classList.add('hidden');
    }
  });
}
