// Funcionalidad del carrito
let cart = [];
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartCount = document.querySelector('.cart-count');
const closeModal = document.querySelector('.close-modal');
const btnContinue = document.querySelector('.btn-continue');

// Event Listeners
cartIcon.addEventListener('click', toggleModal);
closeModal.addEventListener('click', toggleModal);
btnContinue.addEventListener('click', toggleModal);

// Cerrar modal al hacer clic fuera
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        toggleModal();
    }
});

// Agregar event listeners a todos los botones "Añadir al carrito"
document.querySelectorAll('.btn-cart').forEach(button => {
    button.addEventListener('click', function(e) {
        const card = e.target.closest('.movies-card');
        const movieData = {
            id: Date.now(), // Identificador único
            image: card.querySelector('.movies-image').src,
            title: card.querySelector('.movies-title').textContent,
            price: card.querySelector('.movies-price').textContent,
        };
        addToCart(movieData);
    });
});

function toggleModal() {
    cartModal.classList.toggle('active');
    if (cartModal.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function addToCart(movie) {
    cart.push(movie);
    updateCartCount();
    updateCartDisplay();
    showAddedToCartAnimation();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    cartCount.textContent = cart.length;
}

function updateCartDisplay() {
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const price = parseFloat(item.price.replace('$', '').replace(',', ''));
        total += price;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <p class="cart-item-price">${item.price}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(itemElement);
    });

    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

function showAddedToCartAnimation() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = '¡Película agregada al carrito!';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Agregar este CSS a tus estilos
const style = document.createElement('style');
style.textContent = `
.cart-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--primary-color);
    color: white;
    padding: 1rem 2rem;
    border-radius: 4px;
    animation: slideIn 0.3s ease, fadeOut 0.3s ease 1.7s;
    z-index: 1200;
}

@keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}
`;
document.head.appendChild(style);