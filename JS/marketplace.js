// =====================================================
// CONFIG
// =====================================================

const URL = "https://juhoiuurglcyarecqccd.supabase.co";
const KEY = "sb_publishable_1OodfzUIF0amgWyqJxYbHQ_cCIYLaVj";

let selectedItem = null;
let itemsCache = [];


// =====================================================
// TOAST
// =====================================================

function toast(msg){

    const t = document.getElementById("toast");

    if(!t) return;

    t.innerText = msg;
    t.style.display = "block";

    setTimeout(()=>{
        t.style.display = "none";
    },2000);

}


// =====================================================
// IMAGE PREVIEW
// =====================================================

function setupImagePreview(){

    const input = document.getElementById("image");

    if(!input) return;

    input.addEventListener("change",e=>{

        const file = e.target.files[0];

        const preview = document.getElementById("preview");
        const text = document.getElementById("uploadText");

        if(file){

            preview.src = URL.createObjectURL(file);
            preview.style.display = "block";

            if(text){
                text.style.display = "none";
            }

        }

    });

}


// =====================================================
// UPLOAD ITEM
// =====================================================

async function uploadItem(){

    const file   = document.getElementById("image")?.files[0];
    const title  = document.getElementById("title")?.value;
    const price  = document.getElementById("price")?.value;
    const branch = document.getElementById("branch")?.value;
    const phone  = document.getElementById("phone")?.value;

    if(!file || !title || !price || !phone){

        toast("Fill all fields");
        return;

    }

    localStorage.setItem("sellerPhone",phone);

    const reader = new FileReader();

    reader.onload = async ()=>{

        try{

            const data = {

                title,
                price,
                branch,
                phone,
                image: reader.result,
                is_sold:false

            };

            const res = await fetch(`${URL}/rest/v1/items`,{

                method:"POST",

                headers:{

                    "Content-Type":"application/json",
                    apikey:KEY,
                    Authorization:`Bearer ${KEY}`

                },

                body:JSON.stringify(data)

            });

            if(!res.ok) throw new Error();

            toast("Item uploaded 🚀");

        }

        catch(err){

            console.error(err);
            toast("Upload failed ❌");

        }

    };

    reader.readAsDataURL(file);

}


// =====================================================
// LOAD ITEMS
// =====================================================

async function loadItems(){

    const container = document.getElementById("items");

    if(!container) return;

    try{

        const res = await fetch(`${URL}/rest/v1/items?is_sold=eq.false`,{

            headers:{

                apikey:KEY,
                Authorization:`Bearer ${KEY}`

            }

        });

        const data = await res.json();

        itemsCache = data;

        container.innerHTML = "";

        if(data.length===0){

            container.innerHTML = `
                <p style="padding:20px;">
                    No items available.
                </p>
            `;

            return;

        }

        data.forEach(item=>{

            container.innerHTML += `

            <div class="card">

                <img src="${item.image}">

                <div class="card-body">

                    <h4>${item.title}</h4>

                    <p>₹${item.price}</p>

                    <p>${item.branch}</p>

                    <button onclick="openModalById(${item.id})">
                        Buy
                    </button>

                </div>

            </div>

            `;

        });

    }

    catch(err){

        console.error(err);
        toast("Failed to load items ❌");

    }

}
// =====================================================
// BUY FLOW
// =====================================================

let selectedItem = null;


// ---------- Open Modal from Item ID ----------

function openModalById(id){

    selectedItem = itemsCache.find(item => item.id === id);

    if(!selectedItem){
        toast("Item not found");
        return;
    }

    const modal = document.getElementById("buyModal");

    if(modal){
        modal.classList.remove("hidden");
    }

}


// ---------- Close Modal ----------

function closeModal(){

    const modal = document.getElementById("buyModal");

    if(modal){
        modal.classList.add("hidden");
    }

    document.getElementById("buyerName").value = "";
    document.getElementById("buyerPhone").value = "";
    document.getElementById("buyerBranch").value = "";

}


// ---------- Confirm Purchase ----------

async function confirmBuy(){

    if(!selectedItem){
        toast("No item selected");
        return;
    }

    const name = document.getElementById("buyerName").value.trim();
    const phone = document.getElementById("buyerPhone").value.trim();
    const branch = document.getElementById("buyerBranch").value.trim();

    if(name==="" || phone===""){

        toast("Fill required fields");
        return;

    }

    try{

        // Save order

        await fetch(`${URL}/rest/v1/orders`,{

            method:"POST",

            headers:{

                "Content-Type":"application/json",
                apikey:KEY,
                Authorization:`Bearer ${KEY}`

            },

            body:JSON.stringify({

                item_id:selectedItem.id,
                item_name:selectedItem.title,
                price:selectedItem.price,
                seller_phone:selectedItem.phone,

                buyer_name:name,
                buyer_phone:phone,
                buyer_branch:branch

            })

        });


        // Mark item as sold

        await fetch(`${URL}/rest/v1/items?id=eq.${selectedItem.id}`,{

            method:"PATCH",

            headers:{

                "Content-Type":"application/json",
                apikey:KEY,
                Authorization:`Bearer ${KEY}`

            },

            body:JSON.stringify({

                is_sold:true

            })

        });


        toast("Order placed ✅");

        closeModal();

        loadItems();

    }

    catch(err){

        console.error(err);

        toast("Purchase failed ❌");

    }

}
// =====================================================
// SELLER ITEMS
// =====================================================

async function loadMyItems(){

    const phone = localStorage.getItem("sellerPhone");
    const container = document.getElementById("myItems");

    if(!phone || !container) return;

    try{

        const res = await fetch(`${URL}/rest/v1/items?phone=eq.${phone}`,{

            headers:{
                apikey:KEY,
                Authorization:`Bearer ${KEY}`
            }

        });

        const data = await res.json();

        container.innerHTML = "";

        if(!data.length){

            container.innerHTML = "<p>No uploaded items.</p>";
            return;

        }

        data.forEach(item=>{

            container.innerHTML += `

            <div class="card">

                <img src="${item.image}">

                <div class="card-body">

                    <h4>${item.title}</h4>

                    <p>₹${item.price}</p>

                    <button onclick="deleteItem(${item.id})">
                        Delete
                    </button>

                </div>

            </div>

            `;

        });

    }

    catch(err){

        console.error(err);

        toast("Couldn't load your items");

    }

}



// =====================================================
// DELETE ITEM
// =====================================================

async function deleteItem(id){

    try{

        await fetch(`${URL}/rest/v1/items?id=eq.${id}`,{

            method:"DELETE",

            headers:{
                apikey:KEY,
                Authorization:`Bearer ${KEY}`
            }

        });

        toast("Item deleted 🗑️");

        loadMyItems();

        loadItems();

    }

    catch(err){

        console.error(err);

        toast("Delete failed ❌");

    }

}



// =====================================================
// INIT
// =====================================================

document.addEventListener("DOMContentLoaded",()=>{

    setupImagePreview();

    loadItems();

    loadMyItems();

});



// =====================================================
// EXPOSE FUNCTIONS TO HTML
// =====================================================

window.uploadItem = uploadItem;

window.openModalById = openModalById;

window.closeModal = closeModal;

window.confirmBuy = confirmBuy;

window.deleteItem = deleteItem;