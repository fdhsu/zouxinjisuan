/**
 * 房贷计算核心工具函数
 * 等额本息 / 等额本金 / 总利息 / 剩余本金
 */

/**
 * 等额本息月供
 * @param {number} principal - 贷款本金
 * @param {number} annualRate - 年利率（小数，如 0.031）
 * @param {number} months - 期数（月）
 * @returns {number}
 */
export function calcEqualInstallment(principal, annualRate, months) {
  const r = annualRate / 12;
  if (r === 0) return principal / months;
  return principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
}

/**
 * 等额本金第 k 月还款额（k 从 0 开始）
 */
export function calcEqualPrincipalMonth(principal, annualRate, months, k) {
  const r = annualRate / 12;
  const monthlyPrincipal = principal / months;
  const remain = principal - monthlyPrincipal * k;
  return monthlyPrincipal + remain * r;
}

/**
 * 生成等额本息还款明细
 * @returns {Array<{month, payment, principal, interest, remain}>}
 */
export function genEqualInstallmentDetail(principal, annualRate, months) {
  const r = annualRate / 12;
  const payment = calcEqualInstallment(principal, r === 0 ? 0 : annualRate, months);
  const list = [];
  let remain = principal;
  for (let k = 0; k < months; k++) {
    const interest = remain * r;
    const prin = payment - interest;
    remain -= prin;
    if (remain < 0) remain = 0;
    list.push({
      month: k + 1,
      payment: payment.toFixed(2),
      principal: prin.toFixed(2),
      interest: interest.toFixed(2),
      remain: remain.toFixed(2),
    });
  }
  return list;
}

/**
 * 生成等额本金还款明细
 */
export function genEqualPrincipalDetail(principal, annualRate, months) {
  const r = annualRate / 12;
  const list = [];
  const monthlyPrincipal = principal / months;
  for (let k = 0; k < months; k++) {
    const remain = principal - monthlyPrincipal * k;
    const interest = remain * r;
    const payment = monthlyPrincipal + interest;
    const newRemain = remain - monthlyPrincipal;
    list.push({
      month: k + 1,
      payment: payment.toFixed(2),
      principal: monthlyPrincipal.toFixed(2),
      interest: interest.toFixed(2),
      remain: (newRemain < 0 ? 0 : newRemain).toFixed(2),
    });
  }
  return list;
}

/**
 * 计算总利息
 * @param {number} method - 0=等额本息, 1=等额本金
 */
export function calcTotalInterest(principal, annualRate, months, method) {
  if (method === 0) {
    const mp = calcEqualInstallment(principal, annualRate, months);
    return mp * months - principal;
  } else {
    const r = annualRate / 12;
    return principal * r * (months + 1) / 2;
  }
}

/**
 * 计算已还 M 期后的剩余本金
 * @param {number} method - 0=等额本息, 1=等额本金
 * @returns {number}
 */
export function calcRemainPrincipal(principal, annualRate, months, paidM, method) {
  const r = annualRate / 12;
  if (method === 0) {
    const mp = calcEqualInstallment(principal, annualRate, months);
    let remain = principal;
    for (let k = 0; k < paidM; k++) {
      const interest = remain * r;
      remain -= (mp - interest);
      if (remain < 0) remain = 0;
    }
    return remain;
  } else {
    const monthlyPrincipal = principal / months;
    return principal - monthlyPrincipal * paidM;
  }
}

/**
 * 计算已还 M 期累计已付利息
 */
export function calcPaidInterest(principal, annualRate, months, paidM, method) {
  const r = annualRate / 12;
  if (method === 0) {
    const mp = calcEqualInstallment(principal, annualRate, months);
    let remain = principal;
    let paidInterest = 0;
    for (let k = 0; k < paidM; k++) {
      const interest = remain * r;
      paidInterest += interest;
      remain -= (mp - interest);
      if (remain < 0) remain = 0;
    }
    return paidInterest;
  } else {
    const monthlyPrincipal = principal / months;
    let paidInterest = 0;
    for (let k = 0; k < paidM; k++) {
      const remain = principal - monthlyPrincipal * k;
      paidInterest += remain * r;
    }
    return paidInterest;
  }
}
