# Descargador de Videos

Descarga videos de YouTube y otras plataformas para visualización sin conexión, edición o archivo. Maneja varios formatos y opciones de calidad.

## Descripción General

Esta habilidad descarga videos de YouTube y otras plataformas directamente a tu computadora.

## Configuración

Esta habilidad está diseñada para funcionar con Claude.ai, Claude Code y la API de Claude.

### Instalación

**Para Claude.ai:**
1. Haz clic en el ícono de habilidades (🧩) en tu interfaz de chat
2. Agrega esta habilidad desde el mercado o sube el archivo SKILL.md

**Para Claude Code:**
```bash
mkdir -p ~/.config/claude-code/skills/
cp -r video-downloader ~/.config/claude-code/skills/
```

**Para la API de Claude:**
```python
import anthropic

client = anthropic.Anthropic(api_key="tu-clave-api")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    skills=["video-downloader"],
    messages=[{"role": "user", "content": "Tu mensaje"}]
)
```

## Uso

### Descarga Básica

```
Descarga este video de YouTube: https://youtube.com/watch?v=...
```

```
Descarga este video en calidad 1080p
```

## Entradas y Salidas

**Entradas:** Varía según los requisitos de la tarea (consulta SKILL.md para más detalles)

**Salidas:** Resultados procesados según las especificaciones de la habilidad

## Limitaciones

- Requiere una configuración de entorno apropiada (consulta la sección de Configuración)
- El rendimiento depende de la complejidad de la entrada
- Consulta SKILL.md para restricciones específicas

## Licencia

Ver LICENSE.txt

## Aprende Más

Para documentación completa de la habilidad, consulta [SKILL.md](./SKILL.md).
