import Foundation
import OpenTok


@objc public class OTPublisherViewNativeImpl: NSObject {
    private var publisher: OTPublisher?
    private var currentSession: OTSession?
    fileprivate weak var strictUIViewContainer: OTPublisherViewNativeComponentView?
    fileprivate var publisherDelegateHandler: PublisherDelegateHandler?
    fileprivate var publisherUIView: UIView?

   @objc public var publisherView: UIView {
       if let publisherUIView = publisherUIView {
           return publisherUIView
       }
        return UIView()
    }
@objc public init(view: OTPublisherViewNativeComponentView, properties: [String: Any]) {
        self.strictUIViewContainer = view
        super.init()
        initPublisher(withProperties: properties)
    }

    private func initPublisher(withProperties properties: [String: Any]){
let publisherProperties = OTPublisherSettings()
        publisherProperties.videoTrack = Utils.sanitizeBooleanProperty(properties["videoTrack"] as Any)
        publisherProperties.audioTrack = Utils.sanitizeBooleanProperty(properties["audioTrack"] as Any)
        if let audioBitrate = properties["audioBitrate"] as? Int32 {
            publisherProperties.audioBitrate = audioBitrate
        }
        publisherProperties.cameraFrameRate = Utils.sanitizeFrameRate(properties["frameRate"] as Any)
        publisherProperties.cameraResolution = Utils.sanitizeCameraResolution(properties["resolution"] as? String ?? "MEDIUM")
        publisherProperties.enableOpusDtx = Utils.sanitizeBooleanProperty(properties["enableDtx"] as Any)
        publisherProperties.name = properties["name"] as? String
        publisherProperties.publisherAudioFallbackEnabled = Utils.sanitizeBooleanProperty(properties["publisherAudioFallback"] as Any)
        publisherProperties.subscriberAudioFallbackEnabled = Utils.sanitizeBooleanProperty(properties["subscriberAudioFallback"] as Any)
        publisherProperties.videoCapture?.videoContentHint = .none 
        
        publisherDelegateHandler = PublisherDelegateHandler(impl: self) 
        
        guard let newPublisher = OTPublisher(delegate: publisherDelegateHandler, settings: publisherProperties) else {
            // TODO: Handle error
            return
        }
        
        publisher = newPublisher
        
        // Handle video source
        let videoSource = properties["videoSource"] as? String ?? "camera"
        if videoSource == "screen" {
            // TODO: Implement screen sharing logic
            publisher?.videoType = .screen
            // Need to handle screen capture view
        } else {
            let cameraPosition = properties["cameraPosition"] as? String ?? "front"
            publisher?.cameraPosition = cameraPosition == "front" ? .front : .back
        }
        
        publisher?.audioFallbackEnabled = Utils.sanitizeBooleanProperty(properties["audioFallbackEnabled"] as Any)
        publisher?.publishAudio = Utils.sanitizeBooleanProperty(properties["publishAudio"] as Any)
        publisher?.publishVideo = Utils.sanitizeBooleanProperty(properties["publishVideo"] as Any)
        publisher?.publishCaptions = Utils.sanitizeBooleanProperty(properties["publishCaptions"] as Any)
        
        // TODO: Set up delegates
        // publisher?.audioLevelDelegate = self
        // publisher?.networkStatsDelegate = self
        // publisher?.rtcStatsReportDelegate = self
        
        if let pubView = publisher?.view {
            pubView.frame = strictUIViewContainer?.bounds ?? .zero
            publisherUIView = pubView
        }
    }
    
    @objc public func setSessionId(_ sessionId: String) {
        // Get session from shared state
        if let session = OTRN.sharedState.sessions[sessionId] {
            currentSession = session
            // Publish to session if we have a publisher
            if let pub = publisher {
                do {
                    try session.publish(pub)
                } catch {
                    strictUIViewContainer?.handleError([
                        "code": "OTPublisherError",
                        "message": error.localizedDescription
                    ])
                }
            }
        }
    }
    
    @objc public func setPublisherId(_ publisherId: String) {
        // TODO : do we allow to unpublish or will this ever change
    }
    
    @objc public func setPublishAudio(_ publishAudio: Bool) {
        publisher?.publishAudio = publishAudio
    }
    
    @objc public func setPublishVideo(_ publishVideo: Bool) {
        publisher?.publishVideo = publishVideo
    }
    
    deinit {
        if let pub = publisher {
            currentSession?.unpublish(pub, error: nil)
            pub.delegate = nil
            publisherDelegateHandler = nil
            publisher = nil
        }
    }
}

private class PublisherDelegateHandler: NSObject, OTPublisherKitDelegate {
   
    
    weak var impl: OTPublisherViewNativeImpl?
    
    init(impl: OTPublisherViewNativeImpl) {
        self.impl = impl
        super.init()
    }
    

     func publisher(_ publisher: OTPublisherKit, streamCreated stream: OTStream) {
        impl?.strictUIViewContainer?.handleStreamCreated(["streamId": stream.streamId])
    }
    
     func publisher(_ publisher: OTPublisherKit, didFailWithError error: OTError) {
        impl?.strictUIViewContainer?.handleError([
            "code": String(error.code),
            "message": error.localizedDescription
        ])
    }
    
     func publisher(_ publisher: OTPublisherKit, streamDestroyed stream: OTStream) {
        impl?.strictUIViewContainer?.handleStreamDestroyed(["streamId": stream.streamId])
    }
}

