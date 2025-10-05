// Global State (can be extended with localStorage later)
let shoppingCart = JSON.parse(localStorage.getItem('cart')) || [];

/* --- PRODUCT DATA CENTRALIZATION --- */
const allProducts = [
    // Replace the placeholders with actual image URLs
    {id:1, brand:"Cetaphil", name:"Daily Hydrating Moisturizer", price:15.00, discount:0.20, image:"https://th.bing.com/th/id/OIP.0AveNN1pqL2B3x_ifPbOmAHaHa?w=183&h=183&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3", skinType:"dry", rating: 4.5, onSale:true},
    {id:2, brand:"NY Bae", name:"3-in-1 Foundation", price:18.99, discount:0.30, image:"https://media6.ppl-media.com/tr:h-750,w-750,c-at_max,dpr-2/static/img/product/372468/good-vibes-ubtan-insta-glow-powder-100-percentage-natural-ny-bae-3-in-1-serum-foundation-with-primer-warm-cashew-03-combo_1_display_1704351906_bc0693d1.jpg", category:"makeup", subtype:"foundation", skinType:"oily", rating: 4.2, onSale:true},
    {id:3, brand:"Olaplex", name:"Bond Smoother Cream", price:30.00, discount:0.10, image:"https://th.bing.com/th/id/OIP.DB2cJpBoFiac74xjLK1I3wHaHa?w=183&h=183&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3", category:"hair", subtype:"treatment", skinType:"all", rating: 4.7, onSale:true},
    {id:4, brand:"Mac", name:"Velvet Teddy Matte Lipstick", price:22.00, discount:0.25, image:"https://tse3.mm.bing.net/th/id/OIP.ihUHGU_E1a5URcqndxItfgHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3", category:"makeup", subtype:"lipstick", skinType:"all", rating: 4.6, onSale:true},
    {id:5, brand:"Fenty Beauty", name:"Lip Plumper", price:60.00, discount:0.00, image:"https://tse2.mm.bing.net/th/id/OIP.cdQ8P5enPs5Wi58xghF6ngHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3", category:"makeup", subtype:"lipgloss", skinType:"all", rating: 4.1, onSale:false}, // New Arrival
    {id:6, brand:"The Ordinary", name:"Niacinamide 10% + Zinc 1%", price:5.90, discount:0.00, image:"https://cdn.shopify.com/s/files/1/2626/0488/products/Untitled-2.jpg?v=1568866367", category:"face", subtype:"serum", skinType:"oily", rating: 4.8, onSale:false}, // New Arrival
    {id:7, brand:"La Roche-Posay", name:"Toleriane Cleanser", price:14.99, discount:0.15, image:"https://tse1.mm.bing.net/th/id/OIP.F2Sdbj2xij5k1OfMfO6bCQHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3", category:"face", subtype:"cleanser", skinType:"sensitive", rating: 4.4, onSale:true},
    {id:8, brand:"Body Shop", name:"Strawberry Body Butter", price:12.50, discount:0.40, image:"https://cdn.notinoimg.com/detail_main_lq/the_body_shop/5028197973605_01-o/strawberry-body-butter___220308.jpg", category:"body", subtype:"lotion", skinType:"dry", rating: 4.3, onSale:true},
    {id:9, brand:"Huda Beauty", name:"Desert Dusk Palette", price:65.00, discount:0.00, image:"https://tse4.mm.bing.net/th/id/OIP.DYty0g-Xb90yP22IBg_gWQHaHV?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3", category:"makeup", subtype:"eyeshadow", skinType:"all", rating: 4.9, onSale:false},
];

/* --- COMMON FUNCTIONS --- */

// Function to update cart count on all pages
function updateCartCount() {
    const count = shoppingCart.reduce((total, item) => total + item.quantity, 0);
    // Find all elements with an ID starting with 'cart-count' and update them
    document.querySelectorAll('[id^="cart-count"]').forEach(el => {
        el.textContent = count;
    });
    localStorage.setItem('cart', JSON.stringify(shoppingCart));
}

// Function to add a product to the cart
function addToCart(productId, name) {
    const existingItem = shoppingCart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const product = allProducts.find(p => p.id === productId);
        if (product) {
            shoppingCart.push({...product, quantity: 1});
        }
    }
    updateCartCount();
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(document.querySelector('.cart-btn'), {scale: 1.1}, {scale: 1.0, duration: 0.3, ease: "back.out(1.7)"});
    }
    console.log(`Product ${name} added to bag!`);
}
window.addToCart = addToCart; // Make it globally accessible

