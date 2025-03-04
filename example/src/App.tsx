import React, { useRef } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

import {
  OTSession,
  OTSubscriberView,
  OTPublisherView,
} from 'opentok-react-native';

function App(): React.JSX.Element {
  const apiKey = '472032';
  const sessionId =
    '1_MX40NzIwMzJ-fjE3MzM0NTAzOTcyNjh-L0FQMkR0K2tVc214ajJOVzZiYWtYclg1fn5-';
  const token =
    'T1==cGFydG5lcl9pZD00NzIwMzImc2lnPTgxMGU1ODU1YjdkZTY2MTdmNzBhOWFjMTIxY2JlNmJlYTE3ZjQwOTc6c2Vzc2lvbl9pZD0xX01YNDBOekl3TXpKLWZqRTNNek0wTlRBek9UY3lOamgtTDBGUU1rUjBLMnRWYzIxNGFqSk9WelppWVd0WWNsZzFmbjUtJmNyZWF0ZV90aW1lPTE3NDEwNTM5ODEmbm9uY2U9MC45ODU3OTExMzY3NDE2MDE1JnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE3NDM2NDU5ODAwOTEmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=';

  const [streamIds, setStreamIds] = React.useState<string[]>([]);
  const [subscribeToVideo, setSubscribeToVideo] = React.useState<boolean>(true);
  const [connected, setConnected] = React.useState<boolean>(false);

  const sessionRef = useRef<OTSession>(null);
  const subscriberRef = useRef<OTSubscriberViewNative>(null);
  const toggleVideo = () => {
    setSubscribeToVideo((val) => !val);
  };

  React.useEffect(() => {
    setInterval(() => {
      toggleVideo();
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.text}>
        SubscribeToVideo: {subscribeToVideo.toString()}
      </Text>
      <OTSession
        apiKey={apiKey}
        token={token}
        sessionId={sessionId}
        ref={sessionRef}
        eventHandlers={{
          sessionConnected: (event: any) => {
            console.log('sessionConnected', event);
            setConnected(true);
            sessionRef.current?.signal({
              type: 'greeting2',
              data: 'hello again from React Native',
            });
          },
          streamCreated: (event: any) => {
            console.log('streamCreated', event);
            setStreamIds((prevIds) => [...prevIds, event.streamId]);
          },
          streamDestroyed: (event: any) =>
            console.log('streamDestroyed', event),
          signal: (event: any) => console.log('signal event', event),
          error: (event: any) => console.log('error event', event),
        }}
        signal={{
          type: 'greeting2',
          data: 'initial signal from React Native',
        }}
        style={styles.session}
      >
        {connected && (
          <OTPublisherView
            sessionId={sessionId}
            eventHandlers={{
              error: (event) => console.log('pub error', event),
              streamCreated: (event) => console.log('pub streamCreated', event),
            }}
          />
        )}

        {streamIds?.map((streamId) => (
          <OTSubscriberView
            streamId={streamId}
            sessionId={sessionId}
            key={streamId}
            ref={subscriberRef}
            subscribeToVideo={subscribeToVideo}
            subscribeToAudio={!subscribeToVideo}
            style={styles.webview}
            eventHandlers={{
              subscriberConnected: (event: any) => {
                console.log('subscriberConnected', event);
                setTimeout(() => {
                  subscriberRef.current?.getRtcStatsReport();
                }, 4000);
              },
              onRtcStatsReport: (event: any) => {
                console.log('onRtcStatsReport', event);
              },
            }}
          />
        ))}
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
    display: 'flex',
  },
});

export default App;
