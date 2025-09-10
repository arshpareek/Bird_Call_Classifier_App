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

const decodePredictions = (predictions:tf.Tensor, classes:any,topK=1) =>{
  const {values, indices} = predictions.topk(topK);
  const topKValues = values.dataSync();
  const topKIndices = indices.dataSync();

  const topClassesAndProbs:ModelPrediction[] = [];
  for (let i = 0; i < topKIndices.length; ++i) {
    topClassesAndProbs.push({
      className: classes[topKIndices[i]],
      probability: topKValues[i]
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
        if (!ModelService.instance){
            //await tf.ready(); 
            
            const modelPath = {url: '../assets/models/model.tflite'};
            //console.log(((modelJSON['format'])));
            const model = await loadTensorflowModel(modelPath);
            //const model = await tf.loadGraphModel(modelJSON);
            
            ModelService.instance = new ModelService(melSize, model);
          }
    
        return ModelService.instance;
    }

    

    async classify(audio: number[][]): Promise<IModelPredictionResponse> {
        const classificationResponse = {timing:null, predictions:null, error:null} as IModelPredictionResponse;
        try {
            let input_tensor = tf.tensor(audio);
            console.log(input_tensor.shape);
            //TODO: normalize

            const predictionsTensor: Uint8Array[] = await this.model.run(input_tensor) as Uint8Array[];
            const class_names: any = JSON.parse('../assets/class_names.json')

            classificationResponse.predictions = decodePredictions(predictionsTensor, class_names)
            console.log(classificationResponse.predictions[0].className)
            return classificationResponse
        } catch (error) {
            console.log('Exception Error: ', error)
            throw error
        }
    }
}

/*export function predict(input: number[][]) {
    
}*/

