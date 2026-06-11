# 🔧 Mejoras para flyit-aircraft-publisher Skill

## Problemas encontrados y soluciones

### 1. ❌ No consultaba por fotos principales
**Problema:** El skill asumía las primeras 2 fotos sin preguntar
**Solución:** 
```
PASO 1 MEJORADO:
- Mostrar todas las fotos disponibles en miniatura
- Preguntar: "¿Cuál es la foto principal (para el grid)?"
- Preguntar: "¿Cuál es la foto hover (para pasar el mouse)?"
- Permitir que el usuario seleccione por número
```

### 2. ❌ Solo subía 2 fotos
**Problema:** Solo copiaba c340-main.jpg y c340-hover.jpg
**Solución:**
```
PASO 2 MEJORADO:
- Copiar TODAS las fotos de la carpeta fotos/ a assets/images/
- Renombrar cada una con patrón: {modelo}-{numero}.jpg
- Mantener orden secuencial en galería
```

### 3. ❌ Mostraba matrícula en catálogo de importación
**Problema:** En importar-catalogo.html mostraba "Cessna 340 - CX-BVC"
**Solución:**
```
Detectar si catalog == "import":
  - Tarjeta en catálogo: NO mostrar matrícula → "Cessna 340"
  - Página de detalle: NO mostrar matrícula en ningún lado
  - Meta tags OpenGraph:
    * og:title: "Cessna 340 - A Importar" (SIN matrícula)
    * og:description: SIN matrícula
  - <title> en navegador: puede tener matrícula (SEO interno, no público)
  - La matrícula permanece en base de datos (interna/admin)
```

### 4. ❌ Contactos públicos en web
**Problema:** Mostraba info de Álabe Servicios en página pública
**Solución:**
```
Crear estructura:
- data/contacts.json (INTERNO - no visible en web pública)
- En página de detalle:
  - Mostrar: "¿Interesado? Contáctanos por WhatsApp"
  - NO mostrar: nombre, teléfono, email del vendedor
  - Guardar contactos SOLO en data/contacts.json
```

### 5. ❌ Filtro mostraba todos los países
**Problema:** Filtro de ubicación con 7 opciones aunque solo hay Uruguay
**Solución:**
```
PASO 6 MEJORADO - Generar filtro dinámico:
- Leer data/aircraft-inventory.json
- Extraer ubicaciones únicas: ["uruguay", "paraguay", etc]
- Generar HTML del filtro SOLO con países disponibles
- Actualizar <select id="filter-location"> dinámicamente
- Agregar opción "Todas las ubicaciones" al inicio
```

### 6. ❌ Botón WhatsApp con mal contraste
**Problema:** Color azul (#2563eb) en fondo azul = invisible
**Solución:**
```
Usar clase btn-primary (consistente con aeronaves Argentina):
- class="btn-primary"
- display: flex; justify-content: center; align-items: center;
- Text: "Contactar por WhatsApp"
- Incluir icono: <i class="fab fa-whatsapp"></i>
```

### 7. ❌ Matrícula en meta tags de compartir
**Problema:** Cuando compartían el link (WhatsApp, Facebook), aparecía matrícula
**Solución (SOLO para catalog == "import"):**
```
Meta tags OpenGraph:
- og:title: SIN matrícula → "Cessna 340 - A Importar"
- og:description: SIN matrícula
- og:image: foto del avión (sin blur, ya optimizada)
- <title>: SIN matrícula → "Cessna 340 - Aeronave a Importar | Fly It"

Motivo: En importación, el cliente no debe saber la matrícula
Almacenamiento: Matrícula está en datos internos (contacts.json)
```

### 8. ❌ og:image con ruta relativa (Facebook/WhatsApp no podían validar)
**Problema:** og:image="assets/images/c340-main.jpg" → Facebook no podía descargar la imagen
**Solución (CRÍTICO para redes sociales):**
```
SIEMPRE usar URL ABSOLUTA en og:image:
- ❌ MALO: og:image="assets/images/c340-main.jpg"
- ✅ BIEN: og:image="https://flyit.com.ar/assets/images/c340-06-main.jpg"

Meta tags OpenGraph COMPLETOS:
- og:title: "Cessna 340 - A Importar | Fly It"
- og:description: "Cessna 340 año 1973..."
- og:image: https://flyit.com.ar/assets/images/c340-06-main.jpg (URL ABSOLUTA)
- og:image:width: 1200
- og:image:height: 630
- og:url: https://flyit.com.ar/c340-uruguay.html
- og:type: product

IMPORTANTE: Después de actualizar, usar Facebook Link Debugger:
- URL: https://developers.facebook.com/tools/debug/
- Pegar URL de la página
- Click "Volver a extraer" para forzar validación
- WhatsApp tardará hasta 24h en actualizar caché

Motivo: Facebook/WhatsApp necesitan URL completas para descargar y cachear previews
```

---

## 📋 Flujo mejorado para PASO 1

```
PASO 1 MEJORADO: Consultas Iniciales
┌─────────────────────────────────────┐
│ 1. Mostrar todas las fotos           │
│    [1] [2] [3] [4] [5]              │
│    [6] [7] [8] [9] [10]             │
│                                     │
│ 2. Preguntar: "¿Foto principal?"    │
│    → Usuario: 6                     │
│                                     │
│ 3. Preguntar: "¿Foto hover?"        │
│    → Usuario: 10                    │
│                                     │
│ 4. Preguntar: "¿Catálogo?"          │
│    → Usuario: import                │
│    → Auto-detecta: NO matrícula     │
│                                     │
│ 5. Preguntar: "¿Ubicación?"         │
│    → Usuario: uruguay               │
│    → Auto-genera: filtro dinámico   │
│                                     │
│ 6. Confirmar contacto (INTERNO)     │
│    → Guardar SOLO en data/          │
│    → NO mostrar en web pública      │
└─────────────────────────────────────┘
```

---

## 🔑 Checklist para implementación

- [ ] Modificar PASO 1 para mostrar fotos y preguntar cuáles usar
- [ ] Actualizar PASO 2 para copiar TODAS las fotos
- [ ] Agregar lógica: if catalog=="import" → NO matrícula
- [ ] Crear estructura de contactos internos (data/contacts.json)
- [ ] Implementar filtros dinámicos basados en datos reales
- [ ] Mejorar estilos de botones (contraste, colores)
- [ ] Documentar en skill README

---

## 📝 Template mejorado de info.txt

Agregar campos para catálogo de importación:

```
Modelo: Cessna 340
Año: 1973
Matrícula: CX-BVC
Catalog: import          # Nuevo: especificar si es venta o importación
Location: uruguay        # Nuevo: país de ubicación
Status: available

[resto de especificaciones...]
```

