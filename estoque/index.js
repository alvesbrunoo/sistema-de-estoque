// Função para salvar um item em localStorage
function saveItem(event) {
    event.preventDefault();

    const itemName = document.getElementById("item-name").value;
    const itemMarca = document.getElementById("item-marca").value;
    const itemQuantity = parseInt(document.getElementById("item-quantity").value);
    const itemValue = parseFloat(document.getElementById("item-value").value).toFixed(2);
    const itemColor = document.getElementById("item-color").value;
    const itemSize = document.getElementById("item-size").value;
    const itemMaterial = document.getElementById("item-material").value;
    const itemQuality = document.getElementById("item-quality").value;

    // Validações de preenchimento e valores
    if (!itemName || !itemMarca || !itemQuantity || !itemValue || !itemColor || !itemSize || !itemMaterial || !itemQuality) {
        alert("Preencha todos os campos.");
        return;
    }

    if (itemQuantity <= 0 || itemValue <= 0) {
        alert("Quantidade e Valor devem ser números positivos.");
        return;
    }

    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const nextId = inventory.length > 0 ? inventory[inventory.length - 1].id + 1 : 1;

    const item = {
        id: nextId,
        name: itemName,
        marca: itemMarca,
        quantity: itemQuantity,
        value: `R$ ${itemValue}`,
        color: itemColor,
        size: itemSize,
        material: itemMaterial,
        quality: itemQuality,
    };

    inventory.push(item);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    alert("Item salvo com sucesso!");
    window.location.href = "index.html"; // Redireciona para a página principal
}

// Função para carregar os itens do localStorage e exibi-los na tabela
function loadInventory() {
    const tableBody = document.getElementById("inventory-table-body");
    tableBody.innerHTML = "";

    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    inventory.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.marca}</td>
            <td class="quantity">${item.quantity}</td>
            <td>${item.value}</td>
            <td>${item.color}</td>
            <td>${item.size}</td>
            <td>${item.material}</td>
            <td>${item.quality}</td>
            <td><input type="number" class="form-control sell-quantity" placeholder="Quantidade para vender" data-id="${item.id}" min="1"></td>
            <td><input type="number" class="form-control add-stock" placeholder="Adicionar Estoque" data-id="${item.id}" min="1"></td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">Remover</button></td>
        `;
        tableBody.appendChild(row);
    });

    // Eventos para campos de vender e adicionar estoque
    document.querySelectorAll(".sell-quantity").forEach(input => {
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                updateQuantity(this.dataset.id, -parseInt(this.value || 0));
                this.value = "";
            }
        });
    });

    document.querySelectorAll(".add-stock").forEach(input => {
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                updateQuantity(this.dataset.id, parseInt(this.value || 0));
                this.value = "";
            }
        });
    });
}

// Função para atualizar a quantidade de um item no localStorage
function updateQuantity(id, change) {
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const item = inventory.find(item => item.id === parseInt(id));
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity < 0) {
            alert("Quantidade insuficiente no estoque.");
            return;
        }
        item.quantity = newQuantity;
        localStorage.setItem("inventory", JSON.stringify(inventory));
        loadInventory();
    }
}

// Função para excluir um item pelo ID
function deleteItem(id) {
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    inventory = inventory.filter(item => item.id !== id);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    loadInventory();
}

// Função de pesquisa com base em ID, nome, marca e cor
function searchItem() {
    const searchValue = document.getElementById("search-bar").value.toLowerCase();
    const rows = document.querySelectorAll("#inventory-table-body tr");

    rows.forEach(row => {
        const itemId = row.cells[0].innerText.toLowerCase();
        const itemName = row.cells[1].innerText.toLowerCase();
        const itemMarca = row.cells[2].innerText.toLowerCase();
        const itemColor = row.cells[5].innerText.toLowerCase();

        if (itemId.includes(searchValue) || itemName.includes(searchValue) || itemMarca.includes(searchValue) || itemColor.includes(searchValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// Inicialização da página
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("inventory-table-body")) {
        loadInventory();
    }

    const form = document.getElementById("item-form");
    if (form) {
        form.addEventListener("submit", saveItem);
    }
});

// Função para carregar os itens na tabela
function loadInventory() {
    const tableBody = document.getElementById("inventory-table-body");
    tableBody.innerHTML = "";

    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    inventory.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.marca}</td>
            <td>${item.quantity}</td>
            <td>${item.value}</td>
            <td>${item.color}</td>
            <td>${item.size}</td>
            <td>${item.material}</td>
            <td>${item.quality}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="openEditModal(${item.id})">Upgrade</button>
                <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">Remover</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Função para abrir o modal de edição
function openEditModal(id) {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const item = inventory.find((item) => item.id === id);

    if (item) {
        document.getElementById("edit-id").value = item.id;
        document.getElementById("edit-name").value = item.name;
        document.getElementById("edit-marca").value = item.marca;
        document.getElementById("edit-quantity").value = item.quantity;
        document.getElementById("edit-value").value = item.value;
        document.getElementById("edit-color").value = item.color;
        document.getElementById("edit-size").value = item.size;
        document.getElementById("edit-material").value = item.material;
        document.getElementById("edit-quality").value = item.quality;

        // Mostra o modal
        $("#editModal").modal("show");
    }
}

// Função para salvar as alterações
function saveEdit(event) {
    event.preventDefault();

    const id = parseInt(document.getElementById("edit-id").value);
    const name = document.getElementById("edit-name").value;
    const marca = document.getElementById("edit-marca").value;
    const quantity = parseInt(document.getElementById("edit-quantity").value);
    const value = parseFloat(document.getElementById("edit-value").value).toFixed(2);
    const color = document.getElementById("edit-color").value;
    const size = document.getElementById("edit-size").value;
    const material = document.getElementById("edit-material").value;
    const quality = document.getElementById("edit-quality").value;

    if (!name || !marca || !quantity || !value || !color || !size || !material || !quality) {
        alert("Preencha todos os campos.");
        return;
    }

    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const itemIndex = inventory.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
        // Atualiza o item no array
        inventory[itemIndex] = { id, name, marca, quantity, value, color, size, material, quality };
        localStorage.setItem("inventory", JSON.stringify(inventory));
        loadInventory();  // Atualiza a tabela

        // Fecha o modal
        $("#editModal").modal("hide");
        alert("Item atualizado com sucesso!");
    }
}

// Função para excluir um item
function deleteItem(id) {
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    inventory = inventory.filter((item) => item.id !== id);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    loadInventory();  // Atualiza a tabela
}

// Evento para salvar as edições
document.getElementById("editForm").addEventListener("submit", saveEdit);

// Inicializa a tabela ao carregar a página
document.addEventListener("DOMContentLoaded", loadInventory);
