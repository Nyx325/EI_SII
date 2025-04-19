# Evidencia Integradora Sistemas Inteligentes

Un proyecto basado en una trivia que hace preguntas sobre figuras
geométricas y para responder el usuario debe dibujar la figura correspondiente
haciendo uso de reconocimiento de imágenes con python para esto

## Cómo desplegar

### Prerequisitos

- Entorno de ejecución de Javascript como [nodejs](https://nodejs.org/en)
- Python `3.8.20` o `3.8.10`

### Ejecutar backend

Una vez preparado python para el proyecto pondremos en marcha el
backend considerando que se encuentran en la raíz del proyecto

Comprobar versión de python

```bash
python --version
```

Instalar las dependencias

```bash
## Para python 3.8.20
pip install -r backend/requirements.txt

## Para python 3.8.10
pip install -r backend/requirements2.txt
```

Ejecutar el backend

```bash
cd backend
flask run
```

### Ejecutar frontend

Considerando nuevamente que se está en la raíz del proyecto

Instalar las dependencias

```bash
cd frontend
npm install
```

Ejecutar el frontend

```bash
npm run dev
```

Debería mostrarse algo como esto en la terminal:

```bash
  VITE v6.3.2  ready in 225 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Entrar a la url dada, en este caso `http://localhost:5173/`
