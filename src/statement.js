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

function getAmountAndCreditsStatement(invoice, plays, result) {
  let totalAmount = 0;
  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    totalAmount += calculateAmount(perf, getPlayFrom(plays, perf));
    // add volume credits
    volumeCredits = countVolumeCredits(volumeCredits, perf, plays);
    //print line for this order
    result += ` ${getPlayFrom(plays, perf).name}: ${(usd(calculateAmount(perf, getPlayFrom(plays, perf))))} (${perf.audience} seats)\n`;
  }
  return {totalAmount, volumeCredits, result};
}

function statement(invoice, plays) {
    let result = `Statement for ${invoice.customer}\n`;
  const __ret = getAmountAndCreditsStatement(invoice, plays, result);
  let totalAmount = __ret.totalAmount;
  let volumeCredits = __ret.volumeCredits;
  result = __ret.result;
  result += `Amount owed is ${(usd(totalAmount))}\n`;
    result += `You earned ${volumeCredits} credits \n`;
    return result;
}

module.exports = {
    statement,
};
