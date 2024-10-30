// Função para salvar um item em localStorage
function saveItem(event) {
    event.preventDefault();

    const itemName = document.getElementById("item-name").value;
    const itemQuantity = document.getElementById("item-quantity").value;
    const itemValue = document.getElementById("item-value").value;
    const itemColor = document.getElementById("item-color").value;
    const itemSize = document.getElementById("item-size").value;
    const itemMaterial = document.getElementById("item-material").value;
    const itemQuality = document.getElementById("item-quality").value;

    if (!itemName || !itemQuantity || !itemValue || !itemColor || !itemSize || !itemMaterial || !itemQuality) {
        alert("Preencha todos os campos.");
        return;
    }

    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const nextId = inventory.length > 0 ? inventory[inventory.length - 1].id + 1 : 1;

    const item = {
        id: nextId,
        name: itemName,
        quantity: parseInt(itemQuantity),
        value: itemValue,
        color: itemColor,
        size: itemSize,
        material: itemMaterial,
        quality: itemQuality,
    };

    inventory.push(item);
    localStorage.setItem("inventory", JSON.stringify(inventory));

    // Redireciona de volta para a página principal
    window.location.href = "index.html";
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

    // Adiciona eventos de "Enter" para as colunas de quantidade
    document.querySelectorAll(".sell-quantity").forEach(input => {
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                updateQuantity(this.dataset.id, -parseInt(this.value || 0));
                this.value = ""; // Limpa o campo após atualizar
            }
        });
    });

    document.querySelectorAll(".add-stock").forEach(input => {
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                updateQuantity(this.dataset.id, parseInt(this.value || 0));
                this.value = ""; // Limpa o campo após atualizar
            }
        });
    });
}

// Função para atualizar a quantidade de um item no localStorage
function updateQuantity(id, change) {
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const item = inventory.find(item => item.id == id);
    if (item) {
        item.quantity = Math.max(0, item.quantity + change); // Evita que a quantidade seja negativa
        localStorage.setItem("inventory", JSON.stringify(inventory));
        loadInventory(); // Recarrega a tabela para refletir as mudanças
    }
}

// Função para excluir um item pelo ID
function deleteItem(id) {
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    inventory = inventory.filter(item => item.id !== id);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    loadInventory();
}


// Função de pesquisa com base em ID e nome do item
function searchItem() {
    const searchValue = document.getElementById("search-bar").value.toLowerCase();
    const rows = document.querySelectorAll("#inventory-table-body tr");

    rows.forEach(row => {
        const itemId = row.cells[0].innerText.toLowerCase(); // ID do item na primeira coluna
        const itemName = row.cells[1].innerText.toLowerCase(); // Nome do item na segunda coluna

        // Mostra a linha se o ID ou nome contiver o valor pesquisado
        if (itemId.includes(searchValue) || itemName.includes(searchValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// Chame a função `loadInventory` ao carregar a página para exibir os itens salvos
if (document.getElementById("inventory-table-body")) {
    loadInventory();
}


// Carrega o inventário ao abrir a página inicial
if (document.getElementById("inventory-table-body")) {
    loadInventory();
}

// Adiciona evento de salvar ao pressionar "Enter" na página de adição
document.getElementById("item-form")?.addEventListener("submit", saveItem);

// Atualiza a tabela ao pressionar "Enter" na página principal
document.getElementById("search-bar")?.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        loadInventory();
    }
});
