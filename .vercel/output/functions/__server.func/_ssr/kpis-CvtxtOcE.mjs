//#region node_modules/.nitro/vite/services/ssr/assets/kpis-CvtxtOcE.js
function inMonth(date, year, month) {
	const mm = String(month).padStart(2, "0");
	return date.startsWith(`${year}/${mm}`);
}
function saleFinal(s) {
	return s.qty * s.unitPrice - (s.discount || 0);
}
function saleWeight(s) {
	return s.qty * s.packKg;
}
function saleRemain(s) {
	return saleFinal(s) - (s.collected || 0);
}
function purchaseTotal(p) {
	return p.kg * p.price + (p.freight || 0);
}
function wasteKg(p) {
	return p.inputKg - p.cleanKg;
}
function packCount(p) {
	if (!p.packKg) return 0;
	return Math.floor(p.cleanKg / p.packKg);
}
function abcClass(total, settings) {
	if (total >= settings.abcA) return "A";
	if (total >= settings.abcB) return "B";
	return "C";
}
function firstPurchase(name, sales) {
	return sales.filter((s) => s.customer === name).map((s) => s.date).sort()[0] ?? "";
}
function lastPurchase(name, sales) {
	const dates = sales.filter((s) => s.customer === name).map((s) => s.date).sort();
	return dates[dates.length - 1] ?? "";
}
function customerTotal(name, sales) {
	return sales.filter((s) => s.customer === name).reduce((a, s) => a + saleFinal(s), 0);
}
function rawStock(product, purchases, production, moves) {
	return purchases.filter((p) => p.product === product && p.status === "تأیید شده").reduce((a, p) => a + p.kg, 0) + moves.filter((m) => m.kind === "مواد اولیه" && m.product === product).reduce((a, m) => a + m.inn, 0) - (production.filter((p) => p.product === product).reduce((a, p) => a + p.inputKg, 0) + moves.filter((m) => m.kind === "مواد اولیه" && m.product === product).reduce((a, m) => a + m.out, 0));
}
function finStock(product, production, sales, moves) {
	return production.filter((p) => p.product === product).reduce((a, p) => a + p.cleanKg, 0) + moves.filter((m) => m.kind === "محصول نهایی" && m.product === product).reduce((a, m) => a + m.inn, 0) - (sales.filter((s) => s.product === product).reduce((a, s) => a + saleWeight(s), 0) + moves.filter((m) => m.kind === "محصول نهایی" && m.product === product).reduce((a, m) => a + m.out, 0));
}
function packStock(product, packKg, production, sales) {
	return production.filter((p) => p.product === product && p.packKg === packKg).reduce((a, p) => a + packCount(p), 0) - sales.filter((s) => s.product === product && s.packKg === packKg).reduce((a, s) => a + s.qty, 0);
}
function lightOf(value, def) {
	if (def.direction === "info" || def.green == null || def.yellow == null) return "info";
	if (def.direction === "higher") {
		if (value >= def.green) return "ok";
		if (value >= def.yellow) return "watch";
		return "critical";
	}
	if (value <= def.green) return "ok";
	if (value <= def.yellow) return "watch";
	return "critical";
}
function computeKpis(input) {
	const { settings, purchases, production, sales, customers, visits, expenses, moves, kpiDefs, products } = input;
	const y = settings.year;
	const m = settings.month;
	const monthSales = sales.filter((s) => inMonth(s.date, y, m));
	const monthPurch = purchases.filter((p) => inMonth(p.date, y, m));
	const monthProd = production.filter((p) => inMonth(p.date, y, m));
	const monthExp = expenses.filter((e) => inMonth(e.date, y, m));
	const monthVis = visits.filter((v) => inMonth(v.date, y, m));
	const salesDay = sales.filter((s) => s.date === settings.today).reduce((a, s) => a + saleFinal(s), 0);
	const salesMonth = monthSales.reduce((a, s) => a + saleFinal(s), 0);
	const purchasesMonth = monthPurch.filter((p) => p.status === "تأیید شده").reduce((a, p) => a + purchaseTotal(p), 0);
	const expensesMonth = monthExp.reduce((a, e) => a + e.amount, 0);
	const gross = salesMonth - purchasesMonth - expensesMonth;
	const raw = products.reduce((a, p) => a + rawStock(p, purchases, production, moves), 0);
	const fin = products.reduce((a, p) => a + finStock(p, production, sales, moves), 0);
	const prodKg = monthProd.reduce((a, p) => a + p.cleanKg, 0);
	const inKg = monthProd.reduce((a, p) => a + p.inputKg, 0);
	const waste = inKg ? monthProd.reduce((a, p) => a + wasteKg(p), 0) / inKg : 0;
	const orders = monthSales.length;
	const newCust = customers.filter((c) => inMonth(firstPurchase(c.name, sales), y, m)).length;
	const collected = monthSales.reduce((a, s) => a + (s.collected || 0), 0);
	const receivables = sales.reduce((a, s) => a + Math.max(0, saleRemain(s)), 0);
	const planned = monthVis.reduce((a, v) => a + v.planned, 0);
	const visited = monthVis.reduce((a, v) => a + v.visited, 0);
	const visOrders = monthVis.reduce((a, v) => a + v.orders, 0);
	const visitRate = planned ? visited / planned : 0;
	const conversion = visited ? visOrders / visited : 0;
	const accepted = monthPurch.filter((p) => p.status === "تأیید شده").length;
	const values = {
		sales_day: salesDay,
		sales_month: salesMonth,
		gross_profit: gross,
		purchases: purchasesMonth,
		raw_stock: raw,
		fin_stock: fin,
		production: prodKg,
		waste,
		orders,
		new_cust: newCust,
		collected,
		receivables,
		expenses: expensesMonth,
		visit_rate: visitRate,
		conversion,
		accept_rate: monthPurch.length ? accepted / monthPurch.length : 0
	};
	return kpiDefs.map((d) => {
		const value = values[d.key] ?? 0;
		const light = lightOf(value, d);
		const action = light === "critical" ? d.actionRed : light === "watch" ? d.actionYellow : "";
		return {
			key: d.key,
			name: d.name,
			value,
			unit: d.unit,
			target: d.green,
			light,
			action
		};
	});
}
function formatKpi(value, unit) {
	if (unit === "تومان") return new Intl.NumberFormat("fa-IR").format(Math.round(value));
	if (unit === "درصد") return new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 }).format(value * 100) + "٪";
	if (unit === "کیلوگرم") return new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 }).format(value);
	return new Intl.NumberFormat("fa-IR").format(value);
}
//#endregion
export { wasteKg as _, firstPurchase as a, lastPurchase as c, packStock as d, purchaseTotal as f, saleWeight as g, saleRemain as h, finStock as i, lightOf as l, saleFinal as m, computeKpis as n, formatKpi as o, rawStock as p, customerTotal as r, inMonth as s, abcClass as t, packCount as u };
