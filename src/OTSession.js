import React, { Component, useMemo } from 'react';
import { View } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import PropTypes from 'prop-types';
import { OT } from './OT';
import { dispatchEvent, setIsConnected } from './helpers/OTSessionHelper';
import OTContext from './contexts/OTContext';

export default class OTSession extends Component {
  eventHandlers = {};

  dispatchLocalEvent(type, event) {
    if (this.props.eventHandlers && this.props.eventHandlers[type]) {
      this.props.eventHandlers[type](event);
    }
  }

  async initSession(apiKey, sessionId, token) {
    OT.onSessionConnected((event) => {
      this.connectionId = event.connectionId;
      this.eventHandlers.sessionConnected(event);
      setIsConnected(true);
      this.dispatchLocalEvent('sessionConnected', event);
      if (Object.keys(this.props.signal).length > 0) {
        this.signal(this.props.signal);
      }
    });
    OT.initSession(apiKey, sessionId, {});
    OT.onStreamCreated((event) => {
      this.dispatchLocalEvent('streamCreated', event);
      dispatchEvent('streamCreated', event);
    });

    OT.onStreamDestroyed((event) => {
      this.dispatchLocalEvent('streamDestroyed', event);
      dispatchEvent('streamDestroyed', event);
    });

    OT.onSignalReceived((event) => {
      this.dispatchLocalEvent('signal', event);
    });

    OT.onSessionError((event) => {
      this.dispatchLocalEvent('error', event);
    });
    OT.connect(sessionId, token);
  }

  constructor(props) {
    super(props);
    this.eventHandlers = props.eventHandlers;
    this.initComponent(props.eventHandlers);
  }

  initComponent = () => {
    this.initSession(this.props.apiKey, this.props.sessionId, this.props.token);
    this.eventHandlers.sessionConnected =
      this.props.eventHandlers?.sessionConnected;
  };

  signal(signalObj) {
    OT.sendSignal(this.props.sessionId, signalObj.type, signalObj.data);
  }

  render() {
    const { style, children, sessionId, apiKey, token } = this.props;

    if (children && sessionId && apiKey && token) {
      return (
        <OTContext.Provider
          value={{ sessionId, connectionId: this.connectionId }}
        >
          <View style={style}>{children}</View>
        </OTContext.Provider>
      );
    }
    return <View />;
  }
}

OTSession.propTypes = {
  apiKey: PropTypes.string.isRequired,
  sessionId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  style: ViewPropTypes.style,
  eventHandlers: PropTypes.object,
  options: PropTypes.object,
  signal: PropTypes.object,
  encryptionSecret: PropTypes.string,
};

OTSession.defaultProps = {
  eventHandlers: {},
  options: {},
  signal: {},
  style: {
    flex: 1,
  },
};
