import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useWallet } from '../context/WalletContext';

export default function PhantomConnect({ onConnect }) {
  // Destructurez correctement toutes les propriétés et fonctions du hook useWallet
  const { walletAddress, connected, connectWallet, disconnectWallet } = useWallet();
  const isWeb = Platform.OS === 'web';

  const handleConnect = async () => {
    const address = await connectWallet();
    if (address && onConnect) {
      onConnect(address);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
  };

  return (
    <View style={styles.container}>
      {!connected ? (
        <TouchableOpacity style={styles.button} onPress={handleConnect}>
          <Text style={styles.buttonText}>
            {isWeb ? "Connecter Phantom Wallet" : "Simuler Connexion Wallet"}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.connectedContainer}>
          <Text style={styles.connectedText}>
            Connecté: {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
          </Text>
          <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
            <Text style={styles.disconnectText}>Déconnecter</Text>
          </TouchableOpacity>
        </View>
      )}
      {!isWeb && !connected && (
        <Text style={styles.mobileWarning}>
          (Mode test: simule une connexion)
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#9945FF',
    padding: 10,
    borderRadius: 5,
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  connectedContainer: {
    alignItems: 'center',
  },
  connectedText: {
    color: 'white',
    marginBottom: 5,
  },
  disconnectButton: {
    backgroundColor: '#FF4545',
    padding: 8,
    borderRadius: 5,
    minWidth: 120,
  },
  disconnectText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mobileWarning: {
    color: '#FFD700',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  }
});