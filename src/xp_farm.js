/** @param {NS} ns */
export async function main(ns) {
	let deploymentTarget = ns.args[0];
	if (!deploymentTarget || deploymentTarget === null) {
		deploymentTarget = 'home';	
	}

	const hackScript = 'weaken.js';
	const maxRam = ns.getServerMaxRam(deploymentTarget);
	const scriptRam = ns.getScriptRam(hackScript);
	const threads = Math.floor((maxRam / scriptRam) * .99);

	await ns.scp(hackScript, deploymentTarget);
	if (deploymentTarget !== 'home') {
		ns.killall(deploymentTarget);
	}
	ns.exec(hackScript, deploymentTarget, threads, 'joesguns');
}