const WavDecoder = require("wav-decoder");
import * as tf from "@tensorflow/tfjs";
import decodeAudio from 'audio-decode';
import * as FileSystem from 'expo-file-system';

async function fetchAudio(filepath: string) {
    let audioB64: string;
    audioB64 = await FileSystem.readAsStringAsync(filepath, { encoding: FileSystem.EncodingType.Base64})
    const audioBuffer = tf.util.encodeString(audioB64, 'base64').buffer;
    const rawAudioData = new Uint8Array(audioBuffer);
    const audio = await decodeAudio(rawAudioData);
    return audio;
}

