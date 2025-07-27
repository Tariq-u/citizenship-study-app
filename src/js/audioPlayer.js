export class AudioPlayer {
    static currentAudio = null;

    static play(src) {
        if (this.currentAudio) {
            this.currentAudio.pause();
        }
        this.currentAudio = new Audio(src);
        this.currentAudio.play();
    }

    static stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
    }
}
