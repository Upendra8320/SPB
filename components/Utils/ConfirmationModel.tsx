import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

const ConfirmationModal = ({
  isVisible,
  onYes,
  onNo,
  question,
  Yes,
  No,
}: {
  isVisible: boolean;
  onYes: () => void;
  onNo: () => void;
  question: string;
  Yes: string;
  No: string;
}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{question}</Text>
          <View style={styles.buttonView}>
            <Button 
            style={styles.button}
            buttonColor="#d6d6d6"
            textColor="#5b5b5b"
            onPress={onNo}>
              {No}
            </Button>
            <Button 
            style={styles.button}
            buttonColor="#2a2c93" 
            textColor="white"
            onPress={onYes}>
              {Yes}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    display: "flex",
    gap: 10,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonView: {
    display:"flex",
    flexDirection: "row",
    gap:4
  },
  modalText: {
    color:"#585858",
    fontSize:20,
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    margin: 4,
    fontWeight: "700",
    borderRadius: 8,
    width:150,
  }
});

export default ConfirmationModal;
