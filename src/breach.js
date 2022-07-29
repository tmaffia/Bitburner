const hackScript = 'superhack.js';

/** @param {NS} ns */
export async function main(ns) {
	const target = ns.args[0];

	if (!ns.hasRootAccess(target)) {
		const portsRequired = ns.getServerNumPortsRequired(target);
		ns.print(portsRequired + ' ports required to be opened on server: ' + target);
		
		switch(portsRequired) {
			case 0:
				await getBackdoorAccess(ns, target);
				break;
			case 1:
				if (ns.ls('home', 'BruteSSH')) {
					ns.brutessh(target);		
					await getBackdoorAccess(ns, target);
					break;
				} else {
					ns.tprintf('Cannot breach: %1$s without BruteSSH.exe', target);
				}
			case 2:
				if (ns.ls('home', 'FTPCrack')) {
					ns.brutessh(target);
					ns.ftpcrack(target);
					await getBackdoorAccess(ns, target);
					break;
				} else {
					ns.tprintf('Cannot breach: %1$s without FTPCrack.exe', target);
				}
			case 3:
				if (ns.ls('home', 'RelaySMTP')) {
					ns.brutessh(target);
					ns.ftpcrack(target);
					ns.relaysmtp(target);
					await getBackdoorAccess(ns, target);
					break;
				} else {
					ns.tprintf('Cannot breach: %1$s without RelaySMTP.exe', target);
				}
			case 4:
				if (ns.ls('home', 'HTTPWorm')) {
					ns.brutessh(target);
					ns.ftpcrack(target);
					ns.relaysmtp(target);
					ns.httpworm(target);
					await getBackdoorAccess(ns, target);
					break;
				} else {
					ns.tprintf('Cannot breach: %1$s without HTTPWorm.exe', target);
				}
			case 5:
				if (ns.ls('home', 'SQLInject')) {
					ns.brutessh(target);
					ns.ftpcrack(target);
					ns.relaysmtp(target);
					ns.httpworm(target);
					ns.sqlinject(target);
					await getBackdoorAccess(ns, target);
					break;
				} else {
					ns.tprintf('Cannot breach: %1$s without SQLInject.exe', target);
				}
		}
	} else {
		if (ns.hasRootAccess(target)) {
		}
	}
}

async function getBackdoorAccess(ns, target) {
	if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(target)) {
		await ns.nuke(target);
		// await ns.installBackdoor(target);
		await ns.print('backdoor and root access achieved for: ' + target);
	} else {
		 ns.print('Required hacking level too high on: ' + target);
	}
}