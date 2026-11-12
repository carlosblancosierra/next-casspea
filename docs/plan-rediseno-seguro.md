# Plan de rediseño seguro

Auditoría de la tienda (`next-casspea`, Next.js) y de la API (`casspea-v2`, Django) hecha el 11 de noviembre de 2026, con un plan para rediseñar la web sin romper la compra, la analítica ni el SEO.

Todo lo que aparece como fallo está **comprobado con un test** que se puede ejecutar. Los tests están en la rama `feat/app-analysis-testing-plan-rnrtpp` de los dos repos.

## Resumen

- **La base es buena.** Hay 432 tests en verde (213 en la tienda, 219 en la API), el typecheck está limpio y el build funciona.
- **Pero lo que hace el cliente casi no está probado.** La cobertura de la tienda es del 25 %. Las páginas del checkout, el pack builder, el portal de clientes y el refresco de sesión están al 0 %.
- **He encontrado 18 fallos reales.** Seis son urgentes y no tienen que ver con el rediseño: un paquete de *dependency confusion* que se instala en producción, datos personales de clientes accesibles por URL, pedidos que se marcan como pagados sin cobro, un bucle infinito al elegir recogida en tienda, el enlace de baja de los emails roto y el optimizador de imágenes abierto a cualquier dominio.
- **No hay que empezar a rediseñar hasta tener cuatro cosas:** los fallos P0 arreglados, el evento `add_to_cart` funcionando (sin él no se puede saber si el diseño nuevo vende más o menos), un entorno de preview que funcione y los tests E2E de los recorridos de compra.
- **Calendario:** estamos a dos semanas del pico de Navidad. Propongo arreglar los P0 y P1 esta semana y la siguiente, congelar el checkout del 20 de noviembre al 2 de enero, preparar el rediseño en ese tiempo y lanzarlo por partes desde enero.

## 1. Cómo está la app hoy

| | Tienda (`next-casspea`) | API (`casspea-v2`) |
|---|---|---|
| Tests | 37 suites, 213 tests, todos pasan | 219 tests, todos pasan |
| Cobertura de líneas | 25 % | 69 % |
| Typecheck | Limpio (`tsc --noEmit`) | — |
| Lint | 0 errores, 57 avisos | — |
| Build | Correcto en 52 s, 42 rutas | `manage.py check` correcto, migraciones al día |
| Dependencias | `pnpm audit --prod`: 4 críticas y 29 altas. Next 14.2.35 aporta 3 críticas y 9 altas | Sin versiones fijadas. Incluye un paquete de prueba de *dependency confusion* |
| Contrato de la API | — | El esquema OpenAPI sale con 151 errores, así que hoy no sirve como contrato |

Lo que está a 0 % de cobertura y forma parte de la compra: todas las páginas de `app/checkout/*`, `app/cart`, `components/address/AddressForm.tsx`, `components/packs/PackBuilder.tsx` y sus pasos, `components/client-portal/*`, `components/personalized/PersonalizedForm.tsx`, `components/product_detail/FlavourPicker.tsx` y `ProductFormGeneral.tsx`, `redux/services/apiSlice.ts` (el refresco del token), `hooks/use-login.ts` y `hooks/use-verify.ts`.

En la API, lo menos cubierto es `checkout/views.py` (24 %), `mails/services.py` (22 %), `leads/views.py` (37 %), `orders/views.py` (46 %) y `checkout/stripe_views.py` (47 %).

## 2. Fallos encontrados

Prioridades:

- **P0:** arreglar ya. Afecta a clientes, dinero o ley, haya rediseño o no.
- **P1:** arreglar antes de empezar el rediseño. Sin esto no se puede probar o medir el diseño nuevo.
- **P2:** arreglar cuando se toque esa zona.

Cada fallo tiene un test marcado como "fallo esperado" (ver la sección 4). Cuando alguien lo arregle, ese test se pone rojo para avisar de que hay que convertirlo en un test normal.

### P0: arreglar ya

**BUG-01. Paquete de *dependency confusion* en producción.**
`requirements.txt:16` instala `rest_framework_simplejwt` 0.0.2. No es la librería de JWT: es un paquete de prueba cuya descripción dice *"PoC of pipreqs dependency confusion"*. La librería real (`djangorestframework-simplejwt`) ya está en la lista. Hoy el paquete solo imprime un aviso, pero quien controle ese nombre en PyPI puede publicar una versión maliciosa, y entraría en producción en el siguiente despliegue porque no hay versiones fijadas.
*Arreglo:* borrar la línea y fijar versiones (ver Fase 2). *Tamaño:* pequeño.
*Test:* `casspea-v2/erp/tests/test_known_issues.py`, `Bug01DependencyConfusionTest`.

