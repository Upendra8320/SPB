const STEP1 = 'Turn on the switch';
const STEP2 = 'Measured Current';
const STEP3 = 'Final Status';

export const testData = [
  {
    id: 1,
    test_name: 'Fireman Pump',
    test_command: 'A',
    threshold_command: 'E',
    steps: [
      {
        id: 1,
        step_name: STEP1,
        step_command: 'B',
      },
      {
        id: 2,
        step_name: STEP2,
        step_command: 'C',
      },
      {
        id: 3,
        step_name: STEP3,
        step_command: 'D',
      },
    ],
  },
  {
    id: 2,
    test_name: 'Navigation Light',
    test_command: 'M',
    threshold_command: 'Q',
    steps: [
      {
        id: 1,
        step_name: STEP1,
        step_command: 'N',
      },
      {
        id: 2,
        step_name: STEP2,
        step_command: 'O',
      },
      {
        id: 3,
        step_name: STEP3,
        step_command: 'P',
      },
    ],
  },
];
