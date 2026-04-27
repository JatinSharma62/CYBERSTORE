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
  
  const FAMPAY_ID = "the.real.shory@fampay";
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cursorPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const menus = {
    bakery: [
      { id: 1, name: "Neon Croissant", price: 150, img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400" },
      { id: 2, name: "Quantum Cupcake", price: 120, img: "https://images.unsplash.com/photo-1519869325930-281384150729?w=400" },
      { id: 3, name: "Plasma Sourdough", price: 250, img: "https://images.unsplash.com/photo-1585478259715-876a6a81fc08?w=400" }
    ],
    food: [
      { id: 201, name: "Grid Burger", price: 450, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
      { id: 202, name: "Carbon Pizza", price: 600, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" }
    ],
    chinese: [
      { id: 301, name: "Neon Dim Sum", price: 350, img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500" },
      { id: 302, name: "Quantum Ramen", price: 550, img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500" }
    ]
  };

  const satData = useRef([
    { id: 0, px: 0.15, py: 0.25, vx: 0.7, vy: 0.5, label: 'BAKERY', target: 'bakery', x: 0, y: 0 },
    { id: 1, px: 0.70, py: 0.40, vx: -0.6, vy: 0.8, label: 'FOOD', target: 'food', x: 0, y: 0 },
    { id: 2, px: 0.30, py: 0.75, vx: 0.8, vy: -0.6, label: 'CHINESE', target: 'chinese', x: 0, y: 0 }
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
      sat.x += sat.vx;
      sat.y += sat.vy;
      const limitX = W - 95; 
      const limitY = H - 95;
      if (sat.x < 10) { sat.x = 10; sat.vx = Math.abs(sat.vx); }
      if (sat.x > limitX) { sat.x = limitX; sat.vx = -Math.abs(sat.vx); }
      if (sat.y < 10) { sat.y = 10; sat.vy = Math.abs(sat.vy); }
      if (sat.y > limitY) { sat.y = limitY; sat.vy = -Math.abs(sat.vy); }
      if (satRefs.current[i]) {
        satRefs.current[i].style.transform = `translate3d(${sat.x}px, ${sat.y}px, 0)`;
      }
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
    const resync = () => {
        cursorPos.current = { x: mouse.current.x, y: mouse.current.y };
        if (cursorRef.current) cursorRef.current.style.opacity = "1";
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchstart", handleMove);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("focus", resync);
    document.addEventListener("visibilitychange", resync);
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchstart", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("focus", resync);
      document.removeEventListener("visibilitychange", resync);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePay = () => {
    const upiUri = `upi://pay?pa=${FAMPAY_ID}&pn=NEONHUB&am=${total}&cu=INR`;
    window.location.href = upiUri;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setCart([]);
      setTimeout(() => {
        setIsSuccess(false);
        setIsCheckingOut(false);
        setIsCartOpen(false);
      }, 3000);
    }, 4000);
  };

  return (
    <div className="site-wrapper">
      <div className="void-bg" />
      <div ref={cursorRef} className="cursor-follower" />

      {isCheckingOut && (
        <div className="checkout-overlay">
          <div className="checkout-modal">
            {!isSuccess ? (
              <>
                <h2 className={isProcessing ? "glitch-text" : ""}>
                  {isProcessing ? "LINKING TO FAMPAY..." : "SECURE CHECKOUT"}
                </h2>
                {isProcessing ? <div className="loader"></div> : (
                  <>
                    <div className="order-summary">
                      <p>Receiver: <span>{FAMPAY_ID}</span></p>
                      <p>Total: <span>₹{total}</span></p>
                    </div>
                    <button className="confirm-btn" onClick={handlePay}>OPEN FAMPAY APP</button>
                    <div className="qr-box">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=${FAMPAY_ID}%26pn=NEONHUB%26am=${total}%26cu=INR`} alt="QR" />
                      <span>OR SCAN TO PAY</span>
                    </div>
                    <button className="cancel-btn" onClick={() => setIsCheckingOut(false)}>GO BACK</button>
                  </>
                )}
              </>
            ) : (
              <div className="success-msg">
                <div className="check-icon">✓</div>
                <h2>SYNC SUCCESSFUL</h2>
                <p>Order Sent to the Grid.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="glass-nav">
        <div className="logo" onClick={() => setView("home")}>NEON<span>HUB</span></div>
        <button className="cart-pill" onClick={() => setIsCartOpen(true)}>BAG [{cart.length}]</button>
      </nav>

      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-inner">
          <h3>YOUR SELECTION</h3>
          <div className="cart-items">
            {cart.map((item, i) => (
              <div key={i} className="cart-row">
                <span>{item.name}</span>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>
          <div className="cart-footer">
            <div className="total-row"><span>TOTAL:</span><span>₹{total}</span></div>
            <button className="checkout-btn" disabled={cart.length === 0} onClick={() => setIsCheckingOut(true)}>AUTHORIZE PAYMENT</button>
            <button className="close-btn" onClick={() => setIsCartOpen(false)}>CLOSE</button>
          </div>
        </div>
      </div>

      {view === "home" && (
        <>
          <div className="space-layer">
            {satData.current.map((s, i) => (
              <div key={i} ref={el => satRefs.current[i] = el} className="sat-positioner">
                <button className="unified-rotating-circle" onClick={() => setView(s.target)}>
                  <span className="sat-label">{s.label}</span>
                </button>
              </div>
            ))}
          </div>
          <section className="hero">
            <h1>NEON <br/> <span className="cyan-text">HUB</span></h1>
          </section>
        </>
      )}

      {view !== "home" && (
        <section className="shop-view">
          <button className="back-btn" onClick={() => setView('home')}>← BACK TO HUB</button>
          <div className="grid">
            {menus[view].map(item => (
              <div key={item.id} className="food-card">
                <img src={item.img} alt="" />
                <div className="card-info">
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>
                  <button onClick={() => setCart([...cart, item])}>+ ADD TO BAG</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <style>{`
        * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
        body { margin: 0; background: #000; color: #fff; overflow: hidden; touch-action: none; }
        .void-bg { position: fixed; inset: 0; background: radial-gradient(circle at center, #0a192f 0%, #000 100%); z-index: -1; }
        .cursor-follower { position: fixed; top: 0; left: 0; width: 18px; height: 18px; border: 2px solid #00f2ff; border-radius: 50%; pointer-events: none; z-index: 9999; margin: -9px 0 0 -9px; opacity: 0; will-change: transform; transition: opacity 0.3s; }

        .glass-nav { position: fixed; top: 0; width: 100%; display: flex; justify-content: space-between; padding: 20px; z-index: 100; background: rgba(0,0,0,0.8); backdrop-filter: blur(15px); border-bottom: 1px solid rgba(0,242,255,0.2); }
        .logo { font-weight: 900; color: #00f2ff; font-size: 1.2rem; cursor: pointer; letter-spacing: 2px; }
        .cart-pill { background: #00f2ff; color: #000; border: none; padding: 8px 18px; font-weight: 900; border-radius: 2px; cursor: pointer; }

        .space-layer { position: fixed; inset: 0; z-index: 10; pointer-events: none; }
        .sat-positioner { position: absolute; top: 0; left: 0; pointer-events: auto; will-change: transform; }
        .unified-rotating-circle { width: 85px; height: 85px; border-radius: 50%; border: 2px solid #00f2ff; background: #000; color: #00f2ff; font-weight: 900; font-size: 9px; cursor: pointer; box-shadow: 0 0 20px rgba(0,242,255,0.3); }

        .hero { height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; pointer-events: none; }
        .hero h1 { font-size: 5rem; margin: 0; line-height: 0.8; font-weight: 900; }
        .cyan-text { color: #00f2ff; text-shadow: 0 0 30px rgba(0,242,255,0.5); }

        .shop-view { height: 100vh; overflow-y: auto; padding: 100px 20px 40px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }
        .food-card { background: #050505; border: 1px solid #1a1a1a; padding: 15px; transition: 0.3s; }
        .food-card img { width: 100%; height: 180px; object-fit: cover; border-bottom: 2px solid #00f2ff; }
        .food-card h3 { margin: 15px 0 5px; font-size: 1rem; }
        .food-card button { width: 100%; padding: 12px; background: #00f2ff; border: none; font-weight: 900; margin-top: 10px; cursor: pointer; }

        .cart-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 400px; height: 100%; background: #000; z-index: 1000; transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1); border-left: 2px solid #00f2ff; }
        .cart-drawer.open { right: 0; }
        .cart-inner { padding: 40px 30px; display: flex; flex-direction: column; height: 100%; }
        .cart-row { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #111; font-size: 0.9rem; }
        .checkout-btn { width: 100%; padding: 18px; background: #00f2ff; border: none; font-weight: 900; margin-top: 20px; cursor: pointer; }

        .checkout-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(10px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .checkout-modal { background: #000; border: 1px solid #00f2ff; padding: 30px; width: 100%; max-width: 380px; text-align: center; }
        .order-summary { background: #0a0a0a; padding: 15px; margin: 20px 0; text-align: left; }
        .qr-box { background: #fff; padding: 10px; display: inline-block; margin: 20px 0; }
        .qr-box span { color: #000; display: block; font-size: 10px; font-weight: 900; margin-top: 5px; }
        .confirm-btn { width: 100%; padding: 15px; background: #00f2ff; border: none; font-weight: 900; cursor: pointer; }
        .cancel-btn { background: none; border: none; color: #444; margin-top: 15px; cursor: pointer; text-decoration: underline; }
        
        .loader { width: 30px; height: 30px; border: 3px solid #111; border-top: 3px solid #00f2ff; border-radius: 50%; animation: spin 1s linear infinite; margin: 20px auto; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        @media (max-width: 600px) {
          .hero h1 { font-size: 3.2rem; }
          .unified-rotating-circle { width: 75px; height: 75px; }
        }
      `}</style>
    </div>
  );
}

export default App;