**BUG-02. Cualquiera puede leer los datos de cualquier cliente.**
`GET /api/checkout/session/<id>/` devuelve email, teléfono y dirección de cualquier sesión de checkout, sin comprobar de quién es (`checkout/views.py:139`). Los ids son correlativos (1, 2, 3…), así que se pueden recorrer todos. `POST /api/checkout/session/<id>/shipping-option/` (`checkout/views.py:191`) permite además cambiar el envío de otro cliente. Es un posible incidente de protección de datos.
*Arreglo:* buscar siempre la sesión del carrito de quien hace la petición, como ya hace `GET /api/checkout/session/`, y responder 404 si el id no es el suyo. La tienda ya manda el id de su propia sesión, así que no cambia nada en el frontend. *Tamaño:* pequeño.
*Test:* `Bug02CheckoutSessionPrivacyTest`.

**BUG-03. Pedidos marcados como pagados sin cobro.**
El webhook `checkout.session.completed` crea el pedido y marca la sesión como pagada aunque Stripe diga `payment_status: "unpaid"` (`checkout/webhooks.py:60-170`). Eso pasa con los métodos de pago diferidos (adeudos, vales), que se activan desde el Dashboard de Stripe sin tocar código.
*Arreglo:* marcar como pagado solo si `payment_status == "paid"`, y tratar `checkout.session.async_payment_succeeded` y `async_payment_failed`. *Tamaño:* pequeño.
*Test:* `Bug03UnpaidCompletionTest`.

**BUG-17. Bucle infinito al elegir recogida en tienda.**
En cuanto el cliente elige día y franja, `CheckoutShippingOptions` y `CheckoutStorePickUp` se actualizan el uno al otro sin parar. React avisa con *"Maximum update depth exceeded"* y la página se queda gastando CPU; en un móvil puede congelarse o ir a tirones. La causa es que el padre pasa un callback nuevo en cada render (`CheckoutShippingOptions.tsx:692`) y el hijo tiene un efecto que depende de ese callback y crea un objeto nuevo cada vez (`CheckoutStorePickUp.tsx:57-67`). Ningún test lo veía porque cada uno sustituía uno de los dos componentes por un mock.
*Arreglo:* `useCallback` en el padre, o que el hijo avise solo cuando cambian el día o la franja. *Tamaño:* pequeño.
*Test:* `components/checkout/__tests__/CheckoutStorePickUpLoop.test.tsx`.

**BUG-08. El enlace de baja de los emails no funciona.**
Todos los emails (confirmación de pedido, newsletter, campañas) llevan a `https://www.casspea.co.uk/unsubscribe/`, que da 404. Tampoco hay API de baja: el campo `Lead.unsubscribed` existe, pero nada lo pone a `true`. En emails de marketing la baja es obligatoria (PECR y UK GDPR).
*Arreglo:* página `/unsubscribe?token=…`, un endpoint que marque `unsubscribed` y filtrar los envíos por ese campo. *Tamaño:* medio.
*Test:* `contract/__tests__/routes.test.ts`, enlace `/unsubscribe/`.

**BUG-15 (parte urgente). El optimizador de imágenes acepta cualquier host.**
Next 14.2.35 tiene avisos críticos de ejecución remota en el optimizador de imágenes, y `next.config.js:5-10` permite optimizar imágenes de cualquier dominio (`hostname: '**'`).
*Arreglo inmediato:* limitar `remotePatterns` al bucket de S3 (`casspea-v2.s3.amazonaws.com`) y a los dominios propios. La subida de versión de Next va en la Fase 2. *Tamaño:* pequeño.

### P1: antes de empezar el rediseño

**BUG-04. El evento `add_to_cart` nunca se envía.**
`POST /api/carts/items/` devuelve el carrito entero, pero `redux/analyticsMiddleware.ts:52-54` espera la línea añadida (`payload.product`) y, como no la encuentra, no hace nada. El test que había usaba una respuesta inventada con la forma de una línea. Resultado: el embudo de compra de PostHog y GA4 está ciego justo en el paso que más va a cambiar con el rediseño.
*Arreglo:* sacar la línea añadida de `payload.items` (la del producto pedido con el id más alto) y cambiar el tipo de `addCartItem` a `Cart`. *Tamaño:* pequeño.
*Test:* `redux/__tests__/analyticsMiddleware.contract.test.ts`.

**BUG-05. Las solicitudes de chocolate personalizado se pierden.**
El formulario de `/personalised/[slug]` envía a `POST /api/personalized/send-request/`, que no existe en la API (404). El error se queda en un `console.error` (`PersonalizedForm.tsx:121-123`), así que el cliente no ve nada y cree que lo ha enviado.
*Arreglo:* crear el endpoint (o enviar por `leads/generic-lead/`), y mostrar éxito o error en pantalla. *Tamaño:* medio.
*Tests:* `erp/tests/test_frontend_contract.py`, `test_bug_05_personalised_request_endpoint_exists`, y la lista `KNOWN_GAPS`.

