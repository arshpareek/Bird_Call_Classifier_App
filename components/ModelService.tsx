import { loadTensorflowModel, TensorflowModel } from 'react-native-fast-tflite';

export interface ModelPrediction {
  className:string;
  probability:number;
}

export interface IModelPredictionTiming {
  totalTime:number;
  imageLoadingTime:number;
  imagePreprocessing:number;
  imagePrediction:number;
  imageDecodePrediction:number;
}

export interface IModelPredictionResponse {
  predictions?:ModelPrediction[] | null
  timing?:IModelPredictionTiming | null
  error?:string | null
}

const topKElements = (arr: Uint8Array, k: number) => {
  let temp_array = Array.from(arr);
  let indexed_array = temp_array.map((value, index) => ({value, index}));
  indexed_array.sort((a, b) => {return b.value - a.value});
  return indexed_array.slice(0, k);
}


const decodePredictions = (predictions: Uint8Array, classes: Record<number, string>, topK=1) =>{
  //console.log(predictions);
  const topPredictions = topKElements(predictions, 1);
  
  const topKValues: number[] = topPredictions.map(pair => pair.value);
  const topKIndices = topPredictions.map(pair => pair.index);
  console.log(topPredictions);
  console.log(topKValues);
  console.log(topKIndices);
  const topClassesAndProbs:ModelPrediction[] = [];
  for (let i = 0; i < topKIndices.length; ++i) {
    topClassesAndProbs.push({
      className: classes[topKIndices[i]],
      probability: topKValues[i],
    } as ModelPrediction);
  }
  return topClassesAndProbs;
}

export class ModelService {
    private model: TensorflowModel;
    private melSize: number[];
    private static instance: ModelService;

    constructor(melSize: number[], model: TensorflowModel) {
        this.melSize = melSize;
        this.model = model;
    }

    static async createModel(melSize:number[]) {
        console.log('1');
        if (!ModelService.instance){
              
              const modelPath = {url: '../assets/models/model.tflite'};
              const model = await loadTensorflowModel(require('../assets/models/model.tflite'));
              ModelService.instance = new ModelService(melSize, model);
            }
        
        return ModelService.instance;
    }

    

    async classify(audio: number[][]): Promise<IModelPredictionResponse> {
        const classificationResponse = {timing:null, predictions:null, error:null} as IModelPredictionResponse;
        try {
            let input = [];
            audio = audio.map(row => {while (row.length < 384) {row.push(0)} return row;})
            let input_array = new Float32Array(audio.flat());
            //TODO: further normalize
            console.log(this.model.inputs);
            
            const predictionsTensor: Uint8Array[] = await this.model.run([input_array]) as Uint8Array[];
            
            const class_names: Record<number, string> = require('../assets/class_names.json')

            classificationResponse.predictions = decodePredictions(predictionsTensor[0], class_names)
            console.log(classificationResponse.predictions[0].className)
            return classificationResponse
        } catch (error) {
            console.log('Exception Error: ', error)
            throw error
        }
    }
}
