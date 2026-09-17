// ==========================================
// TALLER: PRIVACIDAD Y FINGERPRINTING
// VERSIÓN FINAL - MÁXIMA INFORMACIÓN
// ==========================================

async function obtenerHuellaCompleta() {

    // ====================== HELPERS ======================
    function getWebGL() {
        try {
            const c = document.createElement('canvas');
            const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
            if (!gl) return null;
            const debug = gl.getExtension('WEBGL_debug_renderer_info');
            return {
                vendor: gl.getParameter(gl.VENDOR),
                renderer: gl.getParameter(gl.RENDERER),
                unmaskedVendor: debug ? gl.getParameter(debug.UNMASKED_VENDOR_WEBGL) : null,
                unmaskedRenderer: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : null,
                version: gl.getParameter(gl.VERSION)
            };
        } catch { return null; }
    }

    function getCanvas() {
        try {
            const c = document.createElement('canvas');
            const ctx = c.getContext('2d');
            c.width = 280; c.height = 60;
            ctx.textBaseline = "top";
            ctx.font = "14px Arial";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = "#069";
            ctx.fillText("Privacidad DAW 🍪", 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText("Privacidad DAW 🍪", 4, 17);
            return c.toDataURL().slice(-65);
        } catch { return "Error"; }
    }

    async function getAudio() {
        try {
            const AC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
            if (!AC) return null;
            const ctx = new AC(1, 44100, 44100);
            const osc = ctx.createOscillator();
            const comp = ctx.createDynamicsCompressor();
            osc.connect(comp);
            comp.connect(ctx.destination);
            osc.start(0);
            const buf = await ctx.startRendering();
            const data = buf.getChannelData(0);
            let sum = 0;
            for (let i = 4500; i < 5000; i++) sum += Math.abs(data[i]);
            return {
                hash: sum.toFixed(8),
                baseLatency: (window.AudioContext ? new AudioContext().baseLatency : null)
            };
        } catch { return null; }
    }

    function getFonts() {
        const testFonts = ["Arial","Arial Black","Calibri","Cambria","Comic Sans MS","Consolas",
            "Courier New","Georgia","Impact","Segoe UI","Tahoma","Times New Roman",
            "Trebuchet MS","Verdana","Roboto","Open Sans","Lato","Montserrat"];
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const text = "mmmmmmmmmmlli";
        const detected = [];
        ctx.font = "72px monospace";
        const base = ctx.measureText(text).width;
        testFonts.forEach(f => {
            ctx.font = `72px '${f}', monospace`;
            if (ctx.measureText(text).width !== base) detected.push(f);
        });
        return detected;
    }

    function getMediaQueries() {
        return {
            colorGamut: matchMedia("(color-gamut: rec2020)").matches ? "rec2020" :
                        matchMedia("(color-gamut: p3)").matches ? "p3" : "srgb",
            dynamicRange: matchMedia("(dynamic-range: high)").matches ? "HDR" : "Standard",
            pointer: matchMedia("(pointer: fine)").matches ? "fine" :
                     matchMedia("(pointer: coarse)").matches ? "coarse" : "none",
            hover: matchMedia("(hover: hover)").matches,
            invertedColors: matchMedia("(inverted-colors: inverted)").matches,
            forcedColors: matchMedia("(forced-colors: active)").matches,
            prefersReducedData: matchMedia("(prefers-reduced-data: reduce)").matches,
            displayMode: matchMedia("(display-mode: standalone)").matches ? "standalone" :
                         matchMedia("(display-mode: fullscreen)").matches ? "fullscreen" :
                         matchMedia("(display-mode: minimal-ui)").matches ? "minimal-ui" : "browser"
        };
    }

    // WebRTC - IPs locales
    function getWebRTCIPs() {
        return new Promise(resolve => {
            const ips = new Set();
            const pc = new RTCPeerConnection({ iceServers: [] });
            pc.createDataChannel("");
            pc.createOffer().then(offer => pc.setLocalDescription(offer));
            pc.onicecandidate = (e) => {
                if (!e.candidate) {
                    pc.close();
                    resolve([...ips]);
                    return;
                }
                const ip = e.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);
                if (ip) ips.add(ip[1]);
            };
            setTimeout(() => {
                pc.close();
                resolve([...ips]);
            }, 2000);
        });
    }

    // WebGPU
    async function getWebGPU() {
        try {
            if (!navigator.gpu) return null;
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) return null;
            const info = adapter.info || {};
            return {
                vendor: info.vendor || "N/A",
                architecture: info.architecture || "N/A",
                device: info.device || "N/A",
                description: info.description || "N/A"
            };
        } catch { return null; }
    }

    // Keyboard Layout
    async function getKeyboardLayout() {
        try {
            if (!navigator.keyboard || !navigator.keyboard.getLayoutMap) return null;
            const map = await navigator.keyboard.getLayoutMap();
            const keys = ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY"];
            const layout = {};
            keys.forEach(k => layout[k] = map.get(k));
            return layout;
        } catch { return null; }
    }

    // Sensores
    function getSensors() {
        return {
            Accelerometer: "Accelerometer" in window,
            Gyroscope: "Gyroscope" in window,
            Magnetometer: "Magnetometer" in window,
            AbsoluteOrientationSensor: "AbsoluteOrientationSensor" in window,
            LinearAccelerationSensor: "LinearAccelerationSensor" in window
        };
    }

    // ====================== RECOGIDA ======================
    const [webgl, audioData, voices, permissions, localIPs, webgpu, keyboard] = await Promise.all([
        getWebGL(),
        getAudio(),
        new Promise(res => {
            let v = speechSynthesis.getVoices();
            if (v.length) res(v.map(x => `${x.name} (${x.lang})`));
            else {
                speechSynthesis.onvoiceschanged = () => res(speechSynthesis.getVoices().map(x => `${x.name} (${x.lang})`));
                setTimeout(() => res(speechSynthesis.getVoices().map(x => `${x.name} (${x.lang})`)), 600);
            }
        }),
        (async () => {
            const list = ["notifications","geolocation","camera","microphone","persistent-storage","clipboard-read"];
            const result = {};
            for (const p of list) {
                try {
                    result[p] = (await navigator.permissions.query({name: p})).state;
                } catch { result[p] = "no soportado"; }
            }
            return result;
        })(),
        getWebRTCIPs(),
        getWebGPU(),
        getKeyboardLayout()
    ]);

    let battery = null;
    try {
        if (navigator.getBattery) {
            const b = await navigator.getBattery();
            battery = {
                nivel: Math.round(b.level * 100) + "%",
                cargando: b.charging ? "Sí" : "No"
            };
        }
    } catch {}

    let storage = null;
    try {
        if (navigator.storage?.estimate) {
            const est = await navigator.storage.estimate();
            storage = {
                usado: (est.usage / 1024 / 1024).toFixed(1) + " MB",
                total: (est.quota / 1024 / 1024 / 1024).toFixed(2) + " GB"
            };
        }
    } catch {}

    let mediaDevices = null;
    try {
        const devs = await navigator.mediaDevices.enumerateDevices();
        mediaDevices = {
            total: devs.length,
            camaras: devs.filter(d => d.kind === "videoinput").length,
            micros: devs.filter(d => d.kind === "audioinput").length,
            altavoces: devs.filter(d => d.kind === "audiooutput").length
        };
    } catch {}

    const mq = getMediaQueries();
    const gamepads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(g => g).map(g => g.id) : [];

    let clientHints = null;
    try {
        if (navigator.userAgentData) {
            clientHints = await navigator.userAgentData.getHighEntropyValues([
                "architecture", "bitness", "model", "platformVersion"
            ]);
        }
    } catch {}

    // ====================== RESULTADO FINAL ======================
    return {
        loMasIdentificativo: {
            gpuReal: webgl?.unmaskedRenderer || webgl?.renderer || "No disponible",
            vendorGPU: webgl?.unmaskedVendor || webgl?.vendor || "No disponible",
            canvas: getCanvas(),
            audioHash: audioData?.hash || "No disponible",
            audioLatency: audioData?.baseLatency ?? "N/A",
            fuentes: getFonts()
        },

        hardware: {
            cpu: navigator.hardwareConcurrency || "N/A",
            ram: navigator.deviceMemory ? `~${navigator.deviceMemory} GB` : "N/A",
            touchPoints: navigator.maxTouchPoints || 0,
            resolucion: `${screen.width}×${screen.height}`,
            pixelRatio: window.devicePixelRatio,
            colorDepth: screen.colorDepth + "-bit",
            multiMonitor: screen.isExtended ? "Sí" : "No / No detectado"
        },

        sorprendente: {
            tipoPuntero: mq.pointer,
            hover: mq.hover ? "Sí" : "No",
            colorGamut: mq.colorGamut,
            hdr: mq.dynamicRange,
            displayMode: mq.displayMode,
            chromeVentana: {
                inner: `${innerWidth}×${innerHeight}`,
                outer: `${outerWidth}×${outerHeight}`,
                diferenciaAlto: outerHeight - innerHeight
            },
            ipsLocales: localIPs.length ? localIPs : ["No detectadas / Bloqueado"],
            webgpu: webgpu || "No disponible",
            teclado: keyboard || "No disponible",
            sensores: getSensors(),
            bateria: battery || "No disponible",
            almacenamiento: storage || "No disponible",
            mediaDevices: mediaDevices || "No disponible",
            gamepads: gamepads.length ? gamepads : ["Ninguno"],
            voces: voices.slice(0, 10),
            totalVoces: voices.length,
            permisos: permissions,
            historyLength: history.length
        },

        sistema: {
            plataforma: navigator.platform,
            idioma: navigator.language,
            zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone,
            webdriver: navigator.webdriver ? "⚠️ Posible automatización" : "Normal",
            clientHints: clientHints || "No disponible"
        },

        preferencias: {
            tema: matchMedia("(prefers-color-scheme: dark)").matches ? "Oscuro" : "Claro",
            movimientoReducido: matchMedia("(prefers-reduced-motion: reduce)").matches,
            contrasteAlto: matchMedia("(prefers-contrast: more)").matches,
            coloresInvertidos: mq.invertedColors,
            forcedColors: mq.forcedColors
        }
    };
}

