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
    @objc public init(view: OTPublisherViewNativeComponentView) {
        self.strictUIViewContainer = view
        super.init()
        
        // Initialize publisher right away
        publisherDelegateHandler = PublisherDelegateHandler(impl: self)
        publisher = OTPublisher(delegate: publisherDelegateHandler)

        // Set publisher view as content view
        if let pubView = publisher?.view {
            pubView.frame = view.bounds
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

