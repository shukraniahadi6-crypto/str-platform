import { Client } from '@googlemaps/google-maps-services-js';
import { config } from './config';

let mapsClient: Client | null = null;

export function getMapsClient(): Client {
  if (!mapsClient) {
    mapsClient = new Client({});
  }
  return mapsClient;
}

export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
  const client = getMapsClient();
  const response = await client.geocode({
    params: { address, key: config.google.mapsApiKey },
  });
  if (!response.data.results.length) {
    throw new Error(`No geocoding results for address: ${address}`);
  }
  const location = response.data.results[0].geometry.location;
  return { lat: location.lat, lng: location.lng };
}

export async function getOptimalRoute(
  origin: { lat: number; lng: number },
  waypoints: { lat: number; lng: number }[],
  destination: { lat: number; lng: number }
): Promise<{ distance: number; duration: number; polyline: string }> {
  const client = getMapsClient();
  const waypointStrings = waypoints.map((wp) => `${wp.lat},${wp.lng}`);
  const response = await client.directions({
    params: {
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      waypoints: waypointStrings,
      optimize: true,
      key: config.google.mapsApiKey,
    },
  });
  if (!response.data.routes.length) {
    throw new Error('No route found');
  }
  const route = response.data.routes[0];
  const leg = route.legs[0];
  return {
    distance: leg.distance?.value || 0,
    duration: leg.duration?.value || 0,
    polyline: route.overview_polyline.points,
  };
}