**BUG-06. En verano, la recogida se guarda para el día anterior.**
`CheckoutConfirm.tsx:86` convierte la fecha elegida con `toISOString()`, que la pasa a UTC. En horario de verano británico, la medianoche local son las 23:00 UTC del día anterior. En invierno no pasa nada, y por eso no se ha notado todavía.
*Arreglo:* `format(date, 'yyyy-MM-dd')` de date-fns. *Tamaño:* pequeño.
*Test:* `components/checkout/__tests__/CheckoutConfirmPickupDate.test.tsx`. Ahora toda la suite corre con la zona horaria de Londres (`jest.config.js`), porque en UTC, la de CI, este tipo de fallo es invisible.

**BUG-13. El rediseño no se puede probar fuera de producción.**
Hay tres cosas atadas a producción:
1. Las URLs de vuelta de Stripe son fijas (`https://www.casspea.co.uk` en `checkout/stripe_views.py:144-178` y `checkout/stripe_utils.py:44-77`). Un pago empezado en una preview devuelve al cliente a producción.
2. La tienda reconoce la recogida por el id 34 (`components/checkout/constants.ts:7`), que es un id de la base de datos de producción. La API, en cambio, la reconoce por `delivery_speed == "PICKUP"`.
3. `CORS_ALLOWED_ORIGINS` (`erp/settings.py:191`) no incluye el dominio de preview de Amplify, aunque `CSRF_TRUSTED_ORIGINS` sí. Desde una preview, el navegador bloquea todas las llamadas a la API.

*Arreglo:* un ajuste `FRONTEND_URL`, buscar la recogida por `delivery_speed` y añadir los orígenes de preview y staging a CORS. *Tamaño:* medio.
*Test:* `Bug13FrontendUrlTest`.

**BUG-10. La API responde 500 a cada invitado nuevo.**
`GET /api/checkout/session/` intenta crear la sesión sin email y el modelo lo impide con un `ValueError` (`checkout/models.py:78`). La página `/cart` hace esa llamada al cargar, así que cada visitante nuevo genera un error 500 y un `api_error` en la analítica.
*Arreglo:* permitir sesiones sin email hasta el pago, o no crear la sesión en el `GET`. *Tamaño:* pequeño.
*Test:* `Bug10GuestSessionTest`.

**BUG-07. Los pagos fallidos devuelven 500 a Stripe.**
`payment_intent.payment_failed` lee `checkout_session_id` del `metadata` del PaymentIntent, pero ese dato solo está en la Checkout Session (`checkout/webhooks.py:273`). Cada evento de ese tipo responde 500, Stripe lo reintenta durante días y puede acabar desactivando el webhook.
*Arreglo:* mandar `payment_intent_data.metadata` al crear la sesión, o escuchar `checkout.session.expired` y `async_payment_failed`. *Tamaño:* pequeño.
*Test:* `Bug07PaymentFailedTest`.

**BUG-15 (parte de fondo). Next.js sin parches de seguridad.**
Next 14.2.35 tiene 3 avisos críticos y 9 altos, y el parche solo existe a partir de 15.5.x. Va en su propio PR en la Fase 2, antes del rediseño y nunca a la vez.

**BUG-18 (por verificar). El precio de preventa puede no coincidir con el que cobra Stripe.**
El carrito cobra `preorder_price` cuando hay preventa, pero Stripe cobra el precio asociado a `stripe_price_id`. Si nadie cambia ese id al activar la preventa, el cliente ve un importe y paga otro.
*Arreglo:* comprobar en Stripe cada producto en preventa, o enviar el precio de preventa a Stripe. No tiene test porque depende de datos de Stripe.

### P2: cuando se toque esa zona

