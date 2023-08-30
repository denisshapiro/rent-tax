function calculate_tax_for_apartment(rent, tax_free_amount) {
    const tax_10_percent = rent * 0.10;
    const tax_31_percent = (rent - tax_free_amount) > 0 ? (rent - tax_free_amount) * 0.31 : 0;
    
    if (tax_10_percent < tax_31_percent) {
        return [tax_10_percent, 0];
    }
    return [tax_31_percent, Math.min(rent, tax_free_amount)];
}

function print_allocation(apartment_number, rent, tax_free_allocation) {
    let result = "--------------------------------------------------------<br>";

    if (tax_free_allocation === 0) {
        result += `Оплатить налог 10% за квартиру ${apartment_number} = ₪${(rent * 0.1).toFixed(2)}<br>`;
    } else {
        result += `Kвартирa ${apartment_number} использует ₪${tax_free_allocation} от суммы не облагаемой налогом<br>`;
        result += `Платите 31% за Kвартиру ${apartment_number} = ₪${((rent - tax_free_allocation) * 0.31).toFixed(2)}<br>`;
    }

    return result;
}

function calculateOptimalTax() {
    const taxFreeAmountInput = parseFloat(document.getElementById("taxFreeAmount").value);
    const rent1 = parseFloat(document.getElementById("rent1").value);
    const rent2 = parseFloat(document.getElementById("rent2").value);
    const rent3 = parseFloat(document.getElementById("rent3").value);

    let tax_free_amount = (2 * taxFreeAmountInput) - (rent1 + rent2 + rent3);
    
    let resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ''; // Clear previous results

    if (rent1 + rent2 + rent3 <= 5000) {
        resultsDiv.innerHTML = "Oбщая сумма меньше ₪5000, поэтому налогoм не облагается";
        return;
    }

    let min_tax = Infinity;
    let best_dist;

    for (let i = 0; i <= tax_free_amount; i++) {
        for (let j = 0; j <= tax_free_amount - i; j++) {
            let k = tax_free_amount - i - j;
            
            const [tax_rent1, taxfree_used_rent1] = calculate_tax_for_apartment(rent1, i);
            const [tax_rent2, taxfree_used_rent2] = calculate_tax_for_apartment(rent2, j);
            const [tax_rent3, taxfree_used_rent3] = calculate_tax_for_apartment(rent3, k);
            
            const total_tax = tax_rent1 + tax_rent2 + tax_rent3;
            
            if (total_tax < min_tax) {
                min_tax = total_tax;
                best_dist = [taxfree_used_rent1, taxfree_used_rent2, taxfree_used_rent3];
            }
        }
    }

    resultsDiv.innerHTML += `Общая сумма: ₪${rent1 + rent2 + rent3}<br>`;
    resultsDiv.innerHTML += `Cумма не облагаемая налогом: ₪${tax_free_amount}<br>`;
    resultsDiv.innerHTML += `Оптимальный налог составляет: ₪${min_tax.toFixed(2)}<br>`;
    resultsDiv.innerHTML += `Оптимальное распределение суммы не облагаемой налогом:<br>`;
    resultsDiv.innerHTML += print_allocation(1, rent1, best_dist[0]);
    resultsDiv.innerHTML += print_allocation(2, rent2, best_dist[1]);
    resultsDiv.innerHTML += print_allocation(3, rent3, best_dist[2]);
}
