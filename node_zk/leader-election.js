/**
 * Based on 
 * Created by Nemo on 15/12/1.
 */

// no need blue bird promises
var zookeeper = require('node-zookeeper-client');

// var client = zookeeper.createClient('localhost:2181');
var client = zookeeper.createClient('192.168.99.100:2181');
//var sessionTimeout = client.getSessionTimeout();

var electionRootPath = '/election';
var memberName = process.argv[2];
var my_path = null;

if (memberName === undefined) {
	console.log('Need a name...')
	process.exit(1)
}

client.once('connected', function () {
  	console.log('Connected to the server.');

	// create root path if not exist
  	client.create(electionRootPath, function (error) {
		if (error) {
			console.log('Failed to create node: %s due to: %s.', electionRootPath, error);
		} else {
			console.log('Node: %s is successfully created.', electionRootPath);
		}
	});

  	client.create(electionRootPath + '/m', new Buffer(memberName), zookeeper.ACL.OPEN_ACL_UNSAFE, zookeeper.CreateMode.EPHEMERAL_SEQUENTIAL, function (error, path) {
//  client.create(electionRootPath, new Buffer(memberName), zookeeper.ACL.OPEN_ACL_UNSAFE, zookeeper.CreateMode.EPHEMERAL_SEQUENTIAL, function (error, path) {
		if (error) {
			console.error('Failed to create node: %s due to: %s.', path, error);
			client.close(); // close and bye bye
		} else {
			my_path = path;
			console.log('Node: %s:%s is successfully created.', my_path, memberName);
		}
/*
    setTimeout(function () {
      console.log('memberName:%s closed', memberName);
      client.close();
    }, 1000 * 30);
*/
		listChildren(client, electionRootPath)
  	});
});

/*
client.on('state', function (state) {
    if (state === zookeeper.State.SYNC_CONNECTED) {
        console.log('Client state is changed to connected.');
    }
});
*/

function listChildren(client, path) {
  client.getChildren(
    path,
    function (event) {
      console.log('Got watcher event: %s', event);
      listChildren(client, path);
    },
    function (error, children, stat) {
      if (error) {
        console.log('Failed to list children of node: %s due to: %s.', path, error);
        return;
      }
      if (!children.length) {
        return console.warn('no members!');
      }
      children.sort();
      leader = children[0];

      if (electionRootPath+'/'+leader === my_path) console.log('i am leader')
      else console.log('follower')
      //console.log(electionRootPath+leader, my_path)

      client.getData(electionRootPath + '/' + leader, function (err, data) {
        console.log('leader:%s,leader.name:%s', leader, data.toString());
      });
    }
  );
}

client.connect();