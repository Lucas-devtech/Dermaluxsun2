const CART_STORAGE_KEY = 'dermaluxsun_cart';
const COUPON_STORAGE_KEY = 'dermaluxsun_coupon';

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (erro) {
    return [];
  }
}

function loadCouponFromStorage() {
  try {
    const raw = localStorage.getItem(COUPON_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (erro) {
    return null;
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    if (appliedCoupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  } catch (erro) {
    console.warn('Não foi possível salvar o carrinho no localStorage:', erro);
  }
}

let cart = loadCartFromStorage();

let appliedCoupon = loadCouponFromStorage();

const PRODUTOS_2X1 = ['AquaShield', 'SprayGlow'];

function calcularDesconto(subtotal) {
  if (!appliedCoupon || subtotal <= 0) return 0;

  if (appliedCoupon.tipo === 'percentual') {
    return subtotal * appliedCoupon.valor;
  }

  if (appliedCoupon.tipo === '2x1') {
   
    return cart.reduce(function (acc, item) {
      const elegivel = PRODUTOS_2X1.some(function (nome) {
        return item.name.indexOf(nome) !== -1;
      });
      return elegivel ? acc + Math.floor(item.qty / 2) * item.price : acc;
    }, 0);
  }

  return 0;
}

function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function toggleCart() {
  document.getElementById('cart-overlay').classList.toggle('open');
}

function handleCartOverlayClick(e) {
  if (e.target === document.getElementById('cart-overlay')) {
    toggleCart();
  }
}

function addToCart(name, price) {
  const existing = cart.find(function (item) {
    return item.name === name;
  });

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name: name, price: price, qty: 1 });
  }

  renderCart();
  showToast(name + ' adicionado ao carrinho!');

  document.getElementById('cart-overlay').classList.add('open');
}

function renderCart() {
  const cartItemsEl  = document.getElementById('cartItems');
  const badge        = document.getElementById('cartBadge');
  const totalEl       = document.getElementById('cartTotal');
  const discountRow   = document.getElementById('cartDiscountRow');
  const discountEl     = document.getElementById('cartDiscount');

  const subtotal = cart.reduce(function (acc, item) {
    return acc + item.price * item.qty;
  }, 0);

  const totalQty = cart.reduce(function (acc, item) {
    return acc + item.qty;
  }, 0);

  badge.textContent = totalQty;

  const desconto = calcularDesconto(subtotal);
  const total = subtotal - desconto;

  const removerEl = document.getElementById('cupomRemover');
  if (removerEl) {
    removerEl.style.display = appliedCoupon ? 'block' : 'none';
    if (appliedCoupon) {
      removerEl.textContent = 'Remover cupom ' + appliedCoupon.codigo;
    }
  }

  if (desconto > 0) {
    discountRow.style.display = 'flex';
    discountEl.textContent =
      '− R$ ' + desconto.toFixed(2).replace('.', ',') + ' (' + appliedCoupon.codigo + ')';
  } else {
    discountRow.style.display = 'none';
  }

  totalEl.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');

  saveCartToStorage();

  if (cart.length === 0) {
    cartItemsEl.innerHTML =
      '<div class="cart-empty">' +
        '<div class="cart-empty-icon"></div>' +
        '<div>Carrinho vazio — adicione produtos!</div>' +
      '</div>';
    return;
  }

  cartItemsEl.innerHTML = cart.map(function (item, idx) {
    return (
      '<div class="cart-item">' +
        '<div class="cart-item-info">' +
          '<div class="cart-item-name">' + escaparHtml(item.name) + '</div>' +
          '<div class="cart-item-price">R$ ' + item.price.toFixed(2).replace('.', ',') + '</div>' +
          '<div class="cart-item-qty">' +

            '<button class="qty-btn" onclick="changeQty(' + idx + ', -1)" aria-label="Diminuir">−</button>' +
            '<span class="qty-num">' + item.qty + '</span>' +
            '<button class="qty-btn" onclick="changeQty(' + idx + ', 1)" aria-label="Aumentar">+</button>' +
          '</div>' +
        '</div>' +
        '<button class="cart-item-remove" onclick="removeItem(' + idx + ')" aria-label="Remover ' + escaparHtml(item.name) + '">Remover</button>' +
      '</div>'
    );
  }).join('');
}

function changeQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
  }
  renderCart();
}

function removeItem(idx) {
  cart.splice(idx, 1);
  renderCart();
}

function checkout() {
  if (cart.length === 0) {
    showToast('Adicione produtos ao carrinho primeiro!');
    return;
  }

  const subtotal = cart.reduce(function (acc, item) {
    return acc + item.price * item.qty;
  }, 0);

  const desconto = calcularDesconto(subtotal);
  const total = subtotal - desconto;

  const lines = cart.map(function (item) {
    const itemSubtotal = (item.price * item.qty).toFixed(2).replace('.', ',');
    return '• ' + item.name + ' x' + item.qty + ' = R$ ' + itemSubtotal;
  }).join('%0A');

  let msg =
    'Olá! Gostaria de finalizar meu pedido DermaluxSun:%0A%0A' +
    lines +
    '%0A%0ASubtotal: R$ ' + subtotal.toFixed(2).replace('.', ',');

  if (desconto > 0) {
    msg += '%0ACupom aplicado: ' + appliedCoupon.codigo +
           ' (−R$ ' + desconto.toFixed(2).replace('.', ',') + ')';
  }

  if (appliedCoupon && appliedCoupon.tipo === 'frete') {
    msg += '%0ACupom aplicado: ' + appliedCoupon.codigo + ' (frete grátis)';
  }

  msg +=
    '%0A%0A*Total: R$ ' + total.toFixed(2).replace('.', ',') + '*' +
    '%0A%0APor favor, me informe as opções de pagamento e entrega. Obrigado!';

  window.open('https://wa.me/5531981067709?text=' + msg, '_blank');
}
