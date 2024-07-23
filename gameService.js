class GameService {
  constructor(nostrService) {
    this.nostr = nostrService;
    this.gameId = null;
    this.opponentPubkey = null;
  }

  async findOpponent() {
    const matchEvent = await this.nostr.publishEvent(
      1,
      [["t", "tetris_matchmaking"]],
      { gameVersion: "1.0", skillLevel: "beginner" }
    );

    return new Promise((resolve) => {
      const sub = this.nostr.subscribe(
        {
          kinds: [1],
          "#t": ["tetris_matchmaking"],
          since: matchEvent.created_at,
        },
        (event) => {
          if (event.pubkey !== this.nostr.publicKey) {
            this.opponentPubkey = event.pubkey;
            this.gameId = generatePrivateKey(); // Use as unique game identifier
            sub.unsub();
            resolve(this.gameId);
          }
        }
      );
    });
  }

  async publishGameState(board, score) {
    await this.nostr.publishEvent(
      1,
      [
        ["e", this.gameId],
        ["t", "tetris_game_state"],
      ],
      { board, score }
    );
  }

  subscribeToOpponentMoves(onOpponentMove) {
    return this.nostr.subscribe(
      {
        kinds: [1],
        "#e": [this.gameId],
        "#t": ["tetris_game_state"],
        authors: [this.opponentPubkey],
      },
      (event) => {
        const { board, score } = JSON.parse(event.content);
        onOpponentMove(board, score);
      }
    );
  }

  async endGame(result) {
    await this.nostr.publishEvent(
      1,
      [
        ["e", this.gameId],
        ["t", "tetris_game_end"],
      ],
      { result }
    );
  }
}
