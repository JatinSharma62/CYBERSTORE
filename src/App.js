import React, { useState, useEffect, useRef } from "react";

function App() {
  const [view, setView] = useState("home");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Transaction States
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const cursorRef = useRef(null);
  const satRefs = useRef([]);
  const requestRef = useRef();
  const initialized = useRef(false);
  
  // YOUR ACTUAL FAMPAY ID
  const FAMPAY_ID = "the.real.shory@fampay";
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cursorPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const menus = {
    bakery: [
      { id: 1, name: "Neon Croissant", price: 150, img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400" },
      { id: 2, name: "Quantum Cupcake", price: 120, img: "https://images.unsplash.com/photo-1519869325930-281384150729?w=400" }
    ],
    food: [
      { id: 201, name: "Grid Burger", price: 450, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" }
    ],
    chinese: [
      { id: 301, name: "Neon Dim Sum", price: 350, img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500" }
    ]
  };

  const satData = useRef([
    { id: 0, px: 0.15, py: 0.25, vx: 0.8, vy: 0.6, label: 'BAKERY', target: 'bakery', x: 0, y: 0 },
    { id: 1, px: 0.70, py: 0.40, vx: -0.7, vy: 0.9, label: 'FOOD', target: 'food', x: 0, y: 0 },
    { id: 2, px: 0.30, py: 0.75, vx: 0.9, vy: -0.7, label: 'CHINESE', target: 'chinese', x: 0, y: 0 }
  ]);

  const animate = () => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    if (!initialized.current) {
      satData.current.forEach(s => { s.x = s.px * W; s.y = s.py * H; });
      initialized.current = true;
    }
    cursorPos.current.x += (mouse.current.x - cursorPos.current.x) * 0.15;
    cursorPos.current.y += (mouse.current.y - cursorPos.current.y) * 0.15;
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`;
    }
    satData.current.forEach((sat, i) => {
      sat.x += sat.vx; sat.y += sat.vy;
      const limitX = W - 90; const limitY = H - 90;
      if (sat.x < 5) { sat.x = 5; sat.vx = Math.abs(sat.vx); }
      if (sat.x > limitX) { sat.x = limitX; sat.vx = -Math.abs(sat.vx); }
      if (sat.y < 5) { sat.y = 5; sat.vy = Math.abs(sat.vy); }
      if (sat.y > limitY) { sat.y = limitY; sat.vy = -Math.abs(sat.vy); }
      if (satRefs.current[i]) satRefs.current[i].style.transform = `translate3d(${sat.x}px, ${sat.y}px, 0)`;
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      mouse.current = { x, y };
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchstart", handleMove);
    window.addEventListener("touchmove", handleMove);
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // THIS IS THE REAL DEEP LINK URI
  const upiUrl = `upi://pay?pa=${FAMPAY_ID}&pn=NEON_HUB&am=${total}&cu=INR&tn=OrderFromNeonHub`;

  return (
    <div className="site-wrapper">
      <div className="void-bg" />
      <div ref={cursorRef} className="cursor-follower" />

      {/* --- REAL TRANSACTION MODAL --- */}
      {isCheckingOut && (
        <div className="checkout-overlay">
          <div className="checkout-modal">
            {!isSuccess ? (
              <>
                <h2 className="neon-text">GATEWAY</h2>
                <div className="order-summary">
                  <p>PAY TO: <span>{FAMPAY_ID}</span></p>
                  <p>TOTAL: <span>₹{total}</span></p>
                </div>

                {/* THE MAGIC LINK: This opens FamApp directly on phone */}
                <a href={upiUrl} className="real-upi-button" onClick={() => setIsProcessing(true)}>
                  OPEN FAMPAY APP
                </a>

                <div className="qr-container">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiUrl)}`} alt="Scan" />
                    <span>OR SCAN QR</span>
                </div>

                {isProcessing && (
                  <div className="post-pay-ui">
                    <p>Processing Transaction...</p>
                    <button className="verify-btn" onClick={() => {setIsSuccess(true); setCart([]);}}>
                      I HAVE PAID
                    </button>
                  </div>
                )}
                
                <button className="close-checkout" onClick={() => setIsCheckingOut(false)}>CANCEL</button>
              </>
            ) : (
              <div className="success-screen">
                <div className="glow-check">✓</div>
                <h2>PAYMENT RECEIVED</h2>
                <p>Materializing your order...</p>
                <button onClick={() => {setIsCheckingOut(false); setIsCartOpen(false); setView('home');}}>BACK TO HUB</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- NAVIGATION --- */}
      <nav className="glass-nav">
        <div className="logo" onClick={() => setView("home")}>NEON<span>HUB</span></div>
        <button className="cart-pill" onClick={() => setIsCartOpen(true)}>BAG [{cart.length}]</button>
      </nav>

      {/* --- CART DRAWER --- */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-inner">
          <h3>SELECTIONS</h3>
          <div className="cart-list">
            {cart.map((item, i) => (
              <div key={i} className="cart-row"><span>{item.name}</span><span>₹{item.price}</span></div>
            ))}
          </div>
          <div className="cart-total-box">
             <span>TOTAL: ₹{total}</span>
             <button disabled={cart.length === 0} onClick={() => setIsCheckingOut(true)}>PROCEED</button>
          </div>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>CLOSE</button>
        </div>
      </div>

      {/* --- VIEWS --- */}
      {view === "home" ? (
        <div className="home-container">
          <div className="space-layer">
            {satData.current.map((s, i) => (
              <div key={i} ref={el => satRefs.current[i] = el} className="sat-positioner">
                <button className="unified-rotating-circle" onClick={() => setView(s.target)}>{s.label}</button>
              </div>
            ))}
          </div>
          <section className="hero"><h1>NEON<br/><span className="cyan">HUB</span></h1></section>
        </div>
      ) : (
        <section className="shop-view">
          <button className="back-btn" onClick={() => setView('home')}>← HUB</button>
          <div className="grid">
            {menus[view].map(item => (
              <div key={item.id} className="card">
                <img src={item.img} alt="" />
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
                <button onClick={() => setCart([...cart, item])}>ADD</button>
              </div>
            ))}
          </div>
        </section>
      )}

      <style>{`
        body { margin:0; background:#000; color:#fff; font-family:'Inter', sans-serif; overflow:hidden; touch-action:none; }
        .void-bg { position:fixed; inset:0; background:radial-gradient(circle, #0a192f, #000); z-index:-1; }
        .cursor-follower { position:fixed; top:0; left:0; width:20px; height:20px; border:2px solid #00f2ff; border-radius:50%; pointer-events:none; z-index:9999; margin:-10px 0 0 -10px; opacity:0; will-change:transform; }
        
        .glass-nav { position:fixed; top:0; width:100%; display:flex; justify-content:space-between; padding:20px; z-index:100; background:rgba(0,0,0,0.8); backdrop-filter:blur(10px); border-bottom:1px solid #00f2ff33; }
        .logo { color:#00f2ff; font-weight:900; cursor:pointer; }
        .cart-pill { background:#00f2ff; border:none; padding:8px 15px; font-weight:900; border-radius:4px; }

        .space-layer { position:fixed; inset:0; z-index:10; pointer-events:none; }
        .sat-positioner { position:absolute; top:0; left:0; pointer-events:auto; }
        .unified-rotating-circle { width:80px; height:80px; border-radius:50%; border:2px solid #00f2ff; background:#000; color:#00f2ff; font-weight:900; font-size:10px; box-shadow:0 0 15px #00f2ff44; }

        .hero { height:100vh; display:flex; align-items:center; justify-content:center; text-align:center; }
        .hero h1 { font-size:4.5rem; line-height:0.9; margin:0; }
        .cyan { color:#00f2ff; }

        /* REAL TRANSACTION STYLES */
        .checkout-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.95); z-index:2000; display:flex; align-items:center; justify-content:center; padding:20px; }
        .checkout-modal { background:#050505; border:2px solid #00f2ff; padding:30px; width:100%; max-width:380px; text-align:center; box-shadow:0 0 40px #00f2ff22; }
        .order-summary { text-align:left; background:#111; padding:15px; margin:20px 0; border-left:4px solid #00f2ff; }
        .order-summary span { color:#00f2ff; float:right; font-weight:900; }

        .real-upi-button { 
           display:block; width:100%; padding:20px; background:#00f2ff; color:#000; 
           text-decoration:none; font-weight:900; margin-bottom:20px; border-radius:4px;
           box-shadow: 0 10px 20px #00f2ff33;
        }

        .qr-container { background:#fff; padding:10px; display:inline-block; margin-bottom:20px; }
        .qr-container span { color:#000; font-size:10px; display:block; font-weight:900; margin-top:5px; }

        .verify-btn { background:none; border:1px solid #00f2ff; color:#00f2ff; padding:10px 20px; margin-top:10px; cursor:pointer; }
        .close-checkout { background:none; border:none; color:#444; text-decoration:underline; cursor:pointer; margin-top:15px; }

        .shop-view { height:100vh; overflow-y:auto; padding:100px 20px; }
        .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:20px; }
        .card { background:#0a0a0a; border:1px solid #222; padding:15px; text-align:center; }
        .card img { width:100%; height:150px; object-fit:cover; border-bottom:1px solid #00f2ff; }
        .card button { width:100%; background:#00f2ff; border:none; padding:10px; font-weight:900; margin-top:10px; }

        .cart-drawer { position:fixed; right:-100%; top:0; width:100%; max-width:350px; height:100%; background:#000; z-index:500; transition:0.4s; border-left:1px solid #00f2ff; }
        .cart-drawer.open { right:0; }
        .cart-inner { padding:40px 20px; }
        .cart-total-box { border-top:1px solid #222; padding-top:20px; margin-top:20px; }
        .cart-total-box button { width:100%; background:#00f2ff; border:none; padding:15px; font-weight:900; margin-top:10px; }
      `}</style>
    </div>
  );
}

export default App;
