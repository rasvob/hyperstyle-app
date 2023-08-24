FROM pytorch/pytorch:1.10.0-cuda11.3-cudnn8-devel as wspace
ADD . /workspace

FROM wspace as apt-build
RUN apt-key del 7fa2af80
RUN apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/3bf863cc.pub
RUN apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu1804/x86_64/7fa2af80.pub
RUN apt update -y && apt install -y libgtk2.0-dev vim cmake

FROM apt-build as pip-build
RUN pip install uvicorn==0.16.0 fastapi==0.70.1 opencv-python==4.2.0.34 numpy==1.18.4 matplotlib==3.2.1 pillow==7.1.2 ninja==1.10.2.3 scipy==1.4.1 python-multipart dlib

WORKDIR /workspace
EXPOSE 9000
CMD ["uvicorn", "main:app", "--log-level", "debug", "--host", "0.0.0.0", "--port", "9000", "--ssl-keyfile", "./hyperfei-frontend/certs/hyperfei.key", "--ssl-certfile", "./hyperfei-frontend/certs/hyperfei.crt"]
# ENTRYPOINT ["/bin/bash"]
# --ssl-keyfile ./hyperfei-frontend/certs/MyKey.key  --ssl-certfile ./hyperfei-frontend/certs/MyCertificate.crt