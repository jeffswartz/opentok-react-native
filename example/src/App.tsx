import React, {useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';

import OTSession from 'opentok-react-native';

function App(): React.JSX.Element {
  const apiKey = '472032';
  const sessionId =
    '1_MX40NzIwMzJ-fjE3MzM0NTAzOTcyNjh-L0FQMkR0K2tVc214ajJOVzZiYWtYclg1fn5-';
  const token =
    'T1==cGFydG5lcl9pZD00NzIwMzImc2lnPTNhOTg4ZDJmYWRlYTcyZjQ4MWFhOTg0Yjk3NjRjM2RhYjIwNGIzOGM6c2Vzc2lvbl9pZD0xX01YNDBOekl3TXpKLWZqRTNNek0wTlRBek9UY3lOamgtTDBGUU1rUjBLMnRWYzIxNGFqSk9WelppWVd0WWNsZzFmbjUtJmNyZWF0ZV90aW1lPTE3MzgyNzkyNjEmbm9uY2U9MC43MTE4NTA0MTk1MzI5MDM2JnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE3NDA4NzEyNjA3NTAmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=';

  const [streamIds, setStreamIds] = React.useState<string[]>([]);
  const [subscribeToVideo, setSubscribeToVideo] = React.useState<boolean>(true);

  const sessionRef = useRef<OTSession>(null);
  const toggleVideo = () => {
    setSubscribeToVideo(val => !val);
  };

  React.useEffect(() => {
    setInterval(() => {
      toggleVideo();
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={styles.text}>
        SubscribeToVideo: {subscribeToVideo.toString()}
      </Text>
      <OTSession
        apiKey={apiKey}
        token={token}
        sessionId={sessionId}
        ref={sessionRef}
        eventHandlers={{
          sessionConnected: (event:any) => {
            console.log('sessionConnected', event);
            sessionRef.current?.signal({
              type: 'greeting2',
              data: 'hello again from React Native'
            });
        },
          streamCreated: (event:any) => {
            console.log('streamCreated', event);
            setStreamIds(prevIds => [...prevIds, event.streamId]);
          },
          streamDestroyed: (event:any) => console.log('streamDestroyed', event),
          signal: (event:any) => console.log('signal event', event),
          error: (event:any) => console.log('error event', event),
        }}
        signal={{
          type: 'greeting2',
          data: 'initial signal from React Native'
        }}
        style={styles.session}
      >
        {streamIds?.map((streamId) => <Text
          style={styles.text}
          key={streamId}>
          Stream: {streamId}
        </Text>)}
        </OTSession>
      <Text style={styles.text}>
        Stream count: {streamIds.length.toString()}
      </Text>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    margin: 10,
    fontSize: 20,
  },
  webview: {
    width: '50%',
    height: '50%',
  },
  session: {
    display: "flex"
  }
});

export default App;
