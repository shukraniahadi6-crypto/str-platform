# Google Maps API Integration Guide

## Overview

STR Platform uses the Google Maps Platform for:
- **Geocoding** — converting addresses to lat/lng coordinates
- **Distance Matrix** — calculating distances and travel times between points
- **Directions** — turn-by-turn navigation for couriers
- **Maps JavaScript API** — live map display for customers and admins

## Setup

### 1. Enable APIs in Google Cloud Console

Required APIs:
- Maps JavaScript API
- Geocoding API
- Distance Matrix API
- Directions API

### 2. Environment Variables

```bash
GOOGLE_MAPS_API_KEY=AIza...
GOOGLE_MAPS_SERVER_KEY=AIza...   # Server-side key (no browser restriction)
```

## Geocoding an Address

```typescript
import axios from "axios";

async function geocodeAddress(address: string) {
  const res = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
    params: {
      address,
      key: process.env.GOOGLE_MAPS_SERVER_KEY,
    },
  });

  const { lat, lng } = res.data.results[0].geometry.location;
  return { lat, lng };
}
```

## Distance Matrix (ETA Calculation)

```typescript
async function getETA(originLat: number, originLng: number, destLat: number, destLng: number) {
  const res = await axios.get("https://maps.googleapis.com/maps/api/distancematrix/json", {
    params: {
      origins: `${originLat},${originLng}`,
      destinations: `${destLat},${destLng}`,
      mode: "driving",
      traffic_model: "best_guess",
      departure_time: "now",
      key: process.env.GOOGLE_MAPS_SERVER_KEY,
    },
  });

  const element = res.data.rows[0].elements[0];
  return {
    distanceKm: element.distance.value / 1000,
    durationMin: Math.ceil(element.duration_in_traffic.value / 60),
  };
}
```

## Frontend Map (React Component)

```typescript
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface TrackingMapProps {
  courierLat: number;
  courierLng: number;
  pickupLat: number;
  pickupLng: number;
}

export function TrackingMap({ courierLat, courierLng, pickupLat, pickupLng }: TrackingMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      center={{ lat: courierLat, lng: courierLng }}
      zoom={14}
      mapContainerStyle={{ width: "100%", height: "400px" }}
    >
      <Marker position={{ lat: courierLat, lng: courierLng }} label="🚛" />
      <Marker position={{ lat: pickupLat, lng: pickupLng }} label="📦" />
    </GoogleMap>
  );
}
```

## Common Gotchas

| Issue | Solution |
|---|---|
| `REQUEST_DENIED` | Verify API key and that the required API is enabled |
| High costs | Use server-side Distance Matrix only on status changes, not per-second |
| Map not loading | Ensure `NEXT_PUBLIC_GOOGLE_MAPS_KEY` is set in Next.js environment |
| Rate limits | Implement local caching of ETA results for 30 seconds |

## Useful Links

- [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Geocoding API](https://developers.google.com/maps/documentation/geocoding)
- [Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix)
