// src/services/LeaderboardService.js
import { db } from '../firebase/config';
import { collection, query, where, orderBy, limit, getDocs, addDoc } from 'firebase/firestore';

// Ajoutez cette fonction au début de votre fichier
export const initLeaderboard = async () => {
  console.log('Initialisation du leaderboard avec Firebase');
  try {
    // Vérifier que la connexion à Firestore fonctionne
    const scoresRef = collection(db, 'scores');
    await getDocs(scoresRef); // Test simple pour vérifier la connexion
    console.log('Connexion à Firestore établie avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du leaderboard:', error);
    throw error;
  }
};

export const saveScore = async (walletAddress, score) => {
  console.log(`Tentative de sauvegarde du score pour ${walletAddress}: ${score}`);
  
  try {
    // Référence à la collection des scores
    const scoresRef = collection(db, 'scores');
    
    // Rechercher le meilleur score existant pour ce wallet
    const q = query(
      scoresRef, 
      where('wallet_address', '==', walletAddress),
      orderBy('score', 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    let bestScore = 0;
    
    querySnapshot.forEach(doc => {
      bestScore = doc.data().score;
    });
    
    // Si le nouveau score est meilleur, l'enregistrer
    if (score > bestScore) {
      await addDoc(scoresRef, {
        wallet_address: walletAddress,
        score: score,
        timestamp: new Date()
      });
      
      console.log(`Nouveau meilleur score sauvegardé: ${score}`);
      return { updated: true, score };
    } else {
      console.log(`Pas un meilleur score. Meilleur: ${bestScore}, Actuel: ${score}`);
      return { updated: false, score: bestScore };
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du score:', error);
    throw error;
  }
};

export const getTopScores = async (limit = 10) => {
  try {
    // Récupérer tous les scores
    const scoresRef = collection(db, 'scores');
    const snapshot = await getDocs(scoresRef);
    
    // Convertir en tableau et traiter les données
    const allScores = [];
    snapshot.forEach(doc => {
      allScores.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Grouper par wallet_address et garder le meilleur score
    const walletBestScores = {};
    allScores.forEach(score => {
      const address = score.wallet_address;
      if (!walletBestScores[address] || score.score > walletBestScores[address].score) {
        walletBestScores[address] = score;
      }
    });
    
    // Convertir en tableau, trier et limiter
    const topScores = Object.values(walletBestScores)
      .map(score => ({
        wallet_address: score.wallet_address,
        score: score.score
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    console.log('Scores récupérés:', topScores);
    return topScores;
  } catch (error) {
    console.error('Erreur lors de la récupération des scores:', error);
    throw error;
  }
};