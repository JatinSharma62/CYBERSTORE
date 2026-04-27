import React, { useState, useEffect, useRef } from "react";

function App() {
  const [view, setView] = useState("home");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Advanced Transaction Flow States
  const [checkoutStep, setCheckoutStep] = useState("idle"); // idle, paying, verifying, success
  
  const cursorRef = useRef(null);
  const satRefs = useRef([]);
  const requestRef = useRef();
  const initialized = useRef(false);
  
  const FAMPAY_ID = "the.real.shaurya@fampay";
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cursorPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Physics & Animation (Updated for Mobile Stability)
  const satData = useRef([
    { id: 0, px: 0.2, py: 0.3, vx: 0.6, vy: 0.4, label: 'BAKERY', target: 'bakery', x: 0, y: 0 },
    { id: 1, px: 0.7, py: 0.5, vx: -0.5, vy: 0.7, label: 'FOOD', target: 'food', x: 0, y: 0 },
    { id: 2, px: 0.4, py: 0.8, vx: 0.7, vy: -0.5, label: 'CHINESE', target: 'chinese', x: 0, y: 0 }
  ]);

  const menus = {
    bakery: [{ id: 1, name: "Neon Croissant", price: 150, img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400" }],
    food: [{ id: 201, name: "Grid Burger", price: 450, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" }],
    chinese: [{ id: 301, name: "Neon Dim Sum", price: 350, img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500" }]
  };

  useEffect(() => {
    const animate = () => {
      const W = window.innerWidth, H = window.innerHeight;
      if (!initialized.current) {
        satData.current.forEach(s => { s.x = s.px * W; s.y = s.py * H; });
        initialized.current = true;
      }
      cursorPos.current.x += (mouse.current.x - cursorPos.current.x) * 0.1;
      cursorPos.current.y += (mouse.current.y - cursorPos.current.y) * 0.1;
      if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`;
      satData.current.forEach((sat, i) => {
        sat.x += sat.vx; sat.y += sat.vy;
        if (sat.x < 5 || sat.x > W - 90) sat.vx *= -1;
        if (sat.y < 5 || sat.y > H - 90) sat.vy *= -1;
        if (satRefs.current[i]) satRefs.current[i].style.transform = `translate3d(${sat.x}px, ${sat.y}px, 0)`;
      });
      requestRef.current = requestAnimationFrame(animate);
    };
    const handleMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      mouse.current = { x, y };
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchstart", handleMove, {passive: false});
    window.addEventListener("touchmove", handleMove, {passive: false});
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const upiUrl = `upi://pay?pa=${FAMPAY_ID}&pn=Shaurya_NeonHub&am=${total}&cu=INR`;

  const triggerPayment = () => {
    setCheckoutStep("paying");
    // This allows time for the app switch before showing the verification button
    setTimeout(() => setCheckoutStep("verifying"), 2000);
  };

  const finalizeOrder = () => {
    setCheckoutStep("success");
    setCart([]);
    setTimeout(() => { setCheckoutStep("idle"); setView("home"); }, 4000);
  };

  return (
    <div className="app-root">
      <div className="nebula-bg" />
      <div ref={cursorRef} className="custom-cursor" />

      {/* --- PROFESSIONAL CHECKOUT OVERLAY --- */}
      {checkoutStep !== "idle" && (
        <div className="payment-overlay">
          <div className="payment-card">
            {checkoutStep === "paying" || checkoutStep === "verifying" ? (
              <>
                <div className="pay-header">
                  <h3>SECURE UPI GATEWAY</h3>
                  <p>Order #{Math.floor(Math.random()*90000)}</p>
                </div>
                <div className="amount-badge">₹{total}</div>
                
                <div className="method-box">
                  <p>Send to: <strong>{FAMPAY_ID}</strong></p>
                  
                  {/* MOBILE BUTTON */}
                  <a href={upiUrl} className="pay-btn" onClick={triggerPayment}>
                    PAY VIA FAMPAY / UPI APP
                  </a>

                  {/* DESKTOP/FALLBACK QR */}
                  <div className="qr-section">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiUrl)}&color=00f2ff&bgcolor=000`} alt="Scan" />
                    <span>SCAN TO PAY ANYWHERE</span>
                  </div>
                </div>

                {checkoutStep === "verifying" && (
                  <button className="verify-btn" onClick={finalizeOrder}>
                    I HAVE COMPLETED THE PAYMENT
                  </button>
                )}
                <button className="cancel-text" onClick={() => setCheckoutStep("idle")}>Cancel Transaction</button>
              </>
            ) : (
              <div className="success-anim">
                <div className="check-ring">✓</div>
                <h2>TRANSACTION SYNCED</h2>
                <p>Payment received. Check your FamApp for confirmation.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- NAV & CART --- */}
      <nav className="navbar">
        <div className="brand" onClick={() => setView("home")}>NEON<span>HUB</span></div>
        <div className="cart-trigger" onClick={() => setIsCartOpen(true)}>
          BAG <span className="count">{cart.length}</span>
        </div>
      </nav>

      <div className={`drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="drawer-content">
          <h2>YOUR BAG</h2>
          {cart.map((item, i) => (
            <div key={i} className="item-row"><span>{item.name}</span><span>₹{item.price}</span></div>
          ))}
          <div className="drawer-footer">
            <div className="total-label">Total: ₹{total}</div>
            <button disabled={cart.length === 0} onClick={() => {setIsCartOpen(false); setCheckoutStep("paying")}}>
              CHECKOUT NOW
            </button>
            <button className="close-link" onClick={() => setIsCartOpen(false)}>CLOSE</button>
          </div>
        </div>
      </div>

      {/* --- VIEWS --- */}
      {view === "home" ? (
        <div className="home-view">
          <div className="sat-layer">
            {satData.current.map((s, i) => (
              <div key={i} ref={el => satRefs.current[i] = el} className="sat-node">
                <button onClick={() => setView(s.target)}>{s.label}</button>
              </div>
            ))}
          </div>
          <div className="hero-text">
            <h1>NEON<br/>CENTRAL</h1>
            <p>PREMIUM SECURE MARKETPLACE</p>
          </div>
        </div>
      ) : (
        <div className="menu-view">
          <button className="back-nav" onClick={() => setView("home")}>← BACK</button>
          <div className="product-grid">
            {menus[view].map(item => (
              <div key={item.id} className="p-card">
                <img src={item.img} alt="" />
                <div className="p-info">
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                  <button onClick={() => setCart([...cart, item])}>ADD TO BAG</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Inter:wght@400;900&display=swap');
        
        * { box-sizing: border-box; }
        body { margin: 0; background: #000; color: #fff; font-family: 'Inter', sans-serif; overflow: hidden; touch-action: none; }
        .nebula-bg { position: fixed; inset: 0; background: radial-gradient(circle at 50% 50%, #0a1f33 0%, #000 100%); z-index: -1; }
        .custom-cursor { position: fixed; width: 24px; height: 24px; border: 1px solid #00f2ff; border-radius: 50%; pointer-events: none; z-index: 9999; margin: -12px 0 0 -12px; opacity: 0; transition: opacity 0.3s; box-shadow: 0 0 15px #00f2ff; }

        .navbar { position: fixed; top: 0; width: 100%; padding: 25px; display: flex; justify-content: space-between; align-items: center; z-index: 100; backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0, 242, 255, 0.1); }
        .brand { font-family: 'Syncopate'; font-weight: 700; color: #00f2ff; letter-spacing: 4px; cursor: pointer; }
        .cart-trigger { cursor: pointer; font-weight: 900; font-size: 0.8rem; border: 1px solid #00f2ff; padding: 8px 15px; border-radius: 100px; }

        .home-view { height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; }
        .hero-text h1 { font-family: 'Syncopate'; font-size: 5rem; margin: 0; line-height: 0.9; text-shadow: 0 0 30px rgba(0,242,255,0.3); }
        .hero-text p { letter-spacing: 5px; color: #00f2ff; font-size: 0.7rem; margin-top: 20px; }

        .sat-layer { position: fixed; inset: 0; pointer-events: none; }
        .sat-node { position: absolute; pointer-events: auto; }
        .sat-node button { width: 85px; height: 85px; border-radius: 50%; border: 1px solid #00f2ff; background: rgba(0,0,0,0.8); color: #00f2ff; font-weight: 900; font-size: 9px; cursor: pointer; box-shadow: 0 0 20px rgba(0,242,255,0.2); }

        /* PAYMENT OVERLAY */
        .payment-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .payment-card { background: #000; border: 1px solid #00f2ff; width: 100%; max-width: 400px; padding: 40px; text-align: center; box-shadow: 0 0 100px rgba(0,242,255,0.1); border-radius: 12px; }
        .pay-header p { color: #444; font-size: 12px; margin-top: 5px; }
        .amount-badge { font-size: 3rem; font-weight: 900; margin: 20px 0; color: #00f2ff; }
        .pay-btn { display: block; background: #00f2ff; color: #000; text-decoration: none; padding: 20px; font-weight: 900; border-radius: 6px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,242,255,0.3); }
        .qr-section { border: 1px solid #111; padding: 20px; display: inline-block; border-radius: 8px; }
        .qr-section span { display: block; font-size: 10px; margin-top: 10px; color: #00f2ff; letter-spacing: 2px; }
        .verify-btn { width: 100%; background: #fff; border: none; padding: 15px; font-weight: 900; cursor: pointer; margin-top: 15px; }
        .cancel-text { background: none; border: none; color: #444; margin-top: 20px; cursor: pointer; }

        .success-anim .check-ring { width: 80px; height: 80px; border: 2px solid #00f2ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 2rem; color: #00f2ff; box-shadow: 0 0 30px #00f2ff; }

        .menu-view { height: 100vh; overflow-y: auto; padding: 120px 20px; }
        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto; }
        .p-card { background: #050505; border: 1px solid #111; overflow: hidden; }
        .p-card img { width: 100%; height: 250px; object-fit: cover; }
        .p-info { padding: 20px; }
        .p-info button { width: 100%; background: #00f2ff; border: none; padding: 15px; font-weight: 900; cursor: pointer; }

        .drawer { position: fixed; right: -100%; top: 0; width: 100%; max-width: 400px; height: 100%; background: #000; z-index: 500; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); border-left: 1px solid #00f2ff; }
        .drawer.open { right: 0; }
        .drawer-content { padding: 40px; display: flex; flex-direction: column; height: 100%; }
        .drawer-footer { margin-top: auto; border-top: 1px solid #111; padding-top: 20px; }
        .drawer-footer button { width: 100%; padding: 20px; background: #00f2ff; border: none; font-weight: 900; margin-bottom: 10px; }

        @media (max-width: 600px) {
          .hero-text h1 { font-size: 2.5rem; }
          .payment-card { padding: 20px; }
        }
      `}</style>
    </div>
  );
}

export default App;
