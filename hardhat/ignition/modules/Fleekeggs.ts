const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// biome-ignore lint: type is not exported
module.exports = buildModule("FleekeggsModule", (m: any) => {
	const fleekeggs = m.contract("Fleekeggs", ['0x0001B9f00203105fdB91F52277cFCBC516c33862']);

	return { fleekeggs };
});