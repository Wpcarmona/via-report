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

Todos los reportes se guardan primero en SQLite local con `syncStatus = PENDING`. Al recuperar conexión, `SyncService` detecta el cambio a través de `NetworkService` (signal). Toma los reportes con `syncStatus = PENDING`, los marca como `SYNCING` y los sube a Firestore. Si la subida es exitosa el estado pasa a `SYNCED`; si falla, a `ERROR`.

**Resolución de conflictos:** si un reporte existe en ambos lados, gana el que tenga `updatedAt` más reciente.

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