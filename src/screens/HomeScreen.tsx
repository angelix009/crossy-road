import React, { useState, useEffect } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Hand from "@/components/HandCTA";
import Footer from "@/components/Home/Footer";
import GameContext from "@/context/GameContext";
import LeaderboardScreen from "./LeaderboardScreen";
import { initLeaderboard } from "../services/LeaderboardService";

let hasShownTitle = false;

function Screen(props) {
  const { setCharacter, character } = React.useContext(GameContext);
  const animation = new Animated.Value(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showCustomLeaderboard, setShowCustomLeaderboard] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  // Initialiser le leaderboard au chargement
  useEffect(() => {
    const init = async () => {
      try {
        await initLeaderboard();
      } catch (err) {
        console.error('Erreur d\'initialisation leaderboard:', err);
      }
    };
    
    init();
  }, []);

  React.useEffect(() => {
    function onKeyUp({ keyCode }) {
      // Space, up-arrow
      if ([32, 38].includes(keyCode)) {
        props.onPlay();
      }
    }

    window.addEventListener("keyup", onKeyUp, false);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  React.useEffect(() => {
    if (!hasShownTitle) {
      hasShownTitle = true;

      Animated.timing(animation, {
        useNativeDriver: process.env.EXPO_OS !== "web",
        toValue: 1,
        duration: 800,
        delay: 0,
      }).start();
    }
  }, []);

  const { top, bottom, left, right } = useSafeAreaInsets();

  const animatedTitleStyle = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-Dimensions.get("window").width, 0],
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0],
        }),
      },
    ],
  };

  // Récupérer le score actuel
  useEffect(() => {
    if (props.coins) {
      setCurrentScore(props.coins);
    }
  }, [props.coins]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          paddingBottom: bottom,
          paddingLeft: left,
          paddingRight: right,
        },
      ]}
    >
      {showLeaderboard && (
        <LeaderboardScreen 
          onClose={() => setShowLeaderboard(false)}
          currentScore={currentScore}
        />
      )}
      
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 20 + top,
          right: 20 + right,
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: 10,
          borderRadius: 5,
          zIndex: 100
        }}
        onPress={() => {
          console.log("Ouverture du leaderboard personnalisé");
          setShowCustomLeaderboard(true);
        }}
      >
        <Text style={{ color: 'white' }}>Leaderboard</Text>
      </TouchableOpacity>

      {showCustomLeaderboard && (
        <LeaderboardScreen 
          onClose={() => setShowCustomLeaderboard(false)}
          currentScore={currentScore}
        />
      )}

      <TouchableOpacity
        activeOpacity={1.0}
        style={[
          StyleSheet.absoluteFill,
          { justifyContent: "center", alignItems: "center" },
        ]}
        onPressIn={() => {
          Animated.timing(animation, {
            toValue: 0,
            duration: 400,
            useNativeDriver: process.env.EXPO_OS !== "web",
            easing: Easing.in(Easing.qubic),
            onComplete: ({ finished }) => {
              if (finished) {
                props.onPlay();
              }
            },
          }).start();
        }}
      >
        <Text style={styles.coins}>{props.coins}</Text>
        <Animated.Image
          source={require("../../assets/images/title.png")}
          style={[styles.title, animatedTitleStyle]}
        />

        <View
          style={{
            justifyContent: "center",
            alignItems: "stretch",
            position: "absolute",
            bottom: Math.max(bottom, 8),
            left: Math.max(left, 8),
            right: Math.max(right, 8),
          }}
        >
          <View style={{ height: 64, marginBottom: 48, alignItems: "center" }}>
            {!__DEV__ && <Hand style={{ width: 36 }} />}
          </View>
          <Footer
            onCharacterSelect={() => {
              // Code existant de la sélection de personnage
            }}
            onShop={() => {}}
            onMultiplayer={() => {}}
            onCamera={() => {}}
            onShowLeaderboard={() => {
              console.log("Tentative d'affichage du leaderboard");
              setShowLeaderboard(true);
              console.log("ShowLeaderboard défini à:", true);
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  title: {
    resizeMode: "contain",
    maxWidth: 600,
    width: "80%",
    height: 300,
  },
  coins: {
    fontFamily: "retro",
    position: "absolute",
    right: 8,
    color: "#f8e84d",
    fontSize: 36,
    letterSpacing: 0.9,
    backgroundColor: "transparent",
    textAlign: "right",
    shadowColor: "black",
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e",
  },
});