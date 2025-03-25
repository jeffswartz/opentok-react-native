import Foundation
import OpenTok
import React

@objc public class OTPublisherViewNativeImpl: NSObject {
    private var currentSession: OTSession?
    private var sessionId: String?
    fileprivate var publisherId: String?
    fileprivate weak var strictUIViewContainer:
        OTPublisherViewNativeComponentView?
    fileprivate var publisherDelegateHandler: PublisherDelegateHandler?
    fileprivate var publisherAudioLevelDelegateHandler: PublisherAudioLevelDelegateHandler?
    fileprivate var publisherNetworkStatsDelegateHandler: PublisherNetworkStatsDelegateHandler?
    fileprivate var publisherUIView: UIView?

    @objc public var publisherView: UIView {
        if let publisherUIView = publisherUIView {
            return publisherUIView
        }
        return UIView()
    }

    @objc public init(
        view: OTPublisherViewNativeComponentView
    ) {
        self.strictUIViewContainer = view
        super.init()
    }

    @objc public func createPublisher(_ properties: NSDictionary) {

        let settings = OTPublisherSettings()

        settings.videoTrack = Utils.sanitizeBooleanProperty(
            properties["videoTrack"] as Any)
        settings.audioTrack = Utils.sanitizeBooleanProperty(
            properties["audioTrack"] as Any)
        if let audioBitrate = properties["audioBitrate"] as? Int32 {
            settings.audioBitrate = audioBitrate
        }
        settings.cameraFrameRate = Utils.sanitizeFrameRate(
            properties["frameRate"] as Any)
        settings.cameraResolution = Utils.sanitizeCameraResolution(
            properties["resolution"] as? String ?? "MEDIUM")
        settings.enableOpusDtx = Utils.sanitizeBooleanProperty(
            properties["enableDtx"] as Any)
        settings.name = properties["name"] as? String
        settings.publisherAudioFallbackEnabled =
            Utils.sanitizeBooleanProperty(
                properties["publisherAudioFallback"] as Any)
        settings.subscriberAudioFallbackEnabled =
            Utils.sanitizeBooleanProperty(
                properties["subscriberAudioFallback"] as Any)
        settings.videoCapture?.videoContentHint =
            Utils.convertVideoContentHint(properties["videoContentHint"] as Any)
        settings.scalableScreenshare = Utils.sanitizeBooleanProperty(
            properties["scalableScreenshare"] as Any)

        publisherDelegateHandler = PublisherDelegateHandler(impl: self)
        publisherAudioLevelDelegateHandler = PublisherAudioLevelDelegateHandler(impl: self)
        publisherNetworkStatsDelegateHandler = PublisherNetworkStatsDelegateHandler(impl: self)

        self.publisherId = Utils.sanitizeStringProperty(
            properties["publisherId"] as Any)

        guard let publisherId = self.publisherId else {
            strictUIViewContainer?.handleError([
                "code": "OTPublisherError",
                "message": "Publisher ID is not set",
            ])
            return
        }

        guard
            let publisher = OTPublisher(
                delegate: publisherDelegateHandler, settings: settings)
        else {
            strictUIViewContainer?.handleError([
                "code": "OTPublisherError",
                "message":
                    "There was an error creating the native publisher instance",
            ])
            return
        }

        publisher.audioLevelDelegate = publisherAudioLevelDelegateHandler
        publisher.networkStatsDelegate = publisherNetworkStatsDelegateHandler
        OTRN.sharedState.publishers.updateValue(publisher, forKey: publisherId)

        if let videoSource = properties["videoSource"] as? String,
            videoSource == "screen"
        {
            guard let screenView = RCTPresentedViewController()?.view else {
                strictUIViewContainer?.handleError([
                    "code": "OTPublisherError",
                    "message":
                        "There was an error setting the videoSource as screen",
                ])
                return
            }
            publisher.videoType = .screen
            publisher.videoCapture = OTScreenCapture(view: screenView)
        } else if let cameraPosition = properties["cameraPosition"] as? String {
            publisher.cameraPosition =
                cameraPosition == "front" ? .front : .back
        }

        publisher.audioFallbackEnabled = Utils.sanitizeBooleanProperty(
            properties["audioFallbackEnabled"] as Any)
        publisher.publishAudio = Utils.sanitizeBooleanProperty(
            properties["publishAudio"] as Any)
        publisher.publishVideo = Utils.sanitizeBooleanProperty(
            properties["publishVideo"] as Any)
        publisher.publishCaptions = Utils.sanitizeBooleanProperty(
            properties["publishCaptions"] as Any)



        if let pubView = publisher.view {
            pubView.frame = strictUIViewContainer?.bounds ?? .zero
            publisherUIView = pubView
        }

    }
    @objc public func setSessionId(_ sessionId: String) {
        self.sessionId = sessionId
    }

    @objc public func setPublisherId(_ publisherId: String) {
        self.publisherId = publisherId
    }

    @objc public func setPublishAudio(_ publishAudio: Bool) -> Void {
        guard let publisherId = self.publisherId else {
            strictUIViewContainer?.handleError([
                "code": "OTPublisherError",
                "message": "Publisher ID is not set"
            ])
            return
        }
        
        guard let publisher = OTRN.sharedState.publishers[publisherId] else {
            strictUIViewContainer?.handleError([
                "code": "OTPublisherError",
                "message": "Could not find publisher instance"
            ])
            return
        }
        
        publisher.publishAudio = publishAudio
    }

