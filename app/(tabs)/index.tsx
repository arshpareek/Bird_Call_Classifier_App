import CircleButton from "@/components/CircleButton";
import { ModelService } from "@/components/ModelService";
import ResultModal from "@/components/ResultModal";
import Essentia from '@siteed/react-native-essentia';
import Storage from 'expo-native-storage';
import * as WebBrowser from 'expo-web-browser';
import { fetch } from 'expo/fetch';
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
import { Image } from "expo-image";
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from "react-native";
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
    analysisData,
    compression,
  } = useAudioRecorder()
  
  let audioSource = {
    uri: "@/components/bird.wav",
  };

  const [audioResult, setAudioResult] = useState<AudioRecording | null>(null);
  const player = useAudioPlayer(audioSource);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string>('https://static.wikia.nocookie.net/sonic/images/4/40/Flicky_wink.png/revision/latest?cb=20200314104811');
  const [predictionName, setPredictionName] = useState<string>('Flicky');
  const [predictionDescription, setPredictionDescription] = useState<string>('Blue bird species native to Green Hill Zone.');
  const [predictionURL, setPredictionURL] = useState<string>('https://sonic.fandom.com/wiki/Flicky');
  
  const STORAGE_KEY = 'history';

  const onModalClose = () => {
    setIsModalVisible(false);
  }

  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);

  const config: RecordingConfig = {
    interval: 500, //in milliseconds.
    enableProcessing: true,
    sampleRate: 44100,
    channels: 1,
    encoding: 'pcm_16bit',
    
    output: {
        primary: {
            enabled: true,
        },
        compressed: {
            enabled: false,
            format: 'aac',
            bitrate: 128000,
        }
    },

  autoResumeAfterInterruption: false,

  bufferDurationSeconds: 0.1, // Buffer size in seconds
  }

  const record = async () => {
    const startResult = await startRecording(config)
    setTimeout(stop, 15000);
  }

  const stop = async () => {
    const result = await stopRecording();
    setAudioResult(result);

    const duration = 15;
    const sample_rate = 44100;
    const audio_len = duration * sample_rate;
    const input_size = [128, 384]

    const audio = await readAudio(result?.fileUri ?? "");

    const predictions = await predict(audio);
    
    showResult(predictions.predictions[0].className);

  };

  async function doFetch(searchName: string) {
    let ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMzdkYzlmMTQ4MzAwNjc2ZjE5ZTUzMmRiMzNhZWI1YSIsImp0aSI6IjcwMGZhN2I5M2EyZjNiNTMwYWJmODIwYTVkNmIzOWUzOWVlN2I3OTJiMjYwYzkxZWVjNmVhY2UzYjFjYWQ1Mjk1YWEwMDEwNWZiNDE1YTIwIiwiaWF0IjoxNzU5MzE0MjczLjc4MDQ3NywibmJmIjoxNzU5MzE0MjczLjc4MDQ3OCwiZXhwIjozMzMxNjIyMzA3My43NzY2OCwic3ViIjoiNzk3NzExNTEiLCJpc3MiOiJodHRwczovL21ldGEud2lraW1lZGlhLm9yZyIsInJhdGVsaW1pdCI6eyJyZXF1ZXN0c19wZXJfdW5pdCI6NTAwMCwidW5pdCI6IkhPVVIifSwic2NvcGVzIjpbImJhc2ljIl19.RbCBQgdiMOWvZwAYQN8bzdAkFd9xYLJdhRVcmUKhaXvhA-60mWoKPvlmUECsErke9U4Aa5fp6Zqizsx0S0EIThxJfG3-mLS2wQTRhXzsGLES0Tt2GpQ_CXB15YEbD-FSm1Y6xG-93sl_cUvdM5I4s_UU1KMQDSmXEMCo_hdEsT5K5LE4Ia5r9sdjXF64TjV_op1GkiwsA-WAJxAKcDcNfMBo1sumdTzmCW4Kag3FzuWQf_afFMKCJ8NYT1Qd9V1h4v26QRrOsVsZchPeLK9Zbq_vgXF6yC2uVRSIwVxoJ-e7xLT9ZB-mR9mh4R1nIvnVYNb77ngFG5GfOkfSHhqd70OmJoga-b8EYgKb5ZscAKZ6fDa1HCvx1Opj9dxlp8oHUHfEwRQKM_uBEFwc7QnJOORSxzjVeLX7NckhFGPnOthJxiEnQAz8gIXyEtzrymx4NniotDBHxul4pelptk5tdfy6cZYV1NmfR3yWjue2Hb9o9WveEhm-5-zL3imxpmE6ILZP34NWGJDqDfwvFe4WCUE73cI1_cWzHrelUaYDfJFxtxjOo8oJA8AukDriNESRLlZv05gRvauJ3NF0HEhLWJ8Jna_ZBN2OYBsCJSJYakYgfIxp0-S0JwB8Y6ISITjdyUBTQJQEt-mVBiNrrJtV1xNw-4dlIJLAbqFE_hJoelU';
    let url = 'https://en.wikipedia.org/w/rest.php/v1/search/page';
    let headers = {
      'User-Agent': 'Classifier/1.0 (tabbystarr24@gmail.com)',
    };
    let params = {
      q: searchName,
      limit: '1',
    };
    let query = Object.keys(params)
      .map(k => k + '=' + encodeURIComponent(params[k]))
      .join('&');
    url = url + '?' + query;

    const rsp = await fetch(url, {
      method: 'GET', // Or 'POST', 'PUT', etc.
      headers: {
        'User-Agent': 'Classifier/1.0 (tabbystarr24@gmail.com)',
      },
    });
    
    const data = await rsp.json();
    const thumbnailUrl = data.pages[0].thumbnail.url;
    const description = data.pages[0].description;
    const title = data.pages[0].key;

    return {url: thumbnailUrl, description: description, title: title};
  }
  
  async function fetchAsync(searchName: string)
  {
    try {
      let result = await doFetch(searchName);
      console.log(result);
      return result;
    } catch( err ) {
      console.error( err.message );
    }
  }

  
  const addToHistory = async (item: string) => {
    try{

      const storage_item = await Storage.getItem(STORAGE_KEY);
      const currentHistory = storage_item != null ? JSON.parse(storage_item) : [];
      const newHistory = currentHistory.unshift({id: Date.now(), name: item});
      await Storage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    }
    catch (error){
      console.error('Error saving name:', error);
    }
  }

  const showResult = async (prediction: string) => {
    const wikipediaData = await fetchAsync(prediction.toLowerCase())
    const thumbnailURL = wikipediaData?.url.slice(2);

    const urlRegex = /https?:\/\/[^\s]+/;
    const jpegRegex = /[\%a-zA-Z0-9_-]+\.jpe?g/i;

    const firstLink = imageURL.match(jpegRegex);
    const name = prediction.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    setPredictionName(name);
    setPredictionDescription(wikipediaData?.description ?? '')
    setPredictionURL("https://en.wikipedia.org/wiki/" + wikipediaData?.title)

    let base_url = 'https://api.wikimedia.org/core/v1/commons/file/'
    let url = base_url + 'File:' + firstLink[0];
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Classifier/1.0 (tabbystarr24@gmail.com)',
      },
    });
    const data = await response.json();
    setImageURL(data['original']['url']);
    setIsModalVisible(true);

    addToHistory(name);
  }

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
    const audioData = await extractAudioData({
      fileUri: filePath,
      includeWavHeader: false,
      startTimeMs: 0,
      endTimeMs: audioResult?.durationMs ?? 0,
      includeNormalizedData: true,
    });

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
    
    let melSpec = melSpectrogram.data.bands;
    melSpec.map(row => {row.map(number => {10 * Math.log10(number)})});
    // Transpose mel-spectrogram to match model input size.
    melSpec = melSpec[0].map((_, colIndex) =>
      melSpec.map(row => row[colIndex])
  );
  
    return melSpec;
  }

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        alert('Permission to access microphone was denied');
      }

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
          
          <CircleButton icon='mic' onPress={isRecording ? () => {} : record} recorderState={isRecording}/>
          <Pressable style={{width: 40, height: 40, backgroundColor: '#fff'}} onPress={() => {addToHistory('peacock')}}/>
          
        </View>
      </View> 
        <ResultModal isVisible={isModalVisible} onClose={onModalClose}>
            <Image source={{uri: imageURL}} style={styles.image}/>
            <Text style={{fontSize: 28, color: 'white', padding:10}}>{predictionName}</Text>
            <Text style={{fontSize: 14, color: 'white', padding:10}}>{predictionDescription}</Text>
            <Text style = {{color: 'deepskyblue'}} onPress={() => WebBrowser.openBrowserAsync(predictionURL)}>Learn more.</Text>
        </ResultModal>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008080',
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
  },
  image: {
    width: 320,
    height: 320,
    borderRadius: 18,
    backgroundColor: 'yellow',
  }
})