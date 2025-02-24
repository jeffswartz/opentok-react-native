package com.opentokreactnative

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.OTPublisherViewNativeManagerInterface;
import com.facebook.react.viewmanagers.OTPublisherViewNativeManagerDelegate;

@ReactModule(name = OTPublisherViewNativeManager.REACT_CLASS)
class OTPublisherViewNativeManager(context: ReactApplicationContext) : SimpleViewManager<OTPublisherViewNative>(), OTPublisherViewNativeManagerInterface<OTPublisherViewNative> {
  private val delegate: OTPublisherViewNativeManagerDelegate<OTPublisherViewNative, OTPublisherViewNativeManager> =
    OTPublisherViewNativeManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<OTPublisherViewNative> = delegate

  override fun getName(): String = REACT_CLASS

  override fun createViewInstance(context: ThemedReactContext): OTPublisherViewNative = OTPublisherViewNative(context)

  @ReactProp(name = "streamId")
  override public fun setStreamId(view: OTPublisherViewNative, streamId: String?) {
    view.setStreamId(streamId)
  }

  @ReactProp(name = "sessionId")
  override public fun setSessionId(view: OTPublisherViewNative, sessionId: String?) {
    view.setSessionId(sessionId)
  }


  @ReactProp(name = "subscribeToAudio")
  override public fun setSubscribeToAudio(view: OTPublisherViewNative, value: Boolean) {
    view.setSubscribeToAudio(value)
  }

  @ReactProp(name = "subscribeToVideo")
  override public fun setSubscribeToVideo(view: OTPublisherViewNative, value: Boolean) {
    view.setSubscribeToVideo(value)
  }

  companion object {
    const val REACT_CLASS = "OTPublisherViewNative"
  }

  override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> =
      mapOf(
          "onSubscriberConnected" to
              mapOf(
                  "phasedRegistrationNames" to
                      mapOf(
                          "bubbled" to "onSubscriberConnected",
                          "captured" to "onSubscriberConnectedCapture"
                      )))
}