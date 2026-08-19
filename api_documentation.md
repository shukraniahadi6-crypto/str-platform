# API Documentation: Shuk Trash Removal (STR)
**Subject:** Endpoints, Payloads, and Response Specs

---

## 1. Customer & Booking endpoints

### POST `/api/v1/jobs`
Creates an on-demand or scheduled trash pickup request.
* **Payload:**
  ```json
  {
    "vendorName": "Elm Street Bistro",
    "jobType": "express",
    "wasteCategory": "construction",
    "estimatedVolumeYd3": 4.5,
    "pickupAddress": "742 Evergreen Terrace",
    "pickupLat": 37.7749,
    "pickupLng": -122.4194,
    "isUpcycleRequested": true,
    "upcycleDescription": "Oak wooden beams"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "job": {
      "id": "JOB-101",
      "status": "unassigned",
      "quotedPrice": 187.50,
      "createdAt": "2026-08-11T04:12:00Z"
    }
  }
  ```

---

## 2. Courier & Telemetry Endpoints

### GET `/api/v1/offers`
Lists available jobs matching the online courier's vehicle capacity.
* **Response (200 OK):**
  ```json
  [
    {
      "id": "OFFER-701",
      "jobId": "JOB-102",
      "pickupAddress": "1204 Pine Crest Ave",
      "upfrontPay": {
        "basePay": 45.00,
        "distancePay": 12.00,
        "weightAllowance": 18.00,
        "estimatedTip": 10.00,
        "totalGuaranteed": 90.00
      }
    }
  ]
  ```

### POST `/api/v1/offers/{offer_id}/accept`
Accepts a job and routes it to the courier. Lock-in navigation.
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "message": "Offer accepted! Navigation locked in."
  }
  ```

---

## 3. Admin & HQ Operations Endpoints

### GET `/api/v1/ledger`
Retrieves double-entry bookkeeping details for ledger verification. Includes founder 45% profit share.
* **Response (200 OK):**
  ```json
  {
    "entries": [
      {
        "id": "TX-501",
        "jobId": "JOB-101",
        "amount": 165.00,
        "ownerPayout45": 16.42
      }
    ],
    "ledgerVerified": true
  }
  ```
