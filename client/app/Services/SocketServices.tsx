class PeerService {
    public peer: RTCPeerConnection | null = null;
    constructor() {
        if (!this.peer) {
            try {
                this.peer = new RTCPeerConnection({
                    iceServers: [{
                        urls: [
                            "stun:stun.l.google.com:19302",
                            "stun:global.stun.twilio.com:3478"
                        ]
                    }]
                })
            } catch (error) {
                console.log("Error in Peer connection", error);
            }
        }
    };

    async getAnswer(offer: any) {
        if (this.peer) {
            if (offer) {
                try {
                    await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
                    const ans = await this.peer.createAnswer();
                    await this.peer.setLocalDescription(new RTCSessionDescription(ans));
                    return ans;
                } catch (error) {
                    console.log("Error in getAnswer", error);

                }
            }
            else{
                console.log("Offer not available");                
            }
        }
    }

    async getOffer() {
        if (this.peer) {
            try {
                const offer = await this.peer.createOffer();
                await this.peer.setLocalDescription(new RTCSessionDescription(offer))
                return offer;
            } catch (error) {
                console.log("Error in getOffer", error);

            }
        }
    }
}

export default new PeerService();