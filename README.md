# Algonest - Basic Frontend design for MEDNFT

This starter full stack project has been generated using AlgoKit. See below for default getting started instructions.

## Setup

### Initial setup
1. Clone this repository to your local machine.
2. Ensure [Docker](https://www.docker.com/) is installed and operational. Then, install `AlgoKit` following this [guide](https://github.com/algorandfoundation/algokit-cli#install).
3. Run `algokit project bootstrap all` in the project directory. This command sets up your environment by installing necessary dependencies, setting up a Python virtual environment, and preparing your `.env` file.
4. In the case of a smart contract project, execute `algokit generate env-file -a target_network localnet` from the `Algonest-contracts` directory to create a `.env.localnet` file with default configuration for `localnet`.
5. To build your project, execute `algokit project run build`. This compiles your project and prepares it for running.
6. For project-specific instructions, refer to the READMEs of the child projects:
   - Smart Contracts: [Algonest-contracts](projects/Algonest-contracts/README.md)
   - Frontend Application: [Algonest-frontend](projects/Algonest-frontend/README.md)

> This project is structured as a monorepo, refer to the [documentation](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/features/project/run.md) to learn more about custom command orchestration via `algokit project run`.

### Subsequently

1. If you update to the latest source code and there are new dependencies, you will need to run `algokit project bootstrap all` again.
2. Follow step 3 above.
## 🚀 Features

### ✅ Doctor-Verified NFT Minting
- Each prescription is minted as an **Algorand Standard Asset (ASA)**.
- Metadata includes:
  - Asset name, title, and description
  - PDF link of the signed prescription
  - Patient’s wallet address
- NFT has a **total supply of 1** and **zero decimals** (indivisible)

### ✅ Secure IPFS Storage
- Prescriptions are uploaded to **IPFS** (e.g., via **Pinata**)
- IPFS hash is embedded in the **ASA metadata**

### ✅ NFT Transfer to Patient
- Automatically transferred to the patient’s wallet after minting

### ✅ Immutable Medical Records
- On-chain, tamper-proof prescription history
- **Doctor identity verification** supported

### ✅ ARC3 Compliant
- Compatible with major **Algorand wallets** for seamless access and sharing

---

## Tools

This project makes use of Python and React to build Algorand smart contracts and to provide a base project configuration to develop frontends for your Algorand dApps and interactions with smart contracts. The following tools are in use:

- Algorand, AlgoKit, and AlgoKit Utils
- Python dependencies including Poetry, Black, Ruff or Flake8, mypy, pytest, and pip-audit
- React and related dependencies including AlgoKit Utils, Tailwind CSS, daisyUI, use-wallet, npm, jest, playwright, Prettier, ESLint, and Github Actions workflows for build validation

### VS Code

It has also been configured to have a productive dev experience out of the box in [VS Code](https://code.visualstudio.com/), see the [backend .vscode](./backend/.vscode) and [frontend .vscode](./frontend/.vscode) folders for more details.

## Integrating with smart contracts and application clients

Refer to the [Algonest-contracts](projects/Algonest-contracts/README.md) folder for overview of working with smart contracts, [projects/Algonest-frontend](projects/Algonest-frontend/README.md) for overview of the React project and the [projects/Algonest-frontend/contracts](projects/Algonest-frontend/src/contracts/README.md) folder for README on adding new smart contracts from backend as application clients on your frontend. The templates provided in these folders will help you get started.
When you compile and generate smart contract artifacts, your frontend component will automatically generate typescript application clients from smart contract artifacts and move them to `frontend/src/contracts` folder, see [`generate:app-clients` in package.json](projects/Algonest-frontend/package.json). Afterwards, you are free to import and use them in your frontend application.

The frontend starter also provides an example of interactions with your AlgonestClient in [`AppCalls.tsx`](projects/Algonest-frontend/src/components/AppCalls.tsx) component by default.

## Next Steps

You can take this project and customize it to build your own decentralized applications on Algorand. Make sure to understand how to use AlgoKit and how to write smart contracts for Algorand before you start.
