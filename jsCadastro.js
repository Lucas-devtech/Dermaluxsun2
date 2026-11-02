function alternarCampoAdmin() {
  const marcado = document.getElementById('reg-admin').checked;
  document.getElementById('adminBox').classList.toggle('oculto', !marcado);
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  handleRegister();
}

async function handleRegister() {
  const nome      = document.getElementById('reg-name').value.trim();
  const sobrenome = document.getElementById('reg-sobrenome').value.trim();
  const email     = document.getElementById('reg-email').value.trim();
  const pass      = document.getElementById('reg-pass').value;
  const wpp       = document.getElementById('reg-wpp').value.trim();
  const querAdmin = document.getElementById('reg-admin').checked;
  const codigoAdmin = document.getElementById('reg-codigo-admin').value;

  if (!nome || !email || !pass) {
    showToast('Preencha nome, e-mail e senha para continuar!');
    return;
  }

  if (pass.length < 8) {
    showToast('A senha precisa ter no mínimo 8 caracteres.');
    return;
  }

  if (!email.includes('@')) {
    showToast('Digite um e-mail válido com @');
    return;
  }

  if (querAdmin && !codigoAdmin) {
    showToast('Informe o código de administrador.');
    return;
  }

  try {
    const dadosForm = new FormData();
    dadosForm.append('nome', nome);
    dadosForm.append('sobrenome', sobrenome);
    dadosForm.append('email', email);
    dadosForm.append('senha', pass);
    dadosForm.append('whatsapp', wpp);
    dadosForm.append('quer_admin', querAdmin ? '1' : '0');
    dadosForm.append('codigo_admin', codigoAdmin);

    const resposta = await fetch('processar_cadastro.php', {
      method: 'POST',
      body: dadosForm,
    });
    const dados = await resposta.json();

    if (!dados.sucesso) {
      showToast(dados.mensagem);
      return;
    }

    showToast(dados.mensagem);
    await verificarSessao();

    setTimeout(function () { window.location.href = 'index.html'; }, 900);
  } catch (erro) {
    console.warn('Não foi possível conectar ao processar_cadastro.php:', erro);
    showToast('Servidor PHP indisponível. Abra o site por http://localhost/ (XAMPP) e confira o banco.');
  }
}
