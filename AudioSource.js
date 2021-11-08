class AudioSource {
  static fftSize = 1024;

  static async getDevices () {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return await navigator.mediaDevices.enumerateDevices();
  }

  static audioMonitor (instance) {
    if (instance.analyzer) {
      instance.analyzer.getFloatTimeDomainData(instance.audioData);
      const max = Math.max(...instance.audioData);
      const min = Math.min(...instance.audioData);
      const newValue = (max - min) / 2;
      if (newValue > instance.value) {
        instance.value = newValue;
      } else {
        instance.value = 0.9 * instance.value + 0.1 * newValue;
      }
      instance.chart.render(instance.audioData, instance.value, max !== min);
    }
  }

  constructor (elementId, options) {
    this.chart = new Chart(elementId, { min: -1, max: 1, ...options });
    this.chart.initialize();
    this.value = 0;
    this.audioData = new Float32Array(AudioSource.fftSize);
    this.source = null;
    this.analyzer = null;
    this.timer = null;
  }

  destroy () {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.source) {
      this.source.mediaStream.getTracks().forEach(track => track.stop());
    }
  }

  async initWithStream (stream) {
    const ctx = new AudioContext();
    this.source = new MediaStreamAudioSourceNode(ctx, {
      mediaStream: stream,
    });
    const lpfNode = new BiquadFilterNode(ctx, {
      type: "lowpass",
      Q: 1,
      frequency: 90,
    });
    const gainNode = new GainNode(ctx, {
      gain: 3.5,
    });
    this.analyzer = new AnalyserNode(ctx, {
      fftSize: AudioSource.fftSize,
    });
    const dest = new MediaStreamAudioDestinationNode(ctx);
    this.source.connect(lpfNode).connect(gainNode).connect(this.analyzer).connect(dest);
    this.timer = setInterval(AudioSource.audioMonitor.bind(null, this), 30);
  }

  async initWithDevice (device) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: device.deviceId },
      video: false,
    });
    await this.initWithStream(stream);
  }

  async initWithDisplayMedia () {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true, /* required to be true by the API spec */
      audio: true,
    });
    await this.initWithStream(stream);
  }

  getValue () {
    return this.value;
  }
}