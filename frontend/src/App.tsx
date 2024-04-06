// import React, { useEffect, useState } from "react";
// import { useConnectUI, useIsConnected, useWallet } from "@fuels/react";
// import { ContractAbi__factory } from "./contracts-api";
// import type { ContractAbi } from "./contracts-api";
// import { BN, BigNumberish, Contract } from "fuels";
// import { ProposalInput } from "./contracts-api/contracts/ContractAbi";

// const CONTRACT_ID =
//   "0xfd6afe13d5993ad373984e74e305427f2e86f852050c135d7e88ce5afcaaa376"; // Replace with your contract ID

// const styles = {
//   root: {
//     display: "grid",
//     placeItems: "center",
//     height: "100vh",
//     width: "100vw",
//     backgroundColor: "blue",
//   } as React.CSSProperties,
//   container: {
//     color: "#ffffffec",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     padding: "20px", // Adding some padding for better spacing
//   } as React.CSSProperties,
//   tabContainer: {
//     display: "flex",
//     justifyContent: "center",
//     marginBottom: "20px",
//   } as React.CSSProperties,
//   tab: {
//     marginRight: "10px",
//     cursor: "pointer",
//     fontSize: "20px",
//     color: "#a0a0a0", // Adjusted color for better visibility
//     borderBottom: "2px solid transparent",
//     paddingBottom: "5px",
//   } as React.CSSProperties,
//   activeTab: {
//     borderBottom: "2px solid #ffffffec", // Highlighting the active tab
//     color: "#ffffffec", // Adjusted color for better visibility
//   } as React.CSSProperties,
//   label: {
//     fontSize: "28px",
//   },
//   button: {
//     borderRadius: "8px",
//     marginTop: "24px",
//     backgroundColor: "#707070",
//     fontSize: "16px",
//     color: "#ffffffec",
//     border: "none",
//     outline: "none",
//     height: "60px",
//     padding: "0 1rem",
//     cursor: "pointer",
//   },
// };

// const App: React.FC = () => {
//   const [contract, setContract] = useState<ContractAbi>();
//   const [proposalCount, setProposalCount] = useState<number>();
//   const [proposals, setProposals] = useState<any[]>([]); // Define proposals state
//   const [proposalIdInput, setProposalIdInput] = useState<string>(""); // State for proposal ID input
//   const { connect, isConnecting } = useConnectUI();
//   const { isConnected } = useIsConnected();
//   const { wallet } = useWallet();
//   const [acceptancePercentage, setAcceptancePercentage] = useState<number>(50);
//   const [duration, setDuration] = useState<number>(7);
//   const [proposalTransaction, setProposalTransaction] = useState<ProposalInput>(
//     {
//       amount: 0,
//       asset: { value: "" },
//       call_data: { arguments: 0, function_selector: 0, id: { value: "" } },
//       gas: 0,
//     }
//   );
//   const [activeTab, setActiveTab] = useState<string>("create");

//   useEffect(() => {
//     async function initializeContract() {
//       if (isConnected && wallet) {
//         const contractInstance = ContractAbi__factory.connect(
//           CONTRACT_ID,
//           wallet
//         );
//         setContract(contractInstance);
//         await fetchProposalCount(contractInstance);
//         await fetchProposals(contractInstance, proposalIdInput); // Fetch proposals when initializing contract
//       }
//     }

//     initializeContract();
//   }, [isConnected, wallet, proposalIdInput]);

//   const fetchProposalCount = async (contractInstance: ContractAbi) => {
//     try {
//       const count = await contractInstance.functions.proposal_count().call();
//       setProposalCount(Number(count));
//     } catch (error) {
//       console.error("Error fetching proposal count:", error);
//     }
//   };

//   const fetchProposals = async (
//     contractInstance: ContractAbi,
//     proposalId: string
//   ) => {
//     try {
//       // Fetch the proposal from the contract
//       const proposal = await contractInstance.functions
//         .proposal(proposalId)
//         .call();
//       // Check if the proposal is not null or undefined
//       if (proposal) {
//         // Set the proposal in the state
//         setProposals([proposal]); // Wrap the single proposal in an array
//       } else {
//         // If proposal is null or undefined, clear the state
//         setProposals([]);
//       }
//     } catch (error) {
//       console.error("Error fetching proposals:", error);
//       // Handle the error as needed
//     }
//   };

