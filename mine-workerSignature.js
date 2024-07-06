const { keccak256, encodeAbiParameters, parseAbiParameters, encodePacked, hashMessage } = require('viem');
const { createWalletClient, createPublicClient, http } = require('viem');
const { privateKeyToAccount, signMessage } = require('viem/accounts');
const { baseSepolia } = require('viem/chains');
const { getContract, recoverMessageAddress } = require('viem');

// makeAddr("user")
const USER ='0x6CA6d1e2D5347Bfab1d91e883F1915560e09129D';
const TYPES = [
  3, // 0
  4, // 1
  5, // 2
  6, // 3
  7  // 4
];
const DELTA_EXPIRY = 60 * 60 * 24; // A day
// addr: 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720
const MINTER_PK = '0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6';
const ADDR_fleekeggs = '0x4C743c69E88F146d4dd434cB662024C86c2F0997';

const PUBLIC_CLIENT = createPublicClient({
  chain: baseSepolia,
  transport: http()
});
const CLIENT = createWalletClient({
  account: privateKeyToAccount(MINTER_PK),
  chain: baseSepolia,
  transport: http()
})
const fleekeggs = getContract({
  address: ADDR_fleekeggs,
  abi: require('./ABI_fleekeggs.json'),
  // 1a. Insert a single client
  client: CLIENT,
  // 1b. Or public and/or wallet clients
  client: { public: CLIENT, walletClient: CLIENT }
})

main();

async function main() {
  const nonce = await fleekeggs.read.nonceCount([USER]);

  // Check minter
  const fleekeggsMinter = await fleekeggs.read.minter();
  if (privateKeyToAccount(MINTER_PK).address != fleekeggsMinter) {
    console.log("Wrong minter");
    return;
  }

  // Mine some eggs
  const salts = mine(USER, nonce, TYPES[0], 2);

  // Check the salts and make the message
  const obj = await checkAndMakeMsg(USER, nonce, salts);

  // Sign
  const signature = await signMessage({ message: obj.hashMsg, privateKey:MINTER_PK })

  console.log("Minter addr:", privateKeyToAccount(MINTER_PK).address)
  console.log("Params:", obj.params)
  console.log("Signature:", signature);



  const a = await recoverMessageAddress({ message: obj.hashMsg, signature })
  console.log(a);

return

  // Try mint
  try {
    await PUBLIC_CLIENT.simulateContract({
      address: ADDR_fleekeggs,
      abi: require('./ABI_fleekeggs.json'),
      functionName: 'mintBatch',
      args: [
        obj.params[0],
        obj.params[1],
        obj.params[3],
        obj.params[4],
        signature
      ],
      account: privateKeyToAccount(MINTER_PK).address,
    });

  } catch (error) {
    console.log(error.message)
  }
}

function checkAndMakeMsg(to, nonce, salts) {
  const amounts = new Array(TYPES.length).fill(0);
  for(let i = 0; i < salts.length; i++) {
    let message = encodePacked(
      ['address', 'uint256', 'uint256'],
      [to, nonce, salts[i]]
    );

    const zeros = countLeadingZeros(keccak256(message));
    if (zeros > TYPES[TYPES.length - 1]) zeros = TYPES[TYPES.length - 1];
    amounts[TYPES.findIndex(x => x == zeros)]++;
  }
  const expiry = Math.floor(+Date.now() / 1000) + DELTA_EXPIRY;
  const ids = amounts.map((a, i) => { if(a != 0) return i; }).filter(x => x != undefined);
  const idsAmounts = amounts.map(a => { if(a != 0) return a; }).filter(x => x != undefined);
  const params = [
    to,
    expiry,
    nonce,
    ids,
    idsAmounts
  ];

  const hashMsg = keccak256(encodeAbiParameters(
    parseAbiParameters("address, uint256, uint256, uint256[], uint256[]"),
    params
  ));

  return { params, hashMsg };
}

function mine(to, nonce, maxZerosType, amount) {
  const startArr = 52; // address:20 + uint256: 32 = 52

  let salt = Math.floor(Math.random() * 1e10);
  let message = fromHexString(
    encodePacked(
      ['address', 'uint256', 'uint256'],
      [to, nonce, salt]
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