# Academy & Training Endpoints

Base path: `/api/v1/academy`

---

## `GET /academy/courses`

List all available training courses with completion status for the current courier.

**Roles:** `courier`

**Response `200`:**
```json
[
  {
    "id": "course_hazmat1",
    "title": "Hazmat Handling Level 1",
    "description": "Safe handling of low-to-medium hazard materials including batteries, paint, and solvents.",
    "badge": "hazmat-level-1",
    "estimatedMinutes": 20,
    "isCompleted": false,
    "questions": 10,
    "passingScore": 80
  },
  {
    "id": "course_heavy",
    "title": "Heavy Loads Safety",
    "description": "Techniques for safely loading and transporting heavy and bulky items.",
    "badge": "heavy-loads",
    "estimatedMinutes": 15,
    "isCompleted": true
  }
]
```

---

## `GET /academy/courses/:courseId`

Get full course content including lessons and quiz questions.

**Roles:** `courier`

**Response `200`:**
```json
{
  "id": "course_hazmat1",
  "title": "Hazmat Handling Level 1",
  "lessons": [
    {
      "id": "lesson_01",
      "title": "Identifying Hazardous Materials",
      "content": "Markdown content...",
      "order": 1
    }
  ],
  "quiz": [
    {
      "id": "q_01",
      "question": "Which symbol indicates a flammable material?",
      "options": ["Circle", "Flame", "Skull", "Exclamation mark"],
      "order": 1
    }
  ]
}
```

---

## `POST /academy/courses/:courseId/complete`

Submit quiz answers to complete a course. A passing score unlocks the associated badge.

**Roles:** `courier`

**Request body:**
```json
{
  "answers": [
    { "questionId": "q_01", "selectedOption": 1 },
    { "questionId": "q_02", "selectedOption": 3 }
  ]
}
```

**Response `200`:**
```json
{
  "passed": true,
  "score": 90,
  "badge": "hazmat-level-1",
  "badgeIconUrl": "https://cdn.strplatform.com/badges/hazmat-1.svg",
  "message": "🎉 You earned the Hazmat Level 1 badge! You can now accept low-hazard jobs."
}
```

| Field | Description |
|---|---|
| `passed` | True if score ≥ passingScore |
| `score` | Percentage score (0-100) |
| `badge` | Badge ID awarded (null if failed) |

**Error responses:**

| Status | Code | Description |
|---|---|---|
| 409 | `COURSE_ALREADY_COMPLETED` | Badge already earned |
| 422 | `INVALID_ANSWER_COUNT` | Wrong number of answers submitted |

---

## `GET /academy/badges`

Get all badges earned by the current courier.

**Roles:** `courier`

**Response `200`:**
```json
[
  {
    "id": "badge_heavy",
    "name": "Heavy Lifting Legend",
    "description": "Completed Heavy Loads Safety course",
    "iconUrl": "https://cdn.strplatform.com/badges/heavy-loads.svg",
    "earnedAt": "2025-01-10T09:30:00Z"
  },
  {
    "id": "badge_eco",
    "name": "Eco Hero",
    "description": "Diverted 1,000 kg from landfill",
    "iconUrl": "https://cdn.strplatform.com/badges/eco-hero.svg",
    "earnedAt": "2025-01-14T16:45:00Z"
  }
]
```

---

## Badge Registry

| Badge ID | Name | Unlock Method | Unlocks |
|---|---|---|---|
| `heavy-loads` | Heavy Lifting Legend | Complete Heavy Loads course | Heavy & bulky jobs |
| `hazmat-level-1` | Hazmat Level 1 | Complete Hazmat Level 1 course | Low-hazard jobs |
| `hazmat-level-2` | Hazmat Level 2 | Complete Hazmat Level 2 course | Medium-hazard jobs |
| `e-waste-certified` | E-Waste Certified | Complete E-Waste course | Electronics jobs |
| `eco-hero` | Eco Hero | Divert 1,000 kg from landfill | Profile badge only |
| `100-star-cleanups` | 100+ 5-Star Cleanups | Earn 100 five-star ratings | Profile badge only |
