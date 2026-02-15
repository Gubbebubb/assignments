import { asgn } from "../assignments.js";
import { gloNav } from "../global.js";
import { products } from "./products.js";

gloNav(asgn);

const current = document.querySelector("nav").id;
//från uppgift 1

const cartSave = JSON.parse(localStorage.getItem("cart"));
const proList = document.getElementById("container");
const cartList = document.getElementById("kundvagn");
let cart = [];

if (cartSave) {
    cart = cartSave;
    CartContent();
}
//kollar localStorage och lägger till om de finns något sparat

if (cart == "") {
    cartList.classList.add("hidden");
}

function CartContent() {
    if (cart == "") {
        cartList.classList.add("hidden");
    }
    else {
        cartList.classList.remove("hidden");
    }
    let total = 0;
    let clonedCost = cartList.querySelector("h3");
    if (clonedCost) {
        clonedCost.remove();
    }
    let clonedBtn = cartList.querySelector("button");
    if (clonedBtn) {
        clonedBtn.remove();
    }
    let clonedItems = cartList.querySelectorAll("p");
    for (let item of clonedItems) {
        item.remove();
    }
    for (let item of cart) {
        let cartItem = document.createElement("p");
        cartItem.textContent = item.name + " " + item.amount + "st " + (item.price * item.amount) + "kr";
        cartList.append(cartItem);

        total += (item.price * item.amount);
    }
    let cost = document.createElement("h3");
    cost.textContent = "Pris: " + total + "kr";
    cartList.append(cost);
    let trashBtn = document.createElement("button");
    trashBtn.textContent = "Töm kundvagnen";
    trashBtn.addEventListener("click", function () {
            cart = [];
            localStorage.removeItem("cart");
            CartContent();
        })
    cartList.append(trashBtn);
}
//funktion som skapar innehållet i kundvagnssektionen samt logiken för rensa-knappen

function addCart(product) {
    let inCart = cart.find(item => item.id == product.id);
    if (inCart) {
        inCart.amount += 1;
    }
    else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            amount: 1
        });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    CartContent();
}
//funktion som lägger till produktobjekt/ökar antalet, beroende på om det redan finns i kundvagnen eller inte.

function proCreate(products) {
    for (const product of products) {
        const card = document.createElement("div")
        card.classList.add("item");
        const shopBtn = document.createElement("button");
        shopBtn.textContent = "Lägg i kundvagn"
        shopBtn.value = product.id;
        shopBtn.addEventListener("click", function () {
            addCart(product);
        })
        const pname = document.createElement("h3");
        const pdesc = document.createElement("p");
        const pprice = document.createElement("p");
        const pimg = document.createElement("img")
        const pcat = document.createElement("p")
        pname.textContent = product.name;
        pdesc.textContent = product.description;
        pprice.textContent = product.price + "kr";
        pcat.textContent = product.category;
        pimg.src = product.image;
        pimg.alt = product.name;
        pcat.classList.add("category");
        card.append(pcat);
        card.append(pname);
        card.append(pdesc);
        card.append(pimg);
        card.append(pprice);
        card.append(shopBtn);
        proList.append(card);
    }
}
//funktion som skapar kort av alla produktobjekten

proCreate(products);