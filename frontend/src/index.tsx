import { FuelProvider } from '@fuels/react';
import {
  FuelWalletConnector,
  FuelWalletDevelopmentConnector,
  FueletWalletConnector,
} from '@fuels/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

const queryClient = new QueryClient();

const Index: React.FC = () => (
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
      <App />
    </FuelProvider>
  </QueryClientProvider>
);

export default Index;
