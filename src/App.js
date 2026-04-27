import React, { useState, useEffect, useRef } from "react";
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  const [view, setView] = useState("home");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // New state to toggle cart
  
  const cursorRef = useRef(null);
  const satRefs = useRef([]);
  const requestRef = useRef();
  
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cursorPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const radius = 50; 

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

  const satData = useRef([
    { id: 0, x: 250, y: 300, vx: 1.1, vy: 0.9, label: 'BAKERY', target: 'bakery' },
    { id: 1, x: 600, y: 450, vx: -1.0, vy: 1.3, label: 'FOOD', target: 'food' },
    { id: 2, x: 950, y: 250, vx: 1.2, vy: -1.1, label: 'CHINESE', target: 'chinese' }
  ]);

  const animate = () => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    cursorPos.current.x += (mouse.current.x - cursorPos.current.x) * 0.15;
    cursorPos.current.y += (mouse.current.y - cursorPos.current.y) * 0.15;
    cursor.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`;

    let isCaptured = false;
    let isRepelled = false;

    satData.current.forEach((sat, i) => {
      const dx = cursorPos.current.x - sat.x;
      const dy = cursorPos.current.y - sat.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 200 && dist > 80) {
        sat.vx -= (dx / dist) * 0.1; sat.vy -= (dy / dist) * 0.1;
        isRepelled = true;
      } else if (dist <= 80) {
        sat.vx += (dx / dist) * 0.4; sat.vy += (dy / dist) * 0.4;
        sat.vx *= 0.8; sat.vy *= 0.8;
        isCaptured = true;
      }

      sat.x += sat.vx; sat.y += sat.vy;

      if (sat.x < radius) { sat.x = radius; sat.vx = Math.abs(sat.vx); }
      if (sat.x > window.innerWidth - radius) { sat.x = window.innerWidth - radius; sat.vx = -Math.abs(sat.vx); }
      if (sat.y < radius) { sat.y = radius; sat.vy = Math.abs(sat.vy); }
      if (sat.y > window.innerHeight - radius) { sat.y = window.innerHeight - radius; sat.vy = -Math.abs(sat.vy); }

      if (satRefs.current[i]) {
        satRefs.current[i].style.transform = `translate3d(${sat.x - radius}px, ${sat.y - radius}px, 0)`;
      }
    });

    const targetClass = `cursor-follower ${isCaptured ? 'captured' : (isRepelled ? 'pushing' : '')}`;
    if (cursor.className !== targetClass) cursor.className = targetClass;

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleMouseMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", handleMouseMove);
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const renderMenu = (type) => (
    <section className="shop-view">
      <div className="menu-header">
        <h2>{type.toUpperCase()} <span>MENU</span></h2>
        <button className="back-btn" onClick={() => setView('home')}>← BACK TO HUB</button>
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

      {/* CART DRAWER */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-inner">
          <div className="cart-head">
            <h3>YOUR BAG</h3>
            <button className="close-cart" onClick={() => setIsCartOpen(false)}>CLOSE ✕</button>
          </div>
          <div className="cart-items">
            {cart.length === 0 ? <p className="empty-msg">Your bag is empty...</p> : 
              cart.map((item, index) => (
                <div key={index} className="cart-row">
                  <span>{item.name}</span>
                  <span>₹{item.price}</span>
                  <button className="remove-item" onClick={() => setCart(cart.filter((_, i) => i !== index))}>✕</button>
                </div>
              ))
            }
          </div>
          <div className="cart-footer">
            <div className="total-row">
              <span>TOTAL:</span>
              <span>₹{total}</span>
            </div>
            <button className="checkout-btn" disabled={cart.length === 0}>CHECKOUT NOW</button>
          </div>
        </div>
      </div>

      <nav className="glass-nav">
        <div className="logo" onClick={() => setView("home")}>NEON<span>HUB</span></div>
        <div className="nav-links">
          <button className={`nav-btn ${view === 'home' ? 'active' : ''}`} onClick={() => setView("home")}>HOME</button>
          {/* Toggles the cart open state */}
          <button className="cart-pill" onClick={() => setIsCartOpen(true)}>
            BAG [{cart.length}]
          </button>
        </div>
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
              <span className="badge">INTERFACE OPERATIONAL</span>
              <h1>NEON <br/> <span className="cyan-text">HUB</span></h1>
              <p className="subtext">SELECT A SECTOR TO BROWSE OUR MENUS</p>
            </div>
          </section>
        </>
      )}

      {view === "bakery" && renderMenu("bakery")}
      {view === "food" && renderMenu("food")}
      {view === "chinese" && renderMenu("chinese")}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&display=swap');
        * { cursor: none !important; box-sizing: border-box; }
        body { margin: 0; background: #000; color: #fff; font-family: 'Outfit', sans-serif; overflow: hidden; }
        .void-bg { position: fixed; inset: 0; background: radial-gradient(circle at 50% 50%, #061b2b 0%, #000 100%); z-index: -1; }
        
        .cursor-follower {
          position: fixed; top: 0; left: 0; width: 14px; height: 14px;
          border: 1.5px solid #00f2ff; border-radius: 50%;
          pointer-events: none; z-index: 10000; margin-left: -7px; margin-top: -7px;
          transition: width 0.3s, height 0.3s, background 0.3s; will-change: transform;
        }
        .cursor-follower.captured { width: 100px; height: 100px; margin-left: -50px; margin-top: -50px; background: rgba(0, 242, 255, 0.1); border-width: 1px; box-shadow: 0 0 30px rgba(0, 242, 255, 0.3); }

        /* CART DRAWER STYLES */
        .cart-drawer {
          position: fixed; top: 0; right: -400px; width: 400px; height: 100vh;
          background: rgba(0, 0, 0, 0.95); backdrop-filter: blur(20px);
          z-index: 2000; transition: right 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          border-left: 1px solid rgba(0, 242, 255, 0.3);
        }
        .cart-drawer.open { right: 0; }
        .cart-inner { display: flex; flex-direction: column; height: 100%; padding: 40px 30px; }
        .cart-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .cart-head h3 { font-weight: 900; letter-spacing: 2px; color: #00f2ff; margin: 0; }
        .close-cart { background: none; border: none; color: #fff; font-weight: 900; cursor: pointer !important; }
        
        .cart-items { flex-grow: 1; overflow-y: auto; }
        .empty-msg { opacity: 0.4; font-style: italic; }
        .cart-row { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #1a1a1a; font-weight: 400; align-items: center;}
        .remove-item { background: none; border: none; color: #ff3e3e; cursor: pointer !important; font-size: 18px; }
        
        .cart-footer { padding-top: 30px; border-top: 2px solid #00f2ff; }
        .total-row { display: flex; justify-content: space-between; font-size: 1.5rem; font-weight: 900; margin-bottom: 20px; }
        .checkout-btn { width: 100%; background: #00f2ff; color: #000; border: none; padding: 15px; font-weight: 900; letter-spacing: 1px; cursor: pointer !important; }
        .checkout-btn:disabled { background: #333; color: #666; }

        /* HEADER & PHYSICS STYLES */
        .sat-positioner { position: absolute; top: 0; left: 0; width: 100px; height: 100px; z-index: 50; }
        .unified-rotating-circle {
          width: 100px; height: 100px; border-radius: 50%;
          border: 2px solid rgba(0, 242, 255, 0.4);
          background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          animation: spinLoop 15s linear infinite; transition: 0.3s;
        }
        .sat-label { font-weight: 900; font-size: 13px; color: #00f2ff; letter-spacing: 2px; }
        @keyframes spinLoop { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .glass-nav { display: flex; justify-content: space-between; padding: 20px 5%; background: rgba(0,0,0,0.9); z-index: 100; position: sticky; top: 0; border-bottom: 1px solid rgba(0, 242, 255, 0.1); }
        .logo { font-size: 22px; font-weight: 900; color: #00f2ff; letter-spacing: 2px; cursor: pointer !important; }
        .nav-btn { background: none; border: none; color: #fff; font-weight: 900; cursor: pointer !important; }
        .cart-pill { background: #00f2ff; color: #000; padding: 8px 20px; border: none; font-weight: 900; border-radius: 4px; cursor: pointer !important; }
        
        .shop-view { height: 90vh; overflow-y: auto; padding: 50px 10%; }
        .menu-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; padding-bottom: 100px; }
        .food-card { background: #080808; border: 1px solid #1a1a1a; padding: 15px; }
        .img-wrap { width: 100%; height: 200px; overflow: hidden; margin-bottom: 15px; }
        .food-card img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; }
        .price { color: #00f2ff; font-weight: 900; font-size: 1.4rem; }
        .order-btn { width: 100%; background: #fff; color: #000; border: none; padding: 12px; font-weight: 900; cursor: pointer !important; }
        .hero { height: 80vh; display: flex; align-items: center; padding: 0 10%; pointer-events: none; }
        .hero h1 { font-size: 6rem; line-height: 0.9; margin: 0; font-weight: 900; }
        .cyan-text { color: #00f2ff; }
      `}</style>
      <SpeedInsights />
    </div>
  );
}

export default App;
