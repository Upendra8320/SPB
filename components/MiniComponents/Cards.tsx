import React from 'react';
import {Text, View} from 'react-native';
import {Styles} from '../../Styles/Styles';

// Define the type for a single step if you have additional properties for steps
interface Step {
  id: number;
  step_name: string; 
  step_command: string; 
}

interface Props {
  test_name: string;
  steps: Step[];
}

const Cards: React.FC<Props> = ({test_name, steps}) => {
  return (
    <>
      {steps.map((step, index) => (
        <View key={index}>
          <View style={Styles.header}>
            <View>
              <Text style={Styles.headerText}>{test_name}</Text>
            </View>
            <View>
              <Text>
                {/* Conditional rendering logic */}
                waiting
              </Text>
            </View>
          </View>
          <View style={Styles.subSection}>
            <View style={Styles.subSectionContainer}>
              <View>
                <Text style={Styles.subSectionText}>{step.step_name}</Text>
              </View>
              <View>
                <Text style={{color: '#a3a3a3'}}>
                  {/* Conditional rendering logic */}
                  waiting
                </Text>
              </View>
            </View>
            {/* Additional content if needed */}
          </View>
        </View>
      ))}
    </>
  );
};

export default Cards;
