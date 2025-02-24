import React from 'react';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import PropTypes from 'prop-types';
import uuid from 'react-native-uuid';
import { OT } from './OT';
import OTPublisherViewNative from './OTPublisherViewNativeComponent';

export default class OTPublisherView extends React.Component {
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
  };

  render() {
    const { style, sessionId, streamId, publishAudio, publishVideo } =
      this.props;
    return (
      <OTPublisherViewNative
        sessionId={sessionId}
        publishAudio={publishAudio}
        publishVideo={publishVideo}
        onError={(event) => {
          this.eventHandlers.error && this.eventHandlers.error(event.nativeEvent);
        }}
        onStreamCreated={(event) => {
          this.eventHandlers.streamCreated && this.eventHandlers.streamCreated(event.nativeEvent);
        }}
        style={style}
      />
    );
  }
}

OTPublisherView.propTypes = {
  sessionId: PropTypes.string.isRequired,
  eventHandlers: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  publishAudio: PropTypes.bool,
  publishVideo: PropTypes.bool,
  style: ViewPropTypes.style,
};

OTPublisherView.defaultProps = {
  eventHandlers: {},
  publishAudio: true,
  publishVideo: true,
  style: {
    flex: 1,
  },
};
