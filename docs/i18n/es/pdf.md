# PDF

Kit de herramientas integral para manipulación de PDF que permite extraer texto y tablas, crear nuevos PDFs, fusionar/dividir documentos y manejar formularios. Cuando Claude necesite completar un formulario PDF o procesar, generar o analizar documentos PDF programáticamente a escala.

## Descripción General

Esta guía cubre operaciones esenciales de procesamiento de PDF usando bibliotecas de Python y herramientas de línea de comandos. Para características avanzadas, bibliotecas de JavaScript y ejemplos detallados, consulta reference.md. Si necesitas completar un formulario PDF, lee forms.md y sigue sus instrucciones.

## Configuración

Esta habilidad está diseñada para funcionar con Claude.ai, Claude Code y la API de Claude.

### Instalación

**Para Claude.ai:**
1. Haz clic en el ícono de habilidades (🧩) en tu interfaz de chat
2. Agrega esta habilidad desde el mercado o sube el archivo SKILL.md

**Para Claude Code:**
```bash
mkdir -p ~/.config/claude-code/skills/
cp -r pdf ~/.config/claude-code/skills/
```

**Para la API de Claude:**
```python
import anthropic

client = anthropic.Anthropic(api_key="tu-clave-api")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    skills=["pdf"],
    messages=[{"role": "user", "content": "Tu mensaje"}]
)
```

## Uso

Activa esta habilidad cuando trabajes en tareas relacionadas con PDF.

Claude utilizará automáticamente las capacidades de esta habilidad cuando sea relevante para tu tarea.

Para instrucciones de uso detalladas, consulta [SKILL.md](./SKILL.md).

## Entradas y Salidas

**Entradas:** Varía según los requisitos de la tarea (consulta SKILL.md para más detalles)

**Salidas:** Resultados procesados según las especificaciones de la habilidad

## Limitaciones

- Requiere una configuración de entorno apropiada (consulta la sección de Configuración)
- El rendimiento depende de la complejidad de la entrada
- Consulta SKILL.md para restricciones específicas

## Licencia

Propietaria. LICENSE.txt tiene los términos completos

## Aprende Más

Para documentación completa de la habilidad, consulta [SKILL.md](./SKILL.md).
