import React, { useState, useEffect } from "react";
import {
  Alert,
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Banner from "@/components/GameOver/Banner";
import Footer from "@/components/GameOver/Footer";
import AudioManager from "@/AudioManager";
import Characters from "@/Characters";
import Images from "@/Images";
import { useWallet } from "@/context/WalletContext";
import { saveScore } from "@/services/LeaderboardService";
import LeaderboardScreen from "./LeaderboardScreen";

// Définition initiale de la structure du banner pour les animations
const initialBanners = [
  { color: "#3640eb" },
  { color: "#368FEB" },
  { color: "#36D6EB" }
];

function GameOver({ setGameState, showSettings, onRestart, score = 0 }) {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [characters, setCharacters] = useState(
    Object.keys(Characters).map((val) => Characters[val])
  );
  
  // Utilisez initialBanners pour les animations au lieu de banner
  const [animations, setAnimations] = useState(
    initialBanners.map((val) => new Animated.Value(0))
  );
  
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { connected, walletAddress } = useWallet();
  const [scoreSaved, setScoreSaved] = useState(false);

  // Définir le contenu du banner après les hooks useState
  const banner = [
    {
      color: "#3640eb",
      title: `Score: ${score}`,
      button: {
        onPress: () => setShowLeaderboard(true),
        source: Images.button.mail,
        style: { aspectRatio: 1.85, height: 40 },
      },
    },
    {
      color: "#368FEB",
      title: connected ? `Wallet connected` : "Connect your wallet",
    },
    {
      color: "#36D6EB",
      title: scoreSaved ? "Score saved" : "Be in the Leaderboard",
    },
  ];

  // Auto-save score if wallet is connected
  useEffect(() => {
    const autoSaveScore = async () => {
      if (connected && walletAddress && score > 0 && !scoreSaved) {
        try {
          console.log("Tentative de sauvegarde du score:", score);
          const result = await saveScore(walletAddress, score);
          setScoreSaved(true);
          console.log("Résultat de la sauvegarde:", result);
        } catch (error) {
          console.error("Erreur lors de la sauvegarde du score:", error);
        }
      }
    };

    autoSaveScore();
  }, [connected, walletAddress, score, scoreSaved]);

  const dismiss = () => {
    onRestart();
  };

  const pickRandom = () => {
    const randomIndex = Math.floor(Math.random() * (characters.length - 1));
    const randomCharacter = characters[randomIndex];
    dismiss();
  };

  useEffect(() => {
    setTimeout(() => {
      _animateBanners();

      const playBannerSound = async () => {
        await AudioManager.playAsync(AudioManager.sounds.banner);
      };
      playBannerSound();
      setTimeout(() => playBannerSound(), 300);
      setTimeout(() => playBannerSound(), 600);
    }, 600);
  }, []);

  const _animateBanners = () => {
    const _animations = animations.map((animation) =>
      Animated.timing(animation, {
        useNativeDriver: true,
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(),
      })
    );
    Animated.stagger(300, _animations).start();
  };

  const select = () => {
    dismiss();
  };

  const handleShowLeaderboard = () => {
    setShowLeaderboard(true);
  };

  const handleCloseLeaderboard = () => {
    setShowLeaderboard(false);
  };

  const { top, bottom, left, right } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: top || 12, paddingBottom: bottom || 8 },
      ]}
    >
      <View key="content" style={{ flex: 1, justifyContent: "center" }}>
        {banner.map((val, index) => (
          <Banner
            animatedValue={animations[index].interpolate({
              inputRange: [0.2, 1],
              outputRange: [-width, 0],
              extrapolate: "clamp",
            })}
            key={index}
            style={{
              backgroundColor: val.color,
              transform: [
                {
                  scaleY: animations[index].interpolate({
                    inputRange: [0, 0.2],
                    outputRange: [0, 1],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
            title={val.title}
            button={val.button}
          />
        ))}

        <TouchableOpacity
          style={styles.leaderboardButton}
          onPress={handleShowLeaderboard}
        >
          <Text style={styles.leaderboardText}>Check the Leaderboard</Text>
        </TouchableOpacity>
      </View>

      <Footer
        style={{ paddingLeft: left || 4, paddingRight: right || 4 }}
        showSettings={showSettings}
        setGameState={setGameState}
      />

      {showLeaderboard && (
        <LeaderboardScreen
          onClose={handleCloseLeaderboard}
          currentScore={score}
        />
      )}
    </View>
  );
}

export default GameOver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e",
  },
  leaderboardButton: {
    backgroundColor: "#9945FF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 50,
    marginTop: 20,
  },
  leaderboardText: {
    fontFamily: "retro",
    color: "white",
    fontSize: 18,
  },
});