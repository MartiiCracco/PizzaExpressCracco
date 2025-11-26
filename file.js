const apiURL = "http://localhost:7297/api/pizze";
const dropdownButton = document.querySelector(".dropbtn");
const dropdownContent = document.querySelector(".dropdown-content");
const forms = document.querySelectorAll(".form-container");
const output = document.querySelector(".divOutput");
const formGet = document.getElementById("getForm");
const formPost = document.getElementById("setForm");
const formPut = document.getElementById("putForm");
const formDelete = document.getElementById("deleteForm");
function showOutput(title, data = null) {
    output.innerHTML = `
        <div class="outputMessage">
            <h2>${title}</h2>
            ${data ? `<pre>${JSON.stringify(data, null, 2)}</pre>` : ""}
        </div>
    `;
}
dropdownButton.addEventListener("click", e => {
    e.preventDefault();
    dropdownContent.classList.toggle("show");
});
document.querySelectorAll(".dropdown-content a").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();

        forms.forEach(f => f.classList.remove("active"));
        const form = document.getElementById(link.dataset.form);
        if (form) form.classList.add("active");

        dropdownContent.classList.remove("show");
    });
});
document.addEventListener("click", e => {
    if (!e.target.closest(".dropdown")) {
        dropdownContent.classList.remove("show");
    }
});
formGet.addEventListener("submit", async e => {
    e.preventDefault();

    try {
        const res = await fetch(apiURL);
        const data = await res.json();
        showOutput("GET eseguito con successo!", data);
    } catch (err) {
        showOutput("Errore GET:", err.message);
    }
});
formPost.addEventListener("submit", async e => {
    e.preventDefault();

    const pizza = {
        //id: formPost.querySelector('input[name="id"]').value,
        nome: formPost.querySelector('input[name="nuovoNome"]').value,
        prezzo: Number(formPost.querySelector('input[name="nuovoPrezzo"]').value)
    };

    try {
        const res = await fetch(apiURL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(pizza)
        });

        const data = await res.json();
        showOutput("POST eseguito!", data);
    } catch (err) {
        showOutput("Errore POST:", err.message);
    }
});
formPut.addEventListener("submit", async e => {
    e.preventDefault();

    const id = formPut.querySelector('input[name="id"]').value;
    const prezzo = formPut.querySelector('input[name="prezzo"]').value;

    if (!id || !prezzo)
        return showOutput("Errore PUT:", "Compila tutti i campi!");

    const nuovo = { prezzo: Number(prezzo) };

    try {
        const res = await fetch(`${apiURL}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(nuovo)
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : null;

        showOutput("PUT eseguito!", data);
    } catch (err) {
        showOutput("Errore PUT:", err.message);
    }
});
formDelete.addEventListener("submit", async e => {
    e.preventDefault();

    const id = formDelete.querySelector('input[name="id"]').value;

    if (!id)
        return showOutput("Errore DELETE:", "Inserisci un ID!");

    try {
        const res = await fetch(`${apiURL}/${id}`, { method: "DELETE" });

        if (!res.ok) throw new Error("ID non trovato");

        showOutput("DELETE eseguito!", `Pizza con ID ${id} eliminata`);
    } catch (err) {
        showOutput("Errore DELETE:", err.message);
    }
});