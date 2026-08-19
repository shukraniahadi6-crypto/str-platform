"""
python-examples.py
Python client examples for the STR Platform API.
Uses the requests library for HTTP and websocket-client for real-time events.

Install: pip install requests websocket-client
"""

import os
import json
import time
import hashlib
import hmac
import requests

BASE_URL = os.getenv("STR_API_URL", "https://api.strplatform.com/api/v1")


# ─── Auth ─────────────────────────────────────────────────────────────────────

class STRAuthClient:
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.access_token: str | None = None
        self.refresh_token: str | None = None

    def login(self, email: str, password: str) -> dict:
        res = requests.post(
            f"{self.base_url}/auth/login",
            json={"email": email, "password": password},
        )
        res.raise_for_status()
        data = res.json()
        self.access_token = data["accessToken"]
        self.refresh_token = data["refreshToken"]
        return data

    def refresh(self) -> dict:
        res = requests.post(
            f"{self.base_url}/auth/refresh",
            json={"refreshToken": self.refresh_token},
        )
        res.raise_for_status()
        data = res.json()
        self.access_token = data["accessToken"]
        self.refresh_token = data["refreshToken"]
        return data

    @property
    def headers(self) -> dict:
        return {"Authorization": f"******"}


# ─── Jobs ─────────────────────────────────────────────────────────────────────

class STRJobsClient:
    def __init__(self, auth: STRAuthClient):
        self.auth = auth

    def create_estimate(self, image_urls: list[str], address: str) -> dict:
        res = requests.post(
            f"{BASE_URL}/jobs/estimate",
            headers=self.auth.headers,
            json={"imageUrls": image_urls, "address": address},
        )
        res.raise_for_status()
        return res.json()

    def create_job(self, estimate_id: str, address_id: str, scheduled_at: str) -> dict:
        res = requests.post(
            f"{BASE_URL}/jobs",
            headers=self.auth.headers,
            json={
                "estimateId": estimate_id,
                "addressId": address_id,
                "scheduledAt": scheduled_at,
                "allowBatching": True,
            },
        )
        res.raise_for_status()
        return res.json()

    def list_jobs(self, status: str | None = None, limit: int = 20) -> dict:
        params = {"limit": limit}
        if status:
            params["status"] = status
        res = requests.get(
            f"{BASE_URL}/jobs",
            headers=self.auth.headers,
            params=params,
        )
        res.raise_for_status()
        return res.json()

    def get_job(self, job_id: str) -> dict:
        res = requests.get(
            f"{BASE_URL}/jobs/{job_id}",
            headers=self.auth.headers,
        )
        res.raise_for_status()
        return res.json()


# ─── Ledger ───────────────────────────────────────────────────────────────────

class STRLedgerClient:
    def __init__(self, auth: STRAuthClient):
        self.auth = auth

    def get_balance(self) -> dict:
        res = requests.get(
            f"{BASE_URL}/ledger/balance",
            headers=self.auth.headers,
        )
        res.raise_for_status()
        return res.json()

    def list_entries(self, limit: int = 20) -> dict:
        res = requests.get(
            f"{BASE_URL}/ledger/entries",
            headers=self.auth.headers,
            params={"limit": limit},
        )
        res.raise_for_status()
        return res.json()


# ─── Webhook Verification ─────────────────────────────────────────────────────

def verify_webhook_signature(raw_body: bytes, signature: str, secret: str) -> bool:
    """Verify the X-STR-Signature header on incoming webhook payloads."""
    expected = hmac.new(
        secret.encode(),
        raw_body,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


# ─── Example Usage ───────────────────────────────────────────────────────────

def main():
    auth = STRAuthClient()
    auth.login("jane@example.com", "Str0ng!Pass")

    jobs_client = STRJobsClient(auth)
    ledger_client = STRLedgerClient(auth)

    # Get balance
    balance = ledger_client.get_balance()
    print(f"Available balance: ${balance['available']:.2f}")

    # List completed jobs
    jobs = jobs_client.list_jobs(status="completed")
    print(f"Completed jobs: {jobs['pagination']['total']}")

    for job in jobs["data"]:
        print(f"  - {job['id']}: ${job.get('finalPrice', 'N/A')} on {job['scheduledAt'][:10]}")


if __name__ == "__main__":
    main()
