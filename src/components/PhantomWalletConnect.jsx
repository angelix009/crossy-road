// src/components/PhantomWalletConnect.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

const PhantomWalletConnect = ({ onConnect }) => {
  const [publicKey, setPublicKey] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isWeb, setIsWeb] = useState(false);

  useEffect(() => {
    // Déterminer si nous sommes dans un environnement web
    setIsWeb(Platform.OS === 'web');
  }, []);

  const connectWallet = async () => {
    if (!isWeb) {
      alert("Phantom Wallet est uniquement disponible sur la version web");
      return;
    }

    try {
      const provider = window?.phantom?.solana;
      
      if (!provider?.isPhantom) {
        window.open('https://phantom.app/', '_blank');
        return;
      }

      const { publicKey } = await provider.connect();
      const address = publicKey.toString();
      
      setPublicKey(address);
      setConnected(true);
      
      if (onConnect) {
        onConnect(address);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      alert("Erreur de connexion au wallet");
    }
  };

  const disconnectWallet = async () => {
    if (!isWeb) return;

    try {
      const provider = window?.phantom?.solana;
      await provider.disconnect();
      setPublicKey(null);
      setConnected(false);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  if (!isWeb) {
    return (
      <View style={styles.container}>
        <Text>La connexion à Phantom Wallet est uniquement disponible sur la version web</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!connected ? (
        <TouchableOpacity 
          style={styles.connectButton} 
          onPress={connectWallet}
        >
          <Text style={styles.buttonText}>Connecter Phantom Wallet</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.connectedContainer}>
          <Text style={styles.connectedText}>
            Connected: {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}
          </Text>
          <TouchableOpacity 
            style={styles.disconnectButton} 
            onPress={disconnectWallet}
          >
            <Text style={styles.buttonText}>Déconnecter</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  connectButton: {
    backgroundColor: '#9945FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  disconnectButton: {
    backgroundColor: '#FF4545',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  connectedContainer: {
    alignItems: 'center',
  },
  connectedText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default PhantomWalletConnect;