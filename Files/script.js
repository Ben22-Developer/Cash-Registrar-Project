let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const cashRegisterLogic = (() => {

    function userPurchase (userPrice) {

        const priceLimit = [0.01,0.05,0.1,0.25,1,5,10,20,100];
        const cidCopy = [];
        for (let i = 0; i < cid.length; i++) {
            cidCopy[i] = [];
            cidCopy[i].push(cid[i][0],cid[i][1]);
        }
        let exchange = userPrice - price;
        if (exchange < 0) {
            return "Customer does not have enough money to purchase the item";
            
        }
        else if (exchange === 0) {
            return ["No change due - customer paid with exact cash"];
        }
        else {
            const exchangeObj = [];
            for (let i = cidCopy.length - 1; i >= 0; i--) {
                if (priceLimit[i] <= exchange && cidCopy[i][1]) {
                    let diminishing = 0;
                    while (true) {
                        cidCopy[i][1] = (cidCopy[i][1] - priceLimit[i]).toFixed(2);
                        cidCopy[i][1] = parseFloat(cidCopy[i][1]);
                        exchange = (exchange - priceLimit[i]).toFixed(2);
                        exchange = parseFloat(exchange);
                        diminishing = (diminishing + priceLimit[i]).toFixed(2);
                        diminishing = parseFloat(diminishing)
                        if (exchange - priceLimit[i] < 0 || !cidCopy[i][1]) {
                            break;
                        }
                    }
                    exchangeObj.push([...[cidCopy[i][0]],diminishing]);
                }
            }
            if (exchange) {
                return ["Status: INSUFFICIENT_FUNDS"];
            }
            else {
                let isTheCashRegiSterEmpty = 0;
                cidCopy.forEach(item => {
                    if (!item[1]) {
                        isTheCashRegiSterEmpty += 1;
                    }
                });
                cid = cidCopy;
                if (isTheCashRegiSterEmpty === 9) {
                    exchangeObj.unshift('Status: CLOSED');
                    return exchangeObj;
                }
                else {
                    exchangeObj.unshift('Status: OPEN');
                    return exchangeObj;
                }      
            }
        }
    }

    return {userPurchase};
})();

const dialog = document.getElementById('dialog');
const purchaseBtn = document.getElementById('purchase-btn');
const input = document.getElementById('cash');
const changeDue = document.getElementById('change-due');

const UIupdate = (() => {

    function changeDueUpdate (exchangeObj) {
        const msg = exchangeObj.shift();
        changeDue.innerHTML = `<h4>${msg}</h4>`;
        changeDue.innerHTML += dueDateInner(exchangeObj).join('');
        cashDrawer();
    }

    function dueDateInner (exchangeObj) {
        const innerHTML = [];
        for (let i = 0; i < exchangeObj.length; i++) {
            const exchange = `<p><span>${exchangeObj[i][0]}: </span>$${exchangeObj[i][1]}<span></span></p>`;
            innerHTML.push(exchange);
        }
        return innerHTML;
    }

    const cashDrawer = () => {
        const li = document.querySelectorAll('#exchange li');
        const priceEl = document.querySelector('#pricePara span');
        priceEl.innerText = price
        li.forEach((item,index) => {
            item.innerText = cid[index][0] +': $'+cid[index][1];
        })
    }

    return {changeDueUpdate,cashDrawer};
})()

UIupdate.cashDrawer();

purchaseBtn.addEventListener('click',(e) => {
    e.preventDefault();
    const exchangeObj = cashRegisterLogic.userPurchase(input.value);

    if(Array.isArray(exchangeObj)) {
        UIupdate.changeDueUpdate(exchangeObj);
    }
    else {
        alert(`${exchangeObj}`);
    }
    input.value = '';
})

document.getElementById('howAppWorksBtn').addEventListener('click',() => {
    dialog.showModal();
});

document.getElementById('closeDialogBtn').addEventListener('click',() => {
    dialog.close();
});