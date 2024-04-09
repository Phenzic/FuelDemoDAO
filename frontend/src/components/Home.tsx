import React, { useEffect, useState } from "react";
import { useConnectUI, useIsConnected, useWallet } from "@fuels/react";
import { AbstractAddress, Contract } from "fuels";
import { ContractAbi, ContractAbi__factory } from "../contracts-api";
import { ProposalInput } from "../contracts-api/contracts/ContractAbi";

const CONTRACT_ID =
  "0xe1a2a7ebadc501e173c9f4bd08665a49e1e32571453f883d68c1c4cb7fc46363"; // Replace with your contract ID

const Home: React.FC = () => {
  const [contract, setContract] = useState<ContractAbi>();
  const [proposalCount, setProposalCount] = useState<number>();
  const [proposalIdInput, setProposalIdInput] = useState<string>("");
  const [proposals, setProposals] = useState<any[]>([]); // Define proposals state
  const { connect, isConnecting } = useConnectUI();
  const { isConnected } = useIsConnected();
  const { wallet } = useWallet();
  const [acceptancePercentage, setAcceptancePercentage] = useState<number>(50);
  const [duration, setDuration] = useState<number>(7);
const [proposalTransaction, setProposalTransaction] = useState<ProposalInput>({
  amount: 0, // Initial value for amount
  asset: { value: "" }, // Initial value for asset
  call_data: { arguments: 0, function_selector: 0, id: { value: "" } }, // Initial value for call_data
  gas: 10000, // Initial value for gas
});

  const [activeTab, setActiveTab] = useState<string>('create');
  const [userBalance, setUserBalance] = useState<number>(0);
  const [userVotes, setUserVotes] = useState<number>(0);

  useEffect(() => {
    if (isConnected && wallet) {
      console.log(wallet.address)
      const initializeContract = async () => {
        try {
          const contractInstance = ContractAbi__factory.connect(CONTRACT_ID, wallet);
          setContract(contractInstance);
          // await fetchUserBalance(contractInstance);
        } catch (error) {
          console.error("Error initializing contract:", error);
        }
      };
      initializeContract();
    }
  }, [isConnected, wallet]);

  const fetchProposals = async (
    contractInstance: ContractAbi,
    proposalId: string
  ) => {
    try {
      // Fetch the proposal from the contract
      const proposal = await contractInstance.functions
        .proposal(proposalId)
        .call();
      // Check if the proposal is not null or undefined
      if (proposal) {
        // Set the proposal in the state
        setProposals([proposal]); // Wrap the single proposal in an array
      } else {
        // If proposal is null or undefined, clear the state
        setProposals([]);
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
      // Handle the error as needed
    }
  };
  const fetchUserBalance = async (contractInstance: ContractAbi) => {
    try {
      const balance = await contractInstance.functions.balance().call();
      setUserBalance(Number(balance));
    } catch (error) {
      console.error("Error fetching user balance:", error);
    }
  };

  const getUserAddress = async (): Promise<string> => {
    if (wallet) {
      return wallet.address.toAddress();
    } else {
      throw new Error('User wallet is not connected.');
    }
  };

  const createProposal = async () => {
    try {
      if (!contract) throw new Error("Contract instance is not available");

      console.log("got here")
      const coins = await wallet?.getCoins(); // Call getCoins function and await its result
      const assetId = coins?.[0]?.assetId;
 
      // Extract asset ID from the coins array
      if (!wallet || !wallet.address) throw new Error("Wallet address is not available");
      const setProposalTransaction = {
        amount: acceptancePercentage, // Update amount
        asset: { value: wallet.address.toString() }, // Update asset ID
        call_data: {
          arguments: 123, // Update call data arguments (example value)
          function_selector: 456, // Update function selector (example value)
          id: { value: wallet.address.toString()} , // Update call data ID
        },
        gas: 10000,
      };
      console.log("passed here")
      contract.functions.create_proposal(
        acceptancePercentage,
        duration,
        setProposalTransaction


      );
      console.log("got here too")
      console.log("Proposal created successfully");
    } catch (error) {
      console.error("Error creating proposal:", error);
    }
  };

  const voteOnProposal = async (proposalId: string) => {
    try {
      const voteAmount = await getVoteAmount();
      contract?.functions.vote(true, proposalId, voteAmount);
    } catch (error) {
      console.error("Error voting on proposal:", error);
    }
  };

  const getVoteAmount = async () => {
    return 0;
  };

  const fetchProposalCount = async (contractInstance: ContractAbi) => {
    try {
      const count = await contractInstance.functions.proposal_count().call();
      setProposalCount(Number(count));
    } catch (error) {
      console.error("Error fetching proposal count:", error);
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        {isConnected ? (
          <>
            <div style={styles.tabContainer}>
              <div
                style={{
                  ...styles.tab,
                  ...(activeTab === "create" && styles.activeTab),
                }}
                onClick={() => setActiveTab("create")}
              >
                Create Proposal
              </div>
              <div
                style={{
                  ...styles.tab,
                  ...(activeTab === "vote" && styles.activeTab),
                }}
                onClick={() => setActiveTab("vote")}
              >
                Vote on Proposals
              </div>
            </div>
            {activeTab === "create" && (
              <>
                <label>Acceptance Percentage:</label>
                <input
                  type="number"
                  value={acceptancePercentage}
                  onChange={(e) =>
                    setAcceptancePercentage(parseInt(e.target.value))
                  }
                />
                <label>Duration:</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                />
                <label>Proposal Amount:</label>
                <input
                  type="number"
                  value={proposalTransaction.amount.toString()}
                  onChange={(e) =>
                    setProposalTransaction({
                      ...proposalTransaction,
                      amount: parseInt(e.target.value),
                    })
                  }
                />
                <button onClick={createProposal}>Create Proposal</button>
              </>
            )}
            {activeTab === "vote" && (
              <>
                <h3 style={styles.label}>Available Proposals</h3>
                <div>
                  <label>Proposal ID:</label>
                  <input
                    type="text"
                    value={proposalIdInput}
                    onChange={(e) => setProposalIdInput(e.target.value)}
                  />
                  <button
                    onClick={() =>
                      contract && fetchProposals(contract, proposalIdInput)
                    }
                  >
                    Fetch Proposal
                  </button>
                </div>
                {proposals.map((proposal: any) => (
                  <div key={proposal.id} style={{ marginBottom: "10px" }}>
                    <div>{proposal.text}</div>
                    <button
                      onClick={() => voteOnProposal(proposal.id)}
                      style={styles.button}
                    >
                      Vote
                    </button>
                  </div>
                ))}
              </>
            )}
          </>
        ) : (
          <button onClick={connect} style={styles.button}>
            {isConnecting ? "Connecting" : "Connect"}
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  root: {
    display: 'grid',
    placeItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: "black",
  } as React.CSSProperties,
  container: {
    color: "#ffffffec",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  } as React.CSSProperties,
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  } as React.CSSProperties,
  tab: {
    marginRight: "10px",
    cursor: "pointer",
    fontSize: "20px",
    color: "#a0a0a0", // Adjusted color for better visibility
    borderBottom: "2px solid transparent",
    paddingBottom: "5px",
  } as React.CSSProperties,
  activeTab: {
    borderBottom: "2px solid #ffffffec", // Highlighting the active tab
    color: "#ffffffec", // Adjusted color for better visibility
  } as React.CSSProperties,
  label: {
    fontSize: "18px",
    marginTop: "10px",
  } as React.CSSProperties,
  button: {
    borderRadius: "8px",
    marginTop: "24px",
    backgroundColor: "#707070",
    fontSize: "16px",
    color: "#ffffffec",
    border: "none",
    outline: "none",
    height: "40px",
    padding: "0 1rem",
    cursor: "pointer",
  } as React.CSSProperties,
};

export default Home;
