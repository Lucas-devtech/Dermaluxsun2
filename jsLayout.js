window.addEventListener('scroll', function () {
  const topbar = document.getElementById('topbar');
  if (!topbar) return;
  if (window.scrollY > 20) {
    topbar.classList.add('scrolled');
  } else {
    topbar.classList.remove('scrolled');
  }
});

function atualizarMobileNav(aberto) {
  const painel = document.getElementById('mobile-nav');
  if (!painel) return;
  painel.classList.toggle('open', aberto);
  document.body.classList.toggle('menu-aberto', aberto);

  const botao = document.getElementById('hamburger');
  if (botao) {
    botao.classList.toggle('aberto', aberto);
    botao.setAttribute('aria-expanded', aberto);
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  }
}

function toggleMobileNav() {
  const painel = document.getElementById('mobile-nav');
  atualizarMobileNav(!painel.classList.contains('open'));
}

function closeMobileNav(e) {
  if (!e || e.target === document.getElementById('mobile-nav')) {
    atualizarMobileNav(false);
  }
}

document.addEventListener('keydown', function (evento) {
  if (evento.key === 'Escape') atualizarMobileNav(false);
});

window.addEventListener('resize', function () {
  if (window.innerWidth > 700) atualizarMobileNav(false);
});
