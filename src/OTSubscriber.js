import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { isNull, isUndefined, each, isEqual, isEmpty } from 'underscore';
import { OT } from './OT';
import { addEventListener } from './helpers/OTSessionHelper';
import OTSubscriberView from './OTSubscriberView';
import {
  // sanitizeSubscriberEvents,
  sanitizeProperties,
  sanitizeFrameRate,
  sanitizeResolution,
  sanitizeAudioVolume,
} from './helpers/OTSubscriberHelper';
import {
  getOtrnErrorEventHandler,
  sanitizeBooleanProperty,
} from './helpers/OTHelper';
// import OTContext from './contexts/OTContext';

export default class OTSubscriber extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      streams: [],
      subscribeToSelf: props.subscribeToSelf || false,
    };
    /*
    this.componentEvents = {
      streamDestroyed:
        Platform.OS === 'android'
          ? 'session:onStreamDropped'
          : 'session:streamDestroyed',
      streamCreated:
        Platform.OS === 'android'
          ? 'session:onStreamReceived'
          : 'session:streamCreated',
      captionReceived:
        Platform.OS === 'android'
          ? 'session:onCaptionText'
          : 'subscriber:subscriberCaptionReceived:',
      publisherStreamCreated: 'publisherStreamCreated',
      publisherStreamDestroyed: 'publisherStreamDestroyed',
    };
    this.componentEventsArray = Object.values(this.componentEvents);
    */
    this.otrnEventHandler = getOtrnErrorEventHandler(this.props.eventHandlers);
    this.initComponent();
  }

  dispatchLocalEvent(type, event) {
    if (this.props.eventHandlers && this.props.eventHandlers[type]) {
      this.props.eventHandlers[type](event);
    }
  }

  initComponent = () => {
    const { eventHandlers } = this.props;
    const { sessionId } = this.props;
    // const { sessionId } = this.context;
    addEventListener('streamCreated', this.streamCreatedHandler);
    addEventListener('streamDestroyed', this.streamDestroyedHandler);
    addEventListener('subscriberConnected', this.subscriberConnectedHandler);
    /*
    if (sessionId) {
      this.streamCreated = nativeEvents.addListener(
        `${sessionId}:${this.componentEvents.streamCreated}`,
        (stream) => this.streamCreatedHandler(stream)
      );
      this.streamDestroyed = nativeEvents.addListener(
        `${sessionId}:${this.componentEvents.streamDestroyed}`,
        (stream) => this.streamDestroyedHandler(stream)
      );
      const subscriberEvents = sanitizeSubscriberEvents(eventHandlers);
      OT.setJSComponentEvents(this.componentEventsArray);
      setNativeEvents(subscriberEvents);
    }
    this.publisherStreamCreated = addEventListener(
      'publisherStreamCreated',
      (stream) => this.publisherStreamCreatedHandler(stream)
    );
    this.publisherStreamDestroyed = addEventListener(
      'publisherStreamDestroyed',
      (stream) => this.publisherStreamDestroyedHandler(stream)
    );
    */
  };
  componentDidUpdate() {
    const { streamProperties } = this.props;
    if (!isEqual(this.state.streamProperties, streamProperties)) {
      each(streamProperties, (individualStreamProperties, streamId) => {
        const {
          subscribeToAudio,
          subscribeToVideo,
          subscribeToCaptions,
          preferredResolution,
          preferredFrameRate,
          audioVolume,
        } = individualStreamProperties;
        if (subscribeToAudio !== undefined) {
          OT.subscribeToAudio(
            streamId,
            sanitizeBooleanProperty(subscribeToAudio)
          );
        }
        if (subscribeToVideo !== undefined) {
          OT.subscribeToVideo(
            streamId,
            sanitizeBooleanProperty(subscribeToVideo)
          );
        }
        if (subscribeToCaptions !== undefined) {
          OT.subscribeToCaptions(
            streamId,
            sanitizeBooleanProperty(subscribeToCaptions)
          );
        }
        if (preferredResolution !== undefined) {
          OT.setPreferredResolution(
            streamId,
            sanitizeResolution(preferredResolution)
          );
        }
        if (preferredFrameRate !== undefined) {
          OT.setPreferredFrameRate(
            streamId,
            sanitizeFrameRate(preferredFrameRate)
          );
        }
        if (audioVolume !== undefined) {
          OT.setAudioVolume(streamId, sanitizeAudioVolume(audioVolume));
        }
      });
      this.setState({ streamProperties });
    }
  }
  componentWillUnmount() {
    /*
    this.streamCreated.remove();
    this.streamDestroyed.remove();
    this.publisherStreamCreated.remove();
    this.publisherStreamDestroyed.remove();
    OT.removeJSComponentEvents(this.componentEventsArray);
    const events = sanitizeSubscriberEvents(this.props.eventHandlers);
    removeNativeEvents(events);
    */
  }
  streamCreatedHandler = (stream) => {
    console.log(234234234);
    const { subscribeToSelf } = this.state;
    const { streamProperties, properties } = this.props;
    const { sessionId, sessionInfo } = this.context;
    const subscriberProperties = streamProperties[stream.streamId]
      ? sanitizeProperties(streamProperties[stream.streamId])
      : sanitizeProperties(properties);
    // Subscribe to streams. If subscribeToSelf is true, subscribe also to his own stream
    const sessionInfoConnectionId =
      sessionInfo && sessionInfo.connection
        ? sessionInfo.connection.connectionId
        : null;
    if (subscribeToSelf || sessionInfoConnectionId !== stream.connectionId) {
      this.setState({
        streams: [...this.state.streams, stream.streamId],
      });
      /*
      OT.subscribeToStream(stream.streamId, sessionId, subscriberProperties)
        .catch((error) => {
          // todo
          //this.otrnEventHandler(error);
        })
        .then(() => {
          this.setState({
            streams: [...this.state.streams, stream.streamId],
          });
        });
        */
    }
  };
  streamDestroyedHandler = (stream) => {
    /*
    OT.removeSubscriber(stream.streamId, (error) => {
      if (error) {
        this.otrnEventHandler(error);
      } else {
        const indexOfStream = this.state.streams.indexOf(stream.streamId);
        const newState = this.state.streams.slice();
        newState.splice(indexOfStream, 1);
        this.setState({
          streams: newState,
        });
      }
    });
    */
  };

  subscriberConnectedHandler = (event) => {
    this.dispatchLocalEvent('subscriberConnected', event);
  };

  /**
  publisherStreamCreatedHandler = (stream) => {
    if (this.state.subscribeToSelf) {
      this.streamCreatedHandler(stream);
    }
  };
  publisherStreamDestroyedHandler = (stream) => {
    if (this.state.subscribeToSelf) {
      this.streamDestroyedHandler(stream);
    }
  };
  */
  getRtcStatsReport() {
    OT.getSubscriberRtcStatsReport();
  }
  render() {
    if (!this.props.children) {
      const containerStyle = this.props.containerStyle;
      const childrenWithStreams = this.state.streams.map((streamId) => {
        /*
        const streamProperties = this.props.streamProperties[streamId];
        const style = isEmpty(streamProperties)
          ? this.props.style
          : isUndefined(streamProperties.style) ||
              isNull(streamProperties.style)
            ? this.props.style
            : streamProperties.style;
        */
        const style = styles.videoview;
        console.log(2342333334234, this.props.sessionId, streamId);
        return (
          <OTSubscriberView
            key={streamId}
            streamId={streamId}
            sessionId={this.props.sessionId}
            style={style}
          />
        );
      });
      return <View style={containerStyle}>{childrenWithStreams}</View>;
    }
    console.log(444, this.props.sessionId, this.props.children);
    return this.props.children(this.state.streams) || null;
  }
}

const styles = StyleSheet.create({
  videoview: {
    width: '50%',
    height: '50%',
  },
});

const viewPropTypes = View.propTypes;
OTSubscriber.propTypes = {
  ...viewPropTypes,
  children: PropTypes.func,
  properties: PropTypes.object,
  eventHandlers: PropTypes.object,
  streamProperties: PropTypes.object,
  containerStyle: PropTypes.object,
  // getRtcStatsReport: PropTypes.object,
  subscribeToSelf: PropTypes.bool,
  sessionId: PropTypes.string, // TODO: use context
};

OTSubscriber.defaultProps = {
  properties: {},
  eventHandlers: {},
  streamProperties: {},
  containerStyle: {},
  subscribeToSelf: false,
  // getRtcStatsReport: {},
  // subscribeToCaptions: false,
};

// OTSubscriber.contextType = OTContext;
