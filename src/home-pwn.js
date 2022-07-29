const deployScript = 'deploy_payload.js';
const hackScript = 'superhack.js';
const backdoorScript = 'bd.js';
let hackLevel;
let targets;
let _ns;

/** @param {NS} ns */
export async function main(ns) {
	_ns = ns;
	hackLevel = ns.getHackingLevel();
	targets = ns.args[0];
	targets = targets.split(','); 

	// Creates a list of all servers in game
	let servers = ns.scan();
	servers = servers.filter(e => e.includes('cage'));
	ns.tprint('Post-Filter List: ' + servers.sort().join('  :  '));
	ns.tprint('Targets: ' + targets.join('  :  '));

	targets.forEach((target) => {
		const serverAdmin = ns.hasRootAccess(target);
		const serverReqLevel = ns.getServerRequiredHackingLevel(target);
		if (serverReqLevel <= hackLevel && !serverAdmin) {
			ns.printf('Attacking server: %1$s', target);
			ns.run(backdoorScript, 1, target);
		} else {
			ns.printf('Server: %1$s not owned, and hack level too high', target);
		}
	});

	for (let i = 0; i < servers.length; i++) {
		runDeployment(servers[i], targets[i]);
	}
}

function runDeployment(server, target) {
		const running = _ns.isRunning(hackScript, server, target);

	if (running) {
		_ns.printf('%1$s is already running on server: %2$s', hackScript, server);
		return;
	}

	_ns.printf('Running %1$s on server %2$s', deployScript, server);
	if (target) {
		_ns.run(deployScript, 1, server, target);
	} else {
		_ns.run(deployScript, 1, server);
	}
}