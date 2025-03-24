import React from 'react';
import { Platform } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import PropTypes from 'prop-types';
import uuid from 'react-native-uuid';
import { checkAndroidPermissions, OT } from './OT';
import OTPublisherViewNative from './OTPublisherViewNativeComponent';
import {
  addEventListener,
  dispatchEvent,
  isConnected,
} from './helpers/OTSessionHelper';
import { sanitizeProperties } from './helpers/OTPublisherHelper';
import OTContext from './contexts/OTContext';

export default class OTPublisher extends React.Component {
  eventHandlers = {};
  publisherProperties = {};

  constructor(props) {
    super(props);
    this.eventHandlers = props.eventHandlers;
    this.initComponent(props.eventHandlers);
    this.state = {
      publisherId: uuid.v4(),
      publishVideo: props.properties.publishVideo,
    };
  }

  onSessionConnected = () => {
    OT.publish(this.state.publisherId);
  };

  initComponent = () => {
    addEventListener('sessionConnected', this.onSessionConnected);
    this.eventHandlers.streamCreated = this.props.eventHandlers?.streamCreated;
    this.eventHandlers.streamDestroyed =
      this.props.eventHandlers?.streamDestroyed;
    this.eventHandlers.error = this.props.eventHandlers?.error;
    this.eventHandlers.audioLevel = this.props.eventHandlers?.audioLevel;
    this.eventHandlers.audioNetworkStats =
      this.props.eventHandlers?.audioNetworkStats;
    this.eventHandlers.rtcStatsReport =
      this.props.eventHandlers?.rtcStatsReport;
    this.eventHandlers.videoDisabled = this.props.eventHandlers?.videoDisabled;
    this.eventHandlers.videoDisableWarning =
      this.props.eventHandlers?.videoDisableWarning;
    this.eventHandlers.videoDisableWarningLifted =
      this.props.eventHandlers?.videoDisableWarningLifted;
    this.eventHandlers.videoEnabled = this.props.eventHandlers?.videoEnabled;
    this.eventHandlers.videoNetworkStats =
      this.props.eventHandlers?.videoNetworkStats;
    this.publisherProperties = sanitizeProperties(this.props.properties);

    if (Platform.OS === 'android') {
      const { audioTrack, videoTrack, videoSource } = this.publisherProperties;
      const isScreenSharing = videoSource === 'screen';
      checkAndroidPermissions(audioTrack, videoTrack, isScreenSharing)
        .then(() => {
          if (isConnected()) {
            setTimeout(() => OT.publish(this.state.publisherId), 10);
          }
        })
        .catch((error) => {
          // this.otrnEventHandler(error);
        });
    } else {
      if (isConnected) {
        OT.publish(this.state.publisherId);
      }
    }
  };

  getRtcStatsReport() {
    //NOSONAR - this method is exposed externally
    OT.getPublisherRtcStatsReport();
  }

  dispatchLocalEvent(type, event) {
    if (this.props.eventHandlers && this.props.eventHandlers[type]) {
      this.props.eventHandlers[type](event.nativeEvent);
    }
  }

  render() {
    return (
      <OTPublisherViewNative
        sessionId={this.context.sessionId}
        publisherId={this.state.publisherId}
        onError={(event) => {
          this.dispatchLocalEvent('error', event);
        }}
        onStreamCreated={(event) => {
          dispatchEvent('publisherStreamCreated', event.nativeEvent);
          this.dispatchLocalEvent('streamCreated', event);
        }}
        onStreamDestroyed={(event) => {
          this.dispatchLocalEvent('streamDestroyed', event);
        }}
        onAudioLevel={(event) => {
          this.dispatchLocalEvent('audioLevel', event);
        }}
        onAudioNetworkStats={(event) => {
          this.dispatchLocalEvent('audioNetworkStats', event);
        }}
        onRtcStatsReport={(event) => {
          this.dispatchLocalEvent('rtcStatsReport', event);
        }}
        onVideoDisabled={(event) => {
          this.dispatchLocalEvent('videoDisabled', event);
        }}
        onVideoDisableWarning={(event) => {
          this.dispatchLocalEvent('videoDisableWarning', event);
        }}
        onVideoDisableWarningLifted={(event) => {
          this.dispatchLocalEvent('videoDisableWarningLifted', event);
        }}
        onVideoEnabled={(event) => {
          this.dispatchLocalEvent('videoEnabled', event);
        }}
        onVideoNetworkStats={(event) => {
          this.dispatchLocalEvent('videoNetworkStats', event);
        }}
        style={this.props.style}
        {...this.props.properties}
      />
    );
  }
}

OTPublisher.propTypes = {
  eventHandlers: PropTypes.object,
  properties: PropTypes.object,
  style: ViewPropTypes.style,
};

OTPublisher.defaultProps = {
  eventHandlers: {},
  properties: {
    publishAudio: true,
    publishVideo: true,
    audioBitrate: 40000,
    audioFallback: {
      publisher: false,
      subscriber: true,
    },
    audioTrack: true,
    cameraPosition: 'front',
    enableDtx: false,
    frameRate: 30,
    name: '',
    publishCaptions: false,
    scalableScreenshare: false,
    resolution: 'MEDIUM',
    videoTrack: true,
    videoSource: 'camera',
    videoContentHint: '',
  },
  style: {
    flex: 1,
  },
};

OTPublisher.contextType = OTContext;
