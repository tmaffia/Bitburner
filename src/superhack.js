/** @param {NS} ns */
export async function main(ns) {
	let target = ns.args[0];
	if (!target || target === '') {
		target = ns.getHostname();
	}

	const maxMoney = ns.getServerMaxMoney(target);
	const minSecurityLevel = ns.getServerMinSecurityLevel(target);
	const securityThreshhold = minSecurityLevel + 5;
	const moneyUpperThreshold = maxMoney * .8;
	const moneyLowerThreshold = maxMoney * .6;

	while (true) {
		let moneyAvailable = ns.getServerMoneyAvailable(target); 
		// Ensure Server security is low 
		if (ns.getServerSecurityLevel(target) > securityThreshhold) {
			await ns.weaken(target);

		// Grow if the server is less than 4/5 max size
		} else if (moneyAvailable < moneyUpperThreshold) {
			await ns.grow(target);

			// Hack if more than 60% max money
			if (moneyAvailable > moneyLowerThreshold) {
				await ns.hack(target);
			}

		} else {
			await ns.hack(target);
		}
	}
}