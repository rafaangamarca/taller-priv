# 🕵️‍♂️ Taller: ¿Cuánto saben de ti sin preguntarte nada?
> **Módulos:** DAW + DAM + ASIR | **Duración:** 2 Horas | **Metodología:** Lab First (Código -> Experimentación -> Reflexión)

Este repositorio contiene el material técnico, código fuente, guía pedagógica y retos CTF para impartir el taller práctico sobre privacidad, datos expuestos por navegadores, fingerprinting e inferencia de perfiles.

---

## 🎯 Objetivos
1. **Evitar la charla teórica pasiva:** Descubrimiento mediante manipulación de código real.
2. **Conectar tres perfiles técnicos:**
   - **DAW:** JS Client APIs, DOM, storage, cookies, fingerprinting.
   - **DAM:** Permisos, identificación de dispositivos, APIs de cliente, sensores.
   - **ASIR:** Tráfico de red, análisis de cabeceras HTTP, sockets, servidor e inspección con `curl`/logs.

---

## 📁 Estructura del Repositorio

```text
taller-privacidad-fp/
├── README.md
├── lab/
│   ├── index.html     # Interfaz simple para visualización de métricas
│   ├── app.js         # Lógica client-side (Fingerprinting, Web Crypto API, Storage)
│   └── servidor.py    # Servidor HTTP en Python para capturar cabeceras y peticiones

```

---

## 🚀 Guía de Inicio Rápido

1. Clone o descargue este repositorio.
2. Inicie el servidor local ejecutando en su terminal dentro de la carpeta `lab/`:
   ```bash
   python3 servidor.py
   ```
3. Abra su navegador en `http://localhost:8000`.

---

## 📢 Cierre y Reflexión: Inferencia mediante IA

```text
Navegador ──► Dispositivo ──► Red ──► Servidor ──► Logs ──► Cookies ──► Perfil ──► Inferencias
```

La conclusión del taller demuestra que la recolección masiva de datos individuales (hora, resolución, latencia) no requiere identificar nominalmente al alumno para **inferir patrones de comportamiento** mediante modelos analíticos o algoritmos de Machine Learning.
