from enum import Enum
import os
import io
import time
import sys
import pprint
import numpy as np
from PIL import Image
import torch
import torchvision.transforms as transforms
import cv2

from notebooks.notebook_utils import HYPERSTYLE_PATHS, W_ENCODERS_PATHS, FINETUNED_MODELS, RESTYLE_E4E_MODELS, run_alignment
from utils.common import tensor2im
from utils.inference_utils import run_inversion
from utils.domain_adaptation_utils import run_domain_adaptation
from utils.model_utils import load_model, load_generator

class GeneratorTypes(Enum):
    TOONIFY = 1
    PIXAR = 2
    SKETCH = 3
    DISNEY_PRINESS = 4

class FaceEncoderGateway:
    def __init__(self) -> None:
        self.CODE_DIR = '../'
        self.generator_types = ['toonify', 'pixar', 'sketch', 'disney_princess']
        self.hyperstyle_path = "./pretrained_models/hyperstyle_ffhq.pt"
        self.w_encoder_path = "./pretrained_models/faces_w_encoder.pt"
        self.generator_paths = {k:f"./pretrained_models/{FINETUNED_MODELS[k]['name']}" for k in self.generator_types}
        self.restyle_e4e_path = os.path.join("./pretrained_models", RESTYLE_E4E_MODELS['name'])
        self.net = None
        self.opts = None
        self.restyle_e4e = None
        self.restyle_e4e_opts = None
        
    def load_models(self):
        if not os.path.exists(self.hyperstyle_path) or os.path.getsize(self.hyperstyle_path) < 1000000:
            raise ValueError("HyperStyle model was unable to be loaded correctly!")

        if not os.path.exists(self.w_encoder_path) or os.path.getsize(self.w_encoder_path) < 1000000:
            raise ValueError("WEncoder model was unable to be loaded correctly!")

        for x, path in self.generator_paths.items():
            if not os.path.exists(path):
                raise ValueError(f"Fine-tuned {x} model was unable to be loaded correctly!")
        
        if not os.path.exists(self.restyle_e4e_path):
            raise ValueError("ReStyle-e4e model was unable to be loaded correctly!")

        self.net, self.opts = load_model(self.hyperstyle_path, update_opts={"w_encoder_checkpoint_path": self.w_encoder_path})
        print('Model successfully loaded!')
        self.fine_tuned_generators = {k:load_generator(self.generator_paths[k]) for k in self.generator_types}
        print(f'Fine-tuned generators successfully loaded!')
        self.restyle_e4e, self.restyle_e4e_opts = load_model(self.restyle_e4e_path, is_restyle_encoder=True)
        print(f'ReStyle-e4e model successfully loaded!')

        self.restyle_e4e_opts.n_iters_per_batch = 5
        self.restyle_e4e_opts.resize_outputs = False
        self.opts.n_iters_per_batch = 5
        self.opts.resize_outputs = False

    def transform_image(self, image_path:str, selected_generator:GeneratorTypes = GeneratorTypes.TOONIFY):
        input_image = run_alignment(image_path)
        input_image.resize((256, 256))
        img_transforms = transforms.Compose([transforms.Resize((256, 256)), 
                                        transforms.ToTensor(),
                                        transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])])
        transformed_image = img_transforms(input_image)

        if selected_generator == GeneratorTypes.TOONIFY:
            fine_tuned_generator = self.fine_tuned_generators[self.generator_types[0]]
        elif selected_generator == GeneratorTypes.PIXAR:
            fine_tuned_generator = self.fine_tuned_generators[self.generator_types[1]]
        elif selected_generator == GeneratorTypes.SKETCH:
            fine_tuned_generator = self.fine_tuned_generators[self.generator_types[2]]
        elif selected_generator == GeneratorTypes.DISNEY_PRINESS:
            fine_tuned_generator = self.fine_tuned_generators[self.generator_types[3]]
        else:
            raise ValueError(f"Invalid generator type")

        with torch.no_grad():
            tic = time.time()
            result, _ = run_domain_adaptation(transformed_image.unsqueeze(0).cuda(), 
                                            self.net, 
                                            self.opts, 
                                            fine_tuned_generator, 
                                            self.restyle_e4e, 
                                            self.restyle_e4e_opts)
            toc = time.time()
            print('Inference took {:.4f} seconds.'.format(toc - tic))

        resize_amount = (256, 256) if self.opts.resize_outputs else (self.opts.output_size, self.opts.output_size)

        final_res = tensor2im(result[0]).resize(resize_amount)
        input_im = tensor2im(transformed_image).resize(resize_amount)
        res = np.concatenate([np.array(input_im), np.array(final_res)], axis=1)
        
        img_rgb = cv2.cvtColor(np.array(final_res), cv2.COLOR_RGB2BGR)
        _, image = cv2.imencode(".jpg", img_rgb)
        return image