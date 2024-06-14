# SmartStorage

Notre projet de fin d'études se concentre sur la création d'un drive personnel sécurisé dédié à la gestion des documents administratifs, enrichi d'une couche d'intelligence artificielle pour améliorer l'efficacité des recherches de données. Imaginons un utilisateur recevant un relevé d'imposition, il l’intègre à notre drive personnel via une interface web. Une fois ajouté, notre système utilise une IA pour analyser l'image et extraire les informations pertinentes, qui sont ensuite enregistrées pour une consultation future. Par exemple, en recherchant "numéro fiscal", l'IA identifie et présente non seulement le numéro correspondant, mais aussi la liste des documents associés.

![ComfyUI_00003__1](https://github.com/Yufu0/SmartStorage/assets/91423302/95d6b39b-4065-4694-8f2e-e715bf21e95c)

# Architecture

![Diagramme](https://github.com/Yufu0/SmartStorage/assets/91423302/3614eedd-4694-4c81-921c-876b554bd1fc)
![image](https://github.com/Yufu0/SmartStorage/assets/91423302/975b913a-034b-4a78-a295-a98d8888e63e)
![image](https://github.com/Yufu0/SmartStorage/assets/91423302/431219d9-e6b0-4fd7-b933-75cf81cd7c2c)


# Ollama
Il est extremenment recommandé d'avoir une machine avec un gpu pour avoir des performances acceptables avec les LLM.
Vous pouver : 
- installer Ollama sur votre machine en suivant les instructions sur le site officiel de Ollama : https://ollama.com/
- utiliser Ollama dans un docker:
    - sur Windows :
        - CUDA on WSL : https://docs.nvidia.com/cuda/wsl-user-guide/index.html#getting-started-with-cuda-on-wsl
    - sur Linux : 
        - NVIDIA Container Toolkit : https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html

# Environnement
```
KNOW_HOSTS_FILE=/usr/src/app/known_hosts

APP_USERNAME=username
APP_PASSWORD=$2y$10$NcsNf.jDGkuY6li0aC7Tw.5YvNxq2poeqe1GfCkrI7LflX3mBV./2
APP_PORT=4200

RAG_HOST=http://rag
RAG_PORT=8000

SFTP_HOST=sftp
SFTP_PORT=22
SFTP_USERNAME=smartstorage
SFTP_PASSWORD=password

MONGO_INITDB_ROOT_USERNAME_APP=root
MONGO_INITDB_ROOT_PASSWORD_APP=root
MONGO_INITDB_DATABASE_APP=smartstorage

MONGO_HOST=mongodb
MONGO_PORT=27017
MONGO_USER=root
MONGO_PASS=root

MONGO_DB=smartstorage
MONGO_COLLECTION_FILES=files
MONGO_COLLECTION_LOGS=logs
MONGO_COLLECTION_USERS=users
MONGO_COLLECTION_TAGS=tags

COOKIE_NAME=granola

JWT_SECRET=smartStorageSecretKey
JWT_EXPIRATION_MS=1200000

OLLAMA_URL=http://ollama:11434
OLLAMA_MODEL=llama3
OLLAMA_EMBEDDING=mxbai-embed-large

OLLAMA_MAX_LOADED_MODELS=2
OLLAMA_HOST=0.0.0.0

TEXT_SPLITTER_CHUNK_SIZE=2000
TEXT_SPLITTER_OVERLAP_SIZE=100

MONGODB_URI=mongodb://root:root@rag-mongodb:27017/?directConnection=true
MONGODB_DB=rag_db
MONGODB_COLLECTION=documents

MONGODB_INITDB_ROOT_USERNAME=root
MONGODB_INITDB_ROOT_PASSWORD=root

BACKEND_URL=*
```
# Authors

Célio Bueri @Yufu0 (buericelio@cy-tech.fr) <br/>
Rémy Ollivier @PingouinDuTurfu (ollivierre@cy-tech.fr)
