import Button from "@/components/button";
import CircleButton from "@/components/CircleButton";
import { ModelService } from "@/components/ModelService";
import Essentia from '@siteed/react-native-essentia';
const audioFile = require("@/components/camera.mp3");

import {
  AudioRecording,
  extractAudioData,
  RecordingConfig,
  useAudioRecorder
} from '@siteed/expo-audio-studio';
import {
  AudioModule,
  setAudioModeAsync,
  useAudioPlayer
} from 'expo-audio';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from "react-native";
import Animated from 'react-native-reanimated';


export default function Index() {

  const {
    prepareRecording,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    durationMs,
    size,
    isRecording,
    isPaused,
    analysisData, // Audio analysis data if enableProcessing is true
    compression, // Compression information if compression is enabled
  } = useAudioRecorder()
  //console.log(audioFile)
  let audioSource = {
    uri: "@/components/bird.wav",
  };
  const [audioResult, setAudioResult] = useState<AudioRecording | null>(null);
  const player = useAudioPlayer(audioSource);

  /* const preset: RecordingOptions = {
    extension: '.m4a',
     sampleRate: 44100,
     numberOfChannels: 1,
     bitRate: 128000,
     android: {
       outputFormat: 'mpeg4',
       audioEncoder: 'aac',
     },
     ios: {
       outputFormat: IOSOutputFormat.MPEG4AAC,
       audioQuality: AudioQuality.MAX,
       linearPCMBitDepth: 16,
       linearPCMIsBigEndian: false,
       linearPCMIsFloat: false,
     },
     web: {
       mimeType: 'audio/webm',
       bitsPerSecond: 128000,
     },
   };
  
  const audioRecorder = useAudioRecorder(preset);
  const recorderState = useAudioRecorderState(audioRecorder); */

  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  //const [isRecording, setIsRecording] = useState<boolean>(false);
  //const player = useAudioPlayer();

  const config: RecordingConfig = {
    interval: 500, // Emit recording data every 500ms
    enableProcessing: true, // Enable audio analysis
    sampleRate: 44100, // Sample rate in Hz (16000, 44100, or 48000)
    channels: 1, // Mono recording
    encoding: 'pcm_16bit', // PCM encoding (pcm_8bit, pcm_16bit, pcm_32bit)
    
    // Optional: Configure audio output files
    output: {
        // Primary WAV file (enabled by default)
        primary: {
            enabled: true, // Set to false to disable WAV file creation
        },
        // Compressed file (disabled by default)
        compressed: {
            enabled: false, // Set to true to enable compression
            format: 'aac', // 'aac' or 'opus'
            bitrate: 128000, // Bitrate in bits per second
        }
    },

  /*onAudioStream: async (audioData) => {
    console.log(`onAudioStream`, audioData)
  },
  // Optional: Handle audio analysis data
  onAudioAnalysis: async (analysisEvent) => {
    console.log(`onAudioAnalysis`, analysisEvent)
  },

  // Optional: Handle recording interruptions
  onRecordingInterrupted: (event) => {
      console.log(`Recording interrupted: ${event.reason}`)
  },*/

  // Optional: Auto-resume after interruption
  autoResumeAfterInterruption: false,


  // Optional: Buffer duration control
  bufferDurationSeconds: 0.1, // Buffer size in seconds
  // Default: undefined (uses 1024 frames, but iOS enforces minimum 0.1s)
  }

  const record = async () => {

    const startResult = await startRecording(config)
    setTimeout(stop, 15000);
    //return startResult;
    
    
    /* await audioRecorder.prepareToRecordAsync();
    
    setIsRecording(true);
    audioRecorder.record();
    setTimeout(stop, 15000); */
    //setRecordedAudio(audioRecorder.uri)
    //alert('Recording started.')
  }

  const stop = async () => {
    const result = await stopRecording();
    setAudioResult(result);

    console.log(result?.fileUri ?? "");
    const duration = 15;
    const sample_rate = 44100;
    const audio_len = duration * sample_rate;
    const input_size = [128, 384]

    const audio = await readAudio(result?.fileUri ?? "");


    /* try{
      const melResult = await extractMelSpectrogram({
        fileUri: result?.fileUri ?? "",
        windowSizeMs: 46,
        hopLengthMs: Math.floor((duration / (input_size[1])) * 1000),
        nMels: input_size[0],
        fMin: 20,
        fMax: 16000,
        normalize: true,
      })
      console.log(`Generated mel spectrogram with ${melResult.spectrogram.length} frames`);
      console.log(`Each frame has ${melResult.spectrogram[0].length} mel bands`);
      const predictions = await predict(melResult.spectrogram);
      //console.log(predictions.predictions.className)

    } catch(e) {
      console.error('Error generating mel spectrogram:', e)
      throw e;
    } */
    
    /* await audioRecorder.stop();
    setRecordedAudio(audioRecorder.uri)
    setIsRecording(false);
    const audio = await readAudio(audioRecorder.uri ?? ""); */
    //let audio = await fetchAudio(audioFile);
    //alert('lkkkkk');

  };

  const playRecording = async () => {
    if (player) {
      console.log('Playing...')
      console.log(player.duration)
      player.play();
    }
    else {
      console.log("Failed")
    }
  };

  const predict = async (melSpectrogram: number[][]) => {
    const model = await ModelService.createModel([128, 384]);
    const predictions = model.classify(melSpectrogram);
    return predictions;
  }

  const readAudio = async (filePath: string) => {
    console.log(filePath);
    
    const audioData = await extractAudioData({
      fileUri: filePath,
      includeWavHeader: false,
      startTimeMs: 0,
      endTimeMs: audioResult?.durationMs ?? 0,
      includeNormalizedData: true,
    });
    //console.log(audioData.pcmData);
    //console.log(audioData.pcmData.length);
    const melParams =  {
      frameSize: 2048,
      hopSize: Math.floor(audioData.normalizedData.length / (384 - 1)),
      nMels: 128,
      fMin: 0,
      fMax: 16000,
      windowType: 'hann',
      normalize: true,
      logScale: false,
    };
    await Essentia.setAudioData(audioData.normalizedData, 44100);
    const mfccResult = await Essentia.extractMFCC();
    const melSpectrogram = await Essentia.computeMelSpectrogram(melParams);
    //let mfccData =  Meyda.prepareSignalWithSpectrum(buffer, "hanning", 512)
    //console.log(mfccResult.mfcc.length);
    
    
    let melSpec = melSpectrogram.data.bands;
    melSpec.map(row => {row.map(number => {10 * Math.log10(number)})});
    //console.log(melSpec);
    console.log(melSpec.length);
    console.log(melSpec[0].length);

    console.log('c');
    return melSpec;
  }

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        alert('Permission to access microphone was denied');
      }
      //await prepareRecording(config);

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
      })();

  }, []);

  


  const AnimatedButton = Animated.createAnimatedComponent(CircleButton);


  return (
    <View
      style={styles.container}
    >
      <View style={styles.buttonContainer}>
        <View style={styles.actionRow}>
          {//<CircleButton icon='photo-camera' onPress={recorderState.isRecording ? stopRecording : record} />
          }
          
          <CircleButton icon='mic' onPress={isRecording ? stop : record} recorderState={isRecording}/>
          
        </View>
      </View>
      <Button label='button' onPress={playRecording}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00d8ad',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    display: 'flex',
  },
  actionRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    color: '#fff',
  }
})