| ID | Qué pasa | Dónde | Test |
|---|---|---|---|
| BUG-09 | El logo de la confirmación de pedido y de las newsletters apunta a `/static/images/logo-gray.png`, que no existe | `mails/templates/mails/order_paid.html:160`, `leads/templates/leads/mails/*.html` | `routes.test.ts`, enlace `/static/images/logo-gray.png` |
| BUG-11 | Una llamada al webhook sin cabecera `Stripe-Signature` da 500 en vez de 400 | `checkout/webhooks.py:24` | `Bug11WebhookSignatureTest` |
| BUG-12 | Una cantidad no numérica en `POST /api/carts/items/` da 500 en vez de 400 | `carts/views.py:153` y `:212` | `Bug12QuantityValidationTest` |
| BUG-14 | `StripeSuccessView` y `StripeCancelView` redirigen a `/checkout/error`, que no existe. Parecen no usarse | `checkout/stripe_views.py:242-286` | `routes.test.ts`, enlace `/checkout/error` |
| BUG-16 | Código muerto que un rediseño podría volver a usar: `downloadRoyalMailLabel` (axios con URL relativa y sin token) y `getProductsByCategory` (la API ignora `?category=`) | `redux/features/royalmail/royalmailApiSlice.tsx:36`, `redux/features/products/productApiSlice.tsx:19` | `apiCalls.test.ts`, lista `NOT_ON_BASE_QUERY` |
| BUG-19 | La regla "un carrito con calendario de Adviento no se recoge en tienda" solo está en `CheckoutDetailsSerializer`, que ninguna vista usa. Los endpoints que llama la tienda aceptan la recogida, y el test existente (`FixedDispatchBlocksPickupTest`) pasa porque prueba el serializer suelto. La tienda oculta la opción, así que solo pasa con una petición hecha a mano | `checkout/views.py` (`create` y `update_shipping_option`), `checkout/serializers.py:119` | `Bug19FixedDispatchPickupTest` |

### Otros hallazgos que afectan al rediseño

No son fallos todavía, pero conviene saberlos antes de mover nada:

- **Hay dos copias del payload de Stripe.** El checkout que se usa (`CheckoutConfirm` → `POST /api/checkout/stripe/create-session/`) arma su propio payload en `checkout/stripe_views.py:106-189`. Los tests de "lo que ve el cliente es lo que cobra Stripe" prueban la otra copia, `prepare_stripe_payload`, que solo usa el checkout embebido. Por ejemplo, la copia en uso no excluye los productos agotados. Hay que unificarlas.
- **La conciliación del webhook agrupa por `stripe_price_id`.** Dos líneas del mismo producto con sabores distintos se pisan en el diccionario de `checkout/webhooks.py:86-95`. Falta un test con ese caso.
- **Hay lógica de negocio dentro de componentes de pantalla muy grandes:** `CheckoutShippingOptions.tsx` (702 líneas: fechas de envío, recogida, envío fijo), `ProductFormBoxes.tsx` (941), `QuickBoxBuilder.tsx` (542) y `PackBuilder.tsx` (327). Es lo más fácil de romper al cambiar el diseño.
- **Las fechas de campaña están repetidas.** `2026-05-26` aparece en cuatro archivos (`utils/shippingDays.ts`, `utils/shippingDate.ts`, `CheckoutConfirm.tsx:146` y `CartEarliestDelivery.tsx:34`). `ORDER_DEADLINE` de Navidad es el 26 de noviembre y está en `ChristmasDeliveryCountdown.tsx:7`. `SUMMER_BREAK_ENABLED` está en `utils/storeStatus.ts`.
- **Hay un experimento A/B activo en la ficha de producto** (`box_builder`, `ProductDetail.tsx:28`). Rediseñar la ficha mientras corre contamina el resultado.
- **SEO:** solo 12 de las 42 páginas tienen metadata propia; las demás heredan el título genérico del layout. No hay `sitemap.xml` ni `robots.txt`.
- **El build de CI no prueba los datos.** Corre sin `NEXT_PUBLIC_HOST`, así que las páginas estáticas se generan sin productos (avisos `fetch failed for undefined/api/...`) y el build sale verde igual.
- **La página `/dev` es pública** en producción.
- **El token de sesión (JWT) se guarda en `localStorage`** y la web carga scripts de terceros (GTM, Cookiebot, PostHog, Trustpilot). Si alguno se ve comprometido, se puede robar la sesión de un administrador. Valorar cookies `httpOnly` más adelante.
- **Las versiones del backend no están fijadas** (`Django>=4.2`, `stripe` y `djangorestframework` sin versión). Hoy se instalan Django 5.2 y Stripe 17, y cada despliegue en Heroku puede traer una versión mayor nueva.
- **El README decía que el build ignora los errores de TypeScript.** Ya no es así; está corregido en esta rama.

## 3. Qué puede romper un rediseño

Un rediseño cambia componentes, pero hay acuerdos con el exterior que no deben cambiar sin querer. Estos son los de esta app y cómo quedan protegidos:

