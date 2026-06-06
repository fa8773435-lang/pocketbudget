const savedTransactions = localStorage.getItem("transactions");

// SALDO AWAL
const savedBalance = localStorage.getItem("balance");
const savedSpent = localStorage.getItem("spent");
const savedGoal = localStorage.getItem("goal");
const savedSaving = localStorage.getItem("saving");
const savedBudget = localStorage.getItem("budget");
const savedGoalName = localStorage.getItem("goalName");
let goalName = savedGoalName ||"sepatu Running";
let budget =
savedBudget
? Number(savedBudget)
: 0;


let balance = savedBalance
? Number(savedBalance)
: 0;

let spent = savedSpent
? Number(savedSpent)
: 0;

let transactions = savedTransactions
? JSON.parse(savedTransactions)
: [];
let goal = savedGoal? Number(savedGoal) : 35000;
let saving = savedSaving? Number(savedSaving): 0;
function formatRupiah(number){
    return number.toLocaleString("id-ID");
}



// ELEMENT HTML
const balanceElement =
document.getElementById("balance");

const spentElement =
document.getElementById("spentAmount");

const addExpenseBtn =
document.getElementById("addExpenseBtn");

const addIncomeBtn =
document.getElementById("addIncomeBtn");

const transactionHistory =
document.getElementById("transactionHistory");
const goalText = document.getElementById("goal-text");
const goalProgress = document.getElementById("goalProgress");
const changeGoalBtn = document.getElementById("changeGoalBtn");
const totalExpenseElement = document.getElementById("totalExpense");
const totalIncomeElement = document.getElementById("totalIncome");
const addSavingBtn = document.getElementById("addSavingBtn");
const aiInsightElement = document.getElementById("aiInsight");
const totalSavingElement = document.getElementById("totalSaving");
const withdrawSavingBtn = document.getElementById("withdrawSavingBtn");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");
const budgetText = document.getElementById("budgetText");
const changeBudgetBtn = document.getElementById("changeBudgetBtn");
const budgetWarning = document.getElementById("budgetWarning");
const resetBtn = document.getElementById("resetBtn");
const goalNameElement = document.getElementById("goalName");

resetBtn.addEventListener("click",function(){
    if(confirm("hapus semua data?")){
        localStorage.clear();
        location.reload();
    }
});



// TAMPILKAN SALDO
balanceElement.textContent = `Rp ${formatRupiah(balance)}`;
spentElement.textContent = `Rp ${formatRupiah(spent)}`;

function updateStatistics(){
    let totalExpense = 0;
    let totalIncome = 0;

    transactions.forEach(function(item){
        if(item.type === "expense"){
            totalExpense += item.amount;

        }else{
            totalIncome += item.amount;
        }
    });
    totalExpenseElement.textContent = `Rp ${formatRupiah(totalExpense)}`;

    totalIncomeElement.textContent = `Rp ${formatRupiah(totalIncome)}`;

    totalSavingElement.textContent = `Rp ${formatRupiah(saving)}`;

}
function updateInsight(){

    if(transactions.length === 0){

        aiInsightElement.textContent =
        "Belum ada transaksi";

        return;
    }

    let totalExpense = 0;
    const categories = {};

    transactions.forEach(function(item){

        if(item.type === "expense"){

            totalExpense += item.amount;

            if(!categories[item.category]){
                categories[item.category] = 0;
            }

            categories[item.category] += item.amount;
        }

    });

    if(totalExpense === 0){

        aiInsightElement.textContent =
        "Belum ada pengeluaran";

        return;
    }

    let biggestCategory = "";
    let biggestAmount = 0;

    for(const category in categories){

        if(categories[category] > biggestAmount){

            biggestAmount = categories[category];
            biggestCategory = category;

        }

    }

    const percentage =
    ((biggestAmount / totalExpense) * 100)
    .toFixed(1);

    const savingRate = getSavingRate();

    let status = "";
    if(savingRate >= 20){
        status = "🟢 hemat"
    }else if(savingRate >= 10){
        status = "🟠 cukup"
    }else{
        status = "🔴 boros!!!!!!"
    }
    if(savingRate >= 20){
    aiInsightElement.style.color = "#22c55e";
}else if(savingRate >= 10){
    aiInsightElement.style.color = "#f59e0b";
}else{
    aiInsightElement.style.color = "#ef4444";
}


    aiInsightElement.textContent =
    `${status} | Pengeluaran terbesar: ${biggestCategory} Rp ${formatRupiah(biggestAmount)} (${percentage}%) | Tabungan: ${savingRate}%`;
}
//saving goal//
function updateGoal(){

    goalNameElement.textContent =
    goalName;

    const progress = Math.min(
        (saving / goal) * 100,
        100
    );

    goalText.textContent =
    `Rp ${formatRupiah(saving)} / Rp ${formatRupiah(goal)}`;

    goalProgress.value = progress;
}

