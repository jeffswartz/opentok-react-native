const eventHandlers = {};

let connected = false;

const setIsConnected = (value) => {
  connected = value
};

const isConnected = () => connected;

const dispatchEvent = (event) => {
  const listeners = eventHandlers[event.type]
  if (listeners) {
    listeners.forEach(listener => {
      listener(event);
    });
  }
}

const addEventListener = (type, listener) => {
  if (!eventHandlers[type]) {
    eventHandlers[type] = [ listener ];
  } else {
    eventHandlers[type].push(listener);
  }
}

export {
  isConnected,
  setIsConnected,
  dispatchEvent,
  addEventListener,
};