    @objc public func setPublishVideo(_ publishVideo: Bool) -> Void  {
        guard let publisherId = self.publisherId else {
            strictUIViewContainer?.handleError([
                "code": "OTPublisherError",
                "message": "Publisher ID is not set"
            ])
            return
        }
        
        guard let publisher = OTRN.sharedState.publishers[publisherId] else {
            strictUIViewContainer?.handleError([
                "code": "OTPublisherError",
                "message": "Could not find publisher instance"
            ])
            return
        }
        
        publisher.publishVideo = publishVideo
    }

    deinit {

        DispatchQueue.main.async { [weak self] in
            guard let self = self,
                let publisherId = self.publisherId,
                let publisher = OTRN.sharedState.publishers[publisherId]
            else { return }

            var error: OTError?

            if let isPublishing = OTRN.sharedState.isPublishing[publisherId] {
                if isPublishing {
                    if let sessionId = publisher.session?.sessionId {
                        guard let session = OTRN.sharedState.sessions[sessionId]
                        else {
                            self.strictUIViewContainer?.handleError([
                                "code": "OTPublisherError",
                                "message":
                                    "Error destroying publisher. Could not find native session instance",
                            ])
                            return
                        }
                        if session.sessionConnectionStatus.rawValue == 1 {
                            session.unpublish(publisher, error: &error)
                        }
                    }
                }
            }

            if let err = error {
                self.strictUIViewContainer?.handleError([
                    "code": String(err.code),
                    "message": err.localizedDescription,
                ])
            } else {
                // Clean up publisher resources
                publisher.view?.removeFromSuperview()
                publisher.delegate = nil
                publisherDelegateHandler = nil
                publisher.audioLevelDelegate = nil
                publisherAudioLevelDelegateHandler = nil
                publisher.networkStatsDelegate = nil
                publisherNetworkStatsDelegateHandler = nil
                OTRN.sharedState.publishers[publisherId] = nil
                OTRN.sharedState.isPublishing[publisherId] = nil
            }
        }

    }
}

private class PublisherDelegateHandler: NSObject, OTPublisherKitDelegate {

    weak var impl: OTPublisherViewNativeImpl?

    init(impl: OTPublisherViewNativeImpl) {
        self.impl = impl
        super.init()
    }

    func publisher(_ publisher: OTPublisherKit, streamCreated stream: OTStream)
    {
        impl?.strictUIViewContainer?.handleStreamCreated([
            "streamId": stream.streamId
        ])
    }

    func publisher(_ publisher: OTPublisherKit, didFailWithError error: OTError)
    {
        impl?.strictUIViewContainer?.handleError([
            "code": String(error.code),
            "message": error.localizedDescription,
        ])
    }

    func publisher(
        _ publisher: OTPublisherKit, streamDestroyed stream: OTStream
    ) {
        impl?.strictUIViewContainer?.handleStreamDestroyed([
            "streamId": stream.streamId
        ])
    }
}

private class PublisherAudioLevelDelegateHandler: NSObject, OTPublisherKitAudioLevelDelegate {
    weak var impl: OTPublisherViewNativeImpl?
    
    init(impl: OTPublisherViewNativeImpl) {
        self.impl = impl
        super.init()
    }
    
    public func publisher(_ publisher: OTPublisherKit, audioLevelUpdated audioLevel: Float) {
        guard let publisherId = impl?.publisherId,
              publisherId.count > 0 else {
            return
        }
        
        impl?.strictUIViewContainer?.handleAudioLevel([
            "audioLevel": audioLevel
        ])
    }
}

private class PublisherNetworkStatsDelegateHandler: NSObject, OTPublisherKitNetworkStatsDelegate {
    weak var impl: OTPublisherViewNativeImpl?
    
    init(impl: OTPublisherViewNativeImpl) {
        self.impl = impl
        super.init()
    }
    
    
    public func publisher(_ publisher: OTPublisherKit, audioNetworkStatsUpdated stats: [OTPublisherKitAudioNetworkStats]) {
        let statsArray = stats.map { stat -> [String: Any] in
            return [
                "connectionId": stat.connectionId,
                "subscriberId": stat.subscriberId,
                "audioPacketsLost": stat.audioPacketsLost,
                "audioBytesSent": stat.audioBytesSent,
                "audioPacketsSent": stat.audioPacketsSent,
                "timeStamp": stat.timestamp
            ]
        }
        
        if let jsonData = try? JSONSerialization.data(withJSONObject: statsArray),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            impl?.strictUIViewContainer?.handleAudioNetworkStats(jsonString)
        }
    }
    

    
    public func publisher(_ publisher: OTPublisherKit, videoNetworkStatsUpdated stats: [OTPublisherKitVideoNetworkStats]) {
        let statsArray = stats.map { stat -> [String: Any] in
            return [
                "connectionId": stat.connectionId,
                "subscriberId": stat.subscriberId,
                "videoPacketsLost": stat.videoPacketsLost,
                "videoBytesSent": stat.videoBytesSent,
                "videoPacketsSent": stat.videoPacketsSent,
                "timestamp": stat.timestamp
            ]
        }
        
        if let jsonData = try? JSONSerialization.data(withJSONObject: statsArray),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            impl?.strictUIViewContainer?.handleVideoNetworkStats(jsonString)
        }
    }
}
