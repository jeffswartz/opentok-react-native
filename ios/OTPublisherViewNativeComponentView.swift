import Foundation
import OpenTok

@objc public class OTPublisherViewNativeImpl: NSObject {
    private var publisher: OTPublisher?
    @objc public let view: UIView
    fileprivate weak var componentView: OTPublisherViewNativeComponentView?
    fileprivate var publisherDelegateHandler: PublisherDelegateHandler?
    
    @objc public init(view: UIView) {
        self.view = view
        if let cv = view as? OTPublisherViewNativeComponentView {
            self.componentView = cv
        }
        super.init()
    }
    
    @objc public func setSessionId(_ sessionId: String) {
        guard let session = OTRN.sharedState.sessions[sessionId] else {
            componentView?.handleError(["code": "OTPublisher Error", "message": "Session not found"])
            return
        }
        
        // Clean up existing publisher if needed
        cleanupPublisher()
        
        // Setup will happen when publisherId is set
    }
    
    @objc public func setPublisherId(_ publisherId: String) {
        guard let session = OTRN.sharedState.sessions[publisherId] else { return }
        
        do {
            publisherDelegateHandler = PublisherDelegateHandler(impl: self)
            publisher = OTPublisher(delegate: publisherDelegateHandler)
            try session.publish(publisher!)
            
            if let pubView = publisher?.view {
                pubView.frame = view.bounds
                view.addSubview(pubView)
            }
            
            OTRN.sharedState.publishers[publisherId] = publisher
            
        } catch {
            componentView?.handleError(["code": "OTPublisher Error", "message": error.localizedDescription])
        }
    }
    
    @objc public func setPublishAudio(_ publishAudio: Bool) {
        publisher?.publishAudio = publishAudio
    }
    
    @objc public func setPublishVideo(_ publishVideo: Bool) {
        publisher?.publishVideo = publishVideo
    }
    
    private func cleanupPublisher() {
        if let pub = publisher {
            pub.view?.removeFromSuperview()
            pub.delegate = nil
            publisherDelegateHandler = nil
            publisher = nil
        }
    }
}

private class PublisherDelegateHandler: NSObject, OTPublisherDelegate {
    weak var impl: OTPublisherViewNativeImpl?
    
    init(impl: OTPublisherViewNativeImpl) {
        self.impl = impl
        super.init()
    }
    
    public func publisher(_ publisher: OTPublisherKit, streamCreated stream: OTStream) {
        impl?.componentView?.handleStreamCreated(["streamId": stream.streamId])
    }
    
    public func publisher(_ publisher: OTPublisherKit, didFailWithError error: OTError) {
        impl?.componentView?.handleError([
            "code": String(error.code),
            "message": error.localizedDescription
        ])
    }
    
    public func publisher(_ publisher: OTPublisherKit, streamDestroyed stream: OTStream) {
        impl?.componentView?.handleStreamDestroyed(["streamId": stream.streamId])
    }
}

