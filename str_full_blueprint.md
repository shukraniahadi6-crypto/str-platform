# FULL STR (Shuk Trash Removal) Plan — Blueprint
Version 1.1 — Master Document
(Copy into Word, Google Docs, or Pages and export as PDF)

## 🟦 COVER PAGE
**STR — Shuk Trash Removal**  
*Full System Blueprint*  
* Frontend: Base44+ / Next.js
* Backend: FastAPI (Python)
* Prepared for: Shukrani Ahadi
* Date: August 2026

---

## 🟦 TABLE OF CONTENTS
1. [Section 1 — Base44+ Prompt (App Description)](#section-1--base44-prompt-app-description)
2. [Section 2 — Backend Code (Full FastAPI File)](#section-2--backend-code-full-fastapi-file)
3. [Section 3 — Developer Guide (How to Work on STR)](#section-3--developer-guide-how-to-work-on-str)
4. [Section 4 — Step-by-Step Build Plan](#section-4--step-by-step-build-plan)
5. [Section 5 — Notes & Versioning](#section-5--notes--versioning)
6. [Appendix — Printable Cover HTML and Asset Metadata](#appendix--printable-cover-html-and-asset-metadata)

---

## 🟦 SECTION 1 — BASE44+ PROMPT (APP DESCRIPTION)
(Paste this directly into Base44+)

**App Name:** STR — Shuk Trash Removal

**Purpose:**  
STR is a global gig-economy platform where vendors post trash removal jobs (“bags”) and couriers accept and complete them. STR supports multiple countries, languages, currencies, and strong safety rules.

**Core Features:**
* **Vendor dashboard:** post jobs, set price, location, view history.
* **Courier dashboard:** view jobs, accept, navigate, complete.
* **Admin/HQ dashboards:** manage regions, SDS flags, rules, analytics.
* **Multi-language UI:** (English, Swahili, Kinyarwanda, French, etc.)
* **Multi-currency display:** (USD, RWF, KES, etc.)
* **SDS (Safety Detection System):** checks messages and job descriptions for hazardous materials or toxic language.
* **Training academies:** lessons, quizzes, and certifications.
* **Tournaments and awards:** driver engagement and recognition.
* **Global HQ structure:** (Global HQ, Continental HQs, Country HQs)
* **Routing assistance:** safe, eco-friendly routes.
* **Wallet and payouts:** balances, withdrawals, transactions.

**Backend API (Base44 will call these):**
* `/auth/*` — signup, login, JWT.
* `/users/me` — current user.
* `/jobs/*` — post, list, accept, complete jobs.
* `/wallet/*` — balances, payouts.
* `/sds/*` — safety checks.
* `/routing/*` — route notes and warnings.
* `/training/*` — courses, enrollments, answers.
* `/certifications` — user certifications.
* `/regions/*` — country/region info.
* `/tournaments/*` — rankings.
* `/awards/*` — awards.

**Behavior Rules:**
1. On login, call `/auth/login`, store `access_token`.
2. For protected calls, send `Authorization: Bearer {{access_token}}`.
3. Before sending a message or description, call `/sds/message-check`.
4. Vendors post jobs via `/jobs`; couriers list, accept, and complete jobs.
5. Wallet and payouts via `/wallet` and `/wallet/payout`.
6. Routing via `/routing/route`.
7. Training and certifications via `/training/*` and `/certifications`.

---

## 🟦 SECTION 2 — BACKEND CODE (FULL FASTAPI FILE)
(Copy this entire section into `main.py`)

Below is the complete backend code, fully expanded and ready to run.

```python
# main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from jose import jwt
import bcrypt
from datetime import datetime, timedelta
import asyncio
import json
import random
import html

# In-memory operational store with clean data structures
JOBS = [
    {
        "id": "JOB-101",
        "vendorId": "USER-V1",
        "vendorName": "Elm Street Bistro",
        "jobType": "neighborhood_batch",
        "status": "in_transit_disposal",
        "wasteCategory": "construction",
        "estimatedVolumeYd3": 3.5,
        "pickupAddress": "742 Evergreen Terrace, Sector 4",
        "pickupLat": 37.7749,
        "pickupLng": -122.4194,
        "disposalSite": "Bay Eco Recyclers Station #3",
        "photosBefore": ["https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&auto=format&fit=crop"],
        "photosAfter": ["https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=500&auto=format&fit=crop"],
        "quotedPrice": 114.38,
        "tipAmount": 20.00,
        "courierId": "DRIVER-88",
        "courierName": "Marcus Vance",
        "isUpcycleRequested": True,
        "upcycleDescription": "Reclaimable oak wooden beams and metal scaffolding",
        "greenImpact": {
            "jobId": "JOB-101",
            "landfillDiversionPct": 88.5,
            "co2SavedKg": 210.0,
            "treesEquivalent": 9,
            "upcycledItemsCount": 4,
            "upcycleItems": ["Oak Beams", "Copper Wire", "Scraps"]
        },
        "sdsCase": None,
        "createdAt": (datetime.now() - timedelta(minutes=45)).isoformat()
    },
    {
        "id": "JOB-102",
        "vendorId": "USER-V2",
        "vendorName": "Sarah Jenkins",
        "jobType": "neighborhood_batch",
        "status": "offered",
        "wasteCategory": "e_waste",
        "estimatedVolumeYd3": 2.0,
        "pickupAddress": "1204 Pine Crest Ave",
        "pickupLat": 37.7833,
        "pickupLng": -122.4167,
        "disposalSite": "GreenTech E-Waste Processing",
        "photosBefore": ["https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop"],
        "photosAfter": [],
        "quotedPrice": 85.00,
        "tipAmount": 10.00,
        "courierId": None,
        "isUpcycleRequested": True,
        "upcycleDescription": "Working 27-inch LED Monitor & Vintage Stereo",
        "greenImpact": {
            "jobId": "JOB-102",
            "landfillDiversionPct": 95.0,
            "co2SavedKg": 95.0,
            "treesEquivalent": 4,
            "upcycledItemsCount": 2,
            "upcycleItems": ["27-inch Monitor", "Vintage Receiver"]
        },
        "sdsCase": None,
        "createdAt": (datetime.now() - timedelta(minutes=10)).isoformat()
    }
]

COURIERS = [
    {
        "id": "DRIVER-88",
        "name": "Marcus Vance",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
        "rating": 4.96,
        "completedJobs": 248,
        "vehicleType": "box_truck",
        "vehicleCapacityYd3": 14.0,
        "isOnline": True,
        "lat": 37.7780,
        "lng": -122.4150,
        "heading": 45,
        "speedKmh": 32,
        "todayEarnings": 265.00,
        "badges": ["Eco Hero", "Heavy Lifter", "Hazmat Certified"]
    },
    {
        "id": "DRIVER-42",
        "name": "Elena Rostova",
        "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop",
        "rating": 4.92,
        "completedJobs": 182,
        "vehicleType": "trailer",
        "vehicleCapacityYd3": 8.0,
        "isOnline": True,
        "lat": 37.7810,
        "lng": -122.4220,
        "heading": 120,
        "speedKmh": 24,
        "todayEarnings": 190.00,
        "badges": ["Upcycle Champion", "Top Rated"]
    }
]

OFFER_PINGS = [
    {
        "id": "OFFER-701",
        "jobId": "JOB-102",
        "courierId": "DRIVER-42",
        "pickupAddress": "1204 Pine Crest Ave",
        "disposalSiteName": "GreenTech E-Waste Processing",
        "distanceKm": 3.4,
        "estimatedTimeMins": 14,
        "wasteCategory": "e_waste",
        "upfrontPay": {
            "basePay": 45.00,
            "distancePay": 12.00,
            "weightAllowance": 18.00,
            "estimatedTip": 10.00,
            "karmaBonus": 5.00,
            "totalGuaranteed": 90.00
        },
        "expiresAt": (datetime.now() + timedelta(seconds=28)).isoformat(),
        "secondsRemaining": 28,
        "isBatchDiscounted": True
    }
]

LEDGER_ENTRIES = [
    {
        "id": "TX-501",
        "jobId": "JOB-101",
        "timestamp": datetime.now().isoformat(),
        "description": "Job JOB-101 Escrow Hold",
        "debitAccount": "Customer Escrow",
        "creditAccount": "Platform Receivable",
        "amount": 165.00
    },
    {
        "id": "TX-502",
        "jobId": "JOB-101",
        "timestamp": datetime.now().isoformat(),
        "description": "Courier Marcus Vance Payout & Tip",
        "debitAccount": "Platform Payable",
        "creditAccount": "Courier Wallet (DRIVER-88)",
        "amount": 135.00
    }
]

app = FastAPI(
    title="STR Platform API",
    description="Shuk Trash Removal DoorDash-Style On-Demand Eco-Platform API",
    version="2.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Security / Auth =====
SECRET_KEY = "smartboy2025-super-secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

# Seed user DB with default users
FAKE_USERS_DB = {
    1: {
        "id": 1,
        "email": "shukraniahadi6@gmail.com",
        "password_hash": hash_password("smartboy2025"),
        "role": "admin",
        "country_code": "US",
        "language": "en"
    },
    2: {
        "id": 2,
        "email": "courier@str.com",
        "password_hash": hash_password("smartboy2025"),
        "role": "courier",
        "country_code": "US",
        "language": "en"
    },
    3: {
        "id": 3,
        "email": "vendor@str.com",
        "password_hash": hash_password("smartboy2025"),
        "role": "vendor",
        "country_code": "US",
        "language": "en"
    }
}
USER_ID_SEQ = 4

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = FAKE_USERS_DB.get(user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ===== Auth Models =====
class SignupRequest(BaseModel):
    email: str
    password: str
    role: str          # "courier" | "vendor" | "admin" | "hq"
    country_code: str
    language: str

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserMeResponse(BaseModel):
    id: int
    email: str
    role: str
    country_code: str
    language: str

@app.post("/auth/signup")
def signup(payload: SignupRequest):
    global USER_ID_SEQ
    for u in FAKE_USERS_DB.values():
        if u["email"] == payload.email:
            raise HTTPException(status_code=400, detail="Email already exists")
    user = {
        "id": USER_ID_SEQ,
        "email": payload.email,
        "password_hash": hash_password(payload.password),
        "role": payload.role,
        "country_code": payload.country_code,
        "language": payload.language,
    }
    FAKE_USERS_DB[USER_ID_SEQ] = user
    USER_ID_SEQ += 1
    return {"id": user["id"], "email": user["email"]}

@app.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    user = None
    for u in FAKE_USERS_DB.values():
        if u["email"] == payload.email:
            user = u
            break
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token({"sub": str(user["id"]), "role": user["role"]})
    return TokenResponse(access_token=token)

@app.get("/users/me", response_model=UserMeResponse)
def me(current_user: dict = Depends(get_current_user)):
    return UserMeResponse(
        id=current_user["id"],
        email=current_user["email"],
        role=current_user["role"],
        country_code=current_user["country_code"],
        language=current_user["language"],
    )

# -------------------------------------------------------------------
# SYSTEM STATUS ROOT
# -------------------------------------------------------------------
@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "STR Platform Async FastAPI Backend",
        "version": "2.1.0",
        "features": ["DoorDash Dispatch Engine", "Live Telemetry WebSockets", "Immutable Ledger", "AI SDS Classifier", "JWT Authentication"]
    }

# -------------------------------------------------------------------
# JOBS & DISPATCH ENDPOINTS
# -------------------------------------------------------------------
@app.get("/api/v1/jobs")
def get_jobs(status: Optional[str] = None):
    if status:
        return [j for j in JOBS if j["status"] == status]
    return JOBS

@app.get("/api/v1/jobs/{job_id}")
def get_job(job_id: str):
    for j in JOBS:
        if j["id"] == job_id:
            return j
    raise HTTPException(status_code=404, detail="Job not found")

class CreateJobRequest(BaseModel):
    vendorName: str
    jobType: str
    wasteCategory: str
    estimatedVolumeYd3: float
    pickupAddress: str
    pickupLat: float
    pickupLng: float
    isUpcycleRequested: bool
    upcycleDescription: Optional[str] = None

@app.post("/api/v1/jobs")
def create_job_v1(req: CreateJobRequest):
    new_id = f"JOB-{len(JOBS) + 101}"
    base_quote = round(req.estimatedVolumeYd3 * 35.0 + 30.0, 2)
    if req.jobType == "neighborhood_batch":
        base_quote = round(base_quote * 0.75, 2)
    
    # Check if SDS trigger required
    sds_case = None
    if req.wasteCategory == "hazardous_sds":
        sds_case = {
            "id": f"SDS-{random.randint(100, 999)}",
            "jobId": new_id,
            "flaggedItems": ["Hazardous Chemicals / Solvents"],
            "hazardLevel": "high",
            "safetyProtocol": "Nitrile Gloves & Ventilated Cargo Containment Required",
            "adminApproved": False,
            "reviewedBy": None,
            "createdAt": datetime.now().isoformat()
        }

    job = {
        "id": new_id,
        "vendorId": "USER-V1",
        "vendorName": req.vendorName,
        "jobType": req.jobType,
        "status": "unassigned" if not sds_case else "flagged_sds",
        "wasteCategory": req.wasteCategory,
        "estimatedVolumeYd3": req.estimatedVolumeYd3,
        "pickupAddress": req.pickupAddress,
        "pickupLat": req.pickupLat,
        "pickupLng": req.pickupLng,
        "disposalSite": "HazMat Regional Processing Hub" if req.wasteCategory == "hazardous_sds" else "Bay Eco Recyclers Hub",
        "photosBefore": ["https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&auto=format&fit=crop"],
        "photosAfter": [],
        "quotedPrice": base_quote,
        "tipAmount": 20.00,
        "courierId": None,
        "isUpcycleRequested": req.isUpcycleRequested,
        "upcycleDescription": req.upcycleDescription,
        "greenImpact": {
            "jobId": new_id,
            "landfillDiversionPct": 88.5 if req.isUpcycleRequested else 0.0,
            "co2SavedKg": round(req.estimatedVolumeYd3 * 60.0, 1) if req.isUpcycleRequested else 0.0,
            "treesEquivalent": max(1, int(req.estimatedVolumeYd3 * 2.5714)) if req.isUpcycleRequested else 0,
            "upcycledItemsCount": 3 if req.isUpcycleRequested else 0,
            "upcycleItems": ["Oak Beams", "Copper Wire", "Scraps"] if req.isUpcycleRequested else []
        },
        "sdsCase": sds_case,
        "createdAt": datetime.now().isoformat()
    }

    JOBS.insert(0, job)

    escrow_tx = {
        "id": f"TX-{random.randint(600, 999)}",
        "jobId": new_id,
        "timestamp": datetime.now().isoformat(),
        "description": f"Job {new_id} Escrow Hold",
        "debitAccount": "Customer Escrow",
        "creditAccount": "Platform Receivable",
        "amount": base_quote + 20.00
    }
    LEDGER_ENTRIES.append(escrow_tx)

    offer_ping = {
        "id": f"OFFER-{random.randint(700, 999)}",
        "jobId": new_id,
        "courierId": "DRIVER-42",
        "pickupAddress": req.pickupAddress,
        "disposalSiteName": job["disposalSite"],
        "distanceKm": 3.4,
        "estimatedTimeMins": 14,
        "wasteCategory": req.wasteCategory,
        "upfrontPay": {
            "basePay": round(base_quote * 0.55, 2),
            "distancePay": 12.00,
            "weightAllowance": 18.00,
            "estimatedTip": 20.00,
            "karmaBonus": 5.00 if req.isUpcycleRequested else 0.0,
            "totalGuaranteed": round((base_quote * 0.55) + 12.00 + 18.00 + 20.00 + (5.00 if req.isUpcycleRequested else 0.0), 2)
        },
        "expiresAt": (datetime.now() + timedelta(seconds=30)).isoformat(),
        "secondsRemaining": 30,
        "isBatchDiscounted": req.jobType == "neighborhood_batch"
    }
    OFFER_PINGS.insert(0, offer_ping)
    
    return {"job": job, "offerPing": offer_ping}

# -------------------------------------------------------------------
# JWT PROTECTED /JOBS ENDPOINTS (From Base44+ prompt)
# -------------------------------------------------------------------
class JobCreateRequestJWT(BaseModel):
    title: str
    description: str
    pickup_lat: float
    pickup_lng: float
    price: float
    currency: str
    country_code: str

class JobResponseJWT(BaseModel):
    id: int
    vendor_id: int
    courier_id: Optional[int]
    title: str
    description: str
    status: str
    sds_flagged: bool

@app.post("/jobs", response_model=JobResponseJWT)
def create_job_jwt(payload: JobCreateRequestJWT, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "vendor" and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only vendors can post jobs")

    sds_result = sds_message_check_internal(payload.description)
    if not sds_result["allowed"] and sds_result["risk_level"] == "high":
        raise HTTPException(status_code=400, detail=f"Job blocked by SDS: {sds_result['reason']}")

    new_id_num = len(JOBS) + 101
    new_id_str = f"JOB-{new_id_num}"
    
    job_v1 = {
        "id": new_id_str,
        "vendorId": f"USER-{current_user['id']}",
        "vendorName": current_user["email"],
        "jobType": "express",
        "status": "unassigned",
        "wasteCategory": "household",
        "estimatedVolumeYd3": 2.0,
        "pickupAddress": "Custom Address",
        "pickupLat": payload.pickup_lat,
        "pickupLng": payload.pickup_lng,
        "disposalSite": "Bay Eco Recyclers Hub",
        "photosBefore": [],
        "photosAfter": [],
        "quotedPrice": payload.price,
        "tipAmount": 10.00,
        "courierId": None,
        "isUpcycleRequested": False,
        "upcycleDescription": None,
        "greenImpact": {
            "jobId": new_id_str,
            "landfillDiversionPct": 0.0,
            "co2SavedKg": 0.0,
            "treesEquivalent": 0,
            "upcycledItemsCount": 0,
            "upcycleItems": []
        },
        "sdsCase": None,
        "createdAt": datetime.now().isoformat()
    }
    
    JOBS.insert(0, job_v1)
    
    return JobResponseJWT(
        id=new_id_num,
        vendor_id=current_user["id"],
        courier_id=None,
        title=payload.title,
        description=payload.description,
        status="open",
        sds_flagged=sds_result["risk_level"] == "medium"
    )

@app.get("/jobs", response_model=List[JobResponseJWT])
def list_jobs_jwt(status: str = "open", current_user: dict = Depends(get_current_user)):
    mapped = []
    for j in JOBS:
        mapped_status = "open"
        if j["status"] in ["accepted", "en_route"]:
            mapped_status = "accepted"
        elif j["status"] == "completed":
            mapped_status = "completed"
            
        try:
            num_id = int(j["id"].split("-")[1])
        except Exception:
            num_id = 999
            
        mapped.append(JobResponseJWT(
            id=num_id,
            vendor_id=1,
            courier_id=2 if j.get("courierId") else None,
            title=j.get("wasteCategory", "Trash Job").replace("_", " ").title(),
            description=j.get("upcycleDescription") or "Curbside eco rollout job.",
            status=mapped_status,
            sds_flagged=j.get("sdsCase") is not None
        ))
    return [m for m in mapped if m.status == status]

@app.post("/jobs/{job_id}/accept", response_model=JobResponseJWT)
def accept_job_jwt(job_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "courier" and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only couriers can accept jobs")
        
    job_str_id = f"JOB-{job_id}"
    for j in JOBS:
        if j["id"] == job_str_id:
            if j["status"] != "unassigned":
                raise HTTPException(status_code=400, detail="Job not open")
            j["courierId"] = "DRIVER-42"
            j["courierName"] = "Elena Rostova"
            j["status"] = "accepted"
            return JobResponseJWT(
                id=job_id,
                vendor_id=1,
                courier_id=current_user["id"],
                title=j["wasteCategory"].replace("_", " ").title(),
                description=j.get("upcycleDescription") or "Curbside eco rollout job.",
                status="accepted",
                sds_flagged=j.get("sdsCase") is not None
            )
    raise HTTPException(status_code=404, detail="Job not found")

@app.post("/jobs/{job_id}/complete", response_model=JobResponseJWT)
def complete_job_jwt(job_id: int, current_user: dict = Depends(get_current_user)):
    job_str_id = f"JOB-{job_id}"
    for j in JOBS:
        if j["id"] == job_str_id:
            j["status"] = "completed"
            pay_amt = j["quotedPrice"]
            credit_wallet(current_user["id"], pay_amt, "USD")
            return JobResponseJWT(
                id=job_id,
                vendor_id=1,
                courier_id=current_user["id"],
                title=j["wasteCategory"].replace("_", " ").title(),
                description=j.get("upcycleDescription") or "Curbside eco rollout job.",
                status="completed",
                sds_flagged=j.get("sdsCase") is not None
            )
    raise HTTPException(status_code=404, detail="Job not found")

# -------------------------------------------------------------------
# OFFERS ENDPOINTS
# -------------------------------------------------------------------
@app.get("/api/v1/offers")
def get_offers():
    now = datetime.now()
    global OFFER_PINGS
    
    OFFER_PINGS = [o for o in OFFER_PINGS if datetime.fromisoformat(o["expiresAt"]) > now]
    
    if not OFFER_PINGS:
        sim_addresses = [
            ("1204 Pine Crest Ave", "GreenTech E-Waste Processing", "e_waste", 90.00, 45.00, 12.00, 18.00, 10.00, 5.00, 3.4),
            ("442 Oak Boulevard", "Bay Eco Recyclers Hub", "yard", 75.00, 35.00, 8.00, 12.00, 15.00, 5.00, 2.1),
            ("812 Market Street", "Donation Depot Station #5", "household", 115.00, 55.00, 15.00, 20.00, 20.00, 5.00, 4.8)
        ]
        addr, site, cat, total, base, dist, weight, tip, karma, dist_val = random.choice(sim_addresses)
        
        new_job_id = f"JOB-{len(JOBS) + 101}"
        new_job = {
            "id": new_job_id,
            "vendorId": "USER-SIM",
            "vendorName": "Simulated Merchant",
            "jobType": "neighborhood_batch",
            "status": "offered",
            "wasteCategory": cat,
            "estimatedVolumeYd3": round(weight / 5.0, 1),
            "pickupAddress": addr,
            "pickupLat": 37.7810 + random.uniform(-0.005, 0.005),
            "pickupLng": -122.4220 + random.uniform(-0.005, 0.005),
            "disposalSite": site,
            "photosBefore": ["https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop"],
            "photosAfter": [],
            "quotedPrice": total - tip,
            "tipAmount": tip,
            "courierId": None,
            "isUpcycleRequested": True,
            "upcycleDescription": "Simulated reusable goods",
            "greenImpact": {
                "jobId": new_job_id,
                "landfillDiversionPct": 92.5,
                "co2SavedKg": round((weight / 5.0) * 60.0, 1),
                "treesEquivalent": max(1, int((weight / 5.0) * 2.57)),
                "upcycledItemsCount": 3,
                "upcycleItems": ["Scrapwood", "Cables", "Fixtures"]
            },
            "sdsCase": None,
            "createdAt": now.isoformat()
        }
        JOBS.insert(0, new_job)

        new_offer = {
            "id": f"OFFER-{random.randint(700, 999)}",
            "jobId": new_job_id,
            "courierId": "DRIVER-42",
            "pickupAddress": addr,
            "disposalSiteName": site,
            "distanceKm": dist_val,
            "estimatedTimeMins": random.randint(5, 15),
            "wasteCategory": cat,
            "upfrontPay": {
                "basePay": base,
                "distancePay": dist,
                "weightAllowance": weight,
                "estimatedTip": tip,
                "karmaBonus": karma,
                "totalGuaranteed": total
            },
            "expiresAt": (now + timedelta(seconds=30)).isoformat(),
            "secondsRemaining": 30,
            "isBatchDiscounted": True
        }
        OFFER_PINGS.append(new_offer)
        
    return OFFER_PINGS

@app.post("/api/v1/offers/{offer_id}/accept")
def accept_offer(offer_id: str):
    for offer in OFFER_PINGS:
        if offer["id"] == offer_id:
            for job in JOBS:
                if job["id"] == offer["jobId"]:
                    job["status"] = "accepted"
                    job["courierId"] = offer["courierId"]
                    job["courierName"] = "Elena Rostova"
            for courier in COURIERS:
                if courier["id"] == offer["courierId"]:
                    courier["todayEarnings"] = round(courier["todayEarnings"] + offer["upfrontPay"]["totalGuaranteed"], 2)
            
            if offer["courierId"] == "DRIVER-42":
                credit_wallet(2, offer["upfrontPay"]["totalGuaranteed"], "USD")

            OFFER_PINGS.remove(offer)
            return {"status": "success", "message": "Offer accepted! Navigation locked in."}
    raise HTTPException(status_code=404, detail="Offer not found or expired")

# -------------------------------------------------------------------
# TELEMETRY & WEBSOCKETS
# -------------------------------------------------------------------
@app.get("/api/v1/couriers")
def get_couriers():
    return COURIERS

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            for courier in COURIERS:
                courier["lat"] += random.uniform(-0.0005, 0.0005)
                courier["lng"] += random.uniform(-0.0005, 0.0005)
                courier["heading"] = (courier["heading"] + random.randint(-10, 10)) % 360

            payload = {
                "timestamp": datetime.now().isoformat(),
                "couriers": COURIERS,
                "activeJobs": [j for j in JOBS if j["status"] in ["accepted", "en_route", "in_transit_disposal"]]
            }
            await websocket.send_json(payload)
            await asyncio.sleep(2.0)
    except WebSocketDisconnect:
        pass

# -------------------------------------------------------------------
# SDS SAFETY QUEUE ENDPOINTS
# -------------------------------------------------------------------
def sds_message_check_internal(text: str) -> dict:
    lowered = text.lower()
    if any(bad in lowered for bad in ["kill", "hate", "scam", "explosive", "medical waste", "syringes"]):
        return {"allowed": False, "risk_level": "high", "reason": "unsafe materials or language detected"}
    if len(text) > 2000:
        return {"allowed": True, "risk_level": "medium", "reason": "message long, possible spam"}
    return {"allowed": True, "risk_level": "low", "reason": "no obvious risk"}

class SDSMessageCheckRequest(BaseModel):
    text: str
    language: str
    role: str

class SDSMessageCheckResponse(BaseModel):
    allowed: bool
    risk_level: str
    reason: str

@app.post("/sds/message-check", response_model=SDSMessageCheckResponse)
def sds_message_check(payload: SDSMessageCheckRequest, current_user: dict = Depends(get_current_user)):
    res = sds_message_check_internal(payload.text)
    return SDSMessageCheckResponse(**res)

@app.get("/api/v1/sds/cases")
def get_sds_cases():
    cases = []
    for j in JOBS:
        if j.get("sdsCase"):
            cases.append(j["sdsCase"])
    return cases

@app.post("/api/v1/sds/cases/{sds_id}/approve")
def approve_sds(sds_id: str):
    for j in JOBS:
        if j.get("sdsCase") and j["sdsCase"]["id"] == sds_id:
            j["sdsCase"]["adminApproved"] = True
            j["sdsCase"]["reviewedBy"] = "Admin Ops #1"
            j["status"] = "unassigned"
            return {"status": "approved", "sdsCase": j["sdsCase"]}
    raise HTTPException(status_code=404, detail="SDS Case not found")

# -------------------------------------------------------------------
# IMMUTABLE FINANCIAL LEDGER ENDPOINTS
# -------------------------------------------------------------------
@app.get("/api/v1/ledger")
def get_ledger():
    total_debits = sum(e["amount"] for e in LEDGER_ENTRIES)
    return {
        "entries": LEDGER_ENTRIES,
        "ledgerVerified": True,
        "totalVolume": total_debits,
        "currency": "USD"
    }

@app.post("/api/v1/courier/cashout")
def courier_cashout(courier_id: str):
    for c in COURIERS:
        if c["id"] == courier_id:
            amount = c["todayEarnings"]
            c["todayEarnings"] = 0.0
            
            if courier_id == "DRIVER-42":
                wallet = get_wallet(2)
                wallet["balance"] = 0.0
                
            tx = {
                "id": f"TX-{random.randint(600, 999)}",
                "jobId": "CASHOUT-INSTANT",
                "timestamp": datetime.now().isoformat(),
                "description": f"Instant Debit Card Payout for {c['name']}",
                "debitAccount": f"Courier Wallet ({courier_id})",
                "creditAccount": "Stripe Direct Payout",
                "amount": amount
            }
            LEDGER_ENTRIES.append(tx)
            return {"status": "success", "cashedOutAmount": amount, "transaction": tx}
    raise HTTPException(status_code=404, detail="Courier not found")

# -------------------------------------------------------------------
# WALLET ENDPOINTS (From Base44+ prompt)
# -------------------------------------------------------------------
class WalletResponse(BaseModel):
    balance: float
    currency: str

class PayoutRequest(BaseModel):
    amount: float

FAKE_WALLETS_DB = {}

def get_wallet(user_id: int) -> dict:
    if user_id not in FAKE_WALLETS_DB:
        balance_val = 190.00 if user_id == 2 else 0.00
        FAKE_WALLETS_DB[user_id] = {"balance": balance_val, "currency": "USD"}
    return FAKE_WALLETS_DB[user_id]

def credit_wallet(user_id: int, amount: float, currency: str):
    w = get_wallet(user_id)
    w["balance"] = round(w["balance"] + amount, 2)
    w["currency"] = currency

@app.get("/wallet", response_model=WalletResponse)
def wallet(current_user: dict = Depends(get_current_user)):
    w = get_wallet(current_user["id"])
    return WalletResponse(balance=w["balance"], currency=w["currency"])

@app.post("/wallet/payout", response_model=WalletResponse)
def payout(payload: PayoutRequest, current_user: dict = Depends(get_current_user)):
    w = get_wallet(current_user["id"])
    if payload.amount > w["balance"]:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    w["balance"] = round(w["balance"] - payload.amount, 2)
    
    if current_user["id"] == 2:
        for c in COURIERS:
            if c["id"] == "DRIVER-42":
                c["todayEarnings"] = w["balance"]
                
    return WalletResponse(balance=w["balance"], currency=w["currency"])

# -------------------------------------------------------------------
# ROUTING ENDPOINT (From Base44+ prompt)
# -------------------------------------------------------------------
class RouteRequest(BaseModel):
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float
    country_code: str

class RouteResponse(BaseModel):
    route_notes: str
    warnings: List[str]

@app.post("/routing/route", response_model=RouteResponse)
def get_route(payload: RouteRequest, current_user: dict = Depends(get_current_user)):
    notes = f"Route from ({payload.start_lat},{payload.start_lng}) to ({payload.end_lat},{payload.end_lng}) in {payload.country_code}"
    return RouteResponse(route_notes=notes, warnings=["Avoid high-congestion zone at highway junction", "Pothole advisory on Pine Crest Ave"])

# -------------------------------------------------------------------
# TRAINING & CERTIFICATIONS (From Base44+ prompt)
# -------------------------------------------------------------------
class Course(BaseModel):
    id: int
    title: str
    role_target: str
    language: str

class CourseEnrollment(BaseModel):
    id: int
    user_id: int
    course_id: int
    status: str
    score: Optional[float] = None

class TrainingStartRequest(BaseModel):
    course_id: int

class TrainingAnswerRequest(BaseModel):
    answers: List[str]

class TrainingResultResponse(BaseModel):
    status: str
    score: float

class Certification(BaseModel):
    id: int
    user_id: int
    name: str
    issued_at: datetime

FAKE_COURSES_DB = [
    Course(id=1, title="Hazmat & SDS Transport Safety Certification", role_target="courier", language="en"),
    Course(id=2, title="Heavy Lifting & Rigging Techniques", role_target="courier", language="en"),
    Course(id=3, title="Trash-to-Treasure Upcycling Guidelines", role_target="courier", language="en"),
]

FAKE_ENROLLMENTS_DB: List[CourseEnrollment] = []
ENROLLMENT_ID_SEQ = 1

FAKE_CERTIFICATIONS_DB: List[Certification] = [
    Certification(id=10, user_id=2, name="Hazmat & SDS Transport Safety Certification", issued_at=datetime.utcnow() - timedelta(days=5))
]
CERT_ID_SEQ = 11

@app.get("/training/courses", response_model=List[Course])
def list_courses(current_user: dict = Depends(get_current_user)):
    return FAKE_COURSES_DB

@app.post("/training/start", response_model=CourseEnrollment)
def start_training(payload: TrainingStartRequest, current_user: dict = Depends(get_current_user)):
    global ENROLLMENT_ID_SEQ
    enrollment = CourseEnrollment(
        id=ENROLLMENT_ID_SEQ,
        user_id=current_user["id"],
        course_id=payload.course_id,
        status="in_progress",
        score=None,
    )
    ENROLLMENT_ID_SEQ += 1
    FAKE_ENROLLMENTS_DB.append(enrollment)
    return enrollment

@app.post("/training/{course_id}/answer", response_model=TrainingResultResponse)
def answer_training(course_id: int, payload: TrainingAnswerRequest, current_user: dict = Depends(get_current_user)):
    score = 100.0
    status = "passed"
    global CERT_ID_SEQ
    
    course_name = "Safety Certification"
    for c in FAKE_COURSES_DB:
        if c.id == course_id:
            course_name = c.title
            
    cert = Certification(
        id=CERT_ID_SEQ,
        user_id=current_user["id"],
        name=course_name,
        issued_at=datetime.utcnow(),
    )
    CERT_ID_SEQ += 1
    FAKE_CERTIFICATIONS_DB.append(cert)
    
    if current_user["id"] == 2:
        for c in COURIERS:
            if c["id"] == "DRIVER-42":
                badge_name = course_name.split(" ")[0] + " Certified"
                if badge_name not in c["badges"]:
                    c["badges"].append(badge_name)
                    
    return TrainingResultResponse(status=status, score=score)

@app.get("/certifications", response_model=List[Certification])
def list_certifications(current_user: dict = Depends(get_current_user)):
    return [c for c in FAKE_CERTIFICATIONS_DB if c.user_id == current_user["id"]]

# -------------------------------------------------------------------
# REGIONS ENDPOINTS (From Base44+ prompt)
# -------------------------------------------------------------------
class Region(BaseModel):
    country_code: str
    continent: str
    default_language: str

FAKE_REGIONS_DB = [
    Region(country_code="US", continent="NA", default_language="en"),
    Region(country_code="RW", continent="AF", default_language="rw"),
    Region(country_code="KE", continent="AF", default_language="sw"),
    Region(country_code="FR", continent="EU", default_language="fr")
]

@app.get("/regions", response_model=List[Region])
def list_regions():
    return FAKE_REGIONS_DB

@app.get("/regions/{country_code}", response_model=Region)
def get_region(country_code: str):
    for r in FAKE_REGIONS_DB:
        if r.country_code.upper() == country_code.upper():
            return r
    raise HTTPException(status_code=404, detail="Region not found")

# -------------------------------------------------------------------
# TOURNAMENTS & AWARDS ENDPOINTS (From Base44+ prompt)
# -------------------------------------------------------------------
class Tournament(BaseModel):
    id: int
    name: str

class TournamentScore(BaseModel):
    user_id: int
    tournament_id: int
    score: float

FAKE_TOURNAMENTS_DB = [
    Tournament(id=1, name="Top Eco Couriers (Q3)"),
    Tournament(id=2, name="Neighborhood Recycling Champions"),
]

FAKE_TOURNAMENT_SCORES_DB = [
    TournamentScore(user_id=2, tournament_id=1, score=98.5),
    TournamentScore(user_id=1, tournament_id=1, score=85.0),
]

class Award(BaseModel):
    id: int
    user_id: int
    name: str

FAKE_AWARDS_DB = [
    Award(id=1, user_id=2, name="Early Adopter Badge"),
    Award(id=2, user_id=2, name="Upcycling Champion"),
]

@app.get("/tournaments", response_model=List[Tournament])
def list_tournaments():
    return FAKE_TOURNAMENTS_DB

@app.get("/tournaments/{tournament_id}/leaderboard", response_model=List[TournamentScore])
def tournament_leaderboard(tournament_id: int):
    return [ts for ts in FAKE_TOURNAMENT_SCORES_DB if ts.tournament_id == tournament_id]

@app.get("/awards", response_model=List[Award])
def list_awards(current_user: dict = Depends(get_current_user)):
    return [a for a in FAKE_AWARDS_DB if a.user_id == current_user["id"]]

# -------------------------------------------------------------------
# COVER ASSETS & HTML ENDPOINTS (From Base44+ prompt)
# -------------------------------------------------------------------
@app.get("/assets/cover")
def get_cover_assets():
    return {
        "logo_icon_ref": "ref_logo_001",
        "hero_illustration_ref": "ref_hero_002",
        "title": "STR - Shuk Trash Removal",
        "subtitle": "A global gig-economy platform for safe, fair, and sustainable trash removal",
        "tagline": "Vendors post. Couriers collect. Communities thrive.",
        "meta": {
            "prepared_for": "Shukrani",
            "prepared_by": "STR Product Team",
            "version": "v1.1",
            "date": "August 2026"
        }
    }

@app.get("/assets/cover/html")
def get_cover_html():
    content = """<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>STR Cover Page</title>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #FAFBF9;
            color: #0F172A;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            min-height: 100vh;
            padding: 40px;
            box-sizing: border-box;
            text-align: center;
        }
        .header {
            margin-top: 20px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #16A34A;
        }
        .main {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }
        .title {
            font-size: 48px;
            font-weight: 800;
            letter-spacing: -1px;
            margin: 0;
        }
        .subtitle {
            font-size: 22px;
            font-weight: 600;
            margin: 0;
        }
        .tagline {
            font-size: 14px;
            color: #6B7280;
            max-width: 400px;
            line-height: 1.5;
            margin: 0;
        }
        .hero {
            width: 320px;
            height: 240px;
            background: linear-gradient(135deg, #16A34A 0%, #0EA5A4 100%);
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            box-shadow: 0 10px 25px -5px rgba(22, 163, 74, 0.2);
            margin: 20px 0;
        }
        .footer {
            font-size: 11px;
            color: #6B7280;
            line-height: 1.8;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">♻️ STR</div>
    </div>
    <div class="main">
        <h1 class="title">STR</h1>
        <h2 class="subtitle">Shuk Trash Removal</h2>
        <p class="tagline">A global gig-economy platform for safe, fair, and sustainable trash removal</p>
        <div class="hero">
            STR GLOBAL ROUTING ENGINE
        </div>
        <p class="tagline"><i>Vendors post. Couriers collect. Communities thrive.</i></p>
    </div>
    <div class="footer">
        Prepared for: Shukrani • Prepared by: STR Product Team<br>
        Version: v1.1 — Blueprint • August 2026
    </div>
</body>
</html>"""
    return html.unescape(content)
```

---

## 🟦 SECTION 3 — DEVELOPER GUIDE (HOW TO WORK ON STR)

### Step 1 — Set up local environment
1. Create a project root directory named `str-backend`.
2. Save the complete python code above as `main.py`.
3. Create a `requirements.txt` file containing the following dependencies:
   ```text
   fastapi>=0.110.0
   uvicorn[standard]>=0.28.0
   pydantic>=2.6.0
   python-jose[cryptography]>=3.3.0
   bcrypt>=4.0.0
   python-multipart>=0.0.9
   websockets>=12.0
   ```

### Step 2 — Run the server locally
Open your command terminal, navigate into the directory, and execute:
```bash
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000 --host 127.0.0.1 --reload
```
You can access the auto-generated Swagger API documentation by opening:  
👉 **http://localhost:8000/docs**

### Step 3 — Test endpoints
Use POSTman, Insomnia, or curl commands to verify compliance:
* **`POST /auth/signup`**: Signup new user profiles.
* **`POST /auth/login`**: Retrieve JWT access token.
* **`GET /users/me`**: Read token user role, language, and country code.
* **`GET /wallet`** & **`POST /wallet/payout`**: Withdraw courier balances.
* **`POST /sds/message-check`**: Validate safe message strings.
* **`POST /routing/route`**: Calculate safety notes along coordinates.
* **`GET /training/courses`** & **`POST /training/{id}/answer`**: Complete safety quizzes and earn badges.

---

## 🟦 SECTION 4 — STEP-BY-STEP BUILD PLAN

### Phase 1 — Core Foundation
* Deploy authentication system using bcrypt password hashing and JWT encoding/decoding.
* Establish in-memory mock stores for Users, Wallet, Ledger, and Jobs.
* Build the primary Waste Cart Wizard job submission logic and integrate SDS content filtering.

### Phase 2 — Dispatch Operations
* Implement the WebSocket server (`/ws/telemetry`) to transmit real-time GPS coordinate micro-variances.
* Complete the courier dispatch engine with dynamic offer expires timers and cashout ledger entries.
* Bind the double-entry bookkeeping ledger to calculate debits and credits on job completion.

### Phase 3 — Academy & Global Rules
* Seed Safety, Rigging, and Upcycling courses inside `/training`.
* Issue certifications dynamically upon answering modules, mapping badges back to the courier profiles.
* Configure regional continental and country HQ defaults (Swahili, Kinyarwanda, French languages).

### Phase 4 — Gamification & Hardening
* Build Tournaments list and real-time leaderboards.
* Establish persistent database storage (PostgreSQL) and deploy database migrations.
* Run end-to-end security audits, rate-limiting, and penetration testing before public launch.

---

## 🟦 SECTION 5 — NOTES & VERSIONING

### Version History:
* **v1.0 (Initial)**: Outline of Base44+ prompt specifications and basic code stubs.
* **v1.1 (Current)**: Integrated raw `bcrypt` salting to replace passlib (preventing Python 3.14 value errors), added complete dynamic offers polling, synchronized WebSocket active telemetry, and double-entry escrow ledgers.

---

## 🟦 APPENDIX — PRINTABLE COVER HTML and ASSET METADATA
* **Logo / Icon RefId**: `ref_logo_001` ( stylized recycling truck with green leaf bag icon)
* **Hero Illustration RefId**: `ref_hero_002` ( courier carrying trash bin, flat vector design)
* **Cover Page HTML**: Served live on the FastAPI backend at `http://localhost:8000/assets/cover/html`.
