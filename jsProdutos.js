function filterProducts() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const cards = document.querySelectorAll('.product-card');
  let found = 0;

  cards.forEach(function (card) {

    const keywords =
      (card.dataset.name || '') +
      (card.querySelector('.product-name')  ? card.querySelector('.product-name').textContent  : '') +
      (card.querySelector('.product-desc')  ? card.querySelector('.product-desc').textContent  : '');

    const matches = !query || keywords.toLowerCase().includes(query);
    card.style.display = matches ? '' : 'none';
    if (matches) found++;
  });

  const noResultsEl = document.getElementById('noResults');
  if (noResultsEl) {
    noResultsEl.style.display = found ? 'none' : 'block';
  }
}

function criarCardProduto(produto) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.name = produto.nome.toLowerCase();

  const imgBox = document.createElement('div');
  imgBox.className = 'product-img-placeholder';
  const img = document.createElement('img');
  img.src = 'fotos_produtos/' + produto.foto;
  img.alt = produto.nome;
  img.loading = 'lazy';
  imgBox.appendChild(img);

  const corpo = document.createElement('div');
  corpo.className = 'product-body';

  const tag = document.createElement('span');
  tag.className = 'product-tag';
  tag.textContent = 'Novidade';

  const nome = document.createElement('h3');
  nome.className = 'product-name';
  nome.textContent = produto.nome;

  const desc = document.createElement('p');
  desc.className = 'product-desc';
  desc.textContent = produto.descricao;

  const rodape = document.createElement('div');
  rodape.className = 'product-footer';

  const precoBox = document.createElement('div');
  precoBox.className = 'product-price';
  const preco = document.createElement('span');
  preco.className = 'price-new';
  preco.textContent = 'R$ ' + produto.preco.toFixed(2).replace('.', ',') + ' ';
  const unid = document.createElement('small');
  unid.textContent = '/ unid.';
  preco.appendChild(unid);
  precoBox.appendChild(preco);

  const botao = document.createElement('button');
  botao.className = 'btn-add';
  botao.textContent = 'Adicionar';
  botao.addEventListener('click', function () {
    addToCart(produto.nome, produto.preco);
  });

  rodape.appendChild(precoBox);
  rodape.appendChild(botao);
  corpo.appendChild(tag);
  corpo.appendChild(nome);
  corpo.appendChild(desc);
  corpo.appendChild(rodape);
  card.appendChild(imgBox);
  card.appendChild(corpo);
  return card;
}

async function carregarProdutosDoBanco() {
  const grade = document.getElementById('productsGrid');
  if (!grade) return;

  try {
    const resposta = await fetch('listar_produtos.php');
    const dados = await resposta.json();
    if (!dados.sucesso) return;

    dados.produtos.forEach(function (produto) {
      grade.appendChild(criarCardProduto(produto));
    });
  } catch (erro) {
    console.warn('Não foi possível carregar produtos do servidor:', erro);
  }
}

carregarProdutosDoBanco();
