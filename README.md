# SimpleBoard

## Wymagania
- Node.js (testowane na wersji 20.15.x) + npm/yarn
- MongoDB (zapisywanie trwałych danych)
- Redis (zapisywanie sesji użytkowników)

## Instalacja
```
npm install
```

## Uruchamianie aplikacji
```
npm run dev
```

## Zmienne środowiskowe
W pliku `.env` można zmienić wartości zmiennych środowiskowych.

```dotenv
NODE_ENV=development # development/production
PORT=3000 # port na którym będzie uruchamiany serwer
MONGODB_URI=mongodb://localhost:27017/simpleboard # adres MongoDB
REDIS_URI=redis://localhost:6379 # adres Redis
SESSION_SECRET= # prywatny klucz do szyfrowania sesji użytkowników
```