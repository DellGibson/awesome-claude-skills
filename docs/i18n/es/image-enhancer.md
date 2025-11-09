# Mejorador de Imágenes

Mejora la calidad de imágenes, especialmente capturas de pantalla, aumentando la resolución, nitidez y claridad. Perfecto para preparar imágenes para presentaciones, documentación o publicaciones en redes sociales.

## Descripción General

Esta habilidad toma tus imágenes y capturas de pantalla y las hace lucir mejor: más nítidas, claras y profesionales.

## Configuración

Esta habilidad está diseñada para funcionar con Claude.ai, Claude Code y la API de Claude.

### Instalación

**Para Claude.ai:**
1. Haz clic en el ícono de habilidades (🧩) en tu interfaz de chat
2. Agrega esta habilidad desde el mercado o sube el archivo SKILL.md

**Para Claude Code:**
```bash
mkdir -p ~/.config/claude-code/skills/
cp -r image-enhancer ~/.config/claude-code/skills/
```

**Para la API de Claude:**
```python
import anthropic

client = anthropic.Anthropic(api_key="tu-clave-api")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    skills=["image-enhancer"],
    messages=[{"role": "user", "content": "Tu mensaje"}]
)
```

## Uso

### Mejora Básica

```
Mejora la calidad de imagen de captura.png
```

```
Mejora todas las imágenes en esta carpeta
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
