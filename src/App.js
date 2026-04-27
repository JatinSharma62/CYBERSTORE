import React, { useState, useEffect, useRef } from "react";

function App() {
  const [view, setView] = useState("home");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const cursorRef = useRef(null);
  const satRefs = useRef([]);
  const requestRef = useRef();
  
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cursorPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const radius = 40; // Smaller radius for mobile circles

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

const animate = () => {
    const cursor = cursorRef.current;
    
    // Smooth Cursor Follow
    cursorPos.current.x += (mouse.current.x - cursorPos.current.x) * 0.15;
    cursorPos.current.y += (mouse.current.y - cursorPos.current.y) * 0.15;
    
    if (cursor) {
      cursor.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`;
    }

    satData.current.forEach((sat, i) => {
      // Logic: Keep inside current window bounds
      sat.x += sat.vx; 
      sat.y += sat.vy;

      const rightEdge = window.innerWidth - (radius * 2);
      const bottomEdge = window.innerHeight - (radius * 2);

      if (sat.x < 0) { sat.x = 0; sat.vx *= -1; }
      if (sat.x > rightEdge) { sat.x = rightEdge; sat.vx *= -1; }
      if (sat.y < 0) { sat.y = 0; sat.vy *= -1; }
      if (sat.y > bottomEdge) { sat.y = bottomEdge; sat.vy *= -1; }

      if (satRefs.current[i]) {
        satRefs.current[i].style.transform = `translate3d(${sat.x}px, ${sat.y}px, 0)`;
      }
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleMove = (e) => {
      // Works for both Mouse and Touch
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      mouse.current = { x, y };
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
    };

    const resync = () => {
        cursorPos.current = { x: mouse.current.x, y: mouse.current.y };
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

  return (
    <div className="site-wrapper">
      <div className="void-bg" />
      <div ref={cursorRef} className="cursor-follower" />

      <nav className="glass-nav">
        <div className="logo" onClick={() => setView("home")}>NEON<span>HUB</span></div>
        <button className="cart-pill" onClick={() => setIsCartOpen(true)}>BAG [{cart.length}]</button>
      </nav>

      {view === "home" && (
        <div className="home-container">
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
        </div>
      )}

      {/* Render Menu Logic (Truncated for brevity) */}
      {view !== "home" && (
          <div className="shop-view">
              <button onClick={() => setView("home")}>BACK</button>
              <h2>{view.toUpperCase()}</h2>
          </div>
      )}

      <style>{`
        body { margin: 0; background: #000; color: #fff; font-family: sans-serif; overflow: hidden; touch-action: none; }
        .void-bg { position: fixed; inset: 0; background: radial-gradient(circle, #061b2b, #000); z-index: -1; }
        
        .cursor-follower {
          position: fixed; top: 0; left: 0; width: 20px; height: 20px;
          border: 2px solid #00f2ff; border-radius: 50%;
          pointer-events: none; z-index: 9999; margin: -10px 0 0 -10px;
          opacity: 0; will-change: transform;
        }

        .space-layer { position: fixed; inset: 0; z-index: 10; pointer-events: none; }
        .sat-positioner { position: absolute; top: 0; left: 0; pointer-events: auto; }
        
        .unified-rotating-circle {
          width: 80px; height: 80px; border-radius: 50%;
          border: 2px solid #00f2ff; background: rgba(0,0,0,0.8);
          color: #00f2ff; font-weight: bold; font-size: 10px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 15px rgba(0, 242, 255, 0.2);
        }

        .glass-nav { position: fixed; top: 0; width: 100%; display: flex; justify-content: space-between; padding: 15px; z-index: 100; background: rgba(0,0,0,0.5); backdrop-filter: blur(10px); }
        .hero { height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; pointer-events: none; }
        .hero h1 { font-size: 4rem; margin: 0; }
        .cyan-text { color: #00f2ff; }

        @media (max-width: 600px) {
            .hero h1 { font-size: 2.5rem; }
            .unified-rotating-circle { width: 70px; height: 70px; }
        }
      `}</style>
    </div>
  );
}

export default App;
