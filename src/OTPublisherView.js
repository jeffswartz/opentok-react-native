import React from 'react';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import PropTypes from 'prop-types';
import uuid from 'react-native-uuid';
import { OT } from './OT';
import OTPublisherNative from './OTPublisherNativeComponent';

export default class OTPublisher extends React.Component {
  static defaultProps = {
    publishVideo: true,
    publishAudio: true,
    style: {
      flex: 1,
    },
  };

  eventHandlers = {};

  constructor(props) {
    super(props);
    this.eventHandlers = props.eventHandlers;
    this.initComponent(props.eventHandlers);
    this.state = {
      publisherId: uuid.v4(),
    };
  }

  initComponent = () => {
    this.eventHandlers.streamCreated =
      this.props.eventHandlers?.streamCreated;
    this.eventHandlers.streamDestroyed =
      this.props.eventHandlers?.streamDestroyed;
    this.eventHandlers.error =
      this.props.eventHandlers?.error;
    this.eventHandlers.rtcStatsReport =
      this.props.eventHandlers?.rtcStatsReport;
  };

  getRtcStatsReport() {
    //NOSONAR - this method is exposed externally
    OT.getPublisherRtcStatsReport(this.state.publisherId);
  }

  render() {
    const { style, sessionId, streamId, subscribeToAudio, subscribeToVideo } =
      this.props;
    return (
      <OTPublisherNative
        sessionId={sessionId}
        streamId={streamId}
        publishAudio={publishAudio}
        publishVideo={publishVideo}
        onStreamCreated={(event) => {
          this.eventHandlers.streamCreated(event.nativeEvent);
        }}
        onStreamDestroyed={(event) => {
          this.eventHandlers.streamDestroyed(event.nativeEvent);
        }}
        onError={(event) => {
          this.eventHandlers.error(event.nativeEvent);
        }}
        onRtcStatsReport={(event) => {
          this.eventHandlers.rtcStatsReport(event.nativeEvent);
        }}
        style={style}
      />
    );
  }
}

OTPublisher.propTypes = {
  sessionId: PropTypes.string.isRequired,
  streamId: PropTypes.string.isRequired,
  eventHandlers: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  publishAudio: PropTypes.bool,
  publishVideo: PropTypes.bool,
  style: ViewPropTypes.style,
};

OTPublisher.defaultProps = {
  eventHandlers: {},
  publishAudio: true,
  publishVideo: true,
  style: {
    flex: 1,
  },
};
