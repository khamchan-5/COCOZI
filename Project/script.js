// script.js
document.addEventListener('DOMContentLoaded', ()=>{

  /***** 1) ข้อมูลสินค้า: แก้/เพิ่มได้ที่นี่ *****/
  const PRODUCTS = [
    {id:'tent1', title:'เต็นท์ 2 คน', price:1790, img:'images/products/tent1.png', desc:'เต็นท์โดมสำหรับ 2 คน', category:'tent'},
    {id:'tent2', title:'เต็นท์ 4 คน', price:3200, img:'images/products/tent2.png', desc:'เต็นท์ขนาดใหญ่สำหรับ 4 คน', category:'tent'},
    {id:'tent3', title:'เต็นท์เดี่ยว', price:1500, img:'images/products/tent3.png', desc:'เต็นท์สำหรับผู้เดียว น้ำหนักเบา', category:'tent'},
    {id:'tent4', title:'เต็นท์ 3 คน', price:2200, img:'images/products/tent4.png', desc:'เต็นท์ขนาดกลางสำหรับ 3 คน', category:'tent'},
    {id:'bag1', title:'กระเป๋าเป้ 40L', price:1200, img:'images/products/bag1.png', desc:'กระเป๋าเป้สะพายหลัง 40 ลิตร', category:'bag'},
    {id:'bag2', title:'กระเป๋าเป้ 60L', price:1800, img:'images/products/bag2.png', desc:'กระเป๋าเป้สะพายหลัง 60 ลิตร', category:'bag'},
    {id:'bag3', title:'กระเป๋าเป้ 20L', price:900,  img:'images/products/bag3.png', desc:'กระเป๋าเป้เล็กสำหรับเดินทางสั้น', category:'bag'},
    {id:'lamp1', title:'ไฟฉาย LED', price:250,  img:'images/products/lamp1.png', desc:'ไฟฉาย LED แบบชาร์จได้', category:'lamp'},
    {id:'lamp2', title:'ไฟคบเพลิง', price:400,  img:'images/products/lamp2.png', desc:'ไฟคบเพลิงสำหรับแคมป์กลางแจ้ง', category:'lamp'},
    {id:'stove1',title:'เตาแก๊สพกพา', price:900, img:'images/products/stove1.png',desc:'เตาแก๊สขนาดเล็ก พกพาสะดวก', category:'lamp'},
    {id:'set1', title:'ชุดมือใหม่', price:2490, img:'images/products/set1.png', desc:'ชุดเริ่มต้นสำหรับมือใหม่ ครบชุดอุปกรณ์', category:'set'},
    {id:'set2', title:'ชุดครอบครัว', price:4990, img:'images/products/set2.png', desc:'ชุดสำหรับครอบครัว เต็นท์+อุปกรณ์ครบ', category:'set'},
    {id:'set3', title:'ชุดคู่รัก', price:2990, img:'images/products/set3.png', desc:'ชุดสำหรับคู่รัก เต็นท์+อุปกรณ์เล็ก', category:'set'},
    {id:'gift1', title:'Gift Set', price:990, img:'images/products/gift1.png', desc:'ชุดของขวัญสำหรับผู้ชอบแคมป์', category:'gift'},
    {id:'gift2', title:'Gift Set Pro', price:1590, img:'images/products/gift2.png', desc:'ชุดของขวัญพรีเมียม', category:'gift'},
    {id:'mug1', title:'แก้วน้ำสแตนเลส', price:200, img:'images/products/mug1.png', desc:'แก้วน้ำสแตนเลส ทนความร้อน', category:'mug'},
    {id:'knife1', title:'มีดพก', price:350, img:'images/products/knife1.png', desc:'มีดพกแบบพับได้', category:'knife'},
    {id:'mat1', title:'เสื่อรองนอน', price:350, img:'images/products/mat1.png', desc:'เสื่อรองนอนแบบพับได้', category:'mat'},
    {id:'chair1',title:'เก้าอี้พับ', price:450, img:'images/products/chair1.png', desc:'เก้าอี้พับน้ำหนักเบา', category:'chair'}
  ];

  /***** 2) DOM references *****/
  const gridEl = document.getElementById('productGrid');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalPrice = document.getElementById('modalPrice');
  const modalQty = document.getElementById('modalQty');
  const modalAdd = document.getElementById('modalAdd');
  const modalClose = document.getElementById('modalClose');

  const cartItemsTbody = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const clearCartBtn = document.getElementById('clearCart');

  const searchInput = document.getElementById('searchInput');
  const categoryNav = document.getElementById('categoryNav');

  /***** 3) Categories (dynamic from PRODUCTS) *****/
  let categories = Array.from(new Set(PRODUCTS.map(p=>p.category)));
  categories.sort();
  categories.unshift('all'); // 'all' front

  function renderCategoryButtons(){
    if(!categoryNav) return;
    categoryNav.innerHTML = '';
    categories.forEach(cat=>{
      const btn = document.createElement('button');
      btn.className = 'category-btn';
      btn.textContent = (cat==='all') ? 'ทั้งหมด' : cat.charAt(0).toUpperCase()+cat.slice(1);
      btn.addEventListener('click', ()=> filterCategory(cat));
      categoryNav.appendChild(btn);
    });
  }

  /***** 4) Render products *****/
  function renderProducts(products = PRODUCTS){
    if(!gridEl) return;
    gridEl.innerHTML = '';
    products.forEach(p=>{
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <div style="overflow:hidden;border-radius:8px;height:160px">
          <img src="${p.img}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <h3 style="margin:10px 0 6px">${p.title}</h3>
        <p style="color:#666;margin:0 0 10px;height:36px;overflow:hidden">${p.desc}</p>
        <div class="price-row">
          <strong style="color:var(--primary)">${p.price} บาท</strong>
          <button class="primary add-btn">ใส่ตะกร้า</button>
        </div>
      `;
      // click card opens modal
      div.addEventListener('click', ()=> openModal(p.id));
      // add button
      div.querySelector('.add-btn').addEventListener('click', (e)=>{
        e.stopPropagation();
        addToCart(p.id,1);
      });
      gridEl.appendChild(div);
    });
  }

  /***** 5) Modal functions *****/
  function openModal(id){
    const p = PRODUCTS.find(x=>x.id===id);
    if(!p) return;
    modalImg.src = p.img;
    modalTitle.innerText = p.title;
    modalDesc.innerText = p.desc;
    modalPrice.innerText = p.price + ' บาท';
    if(modalQty) modalQty.value = 1;
    modalBackdrop.classList.add('show');
    if(modalAdd) {
      modalAdd.onclick = ()=>{
        const q = modalQty ? parseInt(modalQty.value || 1) : 1;
        addToCart(p.id, isNaN(q)?1:q);
        modalBackdrop.classList.remove('show');
      };
    }
  }
  if(modalClose) modalClose.addEventListener('click', ()=> modalBackdrop.classList.remove('show'));
  if(modalBackdrop) modalBackdrop.addEventListener('click',(e)=>{ if(e.target === modalBackdrop) modalBackdrop.classList.remove('show') });

  /***** 6) Cart system *****/
  let cart = []; // [{id,title,price,img,qty},...]

  function addToCart(id, qty=1){
    const p = PRODUCTS.find(x=>x.id===id);
    if(!p) return;
    const ex = cart.find(c=>c.id===id);
    if(ex) ex.qty += qty;
    else cart.push({...p, qty});
    renderCart();
    showToast(`เพิ่ม ${p.title} x${qty} ลงตะกร้า`);
  }

  function renderCart(){
    if(!cartItemsTbody || !cartTotalEl) return;
    cartItemsTbody.innerHTML = '';
    let total = 0;
    cart.forEach(item=>{
      const subtotal = item.price * item.qty;
      total += subtotal;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="padding:6px">${item.title}</td>
        <td style="padding:6px">${item.price}</td>
        <td style="padding:6px"><input type="number" min="1" value="${item.qty}" style="width:64px" onchange="(function(id,v){ window.__updateQty && window.__updateQty(id,v); })('${item.id}', this.value)"></td>
        <td style="padding:6px">${subtotal}</td>
        <td style="padding:6px"><button onclick="(function(id){ window.__removeCartItem && window.__removeCartItem(id); })('${item.id}')">ลบ</button></td>
      `;
      cartItemsTbody.appendChild(tr);
    });
    cartTotalEl.innerText = total;
    // show/hide cart box based on cart length (optional)
    document.querySelector('.cart-box').style.display = cart.length ? 'block' : 'none';
  }

  // wrappers for inline handlers
  window.__updateQty = function(id,v){ updateQty(id,v) };
  window.__removeCartItem = function(id){ removeCartItem(id) };

  function updateQty(id,v){
    const n = parseInt(v);
    if(isNaN(n) || n<1) return;
    const it = cart.find(c=>c.id===id);
    if(it){ it.qty = n; renderCart(); }
  }
  function removeCartItem(id){
    cart = cart.filter(c=>c.id!==id);
    renderCart();
  }
  function clearCart(){
    cart = []; renderCart();
  }
  if(clearCartBtn) clearCartBtn.addEventListener('click', (e)=>{ e.preventDefault(); clearCart(); });

  /***** 7) Checkout: ส่งยอดไป payment.html โดยใช้ localStorage *****/
  function goToPayment(){
    const total = cart.reduce((s,i)=>s + i.price * i.qty, 0);
    localStorage.setItem('campshop_total', total);
    // ถ้าต้องการส่งรายละเอียดสินค้าด้วย ก็เก็บ cart เป็น JSON:
    // localStorage.setItem('campshop_cart', JSON.stringify(cart));
    window.location.href = 'payment.html';
  }
  if(checkoutBtn) checkoutBtn.addEventListener('click', goToPayment);

  /***** 8) Search & Filter *****/
  if(searchInput){
    searchInput.addEventListener('input',(e)=>{
      const term = (e.target.value||'').toLowerCase().trim();
      if(!term) { renderProducts(); return; }
      const filtered = PRODUCTS.filter(p=> (p.title + ' ' + p.desc).toLowerCase().includes(term));
      renderProducts(filtered);
    });
  }
  function filterCategory(cat){
    if(!cat || cat==='all') renderProducts(); else renderProducts(PRODUCTS.filter(p=>p.category===cat));
  }
  // expose filterCategory to window
  window.filterCategory = filterCategory;

  /***** 9) Small toast *****/
  function createToast(){
    let t = document.getElementById('simple-toast'); if(!t){ t=document.createElement('div'); t.id='simple-toast'; t.style= 'position:fixed;right:16px;bottom:16px;padding:10px 12px;background:rgba(0,0,0,0.8);color:#fff;border-radius:8px;z-index:9999;display:none'; document.body.appendChild(t); }
    return t;
  }
  function showToast(msg,ms=1200){ const t=createToast(); t.innerText=msg; t.style.display='block'; clearTimeout(t._to); t._to = setTimeout(()=> t.style.display='none', ms); }

  /***** 10) init UI *****/
  renderCategoryButtons();
  renderProducts();
  renderCart();

  // expose some functions for debugging/HTML inline usage
  window.addToCart = addToCart;
  window.renderCart = renderCart;
  window.clearCart = clearCart;

}); // DOMContentLoaded end
