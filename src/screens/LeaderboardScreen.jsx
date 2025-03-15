import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PhantomConnect from '../components/PhantomConnect';
import { getTopScores, saveScore } from '../services/LeaderboardService';
// Temporairement, n'utilisez pas le useWallet
// import { useWallet } from '../context/WalletContext';

export default function LeaderboardScreen({ onClose, currentScore = 0 }) {
  // Utilisez à nouveau l'état local à la place du contexte
  const [walletAddress, setWalletAddress] = useState(null);
  const [connected, setConnected] = useState(false);
  const [scoreUpdated, setScoreUpdated] = useState(false);
  const [topScores, setTopScores] = useState([]);
  const [message, setMessage] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      const scores = await getTopScores(20);
      setTopScores(scores);
    } catch (error) {
      console.error('Erreur de chargement des scores:', error);
    }
  };

  const handleWalletConnect = async (address) => {
    setWalletAddress(address);
    setConnected(true);
    
    if (currentScore > 0) {
      try {
        const result = await saveScore(address, currentScore);
        
        if (result.updated) {
          setScoreUpdated(true);
          setMessage(`Nouveau meilleur score: ${currentScore}!`);
          await loadScores();
        } else {
          setScoreUpdated(false);
          setMessage(`Votre meilleur score: ${result.score}`);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setMessage('Erreur de sauvegarde');
      }
    }
  };

  // ... le reste de votre code reste identique

  return (
    <View style={[styles.container, {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.scoreSection}>
          {currentScore > 0 && (
            <Text style={styles.currentScore}>Score: {currentScore}</Text>
          )}
          
          {!connected ? (
            <View style={styles.connectSection}>
              <Text style={styles.instructionText}>Connectez votre wallet pour sauvegarder le score</Text>
              <PhantomConnect onConnect={handleWalletConnect} />
            </View>
          ) : (
            <View style={styles.walletSection}>
              <Text style={styles.walletText}>
                Wallet: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
              </Text>
              {currentScore > 0 && message && (
                <Text style={[
                  styles.messageText,
                  scoreUpdated ? styles.successText : styles.infoText
                ]}>
                  {message}
                </Text>
              )}
            </View>
          )}
        </View>
        
        <View style={styles.leaderboard}>
          <FlatList
            data={topScores}
            keyExtractor={(item, index) => `score-${index}`}
            renderItem={({ item, index }) => (
              <View style={styles.scoreRow}>
                <Text style={styles.rank}>#{index + 1}</Text>
                <Text style={styles.address}>
                  {item.wallet_address.slice(0, 6)}...{item.wallet_address.slice(-4)}
                </Text>
                <Text style={styles.score}>{item.score}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Aucun score enregistré</Text>
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontFamily: 'retro',
    fontSize: 24,
    color: '#f8e84d',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scoreSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  currentScore: {
    fontFamily: 'retro',
    fontSize: 24,
    color: '#f8e84d',
    marginBottom: 16,
  },
  connectSection: {
    alignItems: 'center',
  },
  instructionText: {
    textAlign: 'center',
    marginBottom: 12,
    color: 'white',
  },
  walletSection: {
    alignItems: 'center',
  },
  walletText: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
  },
  messageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  successText: {
    color: '#4CAF50',
  },
  infoText: {
    color: '#2196F3',
  },
  leaderboard: {
    flex: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  rank: {
    width: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  address: {
    flex: 1,
    color: 'white',
  },
  score: {
    width: 80,
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#f8e84d',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: 'white',
  },
});