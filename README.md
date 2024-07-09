# Eggs Idle Miner

Welcome to Eggs Idle Miner, an innovative idle mining game that combines the engaging elements of idle games with the revolutionary potential of blockchain technology. In this game, players use their PC's processing power to mine unique and rare eggs, each represented as ERC-1155 NFTs.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Types of Eggs](#types-of-eggs)
- [zkLLVM Benefits](#zkllvm-benefits)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Eggs Idle Miner is designed to provide a unique gaming experience where players can earn digital assets through mining. The rarity of the eggs is determined by the complexity of the hashes found during the mining process, creating a fair and engaging reward system.

## Features

- Blockchain Integration: Utilizes Ethereum blockchain to mint and manage ERC-1155 NFTs.
- Idle Mining: Players use their computing power to mine eggs, with rarity based on hash complexity.
- Variety of Eggs: Includes Normal, Plate, Golden, Crystal, Mystic, Fiery, Galaxy, and Cyber Eggs.
- Decentralized Marketplace: Trade your eggs on platforms like OpenSea.
- Scalable and Cost-Efficient: Leveraging zkLLVM for seamless backend integration.

## Installation

To run Eggs Idle Miner locally, follow these steps:

Clone the Repository:
```bash
git clone git@github.com:rotcivegaf/fleekeggs.git
cd fleekeggs
yarn
npm run dev
```

Usage
-----

1.  **Start Mining**:
    -   This demo currently runs using Hardhat, a development environment for Ethereum. You can start the mining process by running the Hardhat node and executing the mining script.
    -   Adjust the number of cores used for mining in the "Cores" section.
2.  **Claim Your Eggs**:
    -   Once you have mined enough, click the "Claim!" button to mint your eggs as ERC-1155 NFTs.
3.  **Check Inventory**:
    -   View your mined eggs in the "Inventory to claim" section.
4.  **Future Deployment**:
    -   In the future, the mining functionality will be deployed on a dedicated server, ensuring continuous and scalable operations.

Types of Eggs
-------------

-   **Normal Egg**: A plain, smooth white egg.
-   **Plate Egg**: A shiny, metallic egg with a platinum-like appearance.
-   **Golden Egg**: A golden egg with a glowing aura.
-   **Crystal Egg**: A transparent egg with multicolored reflections.
-   **Mystic Egg**: An egg covered in ancient runes, emitting a faint purple glow.

zkLLVM Benefits
---------------

**1\. Seamless Integration with Blockchain:** zkLLVM provided an effortless way to integrate with the Ethereum blockchain. This allowed us to mint and manage ERC-1155 tokens without needing extensive backend infrastructure. The serverless nature of zkLLVM simplified the process of handling blockchain transactions, making it easier to focus on game development.

**2\. Serverless Architecture:** The serverless architecture of zkLLVM was particularly beneficial as it reduced the need for managing server infrastructure. This not only saved time and resources but also ensured scalability. As the player base grows, zkLLVM can handle increased traffic and computational demands without requiring significant changes or upgrades.

**3\. Easy Deployment:** Deploying functions on zkLLVM was straightforward and quick. The deployment process was well-documented and user-friendly, allowing for rapid iteration and testing of new features. This agility was crucial during the development phase, especially when participating in a hackathon where time is a critical factor.

**4\. Cost Efficiency:** zkLLVM's pricing model, based on actual usage, was cost-effective for our project. Since "Eggs Idle Miner" is an idle game, the compute requirements are sporadic and can spike during certain times. The pay-as-you-go model ensured that we only paid for the compute power we actually used, keeping our operating costs low.

**5\. Comprehensive Documentation and Support:** The extensive documentation and active support community were invaluable. Whenever we encountered issues or needed clarification, the documentation provided clear guidance, and the community was quick to offer assistance. This support ecosystem enabled us to overcome technical challenges swiftly.

[https://github.com/NilFoundation/nil-by-example/tree/master](https://github.com/NilFoundation/nil-by-example/tree/master)

Contributing
------------

We welcome contributions from the community! Please follow these steps to contribute:

1.  **Fork the Repository**: Click the "Fork" button on the top right corner of this repository page.
2.  **Create a Branch**: Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  **Commit Your Changes**: Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  **Push to the Branch**: Push to the branch (`git push origin feature/AmazingFeature`).
5.  **Open a Pull Request**: Open a pull request to the `main` branch.

License
-------

This project is licensed under the MIT License.
