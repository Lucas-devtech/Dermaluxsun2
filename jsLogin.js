function handleLoginSubmit(event) {
  event.preventDefault();
  handleLogin();
}

async function handleLogin() {
  const email      = document.getElementById('log-email').value.trim();
  const pass       = document.getElementById('log-pass').value;
  const entrarAdmin = document.getElementById('log-admin').checked;

  if (!email || !pass) {
    showToast('Informe e-mail e senha.');
    return;
  }

  try {
    const dadosForm = new FormData();
    dadosForm.append('email', email);
    dadosForm.append('senha', pass);
    dadosForm.append('entrar_admin', entrarAdmin ? '1' : '0');

    const resposta = await fetch('processar_login.php', { method: 'POST', body: dadosForm });
    const dados = await resposta.json();

    if (!dados.sucesso) {
      showToast(dados.mensagem);
      return;
    }

    showToast(dados.mensagem);
    await verificarSessao();

  
    setTimeout(function () { window.location.href = 'index.html'; }, 900);
  } catch (erro) {
    console.warn('Erro no login:', erro);
    showToast('Servidor PHP indisponível. Abra o site por http://localhost/ (XAMPP) e confira o banco.');
  }
}
