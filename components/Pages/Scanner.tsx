import React, { useEffect } from 'react';
import { StyleSheet, Text, ToastAndroid, View } from 'react-native';

import {
  Camera,
  Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner
} from 'react-native-vision-camera';

const Scanner = () => {
    const device = useCameraDevice('back');
    const {hasPermission, requestPermission} = useCameraPermission();
  // const {hasPermission, requestPermission} = useMicrophonePermission();
const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'ean-8', 'upc-e', 'upc-e', 'code-39','code-93', 'code-128', 'itf', 'codabar','upc-e','pdf-417'],
    onCodeScanned: (codes:Code[]) => {
        if(codes.length > 0){
          const value = JSON.stringify(codes[0])
          const pasrsedData = JSON.parse(value)
            console.log(`Scanned code: ${pasrsedData.value}`);
            ToastAndroid.show(`${pasrsedData.value}`, ToastAndroid.SHORT);
            // ToastAndroid.show(`Scanned ${codes} codes!`, ToastAndroid.SHORT);
        }
        // console.log(`Scanned ${codes} codes!`);
        // ToastAndroid.show(`Scanned ${codes} codes!`, ToastAndroid.SHORT);
    },
});
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
      ToastAndroid.show('Camera permission is required', ToastAndroid.SHORT);
    }

  }, []);

  if (device == null)
    return (
      <View>
        <Text>No camera available</Text>
      </View>
    );

  return (
    <View style={{flex: 1}}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
    </View>
  );
};

export default Scanner;
