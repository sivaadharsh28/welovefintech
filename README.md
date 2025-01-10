# Ripple Shield Travel Insurance

This repository contains the complete source code for **Ripple Shield**, a blockchain-powered travel insurance platform. Ripple Shield leverages XRPL (XRP Ledger) and EVM-compatible sidechains to provide automated claims processing, transparent transactions, and seamless multi-currency payouts.



## **About Ripple Shield**
Ripple Shield Travel Insurance is a platform created to tackle common issues in traditional travel insurance, such as slow claims processing, high costs, obsolete cross-border payment options, and poor insurance fraud prevention. Using blockchain technology on the XRPL (XRP Ledger) and EVM-compatible sidechains, Ripple Shield simplifies claim management, improves transparency, and lowers operational expenses. Key features include instant payouts for flight delays, support for payouts in various currencies, and transparent policy transactions. Ripple Shield aims to provide a more efficient and user-friendly approach to travel insurance, offering travelers greater convenience and reliability.

## **Features**
- **Automated Claims Processing**:
  - Real-time API integrations for parametric insurance (e.g., flight delays).
  - Smart contracts for instant payouts based on predefined conditions - Reduces the hassle of claims and delays with payouts.

- **Multi-Currency Payouts**:
  - Supports multiple currencies at no additional cost by leveraging XRPL to enhance global accessibility.

- **Transparent Claims**:
  - All transactions and claims are securely recorded on an immutable blockchain.

- **Seamless User Experience**:
  - Intuitive frontend and robust backend to simplify policy management and claims.


## **Project Structure**
- **`controllers/`**: Contains logic for handling user requests, interacting with APIs, and managing smart contract calls.
- **`models/`**: Includes Mongoose schemas for MongoDB, defining data structures such as users and claims.
- **`routes/`**: API endpoints for user authentication, policy management, and claims processing.
- **`misc/`**: Helper functions and utility scripts for various operations.
- **`server.js`**: The main entry point for the backend server.
- **`package.json`**: Project dependencies and metadata.


## **Technologies Used**
- **Backend**:
  - **Node.js**: Backend runtime environment.
  - **Express.js**: Web framework for building APIs.
  - **MongoDB with Mongoose**: For database management and schema modelling.
- **Blockchain**:
  - **XRPL and EVM-Compatible Sidechains**: To handle smart contracts and token transactions.
- **APIs**:
  - **AviationStack API**: For real-time flight status updates to automate claim validation.
- **Smart Contracts**:
  - Developed in **Solidity** for handling payouts and ERC20 token integration.

