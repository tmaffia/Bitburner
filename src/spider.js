const deployScript = 'deploy_payload.js';
const hackScript = 'superhack.js';
const backdoorScript = 'breach.js';
const ignoredServers = ['home', 'darkweb', 'cage'];
let hackLevel;
let target;
let _ns;

/** @param {NS} ns */
export async function main(ns) {
	hackLevel = ns.getHackingLevel();
	target = ns.args[0];
	_ns = ns;

	// Creates a list of all servers in game
	let servers = ns.scan();
	servers = spiderServers(servers);
	servers = filterServers(servers);
	ns.tprint('Post-Filter List: ' + servers.sort().join('  :  '));

	if (target) {
		servers.push(target);
		servers.reverse();
	}

	if (!servers) {
		ns.tprint('No connected servers');
		return;
	}

	for (let i = 0; i < servers.length - 1; i++) {
		const serverAdmin = ns.hasRootAccess(servers[i]);
		const serverReqLevel = ns.getServerRequiredHackingLevel(servers[i]);
		if (serverAdmin) {
			runDeployment(servers[i]);
		} else if (serverReqLevel <= hackLevel && !serverAdmin) {
			ns.printf('Attacking server: %1$s', servers[i]);
			ns.run(backdoorScript, 1, servers[i]);
			runDeployment(servers[i]);
		} else {
			ns.printf('Server: %1$s not owned, and hack level too high', servers[i]);
		}
	}
}

function runDeployment(server) {
	const running = (target) ?
		_ns.isRunning(hackScript, server, target) :
		_ns.isRunning(hackScript, server);

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

function spiderServers(servers) {
	for (let i = 0; i < servers.length; i++) {
		let thisScan = _ns.scan(servers[i]);
		thisScan.forEach((server) => {
			if (servers.indexOf(server) === -1) {
				servers.push(server);
			}
		});
	}

	return servers;
}

/**
 * Filters out unwanted servers 
 */
function filterServers(servers) {
	let filteredServers = servers;
	ignoredServers.forEach((serverName) => {
		filteredServers = filteredServers.filter(e => !e.includes(serverName));
	});

	return filteredServers;
}