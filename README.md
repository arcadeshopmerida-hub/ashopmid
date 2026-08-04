# Arcade Shop Mérida — Sitio Web

Sitio de Arcade Shop Mérida, taller de muebles arcade en Mérida, Yucatán.

---

## Las páginas

| Archivo | De qué es |
|---|---|
| `index.html` | Inicio — la diferencia entre pedestal y gabinete, los 5 equipos, tabla comparativa, quiénes somos y dudas comunes |
| `retro-clasicos.html` | Pedestal Clásicos · 2 Jugadores |
| `familiar.html` | Pedestal Familiar · 4 Jugadores |
| `arcade-ps4.html` | Pedestal con PS4 · Modernos y Retro |
| `comercial.html` | Pedestal Comercial con Monedero |
| `arcade-clasico-pantalla.html` | Gabinete Clásico con Pantalla |
| `servicios.html` | Servicio técnico |
| `404.html` | La que sale si alguien llega a un enlace roto |

> **Ojo con los nombres de archivo.** Los nombres que ve el cliente cambiaron,
> pero los archivos se llaman igual que siempre a propósito: si los renombras,
> se rompen los enlaces que ya compartiste y lo que Google tenga indexado.

Las 8 páginas comparten dos archivos:

- **`assets/style.css`** — todos los colores, tamaños y el diseño
- **`assets/site.js`** — el menú desplegable y el carrusel de fotos

Si cambias algo ahí, se refleja en las 8 al mismo tiempo.

---

## Cómo navega el cliente

- **Menú de arriba.** El botón "Equipos" abre una lista separada en dos grupos:
  **Pedestales** (los que se conectan a tu tele) y **Gabinetes** (los que traen
  pantalla). En celular todo se abre con el botón de tres líneas.
- **Tabla comparativa** en `index.html#comparar`: los 5 equipos lado a lado.
- **"Otros equipos"** al final de cada página de producto, para brincar de un
  modelo a otro sin volver al menú.

---

## Los PDF

En la carpeta `pdf/` hay **14 archivos ya hechos**: dos por cada sección del
sitio. Son los que le mandas por WhatsApp a un cliente para que no tenga que
entrar a la web.

Por cada equipo hay:

- **Ficha técnica** — 2 o 3 hojas. Los datos duros: medidas, jugadores,
  botones, conexión, precio, todo lo que incluye, y un dibujo a escala que
  compara el equipo con una persona de 1.70 m.
- **Documento completo** — 3 a 6 hojas. La página entera pasada a papel, sin el
  menú, con las fotos en miniatura.

Los dos terminan con tus datos de contacto, así que quien los reciba se queda
con tu WhatsApp aunque cierre el archivo y lo abra semanas después.

En la web, cada página ofrece los dos como descarga directa. Ya no se arma nada
en el momento ni se necesita internet extra: son archivos que se bajan y ya.

> **Importante:** los PDF se generan a partir de las páginas. Si cambias un
> texto, un precio o agregas fotos, **los PDF no se actualizan solos** — hay que
> volver a generarlos. Mientras no lo hagas, la web dirá una cosa y el PDF otra.

Pesan entre 25 KB y 630 KB, así que se mandan sin problema por WhatsApp.

---

## Cómo agregar fotos a una galería

Cada carpeta dentro de `assets/gallery/` alimenta el carrusel de su página. Se
detectan solas, no hay que tocar código:

1. Guarda tus fotos en `.jpg`.
2. El carrusel usa proporción vertical **3:4** — lo ideal es **900 × 1200 px**.
   Si tu foto tiene otra proporción no pasa nada: el carrusel rellena los lados
   con una copia difuminada de la misma foto.
3. Nómbralas `foto-01.jpg`, `foto-02.jpg`... hasta `foto-12.jpg`.
4. Súbelas a la carpeta que corresponda.
5. No tienes que subir las 12. Si subes 4, muestra esas 4.

```
assets/gallery/
├── retro/            → Pedestal Clásicos
├── familiar/         → Pedestal Familiar
├── ps4/              → Pedestal con PS4
├── comercial/        → Pedestal Comercial
└── arcade-pantalla/  → Gabinete con Pantalla
```

---

## Las vistas previas de redes sociales

Cuando alguien comparte un enlace en WhatsApp o Facebook, sale una imagen. Son
las `assets/og-*.jpg`, una por página, de 1200 × 630 px, y **llevan el precio
escrito encima**.

Si subes un precio, acuérdate de que vive en tres lugares:

1. La página (`.html`)
2. La imagen de vista previa (`assets/og-*.jpg`), que lo lleva escrito encima
3. Los PDF de la carpeta `pdf/`, que hay que volver a generar

Si te saltas alguno, el precio viejo va a seguir apareciendo por ahí.

---

## Estructura de carpetas

```
├── index.html                     ← inicio
├── retro-clasicos.html
├── familiar.html
├── arcade-ps4.html
├── comercial.html
├── arcade-clasico-pantalla.html
├── servicios.html
├── 404.html
├── robots.txt                     ← le dice a Google que puede indexar todo
├── sitemap.xml                    ← la lista de páginas, para Google
├── pdf/                           ← los 14 PDF listos para mandar
└── assets/
    ├── style.css                  ← todo el diseño
    ├── site.js                    ← menú y carrusel
    ├── favicon-16/32/48.png, apple-touch-icon.png
    ├── og-*.jpg                   ← vistas previas para redes
    └── gallery/                   ← las fotos de cada equipo
```

---

## Cómo cambiar los colores

Están todos juntos al principio de `assets/style.css`, en el bloque `:root`.
Cada página además tiene su propio color de acento, declarado en su `<head>`:

```html
<style>:root{ --accent:#d81b60; --accent-soft:#fce7f0; }</style>
```

Los colores elegidos se leen bien (pasan el mínimo de contraste de 4.5:1). Si
los cambias, conviene revisar que el texto siga legible.

El fondo lleva una cuadrícula muy tenue que se desvanece hacia abajo. Está en
la sección 17 del CSS, en `body::before`. Para quitarla, borra ese bloque.

---

## Si cambias de dominio

Hoy el sitio vive en **https://arcadeshopmerida-hub.github.io/ashopmid/**

Si algún día conectas un dominio propio, hay que cambiar esa dirección en:

- Las etiquetas `canonical`, `og:url` y `og:image` de cada página
- Los datos estructurados (`application/ld+json`) de cada página
- `robots.txt` y `sitemap.xml`

---

## Contacto del negocio

- WhatsApp: [999 453 0828](https://wa.me/529994530828)
- Facebook: [Arcade Shop Mérida](https://www.facebook.com/arcadeShopMerida/)
- Mérida, Yucatán, México
