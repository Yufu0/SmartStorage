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

# Authors

Célio Bueri @Yufu0 (buericelio@cy-tech.fr) <br/>
Rémy Ollivier @PingouinDuTurfu (ollivierre@cy-tech.fr)
