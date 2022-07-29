let securityThreshhold;
const growthThreshold = 20;

/** @param {NS} ns */
export async function main(ns) {
	let target = ns.args[0];
	if (!target || target === '') {
		target = ns.getHostname();
	}
	
	securityThreshhold = ns.getServerMinSecurityLevel(target) + 15;
	const moneyUpperThreshold = ns.getServerMaxMoney(target) * .85;
	const moneyLowerThreshold = ns.getServerMaxMoney(target) * .3;

	// Ensure Server security is low 
	while (ns.getServerSecurityLevel(target) > securityThreshhold) {
		await ns.weaken(target);
	}

	// Grow if the server is less than 2/3 max size
	if (ns.getServerGrowth(target) >= growthThreshold 
		&& ns.getServerMoneyAvailable(target) < moneyUpperThreshold) {
		await ns.grow(target);
	}

	if (ns.getServerMoneyAvailable(target) > moneyLowerThreshold
		|| ns.getServerGrowth(target) <= growthThreshold) {
		await ns.hack(target);
		await main(ns);
	} else {
		await main(ns);
	}
}