from typing import Optional
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse, StreamingResponse

import os
import io
CODE_DIR = './'
import time
import sys
import pprint
import numpy as np
from PIL import Image
import torch
import torchvision.transforms as transforms
import cv2
from backend.encoder_gateway import FaceEncoderGateway, GeneratorTypes

# sys.path.append(".")
# sys.path.append("..")

# from notebooks.notebook_utils import Downloader, HYPERSTYLE_PATHS, W_ENCODERS_PATHS, FINETUNED_MODELS, RESTYLE_E4E_MODELS, run_alignment

# from notebooks.notebook_utils import HYPERSTYLE_PATHS, W_ENCODERS_PATHS, FINETUNED_MODELS, RESTYLE_E4E_MODELS, run_alignment

# from utils.common import tensor2im
# from utils.inference_utils import run_inversion
# from utils.domain_adaptation_utils import run_domain_adaptation
# from utils.model_utils import load_model, load_generator
# generator_type = 'toonify' #@param ['toonify', 'pixar', 'sketch', 'disney_princess']

# hyperstyle_path = "./pretrained_models/hyperstyle_ffhq.pt" #@param {type:"string"}
# w_encoder_path = "./pretrained_models/faces_w_encoder.pt" #@param {type:"string"}

# if not os.path.exists(hyperstyle_path) or os.path.getsize(hyperstyle_path) < 1000000:
#     print(f'Downloading HyperStyle model for faces...')
#     downloader.download_file(file_id=HYPERSTYLE_PATHS["faces"]['id'], file_name=HYPERSTYLE_PATHS["faces"]['name'])
#     # if google drive receives too many requests, we'll reach the quota limit and be unable to download the model
#     if os.path.getsize(hyperstyle_path) < 1000000:
#         raise ValueError("Pretrained model was unable to be downloaded correctly!")
#     else:
#         print('Done.')
# else:
#     print(f'HyperStyle model for faces already exists!')

# if not os.path.exists(w_encoder_path) or os.path.getsize(w_encoder_path) < 1000000:
#     print(f'Downloading the WEncoder model for faces...')
#     downloader.download_file(file_id=W_ENCODERS_PATHS["faces"]['id'], file_name=W_ENCODERS_PATHS["faces"]['name'])
#     # if google drive receives too many requests, we'll reach the quota limit and be unable to download the model
#     if os.path.getsize(w_encoder_path) < 1000000:
#         raise ValueError("Pretrained model was unable to be downloaded correctly!")
#     else:
#         print('Done.')
# else:
#     print(f'WEncoder model for faces already exists!')

# net, opts = load_model(hyperstyle_path, update_opts={"w_encoder_checkpoint_path": w_encoder_path})
# print('Model successfully loaded!')
# pprint.pprint(vars(opts))

# generator_path = f"./pretrained_models/{FINETUNED_MODELS[generator_type]['name']}"

# if not os.path.exists(generator_path):
#     print(f'Downloading fine-tuned {generator_type} generator...')
#     downloader.download_file(file_id=FINETUNED_MODELS[generator_type]["id"], 
#                              file_name=FINETUNED_MODELS[generator_type]['name'])
#     print('Done.')
# else:
#     print(f'Fine-tuned {generator_type} generator already exists!')

# transform = transforms.Compose([
#     transforms.Resize((256, 256)),
#     transforms.ToTensor(),
#     transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])])

# fine_tuned_generator = load_generator(generator_path)
# print(f'Fine-tuned {generator_type} generator successfully loaded!')

# restyle_e4e_path = os.path.join("./pretrained_models", RESTYLE_E4E_MODELS['name'])

# if not os.path.exists(restyle_e4e_path):
#     print('Downloading ReStyle-e4e model...')
#     downloader.download_file(file_id=RESTYLE_E4E_MODELS["id"], file_name=RESTYLE_E4E_MODELS["name"])
#     print('Done.')
# else:
#     print('ReStyle-e4e model already exists!')

# restyle_e4e, restyle_e4e_opts = load_model(restyle_e4e_path, is_restyle_encoder=True)
# print(f'ReStyle-e4e model successfully loaded!')

#--- FAST API APP ---

app = FastAPI()

face_encoder = FaceEncoderGateway()

@app.on_event("startup")
def startup_event():
    face_encoder.load_models()

@app.get("/")
def ping():
    return {"Ping": "Pong"}

