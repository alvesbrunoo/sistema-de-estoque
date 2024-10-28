// Função para adicionar um item ao estoque
function addItem(id, name, quantity, value, color, size, material, quality, sellQuantity) {
    const tableBody = document.getElementById('inventory-table-body');
    
    // Cria uma nova linha para o item
    const newRow = document.createElement('tr');

    // Cria as células para a nova linha
    newRow.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${quantity}</td>
        <td>${value}</td>
        <td>${color}</td>
        <td>${size}</td>
        <td>${material}</td>
        <td>${quality}</td>
        <td>${sellQuantity}</td>
        <td><button class="btn btn-success" onclick="addToStock('${id}')">Adicionar</button></td>
        <td><button class="btn btn-danger" onclick="deleteItem(this)">Remover</button></td>
    `;

    // Adiciona a nova linha ao corpo da tabela
    tableBody.appendChild(newRow);
}

// Função para buscar itens (simples exemplo de filtragem)
function searchItem() {
    const searchValue = document.getElementById('search-bar').value.toLowerCase();
    const rows = document.querySelectorAll('#inventory-table-body tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let isMatch = false;

        cells.forEach(cell => {
            if (cell.textContent.toLowerCase().includes(searchValue)) {
                isMatch = true;
            }
        });

        row.style.display = isMatch ? '' : 'none';
    });
}

// Função para adicionar quantidade ao estoque
function addToStock(id) {
    // Aqui você pode implementar a lógica para adicionar ao estoque
    alert(`Quantidade adicionada ao estoque para o item ID: ${id}`);
}

// Função para remover um item da tabela
function deleteItem(button) {
    const row = button.parentElement.parentElement; // Obtém a linha pai do botão
    row.parentElement.removeChild(row); // Remove a linha da tabela
}

// Exemplo de como adicionar um item ao iniciar a página (para teste)
document.addEventListener('DOMContentLoaded', () => {
    // Adiciona alguns itens de exemplo
    addItem(1, 'Produto A', 10, 'R$ 20,00', 'Vermelho', 'M', 'Algodão', 'Alta', 5);
    addItem(2, 'Produto B', 15, 'R$ 30,00', 'Azul', 'G', 'Poliéster', 'Média', 10);
});