//budget bulanan//
function updateBudget(){

    budgetText.textContent =
    `Rp ${formatRupiah(budget)}`;

    const percentage =
    (spent / budget) * 100;

    if(percentage >= 100){

        budgetWarning.textContent =
        "🚨 Budget terlampaui!";

        budgetWarning.style.color =
        "red";

    }
    else if(percentage >= 80){

        budgetWarning.textContent =
        "⚠️ Budget hampir habis";

        budgetWarning.style.color =
        "orange";

    }
    else{

        budgetWarning.textContent =
        "✅ Budget masih aman";

        budgetWarning.style.color =
        "green";

    }

}
 changeBudgetBtn.addEventListener(
    "click",
    function(){

        const newBudget =
        Number(prompt(
            "Masukkan budget bulanan"
        ));

        if(
            isNaN(newBudget) ||
            newBudget <= 0
        ){
            alert("Budget tidak valid");
            return;
        }

        budget = newBudget;

        localStorage.setItem(
            "budget",
            budget
        );

        updateBudget();

    }
);


// FUNCTION RENDER TRANSAKSI
function renderTransaction(){

    // kosongkan isi history
    transactionHistory.innerHTML = "";



    // looping transaksi
    const keyword = searchInput.value.toLowerCase();
    const typeFilter = filterType.value;
    transactions
    .slice()
    .reverse()
    .filter(function(item){

    const matchName =
    item.name.toLowerCase().includes(keyword);

    const matchType =
typeFilter === "all" ||
item.type === typeFilter;

return matchName && matchType;

})
    .forEach(function(item,index){


        // buat div
        const newTransaction =
        document.createElement("div");



        // tambah class
        newTransaction.classList.add("transaction");



        // CEK TIPE
        if(item.type === "expense"){

            newTransaction.innerHTML = `
            
                <div class="transaction-left">
                    <h3>💸 ${item.name}</h3>
                    <p>${item.category}</p>
                    <small>${item.date || "-"}</small>
                </div>

                <div>
                    <div class="transaction-right">
                        - Rp ${formatRupiah(item.amount)}
                    </div>

                    <button class="delete-btn">
                        ❌
                    </button>
                </div>

            `;

        } else {

            newTransaction.innerHTML = `
            
                <div class="transaction-left">
                    <h3>💰 ${item.name}</h3>
                    <p>Pemasukan</p>
                    <small>${item.date || "-"}</small>
                </div>

                <div>
                    <div class="transaction-right income">
                        + Rp ${formatRupiah(item.amount)}
                    </div>

                    <button class="delete-btn">
                        ❌
                    </button>
                </div>

            `;
        }



        // tampilkan ke html
        transactionHistory.appendChild(newTransaction);



        // BUTTON DELETE
        const deleteBtn =
        newTransaction.querySelector(".delete-btn");



        deleteBtn.addEventListener("click", function(){

            const realIndex =
            transactions.length - 1 - index;



            const deletedTransaction =
            transactions[realIndex];



            // kalau expense
            if(deletedTransaction.type === "expense"){

                balance += deletedTransaction.amount;

                spent -= deletedTransaction.amount;

            } else {

                balance -= deletedTransaction.amount;
            }



            // update text
            balanceElement.textContent =
            `Rp ${formatRupiah(balance)}`;

            spentElement.textContent =
            `Rp ${formatRupiah(spent)}`;



            // hapus transaksi
            transactions.splice(realIndex, 1);



            // simpan ulang
            localStorage.setItem(
                "transactions",
                JSON.stringify(transactions)
            );

            localStorage.setItem(
                "balance",
                balance
            );

            localStorage.setItem(
                "spent",
                spent
            );



            // render ulang
            renderTransaction();
            updateStatistics();
            updateChart();
            updateGoal();
            updateInsight();
            updateChart();
            updateBudget();

        });

    });

}



// JALANKAN SAAT WEB DIBUKA
renderTransaction();
updateStatistics();
updateGoal();
updateInsight();
updateBudget();
searchInput.addEventListener(
    "input",
    renderTransaction
);

filterType.addEventListener(
    "change",
    renderTransaction
);





// BUTTON PENGELUARAN
addExpenseBtn.addEventListener("click", function(){

    const expenseName =
    prompt("Masukan nama pengeluaran");



    const expenseAmount =
    prompt("Masukan jumlah pengeluaran");
    
   const categories =
["Makanan","Transport","Internet","Hiburan"];

const expenseCategory =
prompt(
"Makanan / Transport / Internet / Hiburan"
);



    const amount =
    Number(expenseAmount);

     if(!expenseName || !expenseAmount){
        return;
    }

    if(isNaN(amount) || amount <= 0){
        alert("masukan angka yang valid!");
        return;
    }
    if(amount > balance){
    alert("Saldo tidak cukup!");
    return;
    }



    // kurangi saldo
    balance -= amount;



    // tambah spent
    spent += amount;



    // update tampilan
    balanceElement.textContent =
    `Rp ${formatRupiah(balance)}`;

    spentElement.textContent =
    `Rp ${formatRupiah(spent)}`;



    // simpan data
    localStorage.setItem(
        "balance",
        balance
    );

    localStorage.setItem(
        "spent",
        spent
    );



    // tambah transaksi
    transactions.push({
        name: expenseName,
        amount: amount,
        category: expenseCategory,
        type: "expense",
        date: new Date().toLocaleDateString("id-ID")
    });



    // simpan transaksi
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

   



    // render ulang
    renderTransaction();
    updateStatistics();
    updateChart();
    updateGoal();
    updateInsight();
    updateBudget();
});