| Acuerdo | Por qué importa | Protección |
|---|---|---|
| **42 URLs** | Google, anuncios, códigos QR, Stripe y los emails apuntan a ellas | `contract/routes.json`, comprobado en `contract/__tests__/routes.test.ts`. Quitar una ruta solo pasa el test si hay redirección en `next.config.js` |
| **Enlaces que llegan de fuera** | Vuelta de Stripe (`/checkout/success`, `/cancel`, `/result`), carrito abandonado (`/cart`), email al equipo (`/orders?order=`), logo de los emails | `contract/inbound-links.json` |
| **49 llamadas a la API** | Método, ruta y barra final. Si cambia una, la API responde 404 o 405 | `contract/frontend-api-calls.json`, generado ejecutando cada endpoint de RTK Query. La API comprueba su copia en `erp/tests/test_frontend_contract.py` |
| **Forma de las respuestas** | Los componentes leen campos concretos | `contract/responses/*.json`: 15 respuestas reales que genera la suite de la API. La tienda las usa como datos de prueba |
| **Eventos de analítica** | Embudo de compra y conversiones de GA4 y Ads | Tests del middleware (BUG-04). Las acciones de PostHog definidas por selector CSS o por texto también se rompen al cambiar el HTML: revisarlas |
| **Reglas de negocio** | Cortes de envío, recogida, mínimo para descuento, envío gratis desde 56 £, cajas "Surprise me" | Tests existentes, que buscan por rol y por texto y por eso sobreviven a un cambio visual. Ampliar en la Fase 3 |
| **Nombres accesibles** | Los tests encuentran los botones por su rol y su texto | Mantener roles, `aria-label` y textos clave. No añadir `data-testid` salvo que no haya otra forma |
| **Assets que usan los emails** | `public/logos/white.png` se sirve desde `/_next/image` en el email al equipo | `inbound-links.json` |

## 4. La red de seguridad de esta rama

### Qué hay nuevo

En `next-casspea`:

- `contract/`: los acuerdos de la sección 3, en JSON, más `contractFile.ts` para compararlos. Su `README.md` explica cómo actualizarlos.
- `contract/__tests__/apiCalls.test.ts`: ejecuta los 49 endpoints contra un `fetch` falso y compara método y ruta con `frontend-api-calls.json`. También falla si alguien añade un endpoint sin registrarlo.
- `contract/__tests__/routes.test.ts`: el inventario de rutas, las redirecciones y los enlaces que llegan de fuera.
- `contract/__tests__/responses.test.ts`: los datos de prueba no pueden inventarse campos que la API no manda.
- `redux/__tests__/analyticsMiddleware.contract.test.ts`: BUG-04.
- `components/checkout/__tests__/CheckoutConfirmPickupDate.test.tsx`: BUG-06.
- `components/checkout/__tests__/CheckoutStorePickUpLoop.test.tsx`: BUG-17.
- `jest.config.js`: la suite corre con la zona horaria `Europe/London`.

En `casspea-v2`:

- `contract/frontend-api-calls.json` (copia del de la tienda) y `contract/responses/*.json`.
- `erp/tests/test_frontend_contract.py`: cada llamada de la tienda llega a una vista que acepta su método, y las 15 respuestas mantienen su forma.
- `erp/tests/test_known_issues.py`: BUG-01, 02, 03, 07, 10, 11, 12, 13 y 19.

Estado final: la tienda tiene 43 suites y 239 tests en verde, 6 de ellos fallos esperados. La API tiene 237 tests en verde, 11 de ellos fallos esperados.

### Cómo funcionan los "fallos esperados"

Cada fallo conocido tiene un test que describe el comportamiento **correcto** y está marcado como fallo esperado: `it.failing` en Jest, `@expectedFailure` en Django. Así:

1. Hoy el test falla, que es lo esperado, y la suite sigue en verde.
2. Quien arregla el fallo hace que el test pase. Entonces Jest o Django lo marcan como "éxito inesperado" y la suite se pone roja.
3. Se quita `.failing` o `@expectedFailure` y el test queda como guardia para siempre.

Ya está comprobado que cada uno de estos tests falla por la razón correcta (la aserción del fallo) y no por un error del propio test.

### Cómo se mantiene el contrato entre los dos repos

- Si cambia una llamada en la tienda: `UPDATE_CONTRACT=1 pnpm test contract`, revisar el diff, copiar `contract/frontend-api-calls.json` a `casspea-v2/contract/` y pasar los tests de la API.
- Si cambia una respuesta en la API: `UPDATE_CONTRACT=1 python manage.py test erp.tests.test_frontend_contract --settings=erp.settings_test`, revisar el diff y copiar `contract/responses/` a `next-casspea/contract/`.
- En un PR del rediseño, cualquier cambio en `contract/` es una señal de alarma que se revisa línea a línea.

## 5. Fases

### Fase 0. Red de seguridad (hecho, en esta rama)

- [x] Línea base medida (sección 1).
- [x] Contratos de rutas, enlaces, llamadas y respuestas, con sus tests.
- [x] 18 fallos documentados, 16 de ellos con un test que los demuestra.

### Fase 1. Arreglar P0 y P1 (próximas dos semanas, antes del pico de Navidad)

