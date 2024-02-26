import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, List, Avatar, TextInput } from "react-native-paper";
import { Styles } from "../../Styles/Styles";

const ConfigScreen = () => {
    const [config, setConfig] = useState({ motorValue: '', engineValue: '' });

  //get log
  const getConfigLogs = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@config_logs");
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      
    }
  };
  const saveConfigLogs = async () => {
    
    try {
      const jsonValue = JSON.stringify(config);
      await AsyncStorage.setItem("@config_logs", jsonValue);
      ToastAndroid.show("Successfull", ToastAndroid.SHORT)
    } catch (e) {
      
      ToastAndroid.show("failed", ToastAndroid.SHORT)
    }
  };

  useEffect(() => {
    const loadConfig = async () => {
      const loadedConfig = await getConfigLogs();
      if (loadedConfig) {
        setConfig(loadedConfig);
      }
    };
    loadConfig();
  }, []);

  return (
    <ScrollView>
      <View>
        <View style={Styles.header}>
          <Text style={Styles.headerText}>Set Values</Text>
        </View>
        <View style={{ backgroundColor: "#f6f8fa" }}> 
          <View style={styles.Input}>
            <View>
              <Text style={styles.InputText}>Motor Value :</Text>
            </View>
            <View style={styles.InputBox}>
              <TextInput
                placeholder="Enter Motor Value"
                keyboardType="numeric"
                value={config?.motorValue}
                onChangeText={(text) =>
                    setConfig((prev: any) => {
                    return { ...prev, motorValue: text.trim() };
                  })
                }
                style={{ backgroundColor: "white" }}
              />
            </View>
          </View>
          <View style={styles.Input}>
            <View>
              <Text style={styles.InputText}>Engine Value :</Text>
            </View>
            <View style={styles.InputBox}>
              <TextInput
                placeholder="Enter Engine Value"
                keyboardType="numeric"
                value={config?.engineValue}
                onChangeText={(text) =>
                    setConfig((prev: any) => {
                    return { ...prev, engineValue: text.trim() };
                  })
                }
                style={{ backgroundColor: "white" }}
              />
            </View>
          </View>
          <View style={Styles.submitBtn}>
            <Button
              style={Styles.button}
              uppercase={true}
              buttonColor="#2a2c93"
              mode="contained"
              onPress={saveConfigLogs}
            >
              <Text>Submit</Text>
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
    gap: 10,
  },
  Input: {
    display: "flex",
    justifyContent: "space-between",
    gap: 5,
    marginTop: 10,
    marginLeft: 25,
    marginRight: 25,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    backgroundColor: "white",
  },
  InputText: {
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#4F4F4F",
    // borderWidth: 2,
  },
  InputBox: {
    flex: 1,
    // borderWidth: 2,
  },
});

export default ConfigScreen;
