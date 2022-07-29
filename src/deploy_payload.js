const hackScript = 'superhack.js';

/** @param {NS} ns */
export async function main(ns) {
	const deploymentTarget = ns.args[0];
	const target = ns.args[1];
	
	ns.killall(deploymentTarget);
	await ns.scp(hackScript, deploymentTarget);
	startRemoteScript(ns, deploymentTarget, target);
}

function startRemoteScript(ns, deploymentTarget, target) {
	const maxRam = ns.getServerMaxRam(deploymentTarget);
	const scriptRam = ns.getScriptRam(hackScript);
	const threads = Math.floor(maxRam / scriptRam);
	if (threads < 1) {
		return;
	}

	ns.print('Starting ' + hackScript + ' with ' + threads.toString() + ' threads!');
	if (target) {
		ns.exec(hackScript, deploymentTarget, threads, target);
	} else {
		ns.exec(hackScript, deploymentTarget, threads);
	}
	ns.print('Started!');
}