document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("expense-form");
    const descInput = document.getElementById("desc");
    const amountInput = document.getElementById("amount");
    const tableBody = document.getElementById("expense-table-body");
    const totalDisplay = document.getElementById("total");
    const searchInput = document.getElementById("search");
    const exportBtn = document.getElementById("export-btn");
  
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  
    function updateTable(filter = "") {
      tableBody.innerHTML = "";
      let total = 0;
  
      expenses.forEach((expense, index) => {
        const match = expense.description.toLowerCase().includes(filter.toLowerCase()) ||
                      expense.amount.toString().includes(filter);
  
        if (match) {
          total += expense.amount;
  
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${expense.description}</td>
            <td>${expense.amount.toFixed(2)}</td>
            <td><button class="delete-btn" data-index="${index}">Delete</button></td>
          `;
          tableBody.appendChild(row);
        }
      });
  
      totalDisplay.textContent = total.toFixed(2);
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const description = descInput.value.trim();
      const amount = parseFloat(amountInput.value);
  
      if (description && !isNaN(amount) && amount > 0) {
        expenses.push({ description, amount });
        updateTable(searchInput.value);
        form.reset();
      }
    });
  
    tableBody.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const index = parseInt(e.target.dataset.index);
        expenses.splice(index, 1);
        updateTable(searchInput.value);
      }
    });
  
    searchInput.addEventListener("input", () => {
      updateTable(searchInput.value);
    });
  
    exportBtn.addEventListener("click", () => {
      let csv = "Description,Amount (KES)\n";
      expenses.forEach(exp => {
        csv += `"${exp.description}",${exp.amount}\n`;
      });
  
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "expenditure_journal.csv";
      a.click();
      URL.revokeObjectURL(url);
    });
  
    updateTable();
  });
  