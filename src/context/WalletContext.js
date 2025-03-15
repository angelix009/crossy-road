import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavedWallet = async () => {
      try {
        // Essayer de charger l'adresse de wallet stockée
        const savedAddress = await AsyncStorage.getItem('walletAddress');
        
        if (savedAddress) {
          setWalletAddress(savedAddress);
          setConnected(true);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du wallet:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedWallet();
  }, []);

  const connectWallet = async () => {
    const isWeb = Platform.OS === 'web';
    
    if (!isWeb) {
      // Mode simulé pour les tests sur mobile
      const mockAddress = "DEmo1234567890ABCDEFghijklmnopqrstuvwxyz12345";
      setWalletAddress(mockAddress);
      setConnected(true);
      await AsyncStorage.setItem('walletAddress', mockAddress);
      return mockAddress;
    }

    try {
      const provider = window?.phantom?.solana;
      
      if (!provider?.isPhantom) {
        window.open('https://phantom.app/', '_blank');
        return null;
      }

      const { publicKey } = await provider.connect();
      const address = publicKey.toString();
      
      setWalletAddress(address);
      setConnected(true);
      
      // Sauvegarder l'adresse pour les futures sessions
      await AsyncStorage.setItem('walletAddress', address);
      
      return address;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      return null;
    }
  };

  const disconnectWallet = async () => {
    const isWeb = Platform.OS === 'web';
    
    if (isWeb) {
      try {
        const provider = window?.phantom?.solana;
        await provider.disconnect();
      } catch (error) {
        console.error("Erreur de déconnexion:", error);
      }
    }
    
    setWalletAddress(null);
    setConnected(false);
    await AsyncStorage.removeItem('walletAddress');
  };

  return (
    <WalletContext.Provider 
      value={{ 
        walletAddress, 
        connected, 
        loading,
        connectWallet,
        disconnectWallet 
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);

export default WalletContext;