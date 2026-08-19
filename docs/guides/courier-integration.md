# Courier Integration Guide

## Overview

This guide covers onboarding as a courier (hauler) on the STR Platform, receiving offer pings, completing jobs, and getting paid.

## Step 1: Register as a Courier

1. Sign up at `https://app.strplatform.com/signup`
2. Select **Courier** as your role
3. Complete identity verification (driver's license + vehicle registration)
4. Wait 1–2 business days for verification approval

## Step 2: Connect Your Stripe Account

1. In the courier dashboard, go to **Earnings → Setup Payouts**
2. Complete Stripe Express onboarding (takes ~5 minutes)
3. Link your bank account or debit card for instant payouts

## Step 3: Complete Academy Courses

Before receiving job offers, complete at least the mandatory safety courses:
- **Heavy Loads Safety** (15 min) — unlocks standard household jobs
- Additional courses unlock higher-value job categories (hazmat, e-waste)

Go to **Academy** in your dashboard to start.

## Step 4: Go Online

1. Set your **vehicle type** (Pickup Truck, Trailer, Box Truck) in your profile
2. Set your **max driving radius** (default 15 km)
3. Toggle **Go Online** to start receiving offers

## Step 5: Accept Offer Pings

When a nearby job matches your capabilities:
- A **30-second ping card** appears with:
  - Upfront guaranteed pay
  - Pickup location and route preview
  - Waste category and any required badges
- Tap **Accept** to claim the job
- Tap **Pass** (or let it expire) to skip

> Tip: Keep the app in the foreground for fastest response. Enable push notifications for background alerts.

## Step 6: Complete the Job

1. Navigate to the pickup address using in-app turn-by-turn directions
2. Upload a **Before photo** when you arrive
3. Load all items and confirm **Loading Complete**
4. Drive to the designated disposal/recycling station
5. Upload an **After photo** showing the clean site
6. Confirm **Disposal Complete** to close the job

## Step 7: Get Paid

- Earnings are credited to your STR wallet immediately after job completion
- Go to **Earnings → Withdraw** to request instant payout
- Instant payouts arrive within minutes for eligible debit cards

## Tips for Earning More

- Complete **all Academy courses** to unlock high-value job categories
- Maintain a **4.8+ star rating** to receive premium job offers first
- Enable **Eco Mode** to route upcyclable items to donation partners and earn Karma Bonuses ($5–$15/item)
- Join **Neighborhood Batches** to earn more per route trip

## Technical Integration (Courier App Developers)

If you're building a custom courier app, use the Socket.io `/dispatch` namespace:

```typescript
import { io } from "socket.io-client";

const dispatch = io("wss://api.strplatform.com/dispatch", {
  auth: { token: courierAccessToken },
});

dispatch.on("offer:ping", (offer) => {
  showOfferCard(offer); // Display 30-second countdown UI
});

// Accept an offer
async function acceptOffer(offerId: string) {
  const job = await strClient.offers.accept(offerId);
  startJobMode(job);
}

// Broadcast location every 5 seconds while on job
setInterval(() => {
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    strClient.tracking.updateLocation(activeJobId, {
      lat: coords.latitude,
      lng: coords.longitude,
      heading: coords.heading ?? 0,
      speed: (coords.speed ?? 0) * 3.6, // m/s → km/h
    });
  });
}, 5000);
```
