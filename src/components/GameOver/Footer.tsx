import { isAvailableAsync } from "expo-sharing";
import React, { useEffect, useState } from "react";
import { LayoutAnimation, Share, StyleSheet, View } from "react-native";

import Colors from "@/Colors";
import Images from "@/Images";
import State from "@/state";
import Button from "../Button";
import { initLeaderboard } from "../../services/LeaderboardService";

async function shareAsync() {
  await Share.share(
    {
      message: `Check out Bouncy Bacon by @baconbrix`,
      url: "https://crossyroad.expo.app",
      title: "Bouncy Bacon",
    },
    {
      dialogTitle: "Share Bouncy Bacon",
      excludedActivityTypes: [
        "com.apple.UIKit.activity.AirDrop", // This speeds up showing the share sheet by a lot
        "com.apple.UIKit.activity.AddToReadingList", // This is just lame :)
      ],
      tintColor: Colors.blue,
    }
  );
}

export default function Footer({
  style,
  showSettings,
  setGameState,
  navigation,
  onShowLeaderboard,
  onCharacterSelect,
  onShop,
  onMultiplayer,
  onCamera
}) {
  const [canShare, setCanShare] = useState(true);

  useEffect(() => {
    isAvailableAsync()
      .then(setCanShare)
      .catch(() => {});
    
    // Initialiser la base de données du leaderboard
    initLeaderboard().catch(err => 
      console.error('Erreur d\'initialisation leaderboard:', err)
    );
  }, []);

  LayoutAnimation.easeInEaseOut();

  return (
    <View style={[styles.container, style]}>
      <Button
        onPress={() => {
          if (showSettings) {
            showSettings();
          }
        }}
        imageStyle={[styles.button, { aspectRatio: 1.25 }]}
        source={Images.button.settings}
      />
      {canShare && (
        <Button
          onPress={shareAsync}
          imageStyle={[styles.button, { marginRight: 4, aspectRatio: 1.9 }]}
          source={Images.button.share}
        />
      )}
      <Button
        onPress={() => {
          if (setGameState) {
            setGameState(State.Game.none);
          }
        }}
        imageStyle={[
          styles.button,
          { marginLeft: canShare ? 4 : 0, aspectRatio: 1.9 },
        ]}
        source={Images.button.long_play}
      />
      <Button
  onPress={() => {
    console.log("Bouton leaderboard cliqué");
    console.log("onShowLeaderboard existe?", !!onShowLeaderboard);
    if (onShowLeaderboard) {
      console.log("Appel de onShowLeaderboard");
      onShowLeaderboard();
    } else {
      console.log("Leaderboard non implémenté");
    }
  }}
  imageStyle={[styles.button, { aspectRatio: 1.25 }]}
  source={Images.button.rank}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    justifyContent: "space-around",
    flexDirection: "row",
    paddingHorizontal: 4,
    minHeight: 56,
    maxHeight: 56,
    minWidth: "100%",
    maxWidth: "100%",
    flex: 1,
  },
  button: {
    height: 56,
  },
});