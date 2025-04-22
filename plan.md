Below is a high-level blueprint for integrating the existing Next.js front-end with a Python + Flask backend for crawling user public profiles, storing the data, and powering the analytics/report. After the blueprint, there is a breakdown into smaller iterative steps. Finally, there is a series of code-generation prompts—each building incrementally, including testing. Feel free to adapt paths, variable names, and so on for your environment.

---

## **Blueprint**

1. **Frontend Enhancements (Next.js + React):**
   - Add a user input form where users can submit their profile URLs.
   - Upon submission, the front-end calls the Flask API to schedule or run a crawler.
   - Display success/failure or any in-progress states.
   - Use the returned JSON from the Flask backend to feed data into the existing "privacy dashboard" components.

2. **Backend Setup (Flask in Python):**
   - Create a new Flask application with endpoints for:
     - **`POST /profiles`**: Accepts JSON with user’s social media URLs, queues up or triggers a crawler job.
     - **`GET /profiles/<user_id>`**: Returns the crawled data for that user, in a shape that the Next.js components can consume directly.
   - Implement a basic crawler logic or integrate with a dedicated crawling library.
   - Store or cache results in memory or a database. 
   - Return summarized data to match the structure required by the Next.js “Privacy Dashboard”.

3. **Crawler/Worker Layer:**
   - If the crawls are quick, run them in the same Flask process.
   - If complex or time-consuming, use a worker queue (e.g. RQ or Celery) for asynchronous tasks. 
   - The crawler fetches each public profile, extracts relevant data (posts, tags, settings).
   - Summarize the data for each platform into a single object returned to the front-end.

4. **Integration / Data Pipeline:**
   - On the front-end, track user session or ID to request the data from the backend.
   - On the backend, associate each user’s crawled data with an ID or token.
   - Serve that data back when requested by the Next.js front-end, or store it short-term.

5. **Security & Testing:**
   - Ensure only authorized or expected users can read certain data. (Potentially out of scope if this is just a local prototype.)
   - Write tests in both Flask and React layers:
     - React tests (Jest/React Testing Library).
     - Flask tests (pytest) for the endpoints, data flow, crawler logic.

---

## **Iterative Breakdown of Tasks**

### **Iteration 1**: Basic Flask Skeleton
- Create a new Python virtual environment.
- Install Flask.
- Build a minimal Flask app with a single test route.
- Confirm app runs and test with a single unit test.

### **Iteration 2**: Basic Next.js to Flask Communication
- Update the Next.js front-end to have a form that calls the Flask endpoint (e.g., `/profiles`) via `fetch` or Axios.
- Return mock responses from the Flask side.
- Display a success or failure notification on the front-end.

### **Iteration 3**: Real Crawler Prototype
- Implement a simple crawler method (or mock it out).
- Create a “crawl_something(url)” function to parse publicly available profile data (just faked data for now).
- Integrate the function in your Flask endpoint so that the POST triggers a crawl and returns the results.

### **Iteration 4**: Data Storage & Retrieval
- Store the results from each crawl in an in-memory dictionary (or a simple DB).
- Add a second endpoint (`GET /profiles/<user_id>`) to retrieve it.
- From the Next.js side, fetch that endpoint to populate the “DataExposureMetrics” and other components.

### **Iteration 5**: Advanced Crawler & Summaries
- Expand the crawler to handle multiple platforms or some real logic (like scraping a Twitter handle).
- Summarize data: user posts, number of photos, location tags, etc.
- Return a JSON shape that closely matches the existing usage in “PrivacyDashboard”.

### **Iteration 6**: Front-End Display Integration
- Wire the data from your backend into the React components:
  - Replace the “fake data” in `DataExposureMetrics` or `PlatformSettings` with dynamic data from the Flask service.
- Add any visual indicators or placeholders while the data is loading or if an error occurs.

### **Iteration 7**: Testing & Validation
- Add unit tests in Flask:
  - Test each endpoint with Pytest.
  - Mock the crawler for faster test runs.
- Add front-end tests:
  - Basic snapshot or functional tests for the new form, error states, success states.

### **Iteration 8**: Production Hardening
- If needed: add user login, secure the endpoints, handle large volume of crawls with a job queue (e.g., RQ or Celery + Redis).
- Add real logging, environment config, etc.

---

## **Further Breakdown to Small Steps**

Here is a finer breakdown of each iteration, with smaller steps for each:

1. **Basic Flask Skeleton**
   1. Create a new folder `backend` and a new Python virtual environment: `python -m venv venv`
   2. Install Flask: `pip install flask pytest`
   3. Create `backend/app.py` with a minimal Flask `hello world`.
   4. Add `tests/test_app.py` with a single unit test that starts the Flask app and checks an endpoint.

2. **Basic Next.js to Flask Communication**
   1. In Next.js, add a new page or a form (component) for entering profile URLs.
   2. Hook form submission to an async function that calls `fetch("http://localhost:5000/profiles", { method: "POST" })`.
   3. In `backend/app.py`, create a `POST /profiles` endpoint that returns a mock JSON (e.g., `{"status": "ok"}`).
   4. On success, show an alert or toast on the front-end.

3. **Real Crawler Prototype**
   1. Create a `crawler.py` in the backend with a function `crawl_profile(url) -> dict`.
   2. Hard-code or mock out the returned data.
   3. In the `POST /profiles` route, call `crawl_profile(url)` for each given URL, then combine results in a dictionary.
   4. Return that dictionary as JSON to the front-end.

