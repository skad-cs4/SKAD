// ===== CONFIG =====
const URL = "https://juhoiuurglcyarecqccd.supabase.co";
const KEY = "sb_publishable_1OodfzUIF0amgWyqJxYbHQ_cCIYLaVj";

// ===== TOAST =====
function toast(msg){
    const t = document.getElementById("toast");
    if(!t) return;
    t.innerText = msg;
    t.style.display = "block";
    setTimeout(()=>t.style.display="none",2000);
}

// ===== IMAGE PREVIEW =====
function setupImagePreview(){
    const input = document.getElementById("image");
    if(!input) return;

    input.addEventListener("change", e=>{
        const file = e.target.files[0];
        const preview = document.getElementById("preview");
        const text = document.getElementById("uploadText");

        if(file){
            preview.src = URL.createObjectURL(file);
            preview.style.display = "block";
            if(text) text.style.display = "none";
        }
    });
}

// ===== UPLOAD ITEM =====
async function uploadItem(){

    const file = document.getElementById("image")?.files[0];
    const title = document.getElementById("title")?.value;
    const price = document.getElementById("price")?.value;
    const branch = document.getElementById("branch")?.value;
    const phone = document.getElementById("phone")?.value;

    if(!file || !title || !price || !phone){
        toast("Fill all fields");
        return;
    }

    localStorage.setItem("sellerPhone", phone);

    const reader = new FileReader();

    reader.onload = async ()=>{
        try {
            const data = {
                title, price, branch, phone,
                image: reader.result,
                is_sold: false
            };

            const res = await fetch(`${URL}/rest/v1/items`, {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    apikey:KEY,
                    Authorization:`Bearer ${KEY}`
                },
                body: JSON.stringify(data)
            });

            if(!res.ok) throw new Error();

            toast("Item uploaded 🚀");

        } catch(err){
            console.error(err);
            toast("Upload failed ❌");
        }
    };

    reader.readAsDataURL(file);
}

// ===== LOAD ITEMS (BUY PAGE) =====
async function loadItems(){

    const container = document.getElementById("items");
    if(!container) return;

    const res = await fetch(`${URL}/rest/v1/items?is_sold=eq.false`,{
        headers:{apikey:KEY, Authorization:`Bearer ${KEY}`}
    });

    const data = await res.json();
    container.innerHTML = "";

    data.forEach(item=>{
        container.innerHTML += `
        <div class="card">
            <img src="${item.image}">
            <div class="card-body">
                <h4>${item.title}</h4>
                <p>₹${item.price}</p>
                <p>${item.branch}</p>
                <button onclick='openModal(${JSON.stringify(item)})'>Buy</button>
            </div>
        </div>`;
    });
}

// ===== BUY FLOW =====
let selectedItem = null;

function openModal(item){
    selectedItem = item;
    document.getElementById("modal").style.display = "flex";
}

function closeModal(){
    document.getElementById("modal").style.display = "none";
}

async function confirmBuy(){

    const name = document.getElementById("buyerName").value;
    const phone = document.getElementById("buyerPhone").value;
    const branch = document.getElementById("buyerBranch").value;

    if(!name || !phone){
        toast("Fill details");
        return;
    }

    const order = {
        item_id: selectedItem.id,
        item_name: selectedItem.title,
        price: selectedItem.price,
        seller_phone: selectedItem.phone,
        buyer_name: name,
        buyer_phone: phone,
        buyer_branch: branch
    };

    await fetch(`${URL}/rest/v1/orders`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            apikey:KEY,
            Authorization:`Bearer ${KEY}`
        },
        body: JSON.stringify(order)
    });

    await fetch(`${URL}/rest/v1/items?id=eq.${selectedItem.id}`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json",
            apikey:KEY,
            Authorization:`Bearer ${KEY}`
        },
        body: JSON.stringify({is_sold:true})
    });

    toast("Order placed ✅");
    closeModal();
    loadItems();
}

// ===== SELLER ITEMS =====
async function loadMyItems(){

    const phone = localStorage.getItem("sellerPhone");
    const container = document.getElementById("myItems");

    if(!phone || !container) return;

    const res = await fetch(`${URL}/rest/v1/items?phone=eq.${phone}`,{
        headers:{apikey:KEY, Authorization:`Bearer ${KEY}`}
    });

    const data = await res.json();
    container.innerHTML = "";

    data.forEach(item=>{
        container.innerHTML += `
        <div class="card">
            <img src="${item.image}">
            <h4>${item.title}</h4>
            <p>₹${item.price}</p>
            <button onclick="deleteItem(${item.id})">Delete</button>
        </div>`;
    });
}

// ===== DELETE =====
async function deleteItem(id){

    await fetch(`${URL}/rest/v1/items?id=eq.${id}`,{
        method:"DELETE",
        headers:{
            apikey:KEY,
            Authorization:`Bearer ${KEY}`
        }
    });

    toast("Item deleted 🗑️");
    loadMyItems();
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", ()=>{
    setupImagePreview();
    loadItems();
    loadMyItems();
});