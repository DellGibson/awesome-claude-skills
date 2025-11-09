# Pruebas de Aplicaciones Web

Kit de herramientas para interactuar y probar aplicaciones web locales usando Playwright. Soporta verificación de funcionalidad frontend, depuración de comportamiento de interfaz, captura de capturas de pantalla del navegador y visualización de registros del navegador.

## Descripción General

Para probar aplicaciones web locales, escribe scripts nativos de Playwright en Python.

## Configuración

Esta habilidad está diseñada para funcionar con Claude.ai, Claude Code y la API de Claude.

### Instalación

**Para Claude.ai:**
1. Haz clic en el ícono de habilidades (🧩) en tu interfaz de chat
2. Agrega esta habilidad desde el mercado o sube el archivo SKILL.md

**Para Claude Code:**
```bash
mkdir -p ~/.config/claude-code/skills/
cp -r webapp-testing ~/.config/claude-code/skills/
```

**Para la API de Claude:**
```python
import anthropic

client = anthropic.Anthropic(api_key="tu-clave-api")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    skills=["webapp-testing"],
    messages=[{"role": "user", "content": "Tu mensaje"}]
)
```

## Uso

Para iniciar un servidor, ejecuta primero `--help`, luego usa el asistente:

**Servidor único:**
```bash
python scripts/with_server.py --server "npm run dev" --port 5173 -- python tu_automatizacion.py
```

**Múltiples servidores (ej: backend + frontend):**
```bash
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python tu_automatizacion.py
```

Para crear un script de automatización, incluye solo lógica de Playwright (los servidores se gestionan automáticamente):
```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True) # Siempre lanza chromium en modo headless
    page = browser.new_page()
    page.goto('http://localhost:5173') # Servidor ya ejecutándose y listo
    page.wait_for_load_state('networkidle') # CRÍTICO: Espera a que se ejecute JS
    # ... tu lógica de automatización
    browser.close()
```

## Entradas y Salidas

**Entradas:** Varía según los requisitos de la tarea (consulta SKILL.md para más detalles)

**Salidas:** Resultados procesados según las especificaciones de la habilidad

## Limitaciones

- Requiere una configuración de entorno apropiada (consulta la sección de Configuración)
- El rendimiento depende de la complejidad de la entrada
- Consulta SKILL.md para restricciones específicas

## Licencia

Términos completos en LICENSE.txt

## Aprende Más

Para documentación completa de la habilidad, consulta [SKILL.md](./SKILL.md).
