import React from 'react';
import { Platform } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import PropTypes from 'prop-types';
import uuid from 'react-native-uuid';
import { checkAndroidPermissions, OT } from './OT';
import OTPublisherViewNative from './OTPublisherViewNativeComponent';
import { addEventListener, isConnected } from './helpers/OTSessionHelper';

export default class OTPublisherView extends React.Component {
  eventHandlers = {};

  constructor(props) {
    super(props);
    this.eventHandlers = props.eventHandlers;
    this.initComponent(props.eventHandlers);
    this.state = {
      publisherId: uuid.v4(),
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
    if (Platform.OS === 'android') {
      // const publisherProperties = sanitizeProperties(this.props.properties);
      const publisherProperties = {
        audioTrack: true,
        videoTrack: true,
        videoSource: 'camera',
      };
      const { audioTrack, videoTrack, videoSource } = publisherProperties;
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

  render() {
    const { style, sessionId, publishAudio, publishVideo } = this.props;
    return (
      <OTPublisherViewNative
        sessionId={sessionId}
        publisherId={this.state.publisherId}
        publishAudio={publishAudio}
        publishVideo={publishVideo}
        onError={(event) => {
          this.eventHandlers.error &&
            this.eventHandlers.error(event.nativeEvent);
        }}
        onStreamCreated={(event) => {
          this.eventHandlers.streamCreated &&
            this.eventHandlers.streamCreated(event.nativeEvent);
        }}
        style={style}
      />
    );
  }
}

OTPublisherView.propTypes = {
  sessionId: PropTypes.string.isRequired,
  eventHandlers: PropTypes.object,
  properties: PropTypes.object,
  style: ViewPropTypes.style,
};

OTPublisherView.defaultProps = {
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