4. **Data Storage & Retrieval**
   1. Store results in a global dictionary, keyed by user or by a random ID: `crawler_results = {}`.
   2. After the crawler finishes, store the data in `crawler_results[id]`.
   3. Add a `GET /profiles/<user_id>` endpoint that returns `crawler_results[id]`.
   4. On the front-end, after submitting, poll or request `GET /profiles/<user_id>` to get the data and show it.

5. **Advanced Crawler & Summaries**
   1. Replace the mock crawler with real logic for any public endpoint (or keep partial mocks).
   2. Summarize data (like number of posts, privacy settings, etc.).
   3. Format it to match how `DataExposureMetrics` or `PlatformSettings` is structured.

6. **Front-End Display Integration**
   1. In `PrivacyDashboard`, fetch the new data from the Python API.
   2. Update the “Overview,” “PlatformSettings,” and “DataExposureMetrics” components to accept the new data props.
   3. Replace placeholders with dynamic data.

7. **Testing & Validation**
   1. Write Pytest tests for the `GET /profiles/<id>` and `POST /profiles`.
   2. Add React Testing Library or Cypress tests for verifying the front-end flow: user enters URL -> sees results.

8. **Production Hardening**
   1. Add environment-based config for your flask app (development vs production).
   2. Add a queue system if real crawling is slow.
   3. Add any needed security or login to ensure only the correct user sees their data.

---

## **Series of Code-Generation Prompts (Test-Driven)**

Below is a set of example prompts you can feed to a code-generation LLM in sequence. Each is self-contained, but references the previous step, building up the code incrementally. Feel free to tweak the JSON structure, endpoints, etc. according to your style:

---

### **Prompt 1: Flask Skeleton**

```text
Write a `backend/app.py` for a minimal Flask application. It should:
1. Create a Flask instance.
2. Have one route `/health` that returns `{"status": "ok"}` as JSON.
3. For testing, include a simple `GET /ping` that returns `pong`.
Write accompanying `tests/test_app.py` with pytest that starts the Flask app and checks that `/health` and `/ping` return the expected results. Use short but complete code with comments.
```

---

### **Prompt 2: Connect Next.js form to Flask**

```text
We have a Next.js page with a form (call it `components/ProfileForm.tsx`). When the user clicks submit, it should POST to `http://localhost:5000/profiles`. For now, the backend endpoint should return a static JSON response: 
```
{
  "status": "received",
  "urls": [ ...the urls that were sent... ]
}
```
Please provide:
1. The updated `app.py` with a `POST /profiles` route that logs the received URLs and returns the JSON above.
2. The `ProfileForm.tsx` code, fully commented, that captures user input (one or more URLs), sends it to the Flask server, and shows the response.
3. A brief test in `test_app.py` that verifies the endpoint can be called with a JSON list of URLs and returns a 200 with the correct structure.
```

---

### **Prompt 3: Basic Crawler Integration**

```text
We want to integrate a simple `crawler.py` that mocks out data from the provided URLs. 
1. In `crawler.py`, implement `def crawl_profile(url: str) -> dict:` that returns `{"fakeData": "mocked for " + url}`. 
2. In the `POST /profiles` endpoint, loop over each URL in the request, call `crawl_profile(url)`, and accumulate the results in a dictionary that is returned to the user.
3. Show updated `test_app.py` that verifies at least one URL is crawled and returned in the final JSON.
Please provide fully commented code.
```

---

### **Prompt 4: Store & Retrieve by User ID**

```text
Add in-memory storage to store the crawler results keyed by user ID:
1. Update `POST /profiles` to accept a query param like `user_id` or generate one. Store the crawler results in a global dictionary. Return a response with the user ID in it.
2. Create `GET /profiles/<user_id>` that returns the stored data if it exists or a 404 otherwise.
3. Provide an updated test that does the sequence: POST some URLs with user_id=123, then GET /profiles/123 and see the results.
```

---

### **Prompt 5: Realistic Data & Summaries**

```text
We want to expand our crawler to return structured data. For now, just return something like:
{
  "username": "someusername",
  "postCount": 42,
  "privacySettings": "public"
}
depending on each platform (Facebook, Twitter, etc.). Demonstrate how you might switch logic based on the domain in the URL.
Return it in the final JSON so each URL has a platform summary. Show an updated test verifying the presence of "username" in the response.
```

---

### **Prompt 6: Integrate with DataExposureMetrics / PlatformSettings**

```text
Now let's connect the backend data to the Next.js components. 
1. Show how to fetch `GET /profiles/<user_id>` within the Next.js `PrivacyDashboard` or `DataExposureMetrics` component. 
2. Populate the displayed metrics with the real data from the crawler (assuming each platform is returning different keys).
3. Provide short tests or instructions to confirm that if we have a user_id with stored data, it updates the UI.
```

---

### **Prompt 7: Final Testing & Mocks**

```text
Add test coverage:
1. In Python: 
   - a test that mocks the crawler function, ensuring any domain is accepted.
   - a test that checks user_id creation, data retrieval, and 404 if data doesn't exist.
2. In Next.js:
   - a test with React Testing Library that checks the form can be submitted, the API is called, and the UI updates.
Use short code with comments, focusing on demonstrating the TDD approach.
```

---

Each prompt ensures small, testable progress. Following them in order helps build the application step by step—providing immediate feedback at each stage, ensuring everything is integrated, and avoiding big leaps. You can insert additional sub-steps or additional tests as needed.
