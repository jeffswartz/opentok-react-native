import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

import { OTSessionManager } from '../../src';

function App(): React.JSX.Element {
  const apiKey = '472032';
  const sessionId =
    '1_MX40NzIwMzJ-fjE3MzM0NTAzOTcyNjh-L0FQMkR0K2tVc214ajJOVzZiYWtYclg1fn5-';
  const token =
    'T1==cGFydG5lcl9pZD00NzIwMzImc2lnPWM2MjU2ZTFlYmQ5OWYyMjcxZDAyMDBlMjVlZDI0MTBiNzIzOWQ3OTg6c2Vzc2lvbl9pZD0xX01YNDBOekl3TXpKLWZqRTNNek0wTlRBek9UY3lOamgtTDBGUU1rUjBLMnRWYzIxNGFqSk9WelppWVd0WWNsZzFmbjUtJmNyZWF0ZV90aW1lPTE3MzcxNDQ2NzEmbm9uY2U9MC4wMTgxNjYxMzQxNjM1NDI2MjQmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTczOTczNjY3MDc5OSZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==';
  
  React.useEffect(() => {
    OTSessionManager.initSession(apiKey, sessionId, {});
    OTSessionManager.connect(sessionId, token);
    OTSessionManager.onSessionConnected((event) =>
      console.log('sessionConnected', event)
    );
    OTSessionManager.onStreamCreated((event) =>
      console.log('onStreamCreated', event)
    );
    setTimeout(() => {
      OTSessionManager.sendSignal(
        sessionId,
        'test-type',
        'Hello from React Native.'
      );
    }, 12000);
  }, []);

  return (
    <SafeAreaView style={styles.flex1}>
      <Text style={styles.text}>sessionId: {sessionId}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  text: {
    margin: 10,
    fontSize: 20,
  },
  webview: {
    width: '50%',
    height: '50%',
  },
  session: {
    display: 'flex',
  },
});

export default App;
