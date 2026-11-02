document.addEventListener('sessao-pronta', function (evento) {
  const usuario = evento.detail;
  const form = document.getElementById('produtoForm');
  if (!form) return;

  if (usuario && usuario.tipo === 'admin') {
    form.classList.remove('oculto');
    document.getElementById('adicionarAviso').classList.add('oculto');
  } else {
    document.getElementById('adicionarAviso').textContent =
      'Acesso restrito. Entre como administrador para adicionar produtos.';
    setTimeout(function () { window.location.href = 'login.html'; }, 1800);
  }
});

async function handleAdicionarSubmit(event) {
  event.preventDefault();

  const nome      = document.getElementById('prod-nome').value.trim();
  const descricao = document.getElementById('prod-descricao').value.trim();
  const preco     = document.getElementById('prod-preco').value.trim();
  const foto      = document.getElementById('prod-foto').files[0];

  if (!nome || !descricao || !preco || !foto) {
    showToast('Preencha nome, descrição, preço e escolha uma foto.');
    return;
  }

  try {
    const dadosForm = new FormData();
    dadosForm.append('nome', nome);
    dadosForm.append('descricao', descricao);
    dadosForm.append('preco', preco);
    dadosForm.append('foto', foto);

    const resposta = await fetch('adicionar_produto.php', { method: 'POST', body: dadosForm });
    const dados = await resposta.json();

    showToast(dados.mensagem);
    if (dados.sucesso) {
      document.getElementById('produtoForm').reset();
    }
  } catch (erro) {
    console.warn('Erro ao adicionar produto:', erro);
    showToast('Servidor PHP indisponível. Abra o site por http://localhost/ (XAMPP) e confira o banco.');
  }
}
