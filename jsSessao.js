let usuarioAtual = null;

async function verificarSessao() {
  try {
    const resposta = await fetch('sessao_status.php');
    const dados = await resposta.json();
    usuarioAtual = dados.logado ? dados : null;
  } catch (erro) {
    console.warn('Não foi possível consultar sessao_status.php:', erro);
    usuarioAtual = null;
  }

  atualizarHeader();

  document.dispatchEvent(new CustomEvent('sessao-pronta', { detail: usuarioAtual }));
}

function atualizarHeader() {
  const logado  = usuarioAtual !== null;
  const ehAdmin = logado && usuarioAtual.tipo === 'admin';

  const chip = document.getElementById('userChip');
  if (chip) {
    chip.classList.toggle('logado', logado);
    document.getElementById('userIcon').classList.toggle('oculto', logado);
    document.getElementById('userInicial').classList.toggle('oculto', !logado);
    document.getElementById('userInicial').textContent = logado ? usuarioAtual.nome.charAt(0) : '';
    document.getElementById('userName').textContent    = logado ? usuarioAtual.nome : 'Entrar';
    document.getElementById('menuDeslogado').classList.toggle('oculto', logado);
    document.getElementById('menuLogado').classList.toggle('oculto', !logado);
    document.getElementById('userInfo').textContent = ehAdmin ? 'Administrador' : 'Cliente';
  }

  document.querySelectorAll('.nav-adicionar').forEach(function (el) {
    el.classList.toggle('oculto', !ehAdmin);
  });
}

function toggleUserMenu(evento) {
  evento.stopPropagation();
  const menu = document.getElementById('userDropdown');
  const aberto = menu.classList.toggle('aberto');
  document.getElementById('userChip').setAttribute('aria-expanded', aberto);
}

function fecharUserMenu() {
  const menu = document.getElementById('userDropdown');
  if (menu) menu.classList.remove('aberto');
}

document.addEventListener('click', function (evento) {
  const caixa = document.getElementById('userMenu');
  if (caixa && !caixa.contains(evento.target)) fecharUserMenu();
});
document.addEventListener('keydown', function (evento) {
  if (evento.key === 'Escape') fecharUserMenu();
});

async function fazerLogout() {
  try {
    await fetch('logout.php');
  } catch (erro) {
    console.warn('Falha ao sair:', erro);
  }
  window.location.href = 'index.html';
}

verificarSessao();
