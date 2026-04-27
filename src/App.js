import React, { useState, useEffect, useRef } from "react";

function App() {
  const [view, setView] = useState("home");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const cursorRef = useRef(null);
  const satRefs = useRef([]);
  const requestRef = useRef();
  const initialized = useRef(false);
  
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cursorPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const radius = 40;

  const menus = {
    bakery: [
      { id: 1, name: "Neon Croissant", price: 150, img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400" },
      { id: 2, name: "Quantum Cupcake", price: 120, img: "https://images.unsplash.com/photo-1519869325930-281384150729?w=400" },
      { id: 3, name: "Plasma Sourdough", price: 250, img: "https://images.unsplash.com/photo-1585478259715-876a6a81fc08?w=400" },
      { id: 4, name: "Cyber Macarons", price: 400, img: "https://images.unsplash.com/photo-1569864358642-9d16197022c9?w=400" },
      { id: 5, name: "Grid Baguette", price: 90, img: "https://images.unsplash.com/photo-1533777419517-3e4017e2e15a?w=400" },
      { id: 6, name: "Logic Lemon Tart", price: 300, img: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400" },
      { id: 7, name: "Data Donut", price: 80, img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400" },
      { id: 8, name: "Neural Nut Cake", price: 950, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400" },
      { id: 9, name: "Binary Bun", price: 50, img: "https://images.unsplash.com/photo-1506459225024-1428097a7e18?w=400" },
      { id: 10, name: "Vector Velvet", price: 750, img: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=400" },
      { id: 11, name: "Hacker Danish", price: 180, img: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400" },
      { id: 12, name: "A.I. Apple Pie", price: 450, img: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400" },
      { id: 13, name: "Static Scone", price: 110, img: "https://images.unsplash.com/photo-1589114473223-1025555d482c?w=400" },
      { id: 14, name: "Sync Berry Cake", price: 880, img: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400" },
      { id: 15, name: "Glitch Cookie", price: 40, img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400" }
    ],
    food: [
      { id: 201, name: "Grid Burger", price: 450, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
      { id: 202, name: "Carbon Pizza", price: 600, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" },
      { id: 203, name: "Laser Steak", price: 1200, img: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=500" },
      { id: 204, name: "Data Fries", price: 200, img: "https://images.unsplash.com/photo-1573016608244-7d5fb3023023?w=500" },
      { id: 205, name: "Cyber Sushi", price: 1200, img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500" },
      { id: 206, name: "Binary Burrito", price: 700, img: "https://images.unsplash.com/photo-1626700051175-656a423e8645?w=500" },
      { id: 207, name: "Grid Gyoza", price: 550, img: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500" },
      { id: 208, name: "Static Salad", price: 450, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500" },
      { id: 209, name: "Logic Lasagna", price: 1300, img: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500" },
      { id: 210, name: "Neural Nuggets", price: 600, img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500" },
      { id: 211, name: "Vector Veggie Pie", price: 900, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500" },
      { id: 212, name: "A.I. Apple Cake", price: 400, img: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=500" },
      { id: 213, name: "Hacker Hummus", price: 350, img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500" },
      { id: 214, name: "Sync Smoothie", price: 300, img: "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=500" },
      { id: 215, name: "Glitch Gelato", price: 250, img: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500" }
    ],
    chinese: [
      { id: 301, name: "Neon Dim Sum", price: 350, img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500" },
      { id: 302, name: "Quantum Ramen", price: 550, img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500" },
      { id: 303, name: "Plasma Bao", price: 320, img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500" },
      { id: 304, name: "Cyber Spring Rolls", price: 280, img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500" }
    ]
  };

// Percent-based spawning (0.1 = 10% of screen width/height)
  const satData = useRef([
    { id: 0, px: 0.2, py: 0.3, vx: 0.8, vy: 0.6, label: 'BAKERY', target: 'bakery', x: 0, y: 0 },
    { id: 1, px: 0.6, py: 0.5, vx: -0.7, vy: 0.9, label: 'FOOD', target: 'food', x: 0, y: 0 },
    { id: 2, px: 0.3, py: 0.7, vx: 0.9, vy: -0.7, label: 'CHINESE', target: 'chinese', x: 0, y: 0 }
  ]);

  const animate = () => {
    const W = window.innerWidth;
    const H = window.innerHeight;

    // Initial safe spawn logic
    if (!initialized.current) {
      satData.current.forEach(s => {
        s.x = s.px * W;
        s.y = s.py * H;
      });
      initialized.current = true;
    }

    // Cursor Movement
    cursorPos.current.x += (mouse.current.x - cursorPos.current.x) * 0.15;
    cursorPos.current.y += (mouse.current.y - cursorPos.current.y) * 0.15;
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`;
    }

    // Satellites Physics
    satData.current.forEach((sat, i) => {
      sat.x += sat.vx;
      sat.y += sat.vy;

      // Keep inside dynamic bounds
      const limitX = W - 90;
      const limitY = H - 90;

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

  const renderMenu = (type) => (
    <section className="shop-view">
      <div className="menu-header">
        <h2>{type.toUpperCase()} <span>MENU</span></h2>
        <button className="back-btn" onClick={() => setView('home')}>← BACK</button>
      </div>
      <div className="grid">
        {menus[type].map(item => (
          <div key={item.id} className="food-card">
            <div className="img-wrap"><img src={item.img} alt={item.name} /></div>
            <div className="card-info">
              <h3>{item.name}</h3>
              <p className="price">₹{item.price}</p>
              <button className="order-btn" onClick={() => setCart([...cart, item])}>ADD TO BAG</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="site-wrapper">
      <div className="void-bg" />
      <div ref={cursorRef} className="cursor-follower" />

      {/* Cart Drawer */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-inner">
          <div className="cart-head">
            <h3>YOUR BAG</h3>
            <button className="close-cart" onClick={() => setIsCartOpen(false)}>✕</button>
          </div>
          <div className="cart-items">
            {cart.length === 0 ? <p className="empty-msg">Empty...</p> : 
              cart.map((item, index) => (
                <div key={index} className="cart-row">
                  <span>{item.name}</span>
                  <span>₹{item.price}</span>
                  <button onClick={() => setCart(cart.filter((_, i) => i !== index))}>✕</button>
                </div>
              ))
            }
          </div>
          <div className="cart-footer">
            <div className="total-row"><span>TOTAL:</span><span>₹{total}</span></div>
            <button className="checkout-btn" disabled={cart.length === 0}>CHECKOUT</button>
          </div>
        </div>
      </div>

      <nav className="glass-nav">
        <div className="logo" onClick={() => setView("home")}>NEON<span>HUB</span></div>
        <button className="cart-pill" onClick={() => setIsCartOpen(true)}>BAG [{cart.length}]</button>
      </nav>

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
            <div className="hero-content">
              <h1>NEON <br/> <span className="cyan-text">HUB</span></h1>
              <p>SELECT A SECTOR</p>
            </div>
          </section>
        </>
      )}

      {view !== "home" && renderMenu(view)}

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #000; color: #fff; font-family: 'Outfit', sans-serif; overflow: hidden; touch-action: none; }
        
        .void-bg { position: fixed; inset: 0; background: radial-gradient(circle, #061b2b, #000); z-index: -1; }
        
        .cursor-follower {
          position: fixed; top: 0; left: 0; width: 20px; height: 20px;
          border: 2px solid #00f2ff; border-radius: 50%;
          pointer-events: none; z-index: 9999; margin: -10px 0 0 -10px;
          opacity: 0; will-change: transform; transition: opacity 0.3s;
        }

        .space-layer { position: fixed; inset: 0; z-index: 10; pointer-events: none; }
        .sat-positioner { position: absolute; top: 0; left: 0; pointer-events: auto; will-change: transform; }
        
        .unified-rotating-circle {
          width: 85px; height: 85px; border-radius: 50%;
          border: 2px solid #00f2ff; background: rgba(0,0,0,0.9);
          color: #00f2ff; font-weight: 900; font-size: 10px; letter-spacing: 1px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 20px rgba(0, 242, 255, 0.3);
          -webkit-tap-highlight-color: transparent;
        }

        .glass-nav { position: fixed; top: 0; width: 100%; display: flex; justify-content: space-between; padding: 20px; z-index: 100; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(0,242,255,0.2); }
        .logo { font-weight: 900; color: #00f2ff; cursor: pointer; }
        .cart-pill { background: #00f2ff; color: #000; border: none; padding: 8px 15px; font-weight: 900; border-radius: 4px; }

        .hero { height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; }
        .hero h1 { font-size: 5rem; margin: 0; font-weight: 900; line-height: 0.9; }
        .cyan-text { color: #00f2ff; }

        .shop-view { height: 100vh; overflow-y: auto; padding: 120px 20px 40px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
        .food-card { background: #111; border: 1px solid #222; padding: 15px; }
        .food-card img { width: 100%; height: 150px; object-fit: cover; }
        .price { color: #00f2ff; font-weight: 900; }
        .order-btn { width: 100%; padding: 10px; background: #fff; border: none; font-weight: 900; }

        .cart-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 400px; height: 100%; background: #000; z-index: 1000; transition: 0.4s; border-left: 1px solid #00f2ff; }
        .cart-drawer.open { right: 0; }
        .cart-inner { padding: 30px; display: flex; flex-direction: column; height: 100%; }
        .cart-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #222; }

        @media (max-width: 600px) {
          .hero h1 { font-size: 3rem; }
          .unified-rotating-circle { width: 75px; height: 75px; }
        }
      `}</style>
    </div>
  );
}

export default App;