// BUTTON PEMASUKAN
addIncomeBtn.addEventListener("click", function(){

    const incomeName =
    prompt("Masukan nama pemasukan");



    const incomeAmount =
    prompt("Masukan jumlah pemasukan");



    const amount =
    Number(incomeAmount);

    if(!incomeName || !incomeAmount){
    return;
    }



    // tambah saldo
    balance += amount;



    // update tampilan
    balanceElement.textContent =
    `Rp ${formatRupiah(balance)}`;



    // simpan balance
    localStorage.setItem(
        "balance",
        balance
    );



    // tambah transaksi
    transactions.push({
        name: incomeName,
        amount: amount,
        type: "income",
        date: new Date().toLocaleDateString("id-ID")
    });



    // simpan transaksi
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );





    // render ulang
    renderTransaction();
    updateStatistics();
    updateChart();
    updateGoal();
    updateInsight();
    updateBudget();

});
//nama tabungan//
addSavingBtn.addEventListener(
    "click",
    function(){
        const savingAmount = prompt("masukan jumlah tabungan");
        const amount = Number(savingAmount);
        if(
            isNaN(amount) ||
            amount <= 0
        ){
            alert("jumlah tidak valid");
            return;
        }
        if(amount > balance){
            alert("saldo tidak cukup")
            return;
        }
        balance -= amount;
        saving += amount;

        balanceElement.textContent = `Rp ${formatRupiah(balance)}`;

        localStorage.setItem("saving",saving)
        localStorage.setItem("balance",balance)

        updateChart();
        updateGoal();
        updateStatistics();
        updateInsight();
    }
);
//tarik tabungan//

withdrawSavingBtn.addEventListener(
    "click",
    function(){
        const withdrawAmount = Number(prompt("masukan jumlah nominal yang akan ditarik"));

        if(
            isNaN(withdrawAmount) ||
            withdrawAmount <= 0
        ){
            alert("jumlah tidak valid");
            return;
        }

        if(withdrawAmount > saving){
            alert("tabunganmu ra cukup");
            return;
        }

        saving -= withdrawAmount;
        balance += withdrawAmount;

        localStorage.setItem(
            "saving",
            saving
        );

        localStorage.setItem(
            "balance",
            balance
        );
        balanceElement.textContent = `Rp ${formatRupiah(balance)}`;

        updateStatistics();
        updateGoal();
        updateChart();
        updateInsight();
        updateBudget();
    }
);

//nominal tabungan//
changeGoalBtn.addEventListener(
    "click",
    function(){

        const newGoalName =
        prompt("Nama target?");

        if(!newGoalName){
            return;
        }

        const newGoal =
        Number(
            prompt("Nominal target?")
        );

        if(
            isNaN(newGoal) ||
            newGoal <= 0
        ){
            alert("Target tidak valid");
            return;
        }

        goalName = newGoalName;
        goal = newGoal;

        localStorage.setItem(
            "goalName",
            goalName
        );

        localStorage.setItem(
            "goal",
            goal
        );

        updateGoal();
    }
);





// CHART
const chartCanvas =
document.getElementById("financeChart");



const financeChart =
new Chart(chartCanvas, {

    type: "bar",

    data: {

        labels: [
            "Pemasukan",
            "Pengeluaran",
            "Tabungan"
        ],

        datasets: [{
            label: "Keuangan Bulan Ini",

            data: [
                balance + spent + saving,
                spent,
                saving
            ],

            backgroundColor: [
                "#4ade80",
                "#f87171",
                "#60a5fa"
            ],

            borderWidth: 1
        }]
  },



    options: {

        responsive: true,

        plugins: {
            legend: {
                labels: {
                    color: "white"
                }
            }
        },

        scales: {

            y: {
                ticks: {
                    color: "white"
                }
            },

            x: {
                ticks: {
                    color: "white"
                }
            }

        }

    }

});


function getTotalIncome(){

    let totalIncome = 0;

    transactions.forEach(function(item){

        if(item.type === "income"){
            totalIncome += item.amount;
        }

    });

    return totalIncome;
}
 function getSavingRate (){
    const totalIncome = getTotalIncome();
    if(totalIncome === 0){
        return 0;
    }
    return((saving / totalIncome) * 100).toFixed(1);
 }


// UPDATE CHART
function updateChart(){

    financeChart.data.datasets[0].data = [

        getTotalIncome(),
        spent,
        saving

    ];

    financeChart.update();

}