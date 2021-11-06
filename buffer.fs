precision highp float;
uniform sampler2D audio;
uniform sampler2D backbuffer;
uniform vec2 resolution;

void main (void) {
    vec2 pos = gl_FragCoord.xy / resolution;
    float prev = texture2D(backbuffer, pos).a;
    float wave = texture2D(audio, vec2(pos.x, 0.)).r;
    float d = abs(pos.y - wave);
    float new = clamp(pow(1. - d, 50.), 0., 1.);
    float value = clamp(prev * .9 + new * 1., 0., 1.);
    gl_FragColor = value * vec4(1., .5, 0., 1.);
}