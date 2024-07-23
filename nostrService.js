// nostrService.js
import {
  generatePrivateKey,
  getPublicKey,
  relayInit,
  getEventHash,
  signEvent,
} from "nostr-tools";

export class NostrService {
  constructor(relayUrl) {
    this.relay = relayInit(relayUrl);
    this.privateKey = null;
    this.publicKey = null;
  }

  async connect() {
    try {
      await this.relay.connect();
      this.privateKey = generatePrivateKey();
      this.publicKey = getPublicKey(this.privateKey);
      console.log("Connected to Nostr relay");
    } catch (error) {
      console.error("Failed to connect to Nostr relay:", error);
      throw error;
    }
  }

  async publishEvent(kind, tags, content) {
    const event = {
      kind,
      pubkey: this.publicKey,
      created_at: Math.floor(Date.now() / 1000),
      tags,
      content: JSON.stringify(content),
    };

    event.id = getEventHash(event);
    event.sig = signEvent(event, this.privateKey);

    try {
      await this.relay.publish(event);
      return event;
    } catch (error) {
      console.error("Failed to publish event:", error);
      throw error;
    }
  }

  subscribe(filter, onEvent) {
    const sub = this.relay.sub([filter]);
    sub.on("event", onEvent);
    return sub;
  }
}
