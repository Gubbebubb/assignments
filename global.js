export function gloNav(navAsgn) {
    const nav = document.querySelector("nav ul");
    const homeli = document.createElement("li");
    const homea = document.createElement("a");
    const curPage = document.querySelector("nav").id;
    if (curPage == "") {
        homea.classList.add("current");
    }
    homeli.textContent = "Start";
    homea.href = "../index.html";
    homea.append(homeli);
    nav.append(homea);
    for (const links of navAsgn) {
        const list = document.createElement("li");
        const link = document.createElement("a");
        link.textContent = links.title;
        link.href = links.link;
        link.dataset.id = links.id;
        list.append(link);
        nav.append(list);
        const allLinks = document.querySelectorAll("nav a");
        for (const all of allLinks) {
            if (links.id == curPage) {
                link.classList.add("current");
            }
        }
    }
}

export function gloCards(navAsgn) {
    const main = document.querySelector("main");
    for (const pages of navAsgn) {
        const card = document.createElement("div");
        const title = document.createElement("h3");
        const text = document.createElement("p");
        const cLink = document.createElement("a");
        title.textContent = pages.title;
        text.textContent = pages.description;
        cLink.textContent = "Gå till uppgift!";
        cLink.href = pages.link;
        main.append(card);
        card.append(title);
        title.append(text);
        text.append(cLink);
    }
}