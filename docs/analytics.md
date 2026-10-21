# Analítica: plan de medición

Objetivo: saber qué hace la gente en la web (vistas, clicks, embudo de compra) y enterarnos de cada error, con coste 0 mientras quepamos en el plan gratis de PostHog.

## Herramientas

| Herramienta | Para qué | Dónde |
|---|---|---|
| **PostHog** (EU) | Vistas, clicks automáticos, embudos, grabaciones de sesión, errores JS y de API | `components/utils/AnalyticsProvider.tsx` |
| **GA4 + Google Ads** | Campañas y conversiones (se queda como estaba) | `app/layout.tsx` |
| **Cookiebot** | Consentimiento: manda sobre todo lo demás | `app/layout.tsx` |
| ~~Mouseflow~~ | Eliminado: no se usaba y PostHog cubre las grabaciones | — |

Todo evento pasa por `track()` en `utils/analytics.ts`. Va a PostHog y, si es un evento ecommerce de GA4, también a `gtag`. Si falta la key o un script está bloqueado, no hace nada y nunca rompe la tienda.

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
| `view_item` | Se abre la ficha de un producto | `value`, `currency`, `items[]` | ✅ | `ProductDetail.tsx` |
| `add_to_cart` | Cualquier botón de añadir al carrito (cajas, packs, gift card, landings) | `value`, `items[]`, `customised` | ✅ | `redux/analyticsMiddleware.ts` |
| `remove_from_cart` | Se quita una línea | `cart_item_id` | ✅ | middleware |
| `discount_applied` | Se aplica un código | `coupon` | — | middleware |
| `begin_checkout` | Clic en pagar, justo antes de ir a Stripe | `value` (con envío), `items[]`, `coupon`, `shipping_option_id` | ✅ | `CheckoutConfirm.tsx` |
| `purchase` | Página de éxito, **una sola vez por pedido** | `transaction_id`, `value`, `currency`, `items[]`, `coupon` | ✅ | `app/checkout/success/page.tsx` |
| `generate_lead` | Newsletter y formularios de leads | `source`, `form_code` | ✅ | middleware |
| `personalised_request_sent` | Solicitud de chocolates personalizados | — | — | middleware |
| `login` | Login correcto | `method` | ✅ | middleware |
| `api_error` | Cualquier llamada a la API que falla (excepto 401) | `endpoint`, `status` | — | middleware |
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

1. **Embudo de compra:** `$pageview` /shop-now → `view_item` → `add_to_cart` → `$pageview` /checkout/address → `begin_checkout` → `purchase`. Desglosarlo por dispositivo y por `utm_source`.
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