//   const createProposal = async () => {
//     try {
//       if (!contract) throw new Error("Contract instance is not available");
//       // Call the create_proposal function on your contract
//       contract.functions.create_proposal(
//         acceptancePercentage,
//         duration,
//         proposalTransaction
//       );
//       // You may want to update state or display a success message upon successful creation
//       console.log("Proposal created successfully");
//     } catch (error) {
//       // Handle any errors that occur during the proposal creation process
//       console.error("Error creating proposal:", error);
//       // You may want to display an error message to the user
//     }
//   };

//   const voteOnProposal = async (proposalId: BigNumberish) => {
//     try {
//       // Assuming you have a function to get the vote amount from somewhere
//       const voteAmount = await getVoteAmount(); // Get the actual amount of votes
//       // Call the vote function on your contract
//       contract?.functions.vote(true, proposalId, voteAmount);
//       // You may want to update state or display a success message upon successful vote
//     } catch (error) {
//       // Handle any errors that occur during the voting process
//       console.error("Error voting on proposal:", error);
//       // You may want to display an error message to the user
//     }
//   };

//   const getVoteAmount = async () => {
//     // Implement your logic to get the actual amount of votes
//     // For example, fetch it from the backend or calculate it based on some conditions
//     return 100; // Dummy value, replace it with your actual logic
//   };

//   return (
//     <div style={styles.root}>
//       <div style={styles.container}>
//         {isConnected ? (
//           <>
//             <div style={styles.tabContainer}>
//               <div
//                 style={{
//                   ...styles.tab,
//                   ...(activeTab === "create" && styles.activeTab),
//                 }}
//                 onClick={() => setActiveTab("create")}
//               >
//                 Create Proposal
//               </div>
//               <div
//                 style={{
//                   ...styles.tab,
//                   ...(activeTab === "vote" && styles.activeTab),
//                 }}
//                 onClick={() => setActiveTab("vote")}
//               >
//                 Vote on Proposals
//               </div>
//             </div>
//             {activeTab === "create" && (
//               <>
//                 <label>Acceptance Percentage:</label>
//                 <input
//                   type="number"
//                   value={acceptancePercentage}
//                   onChange={(e) =>
//                     setAcceptancePercentage(parseInt(e.target.value))
//                   }
//                 />
//                 <label>Duration:</label>
//                 <input
//                   type="number"
//                   value={duration}
//                   onChange={(e) => setDuration(parseInt(e.target.value))}
//                 />
//                 {/* Assuming you have inputs for proposal transaction details */}
//                 {/* Example inputs: */}
//                 <label>Proposal Amount:</label>
//                 <input
//                   type="number"
//                   value={proposalTransaction.amount.toString()}
//                   onChange={(e) =>
//                     setProposalTransaction({
//                       ...proposalTransaction,
//                       amount: parseInt(e.target.value),
//                     })
//                   }
//                 />
//                 {/* Similar inputs for other proposal transaction details */}
//                 <button onClick={createProposal}>Create Proposal</button>
//               </>
//             )}
//             {activeTab === "vote" && (
//               <>
//                 <h3 style={styles.label}>Available Proposals</h3>
//                 {/* Render list of available proposals */}
//                 <div>
//                   <label>Proposal ID:</label>
//                   <input
//                     type="text"
//                     value={proposalIdInput}
//                     onChange={(e) => setProposalIdInput(e.target.value)}
//                   />
//                   <button
//                     onClick={() =>
//                       contract && fetchProposals(contract, proposalIdInput)
//                     }
//                   >
//                     Fetch Proposal
//                   </button>
//                 </div>
//                 {proposals.map(
//                   (
//                     proposal: any // Adjust the type of proposal according to your data structure
//                   ) => (
//                     <div key={proposal.id} style={{ marginBottom: "10px" }}>
//                       <div>{proposal.text}</div>
//                       <button
//                         onClick={() => voteOnProposal(proposal.id)}
//                         style={styles.button}
//                       >
//                         Vote
//                       </button>
//                     </div>
//                   )
//                 )}
//               </>
//             )}
//           </>
//         ) : (
//           <button onClick={connect} style={styles.button}>
//             {isConnecting ? "Connecting" : "Connect"}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default App;

import { FuelProvider } from "@fuels/react";
import {
  FuelWalletConnector,
  FuelWalletDevelopmentConnector,
  FueletWalletConnector,
} from "@fuels/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./components/Home";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <FuelProvider
      fuelConfig={{
        connectors: [
          new FuelWalletConnector(),
          new FuelWalletDevelopmentConnector(),
          new FueletWalletConnector(),
        ],
      }}
    >
      <Home />
    </FuelProvider>
  </QueryClientProvider>
);

export default App;
