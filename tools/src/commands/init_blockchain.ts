import * as Config from '../config';
import * as fs from 'fs';
import * as path from 'path';
import * as bip39 from 'bip39';
import { cmd } from '../lib/cmd';
import * as TOML from '../lib/toml';

const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const init = async() => {

  const dataDir = path.join(Config.blockchain.data_path);

  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  
  if (!fs.existsSync(path.join(dataDir, 'build'))) {
  
    const mnemonic = bip39.generateMnemonic();

    fs.mkdirSync(path.join(dataDir, 'build'));
  
    await writeFileAsync(path.join(dataDir, 'build', '.password'), mnemonic);
  
    const genesis = JSON.parse(await readFileAsync(path.join(__dirname, '..', '..', 'template', 'genesis.json')));

    let stdout:any = await cmd(`geth --datadir "${dataDir}" --password "${path.join(dataDir, 'build', '.password')}" account new`);

    console.log(stdout);
  
    const address = stdout.split('\n').find((s:string) => (s.match(/Public address of the key:\s*(.+)/))).replace('Public address of the key:','').trim();

    await writeFileAsync(path.join(dataDir, 'build', '.accounts'), address);

    genesis.config.chainId = Config.blockchain.id;
    genesis.alloc[address.replace('0x','')] = { balance: Config.blockchain.airdrop };
    genesis.extraData = genesis.extraData.replace(new RegExp("########################################", 'g'), address.replace('0x',''));
    await writeFileAsync(path.join(dataDir, 'build', 'genesis.json'), JSON.stringify(genesis, null, 2));

    stdout = await cmd(`geth --datadir "${dataDir}" --password "${path.join(dataDir, 'build', '.password')}" init "${path.join(dataDir, 'build', 'genesis.json')}"`);

    console.log(stdout);

    stdout = await cmd(`geth --networkid ${Config.blockchain.id} --datadir "${dataDir}" --port  30303 --ipcdisable --syncmode "full" --http --allow-insecure-unlock --http.addr "0.0.0.0" --http.port 8545 --http.vhosts=* --http.corsdomain "*" --http.api "personal,admin,eth,net,web3,miner,txpool,debug,clique" --mine --ws --ws.addr "0.0.0.0" --ws.port 8546 --ws.origins '*' --ws.api "personal,admin,eth,net,web3,miner,txpool,debug,clique" --maxpeers 25 --mine --miner.gasprice 0 --miner.etherbase "${address}" --miner.gaslimit 9999999 dumpconfig > "${path.join(dataDir, 'build', "config.toml")}"`)

    console.log(stdout);

    let toml = (await readFileAsync(path.join(dataDir, 'build', 'config.toml'))).toString('utf8');

    toml = TOML.replaceStartLine(toml, 'BootstrapNodes =', 'BootstrapNodes = []');

    toml = TOML.replaceStartLine(toml, 'BootstrapNodesV5 =', 'BootstrapNodesV5 = []');

    await writeFileAsync(path.join(dataDir, 'build', 'config.toml'), Buffer.from(toml));

    let serviceFile:any = (await readFileAsync(path.join(__dirname, '..', '..', 'template', 'geth.service'))).toString('utf8');

    serviceFile = serviceFile.replace(new RegExp("##DATADIR##", 'g'), dataDir);
    serviceFile = serviceFile.replace(new RegExp("##ADDRESS##", 'g'), address);

    await writeFileAsync(path.join(dataDir, 'build', 'geth.service'), Buffer.from(serviceFile));

    console.log('Blockchain initialized')

  } else {
    console.log('Blockchain is already initialized')
  }
}

init();