// ====================== MOSTRAR ======================
async function mostrarHuella() {
    const d = await obtenerHuellaCompleta();

    console.clear();
    console.log("%c🔥 HUELLA DIGITAL COMPLETA - VERSIÓN FINAL", "font-size:18px; font-weight:bold; color:#00f2ff");

    console.log("\n%c💥 LO MÁS IDENTIFICATIVO", "font-size:14px; color:#ff6b6b; font-weight:bold");
    console.log(d.loMasIdentificativo);

    console.log("\n%c🎯 COSAS SORPRENDENTES", "font-size:14px; color:#f9ca24; font-weight:bold");
    console.log(d.sorprendente);

    console.log("\n%c💻 HARDWARE", "font-size:14px; color:#4ecdc4; font-weight:bold");
    console.log(d.hardware);

    console.log("\n%c🖥️ SISTEMA + PREFERENCIAS", "font-size:14px; color:#a29bfe; font-weight:bold");
    console.log({ ...d.sistema, preferencias: d.preferencias });

    // HTML legible
    const el = document.getElementById("data-display");
    if (el) {
        el.innerHTML = `<pre style="font-size:13px; line-height:1.45; white-space:pre-wrap; font-family:monospace">
<span style="color:#ff6b6b;font-weight:bold">💥 LO MÁS IDENTIFICATIVO</span>
GPU real:        ${d.loMasIdentificativo.gpuReal}
Vendor GPU:      ${d.loMasIdentificativo.vendorGPU}
Canvas:          ${d.loMasIdentificativo.canvas}
Audio Hash:      ${d.loMasIdentificativo.audioHash}
Audio Latency:   ${d.loMasIdentificativo.audioLatency}
Fuentes:         ${d.loMasIdentificativo.fuentes.join(", ")}

<span style="color:#f9ca24;font-weight:bold">🎯 COSAS SORPRENDENTES</span>
Tipo puntero:    ${d.sorprendente.tipoPuntero}
Hover:           ${d.sorprendente.hover}
Color Gamut:     ${d.sorprendente.colorGamut}
HDR:             ${d.sorprendente.hdr}
Display Mode:    ${d.sorprendente.displayMode}
IPs locales:     ${d.sorprendente.ipsLocales.join(", ")}
WebGPU:          ${JSON.stringify(d.sorprendente.webgpu)}
Teclado:         ${JSON.stringify(d.sorprendente.teclado)}
Sensores:        ${JSON.stringify(d.sorprendente.sensores)}
Batería:         ${JSON.stringify(d.sorprendente.bateria)}
Almacenamiento:  ${JSON.stringify(d.sorprendente.almacenamiento)}
Media Devices:   ${JSON.stringify(d.sorprendente.mediaDevices)}
Gamepads:        ${d.sorprendente.gamepads.join(" | ")}
Voces (${d.sorprendente.totalVoces}):
${d.sorprendente.voces.map(v => "   • " + v).join("\n")}
Permisos:        ${JSON.stringify(d.sorprendente.permisos, null, 2)}
History length:  ${d.sorprendente.historyLength}
Chrome ventana:  ${JSON.stringify(d.sorprendente.chromeVentana)}

<span style="color:#4ecdc4;font-weight:bold">💻 HARDWARE</span>
${JSON.stringify(d.hardware, null, 2)}

<span style="color:#a29bfe;font-weight:bold">🖥️ SISTEMA</span>
${JSON.stringify(d.sistema, null, 2)}

<span style="color:#fd79a8;font-weight:bold">🎨 PREFERENCIAS</span>
${JSON.stringify(d.preferencias, null, 2)}
</pre>`;
    }

    // Hash final
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(d)));
    const hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

    console.log("\n%c🔑 HASH FINAL (SHA-256)", "font-size:14px; color:#00ff88; font-weight:bold");
    console.log(hash);

    const hashEl = document.getElementById("hash-display");
    if (hashEl) hashEl.textContent = hash;

    const prev = localStorage.getItem("usuario_hash");
    if (prev === hash) {
        console.log("%c✅ TE HEMOS RECONOCIDO (misma huella)", "color:#00ff88; font-weight:bold");
        alert("¡Te hemos reconocido! Tu huella digital coincide.");
    } else if (prev) {
        console.log("%c⚠️ La huella ha cambiado desde la última visita", "color:#ffaa00");
    }

    localStorage.setItem("usuario_hash", hash);
    localStorage.setItem("ultima_visita", new Date().toISOString());
}

// Ejecutar
mostrarHuella();