// Function to create a product card element
function createProductCard(product, buttonText = 'ADD TO BAG +') {
    const finalPrice = (product.price * (1 - product.discount)).toFixed(2);
    const card = document.createElement('div');
    card.classList.add('product-card');
    let discountTag = '';
    if (product.discount > 0) {
        discountTag = `<span class="discount-tag">${(product.discount * 100).toFixed(0)}% OFF</span>`;
    }

    card.innerHTML = `
        <div class="product-image" style="background-image:url(${product.image});">
            ${discountTag}
        </div>
        <div class="product-details">
            <span class="brand-name">${product.brand}</span>
            <h4>${product.name}</h4>
            <div class="price-box">
                <span class="final-price">$${finalPrice}</span>
                ${product.discount > 0 ? `<span class="original-price">$${product.price.toFixed(2)}</span>` : ''}
            </div>
        </div>
        <div class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}')">${buttonText}</div>
    `;
    return card;
}


document.addEventListener('DOMContentLoaded', () => {

    updateCartCount(); // Initial cart count update on all pages

    /* -------------------------------------- INDEX.HTML LOGIC -------------------------------------- */
    
    /* --- LOADER --- */
    const loader = document.getElementById('loader-overlay');
    const logo = document.querySelector('.loader-logo');
    const main = document.getElementById('main-content');
    if (loader && logo && main && typeof gsap !== 'undefined') { // Check if on index and gsap is loaded
        setTimeout(() => {
            gsap.to(logo, {opacity: 1, duration: 0.5});
            gsap.to(loader, {opacity: 0, delay: 1.2, duration: 0.5, onComplete: () => {
                loader.style.display = 'none';
                main.style.display = 'block';
            }});
        }, 800);
    }

    /* --- HERO CAROUSEL --- */
    const adCarousel = document.getElementById('ad-carousel');
    const carouselDots = document.getElementById('carousel-dots');
    if (adCarousel && carouselDots) {
        let currentSlide = 0;
        const slides = [
            {title: "Cetaphil Skincare", discount: "20% OFF", image: allProducts.find(p => p.id === 1).image, link:"shop.html?brand=cetaphil"},
            {title: "New Season Glow!", discount: "NY Bae Launch: 30% OFF", image: allProducts.find(p => p.id === 2).image, link:"shop.html?brand=nybae"},
            {title: "Luxury Haircare", discount: "10% OFF Olaplex", image: allProducts.find(p => p.id === 3).image, link:"shop.html?brand=olaplex"}
        ];

        function renderCarousel() {
            adCarousel.innerHTML = '';
            carouselDots.innerHTML = '';
            slides.forEach((slide, i) => {
                const slideEl = document.createElement('div');
                slideEl.classList.add('banner-slide');
                slideEl.style.backgroundImage = `url(${slide.image})`;
                slideEl.innerHTML = `<div class="banner-content"><h2>${slide.title}</h2><p>${slide.discount}</p><a href="${slide.link}" class="btn-primary">Shop Now</a></div>`;
                adCarousel.appendChild(slideEl);
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === currentSlide) dot.classList.add('active');
                dot.addEventListener('click', () => { currentSlide = i; updateCarousel(); });
                carouselDots.appendChild(dot);
            });
            updateCarousel();
        }

        function updateCarousel() {
            adCarousel.style.transform = `translateX(${-currentSlide * 100}%)`;
            document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
            if (typeof gsap !== 'undefined') {
                 gsap.fromTo('.banner-content h2', {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: 0.8, ease: "power2.out"});
                 gsap.fromTo('.banner-content p', {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2});
            }
        }

        function nextSlide() { currentSlide = (currentSlide + 1) % slides.length; updateCarousel(); }
        // Only run carousel interval on the index page
        if (document.title.includes('Your Beauty Destination')) {
            setInterval(nextSlide, 5000);
            renderCarousel();
        }
    }

    /* --- FEATURED PRODUCTS --- */
    const prodCarousel = document.getElementById('product-carousel');
    if (prodCarousel) {
        const featuredProducts = allProducts.slice(0, 4);
        featuredProducts.forEach(p => {
            prodCarousel.appendChild(createProductCard(p));
        });
    }

    /* --- LOGIN MODAL --- */
    const loginModal = document.getElementById('login-modal');
    const openLoginBtn = document.getElementById('open-login');
    if (loginModal && openLoginBtn) {
        openLoginBtn.onclick = () => { loginModal.style.display = "block"; };
        document.querySelector('.close-btn').onclick = () => { loginModal.style.display = "none"; };
        window.onclick = e => { if (e.target === loginModal) loginModal.style.display = "none"; };
    }

    /* --- MOBILE NAV --- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => { navLinks.classList.toggle('active'); });
    }

    /* -------------------------------------- SHOP.HTML LOGIC -------------------------------------- */

    const shopGrid = document.getElementById('shop-product-grid');
    const shopCategorySelect = document.getElementById('shop-category');
    const shopSubtypeSelect = document.getElementById('shop-subtype');
    const categorySubtypes = {
        'face': ['moisturizer', 'serum', 'cleanser'],
        'body': ['lotion', 'scrub'],
        'hair': ['shampoo', 'conditioner', 'treatment'],
        'makeup': ['foundation', 'lipstick', 'eyeshadow', 'lipgloss']
    };

    if (shopGrid) {
        function renderShopGrid(products) {
            shopGrid.innerHTML = '';
            if (products.length === 0) {
                shopGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No products match your current filters. Try resetting the filters.</p>';
            }
            products.forEach(p => shopGrid.appendChild(createProductCard(p)));
        }

        function populateSubtypes(category) {
            shopSubtypeSelect.innerHTML = '<option value="all">All</option>';
            if (category !== 'all' && categorySubtypes[category]) {
                categorySubtypes[category].forEach(subtype => {
                    const option = document.createElement('option');
                    option.value = subtype;
                    option.textContent = subtype.charAt(0).toUpperCase() + subtype.slice(1);
                    shopSubtypeSelect.appendChild(option);
                });
            }
        }

        function applyShopFilters() {
            const category = shopCategorySelect.value;
            const subtype = shopSubtypeSelect.value;
            const skinType = document.getElementById('shop-skin').value;
            const sort = document.getElementById('shop-sort').value;

            let filtered = allProducts.filter(p => {
                const categoryMatch = category === 'all' || p.category === category;
                const subtypeMatch = subtype === 'all' || p.subtype === subtype;
                const skinMatch = skinType === 'all' || p.skinType === skinType;
                return categoryMatch && subtypeMatch && skinMatch;
            });

            // Sorting logic
            filtered.sort((a, b) => {
                const finalA = a.price * (1 - a.discount);
                const finalB = b.price * (1 - b.discount);
                switch (sort) {
                    case 'price-low-to-high': return finalA - finalB;
                    case 'price-high-to-low': return finalB - finalA;
                    case 'discount-high-to-low': return b.discount - a.discount;
                    case 'rating-high-to-low': return b.rating - a.rating;
                    case 'rating-low-to-high': return a.rating - b.rating;
                    default: return 0;
                }
            });

            renderShopGrid(filtered);
        }

        shopCategorySelect.addEventListener('change', (e) => {
            populateSubtypes(e.target.value);
        });

        document.getElementById('shop-apply').addEventListener('click', applyShopFilters);
        document.getElementById('shop-reset').addEventListener('click', () => {
            shopCategorySelect.value = 'all';
            document.getElementById('shop-skin').value = 'all';
            document.getElementById('shop-sort').value = 'price-low-to-high';
            populateSubtypes('all');
            applyShopFilters();
        });

        // Initial render
        populateSubtypes('all');
        applyShopFilters();
    }

    /* -------------------------------------- SALE.HTML LOGIC -------------------------------------- */

    const saleGrid = document.getElementById('sale-product-grid');
    const viralCarousel = document.getElementById('viral-carousel');

    if (saleGrid) {
        const saleProducts = allProducts.filter(p => p.onSale);

        function renderSaleGrid(products) {
            saleGrid.innerHTML = '';
            if (products.length === 0) {
                saleGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No sale products match your current filters. Try resetting the filters.</p>';
            }
            products.forEach(p => saleGrid.appendChild(createProductCard(p)));
        }

        // Viral Carousel Logic
        if (viralCarousel) {
            const viralProducts = saleProducts.filter(p => p.rating >= 4.5);
            viralProducts.forEach(p => {
                viralCarousel.appendChild(createProductCard(p, 'VIEW ITEM'));
            });
        }

        function applySaleFilters() {
            const category = document.getElementById('category-filter-sale').value;
            const skinType = document.getElementById('skin-type-filter').value;
            const sort = document.getElementById('sort-filter').value;

            let filtered = saleProducts.filter(p => {
                const categoryMatch = category === 'all' || p.category === category;
                const skinMatch = skinType === 'all' || p.skinType === skinType;
                return categoryMatch && skinMatch;
            });

            filtered.sort((a, b) => {
                const finalA = a.price * (1 - a.discount);
                const finalB = b.price * (1 - b.discount);
                switch (sort) {
                    case 'price-low-to-high': return finalA - finalB;
                    case 'price-high-to-low': return finalB - finalA;
                    case 'discount-high-to-low': return b.discount - a.discount;
                    case 'rating-high-to-low': return b.rating - a.rating;
                    case 'rating-low-to-high': return a.rating - b.rating;
                    default: return 0;
                }
            });

            renderSaleGrid(filtered);
        }

        document.getElementById('apply-filters-sale').addEventListener('click', applySaleFilters);
        document.getElementById('reset-filters-sale').addEventListener('click', () => {
            document.getElementById('category-filter-sale').value = 'all';
            document.getElementById('skin-type-filter').value = 'all';
            document.getElementById('sort-filter').value = 'discount-high-to-low';
            applySaleFilters();
        });

        document.getElementById('sort-filter').value = 'discount-high-to-low';
        applySaleFilters();
    }

    /* -------------------------------------- CART.HTML LOGIC -------------------------------------- */

    const cartItemsDiv = document.getElementById('cart-items');
    const cartSummaryDiv = document.getElementById('cart-summary');

    if (cartItemsDiv && cartSummaryDiv) {
        function renderCart() {
            cartItemsDiv.innerHTML = '';
            let subtotal = 0;

            if (shoppingCart.length === 0) {
                cartItemsDiv.innerHTML = '<p style="text-align: center; margin-top: 50px; font-size: 1.2rem;">Your cart is empty. Time to find your glow! 💖</p>';
                cartSummaryDiv.innerHTML = '';
                return;
            }

            shoppingCart.forEach(item => {
                const finalPrice = item.price * (1 - item.discount);
                const itemTotal = finalPrice * item.quantity;
                subtotal += itemTotal;

                const cartItemEl = document.createElement('div');
                cartItemEl.classList.add('cart-item');

                cartItemEl.innerHTML = `
                    <div class="item-details">
                        <img src="${item.image}" alt="${item.name}" class="item-image" style="width: 80px; height: 80px; object-fit: cover;">
                        <div>
                            <h4>${item.name} (${item.brand})</h4>
                            <p>$${finalPrice.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
                            <div class="quantity-controls">
                                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                                <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
                            </div>
                        </div>
                    </div>
                `;
                cartItemsDiv.appendChild(cartItemEl);
            });

            // Render Summary
            const shipping = subtotal > 50 ? 0.00 : 5.00;
            const taxRate = 0.05;
            const tax = subtotal * taxRate;
            const total = subtotal + shipping + tax;

            cartSummaryDiv.innerHTML = `
                <h2>Order Summary</h2>
                <p>Subtotal: <span>$${subtotal.toFixed(2)}</span></p>
                <p>Shipping: <span>${shipping === 0.00 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></p>
                <p>Tax (5%): <span>$${tax.toFixed(2)}</span></p>
                <hr>
                <p class="total">Total: <span>$${total.toFixed(2)}</span></p>
                <button class="btn-primary checkout-btn" onclick="alert('Proceeding to Checkout! Total: $${total.toFixed(2)}')">Proceed to Checkout</button>
            `;
        }
        window.changeQuantity = (id, change) => {
            const item = shoppingCart.find(i => i.id === id);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeItem(id);
                }
            }
            renderCart();
            updateCartCount();
        };
        window.removeItem = (id) => {
            shoppingCart = shoppingCart.filter(i => i.id !== id);
            renderCart();
            updateCartCount();
        };

        renderCart();
    }

    /* -------------------------------------- NEW.HTML LOGIC -------------------------------------- */

    const newProductsContainer = document.getElementById('new-products');
    if (newProductsContainer) {
        // Products not on sale are considered 'New' for this example
        const newProducts = allProducts.filter(p => !p.onSale).slice(0, 4);

        newProductsContainer.innerHTML = '';
        newProducts.forEach(p => {
            const card = createProductCard(p, 'PRE-BOOK / ADD TO BAG +');
            if (p.id === 5 || p.id === 6) { // Example for pre-book
                card.querySelector('.add-to-cart-btn').textContent = 'PRE-BOOK';
                card.querySelector('.add-to-cart-btn').onclick = () => alert(`Pre-Booking Product ${p.name}`);
            }
            newProductsContainer.appendChild(card);
        });
    }

    /* -------------------------------------- LOGIN.HTML LOGIC -------------------------------------- */

    const loginSimpleForm = document.getElementById('login-form-simple');
    if (loginSimpleForm) {
        loginSimpleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userName = document.getElementById('user-name').value;
            alert(`Welcome back, ${userName}! Login successful (simulated).`);
        });
    }
});