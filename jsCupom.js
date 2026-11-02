const CUPONS_USADOS_KEY = 'dermaluxsun_cupons_usados';

function carregarCuponsUsados() {
  try {
    const raw = localStorage.getItem(CUPONS_USADOS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (erro) {
    return [];
  }
}

function salvarCupomUsado(codigo) {
  const usados = carregarCuponsUsados();
  if (usados.indexOf(codigo) === -1) {
    usados.push(codigo);
    try {
      localStorage.setItem(CUPONS_USADOS_KEY, JSON.stringify(usados));
    } catch (erro) {
      console.warn('Não foi possível salvar o cupom usado:', erro);
    }
  }
}

function marcarCupomUsado(el) {
  el.classList.add('usado');
  el.title = 'Cupom já copiado';
}

function marcarCuponsUsados() {
  const usados = carregarCuponsUsados();
  document.querySelectorAll('.promo-code').forEach(function (el) {
    if (usados.indexOf(el.textContent.trim()) !== -1) {
      marcarCupomUsado(el);
    }
  });
}

function copyCode(el, code) {
  if (carregarCuponsUsados().indexOf(code) !== -1) {
    showToast('Você já usou o cupom ' + code + '.');
    return;
  }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).catch(function () {});
  }

  validarCupomNoServidor(code);

  const originalText = el.textContent;
  el.textContent = 'Aplicado!';
  setTimeout(function () {
    el.textContent = originalText;
    marcarCupomUsado(el);
  }, 1500);
}

async function validarCupomNoServidor(codigo) {
  try {
    const resposta = await fetch('validar_cupom.php?codigo=' + encodeURIComponent(codigo));
    const dados = await resposta.json();

    if (dados.valido) {
     
      appliedCoupon = {
        codigo: dados.codigo,
        tipo: dados.cupom.tipo,
        valor: Number(dados.cupom.valor),
        descricao: dados.cupom.descricao
      };

      salvarCupomUsado(dados.codigo);
      showToast('Cupom ' + dados.codigo + ' aplicado: ' + dados.cupom.descricao);
    } else {
      appliedCoupon = null;
      showToast(dados.mensagem || 'Cupom inválido.');
    }
  } catch (erro) {
    console.warn('Erro ao validar cupom:', erro);
    showToast('Não foi possível validar o cupom. Tente novamente.');
  }

  if (typeof renderCart === 'function') {
    renderCart();
  }
}

function aplicarCupomDigitado() {
  const campo = document.getElementById('cupomInput');
  if (!campo) return;

  const codigo = campo.value.trim().toUpperCase();

  if (!codigo) {
    showToast('Digite o código do cupom.');
    return;
  }

  validarCupomNoServidor(codigo);
  campo.value = '';
}

function removerCupom() {
  appliedCoupon = null;
  if (typeof renderCart === 'function') {
    renderCart();
  }
  showToast('Cupom removido do carrinho.');
}

marcarCuponsUsados();