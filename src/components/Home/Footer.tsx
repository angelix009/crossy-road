import React, { Component } from "react";
import { LayoutAnimation, Animated, StyleSheet, View, Linking, Modal, TouchableOpacity } from "react-native";

import Images from "@/Images";
import Button from "../Button";
import CharacterPicker from "../CharacterPicker";
import GameContext from "@/context/GameContext";
import Characters from "@/Characters";

const imageStyle = { width: 60, height: 48 };

// Liens vers les réseaux sociaux
const TELEGRAM_URL = "https://t.me/votre_chaine_telegram";
const TWITTER_URL = "https://x.com/votre_compte_twitter";

export default function Footer(props) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [characterPickerVisible, setCharacterPickerVisible] = React.useState(false);
  const gameContext = React.useContext(GameContext);

  const collapse = React.useCallback(
    (onPress) => () => {
      setMenuOpen(false);
      onPress();
    },
    [setMenuOpen]
  );

  // Fonction pour ouvrir les liens externes
  const openLink = React.useCallback((url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Impossible d'ouvrir l'URL: " + url);
      }
    });
  }, []);

  // Ouvrir le sélecteur de personnages dans une modale
  const openCharacterPicker = (event) => {
    if (event) {
      event.stopPropagation();
    }
    setCharacterPickerVisible(true);
  };

  // Fermer le sélecteur de personnages
  const closeCharacterPicker = () => {
    setCharacterPickerVisible(false);
  };

  const renderMenu = React.useMemo(() => {
    return (
      <View style={{ flexDirection: "column" }}>
        <Button
          onPress={collapse(props.onMultiplayer)}
          style={[{ marginBottom: 8 }, imageStyle]}
          imageStyle={imageStyle}
          source={Images.button.controller}
        />
        <Button
          onPress={collapse(props.onShop)}
          style={[{ marginBottom: 8 }, imageStyle]}
          imageStyle={imageStyle}
          source={Images.button.shop}
        />
        <Button
          onPress={collapse(props.onCamera)}
          style={[{ marginBottom: 8 }, imageStyle]}
          imageStyle={imageStyle}
          source={Images.button.camera}
        />
      </View>
    );
  }, [collapse]);

  return (
    <Animated.View style={[styles.container, props.style]}>
      {/* Bouton de sélection de personnage */}
      <Button
        style={{ maxHeight: 48 }}
        onPress={openCharacterPicker}
        imageStyle={imageStyle}
        source={Images.button.character}
      />

      {/* Modal pour afficher le sélecteur de personnages */}
      <Modal
        visible={characterPickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeCharacterPicker}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeCharacterPicker}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <CharacterPicker />
            <Button
              style={styles.closeButton}
              onPress={closeCharacterPicker}
              imageStyle={{ width: 30, height: 30, transform: [{ rotate: '180deg' }] }}
              source={Images.button.close || Images.button.menu}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={{ flex: 1 }} />

      {/* Boutons réseaux sociaux côte à côte */}
      <View style={styles.socialContainer}>
        <Button
          onPress={() => openLink(TELEGRAM_URL)}
          style={styles.socialButton}
          imageStyle={imageStyle}
          source={require("../../../assets/images/buttons/2.png")} // Image pour Telegram
        />
        <Button
          onPress={() => openLink(TWITTER_URL)}
          style={styles.socialButton}
          imageStyle={imageStyle}
          source={require("../../../assets/images/buttons/1.png")} // Image pour Twitter/X
        />
      </View>

      {/* Menu principal */}
      <View style={{ flexDirection: "column-reverse" }}>
        <Button
          onPress={() => {
            setMenuOpen(!menuOpen);
          }}
          style={[{ opacity: menuOpen ? 0.8 : 1.0 }, imageStyle]}
          imageStyle={imageStyle}
          source={Images.button.menu}
        />

        {menuOpen && renderMenu}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    justifyContent: "center",
    flexDirection: "row",
    // maxHeight: 48,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e",
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  socialContainer: {
    flexDirection: "row",
    marginRight: 15,
  },
  socialButton: {
    marginRight: 8,
    maxHeight: 48,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#75C5F4',
    borderRadius: 8,
    padding: 15,
    minWidth: 250,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  closeButton: {
    width: 30,
    height: 30,
    marginLeft: 10,
  }
});