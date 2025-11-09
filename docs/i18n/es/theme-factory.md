# Fábrica de Temas

Kit de herramientas para estilizar artefactos con un tema. Estos artefactos pueden ser diapositivas, documentos, informes, páginas de destino HTML, etc. Hay 10 temas preestablecidos con colores/fuentes que puedes aplicar a cualquier artefacto que se haya creado, o puedes generar un nuevo tema sobre la marcha.

## Descripción General

Esta habilidad proporciona una colección curada de temas profesionales de fuentes y colores, cada uno con paletas de colores cuidadosamente seleccionadas y combinaciones de fuentes. Una vez que se elige un tema, se puede aplicar a cualquier artefacto.

## Configuración

Esta habilidad está diseñada para funcionar con Claude.ai, Claude Code y la API de Claude.

### Instalación

**Para Claude.ai:**
1. Haz clic en el ícono de habilidades (🧩) en tu interfaz de chat
2. Agrega esta habilidad desde el mercado o sube el archivo SKILL.md

**Para Claude Code:**
```bash
mkdir -p ~/.config/claude-code/skills/
cp -r theme-factory ~/.config/claude-code/skills/
```

**Para la API de Claude:**
```python
import anthropic

client = anthropic.Anthropic(api_key="tu-clave-api")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    skills=["theme-factory"],
    messages=[{"role": "user", "content": "Tu mensaje"}]
)
```

## Uso

Para aplicar estilo a una presentación de diapositivas u otro artefacto:

1. **Mostrar la galería de temas**: Muestra el archivo `theme-showcase.pdf` para permitir a los usuarios ver todos los temas disponibles visualmente. No hagas modificaciones; simplemente muestra el archivo para visualización.
2. **Solicita su elección**: Pregunta qué tema aplicar a la presentación
3. **Espera la selección**: Obtén confirmación explícita sobre el tema elegido
4. **Aplica el tema**: Una vez que se haya elegido un tema, aplica los colores y fuentes del tema seleccionado a la presentación/artefacto

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
