import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar, Button, List } from "react-native-paper";

const LogScreen = () => {
  const [TestLogs, setTestLogs] = useState<any>();
  

  //get log
  const getTestLogs = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@test_logs");
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      
    }
  };

  // delete log
  const deleteLog = async (logId: any) => {
    try {
      const existingLogsJson = await AsyncStorage.getItem("@test_logs");
      let existingLogs =
        existingLogsJson != null ? JSON.parse(existingLogsJson) : [];
      const updatedLogs = existingLogs.filter((log: any) => log.id !== logId); // Remove the log with the given ID
      const jsonValue = JSON.stringify(updatedLogs);
      await AsyncStorage.setItem("@test_logs", jsonValue);
      setTestLogs(updatedLogs); // Update state to reflect the deletion
    } catch (e) {
      
    }
  };
  useEffect(() => {
    const loadLogs = async () => {
      const loadedLogs = await getTestLogs();
      

      setTestLogs(loadedLogs); // Assuming you have a state called testLogs
    };

    loadLogs();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        {TestLogs &&
          TestLogs.map((testLog: any, index: any) => (
            <List.AccordionGroup key={index}>
              <List.Accordion
                title=""
                id={String(index)}
                left={() => (
                  <View>
                    <Text style={styles.TestId}>
                      Test ID : {testLog.id}
                    </Text>
                    <Text style={{ color: "#515153", fontSize: 12 }}>
                      {testLog.timestamp}
                    </Text>
                  </View>
                )}
                right={() => (
                  <Text style={{ color: "#515153" }}>
                    {testLog.overAllResult ? (
                        <Avatar.Image
                          size={24}
                          source={require("../../assets/done.png")}
                        />
                        
                    ) : (
                        <Avatar.Image
                          size={24}
                          source={require("../../assets/failed.png")}
                        />
                       
                    )}
                  </Text>
                )}
                style={styles.accordion}
              >
                {Object.entries(testLog.Test).map(
                  ([testName, testResults], subIndex) => (
                    <TestDetails
                      key={subIndex}
                      testName={testName}
                      testResults={testResults}
                    />
                  )
                )}
                <Button
                  buttonColor="#C12D2D"
                  textColor="white"
                  style={styles.deleteButton}
                  onPress={() => deleteLog(testLog.id)}
                >
                  Delete Log
                </Button>
              </List.Accordion>
            </List.AccordionGroup>
          ))}
      </View>
    </ScrollView>
  );
};

const TestDetails = ({
  testName,
  testResults,
}: {
  testName: any;
  testResults: any;
}) => {
  const logsDescription: any = {
    B: "Turn on Switch",
    C: "Engine Value",
    D: "Final status",
    N: "Turn on Switch",
    O: "Engine Value",
    P: "Final status",
    T1: "Manual Test1",
    T2: "Manual Test2",
  };

  const TestName = () => {
    if (testName === "Test1") {
      return "Motor Test";
    } else if (testName === "Test2") {
      return "Engine Test";
    } else if (testName === "Test3") {
      return "Manual Test";
    }
  };

  
  return (
    <View>
      <Text style={styles.testName}>{TestName()}</Text>
      {Object.entries(testResults).map(([step, result]:any, index) => (
        <View key={index} style={styles.testResult}>
          <Text style={{ marginTop: 10 }}>{logsDescription[step]}:</Text>
          <Text style={{ marginTop: 10 }}>{result}</Text>
        </View>
      ))}
    </View>
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
  logEntry: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9", // You might want to change the background color
  },
  accordion: {
    backgroundColor: "#f1f1ff", // Color for the accordion header
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 10,
  },
  logHeader: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 10, // Padding for the header
  },
  testName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    padding: 5, // Padding for test names
    color: "#3F3F3F",
  },
  testResult: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    color: "#4F4F4F",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5, // Padding for test results
  },

  deleteButton: {
    padding: 2,
    margin: 10,
  },
  TestId:{
    color: "#515153", 
    fontWeight: "700"
  }
});

export default LogScreen;
