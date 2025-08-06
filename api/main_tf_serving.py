from fastapi import FastAPI, File, UploadFile, Request
import uvicorn
from io import BytesIO
from PIL import Image
import numpy as np
import tensorflow as tf 
from tensorflow.keras.models import load_model 
from tensorflow.python.saved_model import load

app = FastAPI()

model = load_model(r"C:\Users\Yousef Sorour\OneDrive\Desktop\AI_LungDisease\models\Train_model.keras")

class_names = ['NORMAL', 'PNEUMONIA']

def read_files_as_image(data):
    image = np.array(Image.open(BytesIO(data)).convert('RGB'))
    return image

@app.get('/ping')
async def ping():
    return 'Hello world'


@app.post('/predict')
async def predict(file: UploadFile = File(...)):
    image = read_files_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    
    prediction = model.predict(img_batch)
    
    if prediction[0][0] < 0.5:
        predicted_class_name = class_names[0]
        confidence = 1 - np.max(prediction[0])

    else:
        predicted_class_name = class_names[1]
        confidence = np.max(prediction[0])

    return {
        'class' : predicted_class_name,
        'confidence': f"{float(confidence)*100:.4f} %"
    }

if __name__ == '__main__':
    uvicorn.run(app, host='localhost', port=1000)