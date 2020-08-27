function usd(thisAmount) {
    const format = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format;
    return format(thisAmount / 100);
}

function calculateAmount(perf, play) {
    let thisAmount = 0;
    switch (play.type) {
        case 'tragedy':
            thisAmount = 40000;
            if (perf.audience > 30) {
                thisAmount += 1000 * (perf.audience - 30);
            }
            break;
        case 'comedy':
            thisAmount = 30000;
            if (perf.audience > 20) {
                thisAmount += 10000 + 500 * (perf.audience - 20);
            }
            thisAmount += 300 * perf.audience;
            break;
        default:
            throw new Error(`unknown type: ${play.type}`);
    }
    return thisAmount;
}

function getPlayFrom(plays, perf) {
    return plays[perf.playID];
}

function countVolumeCredits(volumeCredits, perf, plays) {
    volumeCredits += Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ('comedy' === getPlayFrom(plays, perf).type) volumeCredits += Math.floor(perf.audience / 5);
    return volumeCredits;
}

function getAmountAndCreditsStatement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let performanceNames = [], cost = [], seats = [];
    let result = `Statement for ${invoice.customer}\n`;
    for (let perf of invoice.performances) {
        totalAmount += calculateAmount(perf, getPlayFrom(plays, perf));
        volumeCredits = countVolumeCredits(volumeCredits, perf, plays);
        result += ` ${getPlayFrom(plays, perf).name}: ${(usd(calculateAmount(perf, getPlayFrom(plays, perf))))} (${perf.audience} seats)\n`;
        performanceNames.push(getPlayFrom(plays, perf).name);
        cost.push((usd(calculateAmount(perf, getPlayFrom(plays, perf)))));
        seats.push(perf.audience);
    }
    return {totalAmount, volumeCredits, result, performanceNames, cost, seats};
}

function createStatement(invoice, plays) {

    let result = getAmountAndCreditsStatement(invoice, plays).result;
    result += `Amount owed is ${(usd(getAmountAndCreditsStatement(invoice, plays).totalAmount))}\n`;
    result += `You earned ${getAmountAndCreditsStatement(invoice, plays).volumeCredits} credits \n`;
    return result;
}

function statement(invoice, plays) {
    return createStatement(invoice, plays);
}

function createHtmlStatement(invoice, plays) {
    let result = `<h1>Statement for ${invoice.customer}</h1>
<table>
<tr><th>play</th><th>seats</th><th>cost</th></tr>`;
    for (let i = 0; i < getAmountAndCreditsStatement(invoice, plays).performanceNames.length; i++) {
        result += ` <tr><td>${getAmountAndCreditsStatement(invoice, plays).performanceNames[i]}</td><td>${getAmountAndCreditsStatement(invoice, plays, result).seats[i]}</td><td>${getAmountAndCreditsStatement(invoice, plays, result).cost[i]}</td></tr>` + '\n'
    }
    result += `</table>\n<p>Amount owed is <em>${(usd(getAmountAndCreditsStatement(invoice, plays).totalAmount))}</em></p>\n`;
    result += `<p>You earned <em>${getAmountAndCreditsStatement(invoice, plays).volumeCredits}</em> credits</p>\n`;
    return result;
}

function htmlStatement(invoice, plays) {
    return createHtmlStatement(invoice, plays);
}

module.exports = {
    statement,
    htmlStatement
};
