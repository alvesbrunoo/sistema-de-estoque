let currentId = 0; // Variável global para manter o controle do último ID usado

document.getElementById("item-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Pega o valor dos campos do formulário
    const itemName = document.getElementById("item-name").value;
    const itemQuantity = document.getElementById("item-quantity").value;
    const itemValue = document.getElementById("item-value").value;
    const itemColor = document.getElementById("item-color").value;
    const itemSize = document.getElementById("item-size").value;
    const itemMaterial = document.getElementById("item-material").value;

    // Verifica se os campos estão preenchidos corretamente
    if (itemName === "" || itemQuantity === "" || itemQuantity <= 0 || itemValue === "" || itemColor === "" || itemSize === "" || itemMaterial === "") {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    // Incrementa o ID para o próximo item
    currentId++;

    // Cria uma nova linha na tabela
    const tableBody = document.getElementById("inventory-table-body");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td class="item-number">${currentId}</td> <!-- Número fixo da linha -->
        <td class="item-name">${itemName}</td>
        <td class="stock">${itemQuantity}</td>
        <td class="item-value">${itemValue}</td>
        <td class="item-color">${itemColor}</td>
        <td class="item-size">${itemSize}</td>
        <td class="item-material">${itemMaterial}</td>
        <td>
            <input type="number" class="form-control sell-quantity" placeholder="Quantidade para vender" min="1">
        </td>
        <td>
            <input type="number" class="form-control add-quantity" placeholder="Adicionar Estoque" min="1">
        </td>
        <td>
            <button class="btn btn-danger btn-sm delete-btn">Remover</button>
        </td>
    `;

    tableBody.appendChild(newRow);

    // Limpa os campos do formulário
    document.getElementById("item-name").value = "";
    document.getElementById("item-quantity").value = "";
    document.getElementById("item-value").value = "";
    document.getElementById("item-color").value = "";
    document.getElementById("item-size").value = "";
    document.getElementById("item-material").value = "";

    // Adiciona eventos de venda e adição para os novos itens
    addEventListenersToRow(newRow);

    // Adiciona o evento para remover o item
    newRow.querySelector(".delete-btn").addEventListener("click", function () {
        this.parentElement.parentElement.remove();
    });
});

// Função para adicionar os eventos de venda e adição para uma linha específica
function addEventListenersToRow(row) {
    // Venda de itens
    const sellInput = row.querySelector(".sell-quantity");
    sellInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            const stockCell = row.querySelector(".stock");
            const sellQuantity = parseInt(sellInput.value);
            const stock = parseInt(stockCell.innerText);

            // Verifica se a quantidade de venda é válida
            if (isNaN(sellQuantity) || sellQuantity <= 0) {
                alert("Insira uma quantidade válida para vender.");
                return;
            }

            // Verifica se a quantidade vendida não excede o estoque
            if (sellQuantity > stock) {
                alert("Quantidade de venda excede o estoque disponível!");
                return;
            }

            // Subtrai a quantidade vendida do estoque
            stockCell.innerText = stock - sellQuantity;

            // Limpa o campo de quantidade para vender
            sellInput.value = "";

            // Se o estoque chegar a 0, o item não é removido, mas o estoque é atualizado para 0
            if (stock - sellQuantity === 0) {
                stockCell.innerText = 0;
                // Desabilita o campo de venda, pois não há mais estoque
                sellInput.disabled = true;
            }

            // Previne o comportamento padrão da tecla Enter
            e.preventDefault();
        }
    });

    // Adição de estoque
    const addInput = row.querySelector(".add-quantity");
    addInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            const stockCell = row.querySelector(".stock");
            const addQuantity = parseInt(addInput.value);

            // Verifica se a quantidade de adição é válida
            if (isNaN(addQuantity) || addQuantity <= 0) {
                alert("Insira uma quantidade válida para adicionar.");
                return;
            }

            // Adiciona a quantidade ao estoque
            stockCell.innerText = parseInt(stockCell.innerText) + addQuantity;

            // Limpa o campo de adicionar estoque
            addInput.value = "";

            // Habilita o campo de venda, caso tenha sido desabilitado
            const sellInput = row.querySelector(".sell-quantity");
            sellInput.disabled = false;

            // Previne o comportamento padrão da tecla Enter
            e.preventDefault();
        }
    });
}

// Função de pesquisa
document.getElementById("search-bar").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll("#inventory-table-body tr");

    rows.forEach((row) => {
        const itemName = row.querySelector(".item-name").innerText.toLowerCase();
        const itemNumber = row.querySelector(".item-number").innerText.toLowerCase();

        // Verifica se o nome ou o número do item inclui o valor da pesquisa
        if (itemName.includes(searchValue) || itemNumber.includes(searchValue)) {
            row.style.display = ""; // Mostra a linha
        } else {
            row.style.display = "none"; // Esconde a linha
        }
    });
});

// Função para definir o próximo ID ao carregar a página ou inicializar itens existentes
function initializeNextId() {
    const rows = document.querySelectorAll("#inventory-table-body tr");
    rows.forEach((row) => {
        const id = parseInt(row.querySelector(".item-number").innerText);
        if (id > currentId) {
            currentId = id; // Garante que o próximo ID será o sucessor do maior ID existente
        }
    });
}

// Chama a função para garantir que o ID comece com o maior ID existente
initializeNextId();
