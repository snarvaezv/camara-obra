# Cámara de Obra · Lucía & Co.

App web (PWA) para el registro fotográfico de obra. Estampa en cada foto el título, la hora, la fecha, la ubicación, el clima y las coordenadas, y guarda el archivo con el formato que lee el Gestor de Supervisión:

`AAAAMMDD_HHMMSS_<lugar>_Título-<título>.jpg`

El título también va dentro de los metadatos de la foto (XPTitle / ImageDescription).

Uso: abrir https://snarvaezv.github.io/camara-obra/ en Safari del iPhone → Compartir → Agregar a inicio.

Incluye piexifjs 1.0.6 (MIT, © 2014 Hiroaki Matoba).

## Estable y pruebas (desde v1.24)
- Estable (compañeros): https://snarvaezv.github.io/camara-obra/
- Pruebas (solo Sebas): https://snarvaezv.github.io/camara-obra/pruebas/

La copia de pruebas guarda sus títulos, ajustes y fotos pendientes aparte (no toca los de la estable) y comparte el lector de texto (`ocr/`). Los cambios nuevos se suben primero a `pruebas/`; cuando Sebas los aprueba se copian a la raíz.