# @app.get("/image")
# def get_image():
#     image_path = "./notebooks/images/domain_adaptation.jpg" #@param {type:"string"}
#     # image_path = "./notebooks/images/foto3.jpg" #@param {type:"string"}

#     input_is_aligned = False #@param {type:"boolean"}
#     if not input_is_aligned:
#         input_image = run_alignment(image_path)
#     else:
#         input_image = Image.open(image_path).convert("RGB")

#     input_image.resize((256, 256))

#     img_transforms = transforms.Compose([transforms.Resize((256, 256)), 
#                                      transforms.ToTensor(),
#                                      transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])])
#     transformed_image = img_transforms(input_image)

#     restyle_e4e_opts.n_iters_per_batch = 5
#     restyle_e4e_opts.resize_outputs = False
#     opts.n_iters_per_batch = 5
#     opts.resize_outputs = False  # generate outputs at full resolution

#     with torch.no_grad():
#         tic = time.time()
#         result, _ = run_domain_adaptation(transformed_image.unsqueeze(0).cuda(), 
#                                         net, 
#                                         opts, 
#                                         fine_tuned_generator, 
#                                         restyle_e4e, 
#                                         restyle_e4e_opts)
#         toc = time.time()
#         print('Inference took {:.4f} seconds.'.format(toc - tic))

#     resize_amount = (256, 256) if opts.resize_outputs else (opts.output_size, opts.output_size)

#     final_res = tensor2im(result[0]).resize(resize_amount)
#     input_im = tensor2im(transformed_image).resize(resize_amount)
#     res = np.concatenate([np.array(input_im), np.array(final_res)], axis=1)
    
#     img_rgb = cv2.cvtColor(np.array(final_res), cv2.COLOR_RGB2BGR)
#     status, image = cv2.imencode(".jpg", img_rgb)

#     # res = Image.fromarray(res)

#     return StreamingResponse(io.BytesIO(image.tobytes()), media_type="image/jpg")

@app.get("/ext")
def get_image_from_api():
    image = face_encoder.transform_image('./notebooks/images/domain_adaptation.jpg', )
    return StreamingResponse(io.BytesIO(image.tobytes()), media_type="image/jpg")

@app.get("/test")
def get_test_image():
    return FileResponse("./outputs/domain_adaptation/toonify/domain_adaptation.jpg")

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    content = await file.read()
    print(content)
    
    return {"filename": file.filename}

# @app.post("/hyper")
# def get_hyper_image(file: UploadFile = File(...)):
#     content = file.file.read()
#     with open("./notebooks/images/my_file.jpg", "wb") as f:
#         f.write(content)
#     image_path = "./notebooks/images/my_file.jpg" #@param {type:"string"}
#     # image_path = "./notebooks/images/foto3.jpg" #@param {type:"string"}

#     input_is_aligned = False #@param {type:"boolean"}
#     if not input_is_aligned:
#         input_image = run_alignment(image_path)
#     else:
#         input_image = Image.open(image_path).convert("RGB")

#     input_image.resize((256, 256))

#     img_transforms = transforms.Compose([transforms.Resize((256, 256)), 
#                                      transforms.ToTensor(),
#                                      transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])])
#     transformed_image = img_transforms(input_image)

#     restyle_e4e_opts.n_iters_per_batch = 5
#     restyle_e4e_opts.resize_outputs = False
#     opts.n_iters_per_batch = 5
#     opts.resize_outputs = False  # generate outputs at full resolution

#     with torch.no_grad():
#         tic = time.time()
#         result, _ = run_domain_adaptation(transformed_image.unsqueeze(0).cuda(), 
#                                         net, 
#                                         opts, 
#                                         fine_tuned_generator, 
#                                         restyle_e4e, 
#                                         restyle_e4e_opts)
#         toc = time.time()
#         print('Inference took {:.4f} seconds.'.format(toc - tic))

#     resize_amount = (256, 256) if opts.resize_outputs else (opts.output_size, opts.output_size)

#     final_res = tensor2im(result[0]).resize(resize_amount)
#     input_im = tensor2im(transformed_image).resize(resize_amount)
#     res = np.concatenate([np.array(input_im), np.array(final_res)], axis=1)
    
#     img_rgb = cv2.cvtColor(np.array(final_res), cv2.COLOR_RGB2BGR)
#     status, image = cv2.imencode(".jpg", img_rgb)

#     # res = Image.fromarray(res)

#     return StreamingResponse(io.BytesIO(image.tobytes()), media_type="image/jpg")

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}