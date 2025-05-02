export class SoundEffects {
  private static sounds: { [key: string]: HTMLAudioElement } = {};

  static initialize() {
    this.sounds = {
      cardPlace: new Audio('/sounds/card-place.mp3'),
      cardCapture: new Audio('/sounds/card-capture.mp3'),
      chainReaction: new Audio('/sounds/chain-reaction.mp3'),
      aiMove: new Audio('/sounds/ai-move.mp3'),
      gameOver: new Audio('/sounds/game-over.mp3')
    };
  }

  static playCardPlace() {
    this.sounds.cardPlace.play();
  }

  static playCapture() {
    this.sounds.cardCapture.play();
  }

  static playChainReaction() {
    this.sounds.chainReaction.play();
  }

  static playAIMove() {
    this.sounds.aiMove.play();
  }

  static playGameOver() {
    this.sounds.gameOver.play();
  }
} 