Un PR por fallo, rama `feat/…`. El test ya existe: el arreglo está terminado cuando ese test pasa y se le quita la marca de fallo esperado. Los PR de arreglo se basan en los de esta red de seguridad (casspea-v2 #29 y next-casspea #58), que se fusionan primero.

- [ ] BUG-01: quitar `rest_framework_simplejwt` de `requirements.txt`. PR abierto: [casspea-v2 #30](https://github.com/carlosblancosierra/casspea-v2/pull/30).
- [ ] BUG-02: sesiones de checkout privadas. PR abierto: [casspea-v2 #31](https://github.com/carlosblancosierra/casspea-v2/pull/31).
- [ ] BUG-03: solo `payment_status == "paid"` crea un pedido pagado. PR abierto: [casspea-v2 #32](https://github.com/carlosblancosierra/casspea-v2/pull/32). Al fusionarlo, suscribir el webhook de Stripe a `checkout.session.async_payment_succeeded` y `async_payment_failed`.
- [ ] BUG-17: bucle de la recogida en tienda. PR abierto: [next-casspea #59](https://github.com/carlosblancosierra/next-casspea/pull/59).
- [ ] BUG-15: `remotePatterns` limitado a los dominios propios. PR en borrador: [next-casspea #60](https://github.com/carlosblancosierra/next-casspea/pull/60). Antes de fusionarlo, comprobar en la preview que se ven las fotos de producto.
- [ ] BUG-08: página y API de baja de emails. PRs abiertos: [casspea-v2 #33](https://github.com/carlosblancosierra/casspea-v2/pull/33) y [next-casspea #61](https://github.com/carlosblancosierra/next-casspea/pull/61), que se fusionan juntos (o primero el de la tienda).
- [ ] BUG-04: `add_to_cart`. Es imprescindible para tener una base que comparar con el rediseño. PR abierto: [next-casspea #62](https://github.com/carlosblancosierra/next-casspea/pull/62).
- [ ] BUG-06: fecha de recogida en verano. PR abierto: [next-casspea #63](https://github.com/carlosblancosierra/next-casspea/pull/63).
- [ ] BUG-10: 500 en `GET /api/checkout/session/`. PR abierto: [casspea-v2 #34](https://github.com/carlosblancosierra/casspea-v2/pull/34).
- [ ] BUG-07: `payment_intent.payment_failed`. PR abierto: [casspea-v2 #35](https://github.com/carlosblancosierra/casspea-v2/pull/35).
- [ ] BUG-05: solicitudes de chocolate personalizado. PRs abiertos: [casspea-v2 #36](https://github.com/carlosblancosierra/casspea-v2/pull/36) y [next-casspea #64](https://github.com/carlosblancosierra/next-casspea/pull/64).
- [ ] BUG-13: URLs de vuelta de Stripe configurables con `SITE_URL`, orígenes extra de CORS con `CORS_EXTRA_ORIGINS`, y la recogida reconocida por `delivery_speed` en vez del id 34. PRs abiertos: [casspea-v2 #37](https://github.com/carlosblancosierra/casspea-v2/pull/37) y [next-casspea #65](https://github.com/carlosblancosierra/next-casspea/pull/65), que va encima de #63.
- [ ] BUG-18: revisar en Stripe los productos en preventa.
- [ ] BUG-19: aplicar la regla de "Adviento no se recoge" en los endpoints reales (P2).

### Fase 2. Preparar el terreno sin cambiar nada visual (en paralelo a la congelación de Navidad)

1. **Entorno de staging.** Una API aparte (otra app de Heroku), con Stripe en modo test, una base de datos con datos de prueba, `FRONTEND_URL` apuntando a la preview y CORS abierto a los dominios de preview de Amplify (BUG-13). Sin esto, cada PR del rediseño solo se puede probar en producción.
2. **Fijar las versiones del backend** con `pip-compile` o `uv pip compile` y un `requirements.lock`.
3. **Subir Next 14 a 15.5.x en un PR propio**, desplegarlo y dejarlo correr una semana antes de tocar el diseño. En Next 15, el App Router exige React 19: revisar headlessui, framer-motion/motion, react-datepicker, react-tailwindcss-datepicker, @react-google-maps/api y react-snowfall. Mantener Tailwind 3; pasar a Tailwind 4 sería otro proyecto.
4. **Sacar la lógica de los componentes grandes** a hooks y funciones con tests propios, sin cambiar el JSX: `useDeliveryChoice` y `useStorePickup` desde `CheckoutShippingOptions`, y `useBoxBuilder` desde `ProductFormBoxes` y `QuickBoxBuilder`. Después del rediseño, el JSX nuevo usa los mismos hooks.
5. **Reunir las fechas de campaña** en un único `config/campaigns.ts`.
6. **Unificar las dos copias del payload de Stripe** (ver "Otros hallazgos").
7. **Cerrar o pausar el experimento `box_builder`** antes de rediseñar la ficha de producto, o hacer el diseño nuevo como una variante del experimento.
8. **Retirar la página `/dev`** y el código muerto de BUG-16.

### Fase 3. Tests de los recorridos críticos

**3a. Tests de componentes (Jest y Testing Library) para lo que hoy está a 0 %**, en este orden:

| Pieza | Qué comprobar |
|---|---|
| `PackBuilder` y sus pasos | Recorre los pasos, no deja avanzar sin elegir, y el `POST` lleva `pack_customization` con chocolate caliente, tarjeta y corteza |
| `/checkout/address` y `AddressForm` | Valida los campos obligatorios, envía `shipping_address`, avanza a `/checkout/gift-card` y muestra el error de la API |
| `/checkout/gift-card` | Añadir y quitar la tarjeta regalo actualiza el carrito |
| `/checkout/success` | `purchase` se envía una sola vez por pedido, con importe, y no se repite al recargar |
| `/checkout/result` y `/checkout/embedded` | Estados `open`, `complete` y error. Ojo: si Stripe no manda `customer_details`, la API responde 500 (`checkout/stripe_views.py:331`) |
| `ClientAccessGate` y `ClientPortal` | Código erróneo, código correcto, 429 por demasiados intentos y compra en múltiplos de `quantity_step` |
| `redux/services/apiSlice.ts` | Refresco antes de caducar, refresco al recibir un 401 y una sola petición de refresco aunque haya varias en paralelo (mutex) |
| `use-login` y `use-verify` | Login correcto y erróneo; la sesión sigue tras recargar |
| `FlavourPicker` y `ProductFormGeneral` | Suma exacta de `units_per_box`, sabores "coming soon" bloqueados y opciones personalizadas |

**3b. API (Django):**

- `checkout/views.py`: crear y actualizar sesión, opción de envío, recogida y casos de error.
- Paridad entre el payload del checkout alojado y `prepare_stripe_payload` (descuento, productos agotados, envío).
- Webhook con dos líneas del mismo producto.
- `orders/views.py`: búsqueda y cambio de fecha por parte del cliente (`customer/lookup`, `customer/update-shipping-date`), que no tienen autenticación y solo comprueban el email.
- `mails/services.py`: render de cada plantilla con datos reales, sin enlaces rotos.

**3c. E2E con Playwright contra una API simulada**, en CI y en cada PR. Diseño propuesto:

- Un servidor Node pequeño en `e2e/mock-api` que sirve `contract/responses/*.json` y guarda el estado del carrito en memoria. Así los E2E usan exactamente el contrato que la API garantiza.
- La app se construye con `NEXT_PUBLIC_HOST` apuntando a ese servidor. También hace falta durante el build, porque algunas páginas piden datos al generarse.
- Se bloquean los terceros (GTM, Cookiebot, PostHog, Trustpilot, Google Maps y Stripe.js) para que el resultado no dependa de ellos.
- Prueba de humo: las 42 rutas cargan en 390 px y en 1280 px sin errores de JavaScript (`pageerror`) ni `console.error`.
- Seis recorridos, buscando siempre por rol y por texto:
  1. Caja "Surprise me", carrito, dirección, envío y pago. La redirección a Stripe se intercepta.
  2. Caja *pick & mix* con sabores y alérgenos.
  3. Pack builder completo.
  4. Recogida en tienda con día y franja: se guarda la fecha correcta y no hay bucle (BUG-06 y BUG-17).
  5. Código de descuento y umbral de envío gratis de 56 £.
  6. Portal de cliente con código de acceso.

**3d. E2E contra staging con Stripe en modo test:** tarjeta `4242 4242 4242 4242`, webhook reenviado con `stripe listen`, pedido creado y email de confirmación recibido. Se ejecuta a mano antes de cada lanzamiento.

### Fase 4. Línea base antes de diseñar

La base se toma con el diseño actual. Sin ella, no hay forma de saber si el nuevo es mejor.

- **Visual:** capturas de las 42 rutas en 390 px y 1280 px, guardadas como "antes".
- **Rendimiento:** Lighthouse (LCP, CLS e INP) en inicio, `/shop-now`, ficha de producto, carrito y checkout.
- **Negocio:** al menos cuatro semanas de embudo con `add_to_cart` ya arreglado, fuera del pico de Navidad (enero). Conversión por paso y por dispositivo, ticket medio, `api_error` por endpoint y *rage clicks* por URL.
- **Accesibilidad:** auditoría WCAG 2.1 AA de las páginas de compra (contraste, teclado, tamaño de los objetivos táctiles).

### Fase 5. El rediseño, por partes

**Reglas para cada PR del rediseño:**

1. Una página o sección por PR. Nunca a la vez que una subida de versión o un cambio de la API.
2. Primero los colores y las fuentes, con los tokens de `theme/palettes.js`; la página `/admin/palette` sirve para previsualizarlos. Después la estructura.
3. El JSX nuevo usa los hooks extraídos en la Fase 2. No se copia lógica de negocio en componentes nuevos.
4. Detrás de una *feature flag* de PostHog por página, con el diseño antiguo como respaldo, hasta llevar dos semanas al 100 %.
5. Se mantienen URLs, roles, nombres accesibles y los textos que buscan los tests. Si un test tiene que cambiar, el cambio se justifica en el PR.
6. `contract/` no cambia. Si cambia, se explica por qué.
7. Se pasan la prueba de humo E2E y los recorridos afectados en móvil y escritorio.

**Orden propuesto:** tokens, layout (Navbar y Footer), inicio, listados y categorías, ficha de producto (con el experimento cerrado), carrito, checkout (el último y fuera de temporada alta) y, al final, landings y páginas de contenido.

### Fase 6. Lanzamiento y vuelta atrás

1. Preview por PR (rama de Amplify más la API de staging) y la checklist de QA de la sección 6.
2. Lanzamiento gradual con la *feature flag*: 10 %, luego 50 % y luego 100 %, con al menos tres días en cada paso.
3. Vigilar el panel de errores de PostHog, `api_error`, la conversión por paso frente a la base y las ventas por día.
4. **Volver atrás** si la conversión de un paso cae más de un 10 % frente a la base durante tres días, si se dobla la tasa de errores o ante cualquier problema con los pagos. Volver atrás es apagar la flag (inmediato) o redesplegar el build anterior en Amplify.

### Calendario recomendado

| Cuándo | Qué |
|---|---|
| 11–20 nov | Fase 1: P0 y P1 desplegados antes del pico |
| 20 nov – 2 ene | Congelación del checkout: solo arreglos urgentes. Fases 2 y 3 en ramas, sin desplegar. Diseño en Figma |
| Enero | Next 15 a producción, solo. Base de métricas (Fase 4). Primeros PR del rediseño detrás de flags: tokens, layout, inicio |
| Febrero | Listados y ficha. Nada de cambios grandes en las 3 semanas antes de San Valentín |
| Finales de febrero y marzo | Carrito y checkout, con recorridos E2E y staging. Ojo al Día de la Madre (7 de marzo de 2027) |

## 6. Checklist de QA antes de cada lanzamiento

En móvil (iPhone/Safari y Android/Chrome) y en escritorio:

- [ ] Compra completa con tarjeta de prueba: el pedido aparece en `/orders` y llega el email con logo y enlaces que funcionan.
- [ ] Recogida en tienda: día y franja guardados bien y la página no se queda colgada.
- [ ] Envío programado y envío lo antes posible; avisos de fecha.
- [ ] Código de descuento válido, caducado y por debajo del mínimo.
- [ ] Envío gratis al pasar de 56 £.
- [ ] Producto agotado; tienda cerrada (`STORE_ORDER_DEADLINE`).
- [ ] Caja *pick & mix*, "Surprise me", pack y tarjeta regalo.
- [ ] Portal de cliente con código.
- [ ] Login de administración y lista de pedidos.
- [ ] Banner de cookies: aceptar y rechazar; la analítica respeta la elección.
- [ ] Páginas 404 y de error.
- [ ] Títulos y descripciones de las páginas principales.

## 7. Comandos

Tienda:

```bash
pnpm test                            # todos los tests
UPDATE_CONTRACT=1 pnpm test contract # aceptar un cambio de contrato (revisar el diff)
pnpm typecheck && pnpm lint && pnpm build
```

API:

```bash
python manage.py test --settings=erp.settings_test
UPDATE_CONTRACT=1 python manage.py test erp.tests.test_frontend_contract --settings=erp.settings_test
```

## Anexo: rutas por importancia

| Importancia | Rutas |
|---|---|
| Compra (crítica) | `/`, `/shop-now`, `/shop-now/[product_slug]`, `/shop-now/categories`, `/shop-now/categories/[category_slug]`, `/cart`, `/checkout/address`, `/checkout/gift-card`, `/checkout/confirm`, `/checkout/embedded`, `/checkout/result`, `/checkout/success`, `/checkout/cancel`, `/clients/[slug]`, `/personalised`, `/personalised/[slug]` |
| Contenido y SEO | `/about-us`, `/faq`, `/contact`, `/flavours`, `/blog/newsletter-july-2025`, `/blog/why-chocolate-tastes-different`, `/subscribe`, `/store` |
| Campañas | `/landing/blue`, `/landing/gold`, `/landing/thermomix`, sus páginas `thank-you`, `/landing/fathers-day`, `/landing/summer-break`, `/blue`, `/gold` |
| Equipo | `/orders`, `/admin/experiments`, `/admin/palette`, `/admin/sms-contacts`, `/admin/summer-break`, `/addresses/stats`, `/auth/login` |
| Retirar | `/dev` |
