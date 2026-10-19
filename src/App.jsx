import { useMemo, useState } from 'react';
import {
  ArrowDownRight, ArrowLeft, ArrowRight, Check, Clock3,
  CookingPot, CreditCard, MapPin, Minus, Plus, Search, ShoppingBag,
  Store, Truck, X, CircleCheck, Leaf, Menu as MenuIcon
} from 'lucide-react';

const products = [
  { id: 1, name: 'Smoky Party Jollof Rice', category: 'Rice', price: 9000, description: 'Party-style jollof served with plantain, coleslaw and a choice of beef or fish.', tag: 'Dilishoz favourite', available: true, image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=900&q=85' },
  { id: 2, name: 'Chicken Wings', category: 'Starters', price: 8750, description: 'Six pieces with your choice of signature wing flavour.', tag: '6 pieces', available: true, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=85' },
  { id: 3, name: 'Peppered River Shrimp', category: 'Starters', price: 8500, description: 'Deep-fried and peppered river shrimp, six pieces.', tag: '', available: true, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=85' },
  { id: 4, name: 'Turkey Peppersoup', category: 'Soups', price: 9750, description: 'Hot, comforting peppersoup with your choice of yam, plantain, noodles or rice.', tag: 'Choice of side', available: true, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85' },
  { id: 5, name: 'Nigerian Fried Rice', category: 'Rice', price: 9000, description: 'Colourful Nigerian fried rice served with plantain, coleslaw and beef or fish.', tag: '', available: true, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85' },
  { id: 6, name: 'Grilled Chicken Penne', category: 'Pasta', price: 10500, description: 'Grilled chicken, penne pasta and bell peppers in spicy tomato sauce.', tag: 'Chef pick', available: true, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85' },
  { id: 7, name: 'Seafood Pasta', category: 'Pasta', price: 18750, description: 'Seafood medley cooked in a sweet and spicy tomato sauce with fresh herbs.', tag: 'Seafood', available: true, image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=85' },
  { id: 8, name: 'Egusi Soup', category: 'Soups', price: 9750, description: 'Egusi loaded with smoked fish, dry fish, ponmo, stockfish and beef. Swallow included.', tag: 'Swallow included', available: true, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85' },
  { id: 9, name: "Chef's Special Chicken Salad", category: 'Salads', price: 10500, description: 'Fresh greens, vegetables, avocado, grilled chicken and egg.', tag: 'Fresh', available: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85' },
  { id: 10, name: 'Dilishoz Platter', category: 'Specials', price: 80750, description: 'Beef, fish, shrimp, chicken and goatmeat skewers with jollof rice and yam fries or corn.', tag: 'For sharing', available: true, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85' },
  { id: 11, name: 'Spicy Bush Meat', category: 'Specials', price: 9750, description: 'Spicy, juicy and tender bush meat — half portion.', tag: 'Half portion', available: true, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85' },
  { id: 12, name: 'Coca-Cola', category: 'Drinks', price: 1000, description: 'Chilled soft drink.', tag: 'Cold drink', available: true, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=900&q=85' },
];
const categories = ['All', 'Starters', 'Soups', 'Rice', 'Pasta', 'Salads', 'Specials', 'Drinks'];
const branches = [
  { id: 'jericho', name: 'Dilishoz — Jericho Hills', address: 'Jericho Hills, Ibadan', time: 'Confirm at order' },
];
const naira = (amount) => `₦${Number(amount).toLocaleString('en-NG')}`;

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [fulfillment, setFulfillment] = useState('delivery');
  const [branch, setBranch] = useState(branches[0].id);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', notes: '', payment: 'online' });
  const [order, setOrder] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [formError, setFormError] = useState('');

  const filtered = useMemo(() => products.filter((p) =>
    (activeCategory === 'All' || p.category === activeCategory) &&
    `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase())
  ), [activeCategory, query]);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = fulfillment === 'delivery' && subtotal > 0 ? 1000 : 0;
  const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.02) : 0;
  const total = subtotal + deliveryFee + serviceFee;
  const selectedBranch = branches.find((b) => b.id === branch) || branches[0];

  function addItem(product) {
    if (!product.available) return;
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      return found ? current.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) : [...current, { ...product, qty: 1 }];
    });
  }
  function changeQty(id, delta) {
    setCart((current) => current.map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item).filter((item) => item.qty > 0));
  }
  function beginCheckout() {
    setCartOpen(false); setCheckoutOpen(true); setFormError('');
  }
  function submitDemoOrder(event) {
    event.preventDefault();
    if (!cart.length) return setFormError('Add at least one item to your cart.');
    if (!customer.name.trim() || !customer.phone.trim()) return setFormError('Please enter your name and phone number.');
    if (fulfillment === 'delivery' && !customer.address.trim()) return setFormError('Please enter the delivery address.');
    const created = {
      id: `DZ-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      items: cart.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
      total, fulfillment, branch: selectedBranch, customer: { ...customer },
      status: 'Order received', createdAt: new Date().toLocaleString(),
      paymentStatus: customer.payment === 'online' ? 'Demo payment not processed' : 'Pay on collection/delivery selected',
    };
    setOrder(created); setCart([]); setCheckoutOpen(false); setCartOpen(false); setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-cream text-forest-dark">
      <div className="demo-banner"><span className="demo-dot" /> DEMO STOREFRONT <span className="demo-separator">•</span> Sample menu and prices · Payments are not connected</div>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#home" onClick={() => setOrder(null)} aria-label="Dilishoz home">
            <img className="brand-logo" src="/dilishoz-logo.png" alt="Dilishoz" />
          </a>
          <nav className={`main-nav ${mobileMenu ? 'nav-open' : ''}`}>
            <a href="#menu" onClick={() => setMobileMenu(false)}>Menu</a>
            <a href="#how-it-works" onClick={() => setMobileMenu(false)}>How it works</a>
            <a href="#locations" onClick={() => setMobileMenu(false)}>Our spots</a>
          </nav>
          <div className="header-actions">
            <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="Open cart"><ShoppingBag size={19}/><span>Cart</span><b>{itemCount}</b></button>
            <button className="mobile-menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X/> : <MenuIcon/>}</button>
          </div>
        </div>
      </header>

      {order ? <OrderConfirmation order={order} onNewOrder={() => { setOrder(null); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); }} /> : <>
        <main id="home">
          <section className="hero container">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-line"/> SOMETHING DELICIOUS IS CALLING</div>
              <h1>Your favourites,<br/>just a few <em>taps</em><br/>away.</h1>
              <p>Good food, good mood. Order your go-to meals and refreshing drinks for delivery or easy pickup at your nearest Dilishoz spot.</p>
              <div className="hero-actions"><a className="button button-primary" href="#menu">Explore the menu <ArrowRight size={17}/></a><a className="text-link" href="#how-it-works">How it works <ArrowDownRight size={17}/></a></div>
              <div className="hero-proof"><div className="proof-icon"><Clock3 size={17}/></div><div><strong>Easy ordering, less waiting</strong><span>Order online whenever you're ready.</span></div></div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-main"><img src="https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1200&q=90" alt="A delicious rice meal"/><div className="image-label"><span>MADE WITH FLAVOUR</span><strong>Good food. Great moments.</strong></div></div>
              <div className="hero-image-small"><img src="https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=500&q=85" alt="A refreshing drink"/></div>
              <div className="floating-note"><span className="note-icon"><Leaf size={17}/></span><span><strong>Your kind of craving</strong><small>One easy order away</small></span></div>
              <span className="hero-spark spark-one">✳</span><span className="hero-spark spark-two">✳</span>
            </div>
          </section>
          <section className="benefit-strip"><div className="container benefit-inner"><div><Truck/><span><strong>Home delivery</strong><small>Goodness to your door</small></span></div><div><Store/><span><strong>Pickup at our spots</strong><small>Order ahead, collect easily</small></span></div><div><CreditCard/><span><strong>Simple checkout</strong><small>Clear totals before you order</small></span></div></div></section>

          <section className="menu-section container" id="menu">
            <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> THE GOOD STUFF</div><h2>Made for your <em>appetite.</em></h2><p>Find your favourite, or discover a new one.</p></div><div className="menu-search"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the menu..." aria-label="Search menu"/>{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={15}/></button>}</div></div>
            <div className="category-row" role="tablist" aria-label="Menu categories">{categories.map((category) => <button key={category} role="tab" aria-selected={activeCategory === category} className={`category-pill ${activeCategory === category ? 'active' : ''}`} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
            <div className="product-grid">{filtered.map((product) => <article className={`product-card ${!product.available ? 'product-unavailable' : ''}`} key={product.id}><div className="product-image"><img src={product.image} alt={product.name} loading="lazy"/>{product.tag && <span className="product-tag">{product.tag}</span>}{!product.available && <span className="sold-out">Currently unavailable</span>}</div><div className="product-info"><div className="product-meta"><span>{product.category}</span><span className="availability"><i className={product.available ? 'available-dot' : 'unavailable-dot'}/>{product.available ? 'Available' : 'Sold out'}</span></div><h3>{product.name}</h3><p>{product.description}</p><div className="product-bottom"><strong>{naira(product.price)}</strong><button className="add-button" disabled={!product.available} onClick={() => addItem(product)} aria-label={`Add ${product.name} to cart`}><Plus size={19}/></button></div></div></article>)}</div>
            {filtered.length === 0 && <div className="empty-results"><Search size={26}/><h3>No matches just yet</h3><p>Try another search or choose a different category.</p><button className="button button-outline" onClick={() => { setQuery(''); setActiveCategory('All'); }}>Show all items</button></div>}
            <div className="menu-footnote"><span>✳</span> Menu and prices shown are examples for this MVP and will be replaced with the approved Dilishoz menu.</div>
          </section>

          <section className="order-way-section" id="how-it-works"><div className="container order-way-inner"><div className="order-way-copy"><div className="eyebrow eyebrow-light"><span className="eyebrow-line"/> YOUR ORDER, YOUR WAY</div><h2>Good food fits<br/>your <em>day.</em></h2><p>Staying in or passing by? Choose the option that works for you. We'll keep the steps simple.</p><a href="#menu" className="button button-orange">Find your next meal <ArrowRight size={17}/></a></div><div className="way-cards"><div className="way-card"><div className="way-icon"><Truck size={23}/></div><span className="way-number">01 / DELIVERY</span><h3>Stay right where you are.</h3><p>Enter your address at checkout and arrange delivery to your door.</p><span className="way-arrow"><ArrowRight size={18}/></span></div><div className="way-card way-card-light"><div className="way-icon"><Store size={23}/></div><span className="way-number">02 / PICKUP</span><h3>Your food, on your way.</h3><p>Choose a Dilishoz spot and collect your order when it's ready.</p><span className="way-arrow"><ArrowRight size={18}/></span></div></div></div></section>

          <section className="locations-section container" id="locations"><div className="section-heading locations-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> COME THROUGH</div><h2>Find your nearest <em>spot.</em></h2><p>Choose a pickup location at checkout.</p></div><span className="locations-stamp"><MapPin size={19}/> MORE FLAVOUR<br/>CLOSER TO YOU</span></div><div className="branch-grid">{branches.map((b, i) => <div className="branch-card" key={b.id}><div className="branch-number">0{i+1}</div><div className="branch-icon"><Store size={23}/></div><div className="branch-info"><h3>{b.name}</h3><p><MapPin size={14}/>{b.address}</p><span><Clock3 size={14}/> Estimated prep: {b.time}</span></div><span className="branch-status"><i/> Demo location</span></div>)}</div><p className="branch-note">The menu lists a Jericho Hills, Ibadan location for its FRIN staff/student service. Confirm the public pickup address, operating hours and available branches with Dilishoz before launch.</p></section>

          <section className="final-cta"><div className="container final-cta-inner"><div><span className="cta-spark">✳</span><h2>Hungry yet?</h2><p>Your next favourite is waiting.</p></div><a href="#menu" className="button button-cream">Let's order <ArrowRight size={17}/></a></div></section>
        </main>
      </>}

      <footer className="site-footer"><div className="container footer-inner"><a className="brand brand-footer" href="#home"><img className="brand-logo" src="/dilishoz-logo.png" alt="Dilishoz" /></a><p>Good food. Great moments. Made easy.</p><span>© {new Date().getFullYear()} Dilishoz · MVP concept</span></div></footer>

      {cartOpen && <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setCartOpen(false); }}><aside className="side-drawer" aria-label="Shopping cart"><div className="drawer-header"><div><span className="eyebrow">YOUR ORDER</span><h2>Your cart <span>({itemCount})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X/></button></div>{cart.length === 0 ? <div className="cart-empty"><div className="empty-bag"><ShoppingBag size={30}/></div><h3>Your cart is taking a break.</h3><p>Add something delicious from the menu to get started.</p><button className="button button-primary" onClick={() => { setCartOpen(false); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); }}>Explore menu <ArrowRight size={16}/></button></div> : <><div className="drawer-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt=""/><div className="cart-item-main"><h3>{item.name}</h3><strong>{naira(item.price)}</strong><div className="qty-control"><button onClick={() => changeQty(item.id, -1)} aria-label={`Remove one ${item.name}`}><Minus size={13}/></button><span>{item.qty}</span><button onClick={() => changeQty(item.id, 1)} aria-label={`Add one ${item.name}`}><Plus size={13}/></button></div></div><strong className="cart-line-total">{naira(item.price * item.qty)}</strong></div>)}</div><div className="drawer-bottom"><div className="mini-total"><span>Subtotal</span><strong>{naira(subtotal)}</strong></div><p>Delivery and service fees are calculated at checkout.</p><button className="button button-primary button-full" onClick={beginCheckout}>Continue to checkout <ArrowRight size={17}/></button><button className="continue-link" onClick={() => setCartOpen(false)}><ArrowLeft size={15}/> Keep browsing</button></div></>}</aside></div>}

      {checkoutOpen && <div className="overlay checkout-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setCheckoutOpen(false); }}><section className="checkout-modal"><div className="drawer-header"><div><span className="eyebrow">ALMOST THERE</span><h2>Checkout</h2></div><button className="icon-button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X/></button></div><form onSubmit={submitDemoOrder}><div className="checkout-grid"><div className="checkout-fields"><h3>How would you like your order?</h3><div className="fulfillment-options"><button type="button" className={`fulfillment-option ${fulfillment === 'delivery' ? 'selected' : ''}`} onClick={() => setFulfillment('delivery')}><Truck size={20}/><strong>Home delivery</strong><small>To your address</small>{fulfillment === 'delivery' && <Check className="option-check" size={16}/>}</button><button type="button" className={`fulfillment-option ${fulfillment === 'pickup' ? 'selected' : ''}`} onClick={() => setFulfillment('pickup')}><Store size={20}/><strong>Branch pickup</strong><small>Collect at a spot</small>{fulfillment === 'pickup' && <Check className="option-check" size={16}/>}</button></div>{fulfillment === 'pickup' && <label className="form-label">Choose a Dilishoz spot<select value={branch} onChange={(e) => setBranch(e.target.value)}>{branches.map((b) => <option value={b.id} key={b.id}>{b.name} — {b.address}</option>)}</select></label>}<h3 className="form-section-title">Your details</h3><label className="form-label">Full name<input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder="e.g. Ayo Ade" required autoComplete="name"/></label><label className="form-label">Phone number<input type="tel" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="e.g. 0801 234 5678" required autoComplete="tel"/></label>{fulfillment === 'delivery' && <label className="form-label">Delivery address<textarea value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} placeholder="House number, street, area..." rows="2" required autoComplete="street-address"/></label>}<label className="form-label">Order notes <span className="optional-label">Optional</span><textarea value={customer.notes} onChange={(e) => setCustomer({ ...customer, notes: e.target.value })} placeholder="Any helpful instructions?" rows="2"/></label><h3 className="form-section-title">Payment preference</h3><label className={`payment-option ${customer.payment === 'online' ? 'selected' : ''}`}><input type="radio" name="payment" value="online" checked={customer.payment === 'online'} onChange={(e) => setCustomer({ ...customer, payment: e.target.value })}/><CreditCard size={19}/><span><strong>Pay online</strong><small>Demo only — payment gateway not connected</small></span></label><label className={`payment-option ${customer.payment === 'collection' ? 'selected' : ''}`}><input type="radio" name="payment" value="collection" checked={customer.payment === 'collection'} onChange={(e) => setCustomer({ ...customer, payment: e.target.value })}/><Store size={19}/><span><strong>Pay on {fulfillment === 'pickup' ? 'pickup' : 'delivery'}</strong><small>Demonstration preference only; confirm with Dilishoz</small></span></label>{formError && <div className="form-error">{formError}</div>}</div><aside className="checkout-summary"><h3>Order summary</h3><div className="summary-items">{cart.map((item) => <div className="summary-item" key={item.id}><span className="summary-qty">{item.qty}×</span><span>{item.name}</span><strong>{naira(item.price * item.qty)}</strong></div>)}</div><div className="summary-line"><span>Subtotal</span><span>{naira(subtotal)}</span></div><div className="summary-line"><span>Delivery fee</span><span>{deliveryFee ? naira(deliveryFee) : 'Free'}</span></div><div className="summary-line"><span>Service fee <span className="info-mark" title="Example fee for this prototype">i</span></span><span>{naira(serviceFee)}</span></div><div className="summary-total"><span>Total</span><strong>{naira(total)}</strong></div><div className="demo-warning"><CreditCard size={16}/><span>This is a frontend demo. No real payment will be taken and no order will be sent to Dilishoz staff.</span></div><button type="submit" className="button button-primary button-full">Place demo order <ArrowRight size={17}/></button><p className="secure-note"><Check size={13}/> Order details are previewed locally only.</p></aside></div></form></section></div>}
    </div>
  );
}

function OrderConfirmation({ order, onNewOrder }) {
  const steps = [
    { label: 'Order received', detail: 'Your demo order has been created in this browser.', icon: CircleCheck, active: true },
    { label: 'Preparing your order', detail: 'This status is illustrative; no kitchen system is connected.', icon: CookingPot, active: false },
    { label: order.fulfillment === 'pickup' ? 'Ready for pickup' : 'Out for delivery', detail: order.fulfillment === 'pickup' ? `Collection at ${order.branch.name}.` : 'Delivery tracking will be connected in a future phase.', icon: order.fulfillment === 'pickup' ? Store : Truck, active: false },
  ];
  return <main className="confirmation-page container"><div className="confirmation-card"><div className="success-icon"><Check size={30}/></div><span className="eyebrow">DEMO ORDER CREATED</span><h1>That's a good <em>choice.</em></h1><p className="confirmation-intro">Thanks, {order.customer.name}. Here's the order preview. It has not been sent to the actual Dilishoz team.</p><div className="order-reference"><span>YOUR DEMO ORDER NUMBER</span><strong>{order.id}</strong><span>Created {order.createdAt}</span></div><div className="status-panel"><h2>Order status</h2><div className="status-timeline">{steps.map((step, i) => <div className={`status-step ${step.active ? 'status-active' : ''}`} key={step.label}><div className="status-step-icon"><step.icon size={18}/></div><div className="status-step-text"><strong>{step.label}</strong><p>{step.detail}</p></div>{i === 0 && <span className="status-current">CURRENT</span>}</div>)}</div><p className="status-demo-note">Status updates are a static demonstration. Live tracking requires backend order management.</p></div><div className="confirmation-details"><h2>Order details</h2>{order.items.map((item) => <div className="confirmation-item" key={item.id}><span>{item.qty} × {item.name}</span><strong>{naira(item.price * item.qty)}</strong></div>)}<div className="confirmation-item"><span>{order.fulfillment === 'pickup' ? `Pickup — ${order.branch.name}` : 'Home delivery'}</span><span>{order.fulfillment === 'pickup' ? 'Branch pickup' : '₦1,000 fee included'}</span></div><div className="confirmation-total"><span>Total</span><strong>{naira(order.total)}</strong></div><div className="payment-demo-status"><CreditCard size={17}/><span><strong>{order.paymentStatus}</strong><small>Connect Paystack and the backend to enable real transactions.</small></span></div></div><button className="button button-primary button-full" onClick={onNewOrder}>Back to menu <ArrowRight size={17}/></button></div></main>;
}

export default App;
