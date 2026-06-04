# Via Report

App móvil para reportar incidentes viales en zonas rurales con soporte offline.

---

## Requisitos previos

- Node.js 18+
- npm
- Ionic CLI: `npm install -g @ionic/cli`
- Angular CLI: `npm install -g @angular/cli`
- Android Studio (para Android)
- Xcode (para iOS, solo Mac)

---

## Instalación y ejecución

```bash
git clone <https://github.com/Wpcarmona/via-report.git>
cd via-report
npm install
npm run build
npx cap sync

ionic serve              # para web
ionic cap run android    # para Android
ionic cap run ios        # para iOS
```

---

## Configuración de Firebase

1. Crear proyecto en [console.firebase.google.com](https://console.firebase.google.com)
2. Habilitar **Authentication → Email/Password**
3. Crear **Firestore** en modo prueba
4. Registrar app web y copiar `firebaseConfig`
5. Pegar las credenciales en `src/environments/environment.ts`

---

## Configuración de SQLite

**Android**
- Abrir el proyecto en Android Studio
- El Gradle sync automático instala las dependencias necesarias

**iOS**
- Ejecutar `npx cap open ios`
- En Xcode, hacer **Pod install**
- Agregar `NSCameraUsageDescription` y permisos de ubicación en `Info.plist` (ya incluidos)

---

## Estrategia de sincronización offline

### Principio general: Local First

La app sigue una arquitectura **offline-first**: SQLite es la fuente de verdad en el dispositivo. Firestore actúa únicamente como backend de sincronización, nunca como fuente primaria en tiempo real.

---

### Estados de sincronización (`SyncStatus`)

Cada reporte tiene un campo `syncStatus` que refleja su estado en todo momento:

| Estado | Descripción |
|---|---|
| `PENDING` | Creado o editado localmente, aún no subido a Firestore |
| `SYNCING` | Actualmente en proceso de subida |
| `SYNCED` | Existe en Firestore y está actualizado |
| `ERROR` | Intentó sincronizar y falló |
| `DELETED` | Eliminado localmente mientras estaba offline, pendiente de borrar en Firestore |

---

### Flujo de creación offline

1. El usuario crea un reporte sin conexión.
2. La foto se guarda en el **filesystem del dispositivo** (`@capacitor/filesystem`). Solo la ruta local se almacena en SQLite, nunca el binario.
3. El reporte se persiste en SQLite con `syncStatus = PENDING`.
4. La UI muestra el reporte inmediatamente con ícono de nube (pendiente).

---

### Flujo de sincronización al reconectar

El `NetworkService` expone un **Signal reactivo** (`online`) que escucha cambios de red mediante `@capacitor/network`. Cuando cambia a `true`:

1. El `effect()` en `AppComponent` detecta el cambio y llama a `SyncService.syncPendingReports()`.
2. Adicionalmente, `ionViewWillEnter` en el listado también dispara la sync si hay conexión, garantizando que incluso si el effect no se disparó, la sync ocurre al navegar.

**Dentro de `syncPendingReports()`:**

```
Para cada reporte con PENDING:
  1. Actualiza estado → SYNCING  (usuario ve el ícono girando)
  2. Si tiene foto local → sube a Cloudinary → obtiene URL pública
  3. Actualiza la URL de la foto en SQLite
  4. Guarda el reporte en Firestore con la URL de Cloudinary
  5. Si éxito → SYNCED | Si falla → ERROR

Para cada reporte con DELETED:
  1. Elimina el documento de Firestore
  2. Elimina la fila de SQLite
```

---

### Eliminación offline

Cuando el usuario elimina un reporte sin conexión:
- Si era `PENDING` (nunca llegó a Firestore): se borra directamente de SQLite.
- Si era `SYNCED` (existe en Firestore): se marca como `DELETED` en SQLite (no se borra la fila). Al reconectar, `syncPendingReports()` lo elimina de Firestore y luego limpia SQLite.
- Mientras tiene estado `DELETED`, se filtra del listado para que no aparezca en la UI.

---

### Descarga de reportes remotos

`SyncService.downloadRemoteReports(userId)` descarga de Firestore los reportes que no existen localmente (por ejemplo, al iniciar sesión en un dispositivo nuevo):

```
Para cada reporte en Firestore:
  - Si no existe en SQLite → crea la fila local
  - Si existe con estado DELETED → lo ignora (evita restaurar reportes borrados offline)
  - Si existe y el remoto tiene updatedAt más reciente → actualiza el local
```

---

### Resolución de conflictos

Si un reporte fue editado en dos dispositivos distintos, gana el que tenga el campo `updatedAt` más reciente. Este campo se actualiza cada vez que el usuario edita un reporte, tanto en SQLite como en Firestore.

---

### Visibilidad en tiempo real

Los cambios de `syncStatus` durante la sincronización se propagan a la UI de forma inmediata sin releer SQLite, gracias al Signal `lastStatusUpdate` en `SyncService`. El listado tiene un `effect()` que escucha este signal y actualiza el reporte específico en memoria — el ícono de estado cambia en tiempo real mientras sube.

---

## Checklist de permisos

**Android**
- [x] `INTERNET`
- [x] `CAMERA`
- [x] `READ_EXTERNAL_STORAGE`
- [x] `WRITE_EXTERNAL_STORAGE`
- [x] `ACCESS_FINE_LOCATION`
- [x] `ACCESS_COARSE_LOCATION`

**iOS**
- [x] `NSCameraUsageDescription`
- [x] `NSLocationWhenInUseUsageDescription`
- [x] `NSLocationAlwaysUsageDescription`
- [x] `NSPhotoLibraryUsageDescription`

---

## Generación del AAB para Google Play

```bash
cd android
./gradlew bundleRelease
```

El archivo `.aab` queda en:
```
android/app/build/outputs/bundle/release/
```

---

## Publicación en App Store

1. Abrir el proyecto en Xcode
2. Seleccionar el target y configurar signing con tu **Apple Developer Account**
3. **Product → Archive**
4. En **Xcode Organizer → Distribute App → App Store Connect**
5. Completar metadata en App Store Connect

---

## Tiempo invertido

el tiempo invertido ha sido de 1 dia 