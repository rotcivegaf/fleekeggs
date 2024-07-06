const {
  keccak256, encodePacked, createWalletClient, createPublicClient, http, getContract
} = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { baseSepolia } = require('viem/chains');

// makeAddr("user")
const USER ='0x6CA6d1e2D5347Bfab1d91e883F1915560e09129D';
const TYPES = [
  3, // id: 0
  4, // id: 1
  5, // id: 2
  6, // id: 3
  7  // id: 4
];
// addr: 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720
const MINTER_PK = '0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6';
const ADDR_fleekeggs = '0xAd43AbaeD15e41176F666DF2935f1249560e4456';

const PUBLIC_CLIENT = createPublicClient({
  chain: baseSepolia,
  transport: http()
});
const WALLET_CLIENT = createWalletClient({
  account: privateKeyToAccount(MINTER_PK),
  chain: baseSepolia,
  transport: http()
})
const fleekeggs = getContract({
  address: ADDR_fleekeggs,
  abi: require('./ABI_fleekeggs.json'),
  // 1a. Insert a single client
  client: WALLET_CLIENT,
  // 1b. Or public and/or wallet clients
  client: { public: PUBLIC_CLIENT, walletClient: WALLET_CLIENT }
})

main();

async function main() {
  // Check minter
  const fleekeggsMinter = await fleekeggs.read.minter();
  if (privateKeyToAccount(MINTER_PK).address != fleekeggsMinter) {
    console.log("Wrong minter");
    return;
  }

  const userHash = await fleekeggs.read.usersHash([USER]);

  // Mine some eggs
  const salts = mine(USER, userHash, TYPES[0], 2);

  // Check the salts and make the message
  const idsAmounts = await checkSalts(USER, userHash, salts);

  // Try mint
  try {
    const { request } = await PUBLIC_CLIENT.simulateContract({
      address: ADDR_fleekeggs,
      abi: require('./ABI_fleekeggs.json'),
      functionName: 'mintBatch',
      args: [
        USER,
        idsAmounts.ids,
        idsAmounts.amounts,
      ],
      account: privateKeyToAccount(MINTER_PK),
    });
    await WALLET_CLIENT.writeContract(request)

  } catch (error) {
    console.log(error.message)
  }
}

function checkSalts(to, userHash, salts) {
  const amounts = new Array(TYPES.length).fill(0);
  for(let i = 0; i < salts.length; i++) {
    let message = encodePacked(
      ['address', 'bytes32', 'uint256'],
      [to, userHash, salts[i]]
    );

    const zeros = countLeadingZeros(keccak256(message));
    if (zeros > TYPES[TYPES.length - 1]) zeros = TYPES[TYPES.length - 1];
    amounts[TYPES.findIndex(x => x == zeros)]++;
  }
  const ids = amounts.map((a, i) => { if(a != 0) return i; }).filter(x => x != undefined);
  const filterAmounts = amounts.map(a => { if(a != 0) return a; }).filter(x => x != undefined);

  return { ids, amounts: filterAmounts };
}

function countLeadingZeros(hash) {
  hash = hash.slice(2);
  let count = 0;
  for (let i = 0; i < hash.length; i++) {
    if (hash[i] === '0') {
      count++;
    } else {
      return count;
    }
  }
}


// Miner

function mine(to, userHash, maxZerosType, amount) {
  const startArr = 52; // address:20 + uint256: 32 = 52

  let salt = Math.floor(Math.random() * 1e10);
  let message = fromHexString(
    encodePacked(
      ['address', 'uint256', 'uint256'],
      [to, userHash, salt]
    )
  );

  const salts = [];

  let n = 0;
  let startTimestamp = +Date.now();
  for (let i = 0; i < amount; i++) {
    while(true) {
      const hash = keccak256(message);

      if(n % 10000 == 0) {
        console.log(n, hash);
        // hash rate
        console.log('hash rate 10k in', ((+Date.now() - startTimestamp)), 'ms');
        startTimestamp = +Date.now();
      }
      const zeros = countLeadingZeros(hash);
      if(zeros >= TYPES[0]) {
          console.log(`0x${toHexString(message)}`);

          console.log("seed:", `0x${toHexString(message.slice(-32))}`);
          console.log("hash:", hash);
          salts.push("0x" + toHexString(message.slice(startArr)));

          if(zeros >= maxZerosType) {
            break;
          }
      };
      message[startArr + (n & 31)] = (Math.random() * 256) | 0;
      n++;
    }
  }

  return salts;
}

function fromHexString(hexString) {
  if(hexString.startsWith('0x')) hexString = hexString.slice(2);
  return Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
}

function toHexString(bytes) {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}