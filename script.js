let cart = [
  { id:1, name:"Organic Honey - 500g", qty:1, price:420},
  { id:2, name:"Turmeric Powder (200g)", qty:2, price:250},
  { id:3, name:"Aloe Vera Soap", qty:1, price:120}
];

let deliveryCharge=0, discount=0, couponApplied=false;

// Render Cart
const renderCart = ()=>{
  const cartContainer=document.getElementById("cartItems");
  cartContainer.innerHTML="";
  cart.forEach(item=>{
    const totalPrice=item.qty*item.price;
    const div=document.createElement("div");
    div.className="item";
    div.innerHTML=`<div class="thumb"></div>
      <div class="item-info">
        <div><b>${item.name}</b></div>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateQty(${item.id},-1)">−</button>
          <input type="text" class="qty" value="${item.qty}" readonly>
          <button class="qty-btn" onclick="updateQty(${item.id},1)">+</button>
          <span class="remove" onclick="removeItem(${item.id})">🗑️</span>
        </div>
      </div>
      <div class="price">৳${totalPrice}</div>`;
    cartContainer.appendChild(div);
  });
  updateTotals();
};

window.updateQty=(id,delta)=>{
  cart=cart.map(item=>item.id===id?{...item, qty:Math.max(1,item.qty+delta)}:item);
  renderCart();
};

window.removeItem=(id)=>{
  cart=cart.filter(item=>item.id!==id);
  renderCart();
};

// Update Totals
const updateTotals=()=>{
  const subtotal=cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  const total=subtotal+deliveryCharge-discount;

  document.getElementById("sumSubtotal").textContent=`৳${subtotal}`;
  document.getElementById("subtotal").textContent=`৳${subtotal}`;
  document.getElementById("grandTotal").textContent=`৳${total}`;

  // Delivery line
  const deliveryLine=document.getElementById("deliveryLine");
  deliveryLine.querySelector("div:nth-child(2)").textContent=`৳${deliveryCharge}`;

  // Coupon line
  const couponLine=document.getElementById("couponLine");
  if(couponApplied){
    couponLine.querySelector("div:nth-child(2)").textContent=`-৳${discount.toFixed(2)}`;
    couponLine.style.display="flex";
  }else{ couponLine.style.display="none";}
};

// Toggle Boxes
function toggleBox(id){
  const box=document.getElementById(id);
  box.parentNode.classList.toggle("active");
}

// District -> Upazila + Delivery
const upazilaData={
  "ঢাকা":["ধানমন্ডি","গুলশান","উত্তরা","মিরপুর"],
  "চট্টগ্রাম":["পতেঙ্গা","হালিশহর","বাকলিয়া"],
  "রাজশাহী":["পবা","বোয়ালিয়া","চারঘাট"],
  "খুলনা":["খুলনা সদর","রূপসা","ডুমুরিয়া"]
};
document.getElementById("district").addEventListener("change",(e)=>{
  const district=e.target.value;
  const upazilaSelect=document.getElementById("upazila");
  upazilaSelect.innerHTML="<option value=''>উপজেলা সিলেক্ট করুন</option>";
  (upazilaData[district]||[]).forEach(u=>{
    const opt=document.createElement("option"); opt.textContent=u; upazilaSelect.appendChild(opt);
  });
  deliveryCharge=(district==="ঢাকা"?60:(district?130:0));
  updateTotals();
});

// Apply Coupon
document.getElementById("applyCoupon").addEventListener("click",()=>{
  const codeInput=document.getElementById("coupon");
  const code=codeInput.value.trim();
  const couponDetailEl=document.querySelector(".coupon-detail")||(function(){ const el=document.createElement("div"); el.className="coupon-detail"; document.querySelector(".order-summary").appendChild(el); return el; })();
  if(!code) return alert("দয়া করে কুপন কোড লিখুন!");
  const subtotal=cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  if(code.toLowerCase()==="organic10"){
    discount=subtotal*0.1;
    couponApplied=true;
    couponDetailEl.textContent=`🎉 10% ডিসকাউন্ট প্রয়োগ হয়েছে (৳${discount.toFixed(2)})`;
    couponDetailEl.style.display="block";
    codeInput.readOnly=true;
    document.getElementById("applyCoupon").disabled=true;
    document.getElementById("applyCoupon").style.opacity="0.6";
    document.getElementById("applyCoupon").style.cursor="not-allowed";
  }else{
    discount=0; couponApplied=false;
    couponDetailEl.textContent=""; couponDetailEl.style.display="none";
    alert("❌ অবৈধ কুপন কোড!");
  }
  updateTotals();
});

// Checkout Form Submit
document.getElementById("checkoutForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  alert("✅ আপনার অর্ডার সফলভাবে গৃহীত হয়েছে!");
});

// Initial render
renderCart();
