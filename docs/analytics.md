# Analítica: plan de medición

Objetivo: saber qué hace la gente en la web (vistas, clicks, embudo de compra) y enterarnos de cada error, con coste 0 mientras quepamos en el plan gratis de PostHog.

## Herramientas

| Herramienta | Para qué | Dónde |
|---|---|---|
| **PostHog** (EU) | Vistas, clicks automáticos, embudos, grabaciones de sesión, errores JS y de API | `components/utils/AnalyticsProvider.tsx` |
| **GA4 + Google Ads** | Campañas y conversiones (se queda como estaba) | `app/layout.tsx` |
| **Cookiebot** | Consentimiento: manda sobre todo lo demás | `app/layout.tsx` |
| ~~Mouseflow~~ | Eliminado: no se usaba y PostHog cubre las grabaciones | — |

Todo evento pasa por `track()` en `utils/analytics.ts`. Va a PostHog y, si es un evento de GA4, también a `gtag` y al `dataLayer` de GTM (`GTM-TWQTXVNR`): los ecommerce como `{ event, ecommerce }` (vaciando antes `ecommerce`) y `generate_lead`/`login` en plano. Cada push lleva `attribution` con los `utm_*`, `fbclid` y `gclid` del **último toque** (ver [Atribución](#atribución-primer-y-último-toque)). Si falta la key o un script está bloqueado, no hace nada y nunca rompe la tienda.

## Atribución: primer y último toque

Problema: el anuncio trae al cliente a una página y la compra llega páginas (o días) después, cuando la query ya no está. Además Stripe es una redirección, así que en PostHog `purchase` llega con `$referring_domain = checkout.stripe.com`. Antes solo se guardaba la última visita y en `sessionStorage`: se perdía al cerrar la pestaña y cada campaña pisaba la anterior.

Ahora `utils/analytics.ts` (`getAttributionTouches()`) guarda dos toques. Un **toque** es una visita que llega con algún `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid` o `fbclid` en la URL.

- **Primer toque:** el primero dentro de la ventana de **30 días**. Las visitas siguientes no lo cambian. Cuando caduca, el último toque vigente pasa a ser el primero (o el siguiente toque nuevo, si no hay ninguno).
- **Último toque:** el más reciente. Cada visita con parámetros nuevos lo reemplaza. También caduca a los 30 días.

**Dónde se guarda (clave `casspea_attribution`):**

| Consentimiento de estadísticas en Cookiebot | Almacén | Dura |
|---|---|---|
| Aceptado | `localStorage` (lo que ya hubiera en `sessionStorage` se pasa ahí) | 30 días |
| Sin respuesta o rechazado | `sessionStorage`, como antes. `localStorage` no se lee ni se escribe | Hasta cerrar la pestaña |

Si el cliente retira el consentimiento, `AnalyticsProvider` borra la copia de `localStorage` (`forgetPersistentAttribution()`).

**PostHog:** `begin_checkout` y `purchase` llevan además estas propiedades (solo las que tengan valor): `first_utm_source`, `first_utm_medium`, `first_utm_campaign`, `first_gclid`, `first_fbclid`, `last_utm_source`, `last_utm_medium`, `last_utm_campaign`. Para el embudo y las ventas por campaña, desglosar por `first_utm_source` / `last_utm_source` en lugar de `$referring_domain`.

**GTM:** el campo `attribution` del `dataLayer` sigue siendo el del último toque, sin cambios.

### Contrato con el backend: `attribution` al crear la sesión de Stripe

`POST /checkout/stripe/create-session/` (el que usa `CheckoutConfirm.tsx`) y `POST /checkout/stripe/embedded/create-session/` mandan ahora este body JSON (antes iban sin body):

```json
{
  "attribution": {
    "first_touch": {
      "utm_source": "google",
      "utm_medium": "cpc",
      "utm_campaign": "advent",
      "gclid": "Cj0KCQ…",
      "landing_path": "/advent-calendar",
      "touched_at": "2026-11-01T10:00:00.000Z"
    },
    "last_touch": {
      "utm_source": "facebook",
      "utm_medium": "paid_social",
      "utm_campaign": "xmas",
      "fbclid": "IwAR…",
      "landing_path": "/",
      "touched_at": "2026-11-05T18:12:00.000Z"
    }
  }
}
```

- `first_touch` y `last_touch` pueden ser `null` (visita directa u orgánica, o sin datos). Pueden ser el mismo toque.
- Dentro de un toque, todos los campos son opcionales salvo `touched_at` (ISO 8601, UTC). Los valores de `utm_*`, `gclid` y `fbclid` se recortan a 200 caracteres. `landing_path` es solo la ruta, sin query.
- Llega desde el navegador: el backend debe tratarlo como dato no fiable (validar tipos y longitudes, ignorar claves desconocidas) y **nunca** fallar la creación de la sesión por culpa de este campo.

**Qué debe hacer el backend (pendiente, este cambio no lo toca):**

1. Leer `attribution` y guardarlo en el `CheckoutSession` / pedido (p. ej. un `JSONField`), o al menos `first_utm_*`, `last_utm_*`, `first_gclid`, `first_fbclid`.
2. Pasarlo a Stripe como `metadata` de la Checkout Session (campos planos, valores ≤ 500 caracteres), para tenerlo en el webhook `checkout.session.completed`.
3. Al confirmar el pago (webhook), copiarlo al `Order`. Así las ventas por campaña salen de la base de datos aunque el cliente cierre la pestaña antes de volver, y sirve de base para el `purchase` desde servidor de *Siguientes pasos* y para subir conversiones offline a Google Ads con `gclid`.

Hasta que el backend lo lea, el campo se ignora y el checkout funciona igual.

## Consentimiento (RGPD / UK GDPR)

- **Antes de aceptar o si se rechaza:** PostHog funciona en *cookieless mode*. Cuenta visitas y eventos de forma anónima, no guarda nada en el dispositivo y no graba sesiones.
- **Si se aceptan las cookies de estadística en Cookiebot:** `opt_in_capturing()`, con tracking normal y grabaciones. Los campos de los formularios siempre salen enmascarados.

## Qué se mide

### Automático (sin código)

| Qué | Evento PostHog |
|---|---|
| Cada página vista, incluida la navegación interna | `$pageview` |
| Salida de página y tiempo en ella | `$pageleave` |
| Clicks, envíos de formularios y cambios de inputs | `$autocapture` |
| Clicks repetidos de frustración y clicks sin respuesta | `$rageclick`, `$dead_click` |
| Errores JS no capturados y promesas rechazadas | `$exception` |
| Grabación de sesión (solo con consentimiento) | Replay |

### Eventos de negocio

| Evento | Cuándo | Propiedades | GA4 | Dónde |
|---|---|---|---|---|
| `view_item` | Se abre la ficha de un producto o la landing del Advent | `value`, `currency`, `items[]` | ✅ | `ProductDetail.tsx`, `components/advent/ViewItemTracker.tsx` |
| `add_to_cart` | Cualquier botón de añadir al carrito (cajas, packs, gift card, landings) | `value`, `items[]`, `customised` | ✅ | `redux/analyticsMiddleware.ts` |
| `remove_from_cart` | Se quita una línea | `cart_item_id` | ✅ | middleware |
| `discount_applied` | Se aplica un código | `coupon` | — | middleware |
| `begin_checkout` | Clic en pagar, justo antes de ir a Stripe | `value` (con envío), `items[]`, `coupon`, `shipping_option_id` + [atribución](#atribución-primer-y-último-toque) (solo PostHog) | ✅ | `CheckoutConfirm.tsx` |
| `purchase` | Página de éxito, **una sola vez por pedido** | `transaction_id`, `value`, `currency`, `items[]`, `coupon` + [atribución](#atribución-primer-y-último-toque) (solo PostHog) | ✅ | `app/checkout/success/page.tsx` |
| `generate_lead` | Newsletter y formularios de leads | `source` (en el Advent: `landing-reminder`, `exit-intent`, `early-access`), `form_code` (`advent-2026`) | ✅ | middleware |
| `personalised_request_sent` | Solicitud de chocolates personalizados | — | — | middleware |
| `login` | Login correcto | `method` | ✅ | middleware |
| `api_error` | La API respondió con error (excepto 401). No incluye fallos de red ni códigos de descuento rechazados | `endpoint`, `status`, `http_status` (en `PARSING_ERROR`) | — | middleware |
| `api_network_error` | La petición no llegó a responder (`FETCH_ERROR`: sin cobertura, pestaña cerrada o navegación a mitad) | `endpoint` | — | middleware |
| `discount_rejected` | La API rechazó un código de descuento (400 en `updateCart`) | `coupon` | — | middleware |
| `$exception` | Pantalla de error de la app | `boundary`, `digest` | — | `app/error.tsx`, `app/global-error.tsx` |

**Arreglo incluido:** antes, `purchase` se enviaba a GA4/Ads sin importe y con `transaction_id` vacío, porque se leía de `useParams` en lugar de `?session_id=`. Ahora lleva importe, productos y cupón.

## Puesta en marcha (lo que hay que hacer a mano)

1. Crear una cuenta en [posthog.com](https://posthog.com) eligiendo la **región EU**.
2. Ir a Project settings → copiar la **Project API key** (`phc_…`).
3. En AWS Amplify → App settings → Environment variables, añadir `NEXT_PUBLIC_POSTHOG_KEY=phc_…` y redesplegar. `NEXT_PUBLIC_POSTHOG_HOST` es opcional; por defecto usa `https://eu.i.posthog.com`.
4. En PostHog → Project settings:
   - Activar **Cookieless server hash mode**. Sin esto se pierden los eventos de quien no acepta cookies.
   - Activar **Session replay**.
   - Activar **Exception autocapture** (Error tracking).
   - En *Authorized URLs*, añadir `https://www.casspea.co.uk`.
5. En Cookiebot, revisar que PostHog aparece en la categoría *Statistics* tras el siguiente escaneo.

Sin la key (en local o en previews), PostHog no se carga y la web funciona igual.

## Dashboards que crear en PostHog (día 1)

1. **Embudo de compra:** `$pageview` /shop-now → `view_item` → `add_to_cart` → `$pageview` /checkout/address → `begin_checkout` → `purchase`. Desglosarlo por dispositivo y por `first_utm_source` / `last_utm_source`.
2. **Ventas:** suma de `purchase.value` por día, ticket medio y número de pedidos.
3. **Errores:** apartado Error tracking, más un gráfico de `api_error` por `endpoint`.
4. **Frustración:** `$rageclick` y `$dead_click` por URL, para ver las grabaciones de esas sesiones.
5. **Leads:** `generate_lead` por `source`.

## Siguientes pasos (v1)

- `posthog.identify()` tras el login, para unir la actividad de un mismo cliente entre dispositivos. Necesita que el backend devuelva el id del usuario.
- Mover el A/B test del box builder (`useExperiment`) a feature flags de PostHog, o enviar la variante como propiedad de los eventos.
- `purchase` desde el servidor (webhook de Stripe → PostHog), para no perder compras de quien cierra la pestaña antes de volver a la web.
- Revisar si GA4 está duplicado: se carga directo con `gtag` y también puede estar dentro del contenedor GTM.

## Coste

Límites aproximados del plan gratis de PostHog, por mes: 1M eventos, 5.000 grabaciones y 100.000 excepciones. Por encima se paga por uso, y se puede poner un límite de gasto en *Billing* para no pagar nunca sin querer.
