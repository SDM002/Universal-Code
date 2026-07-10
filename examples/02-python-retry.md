# 02 — Python HTTP retry loop

**Prompt:** _"Retry this API call 3 times with exponential backoff."_

## Before

```python
import time
import requests

def fetch_with_retry(url: str, max_retries: int = 3):
    last_exc = None
    for attempt in range(max_retries):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            last_exc = e
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
    raise last_exc
```

**Cost:** 16 lines. Silent behavior when all retries fail (raises `None`-typed exc if the first call fails on a non-`RequestException`). No jitter. No max-elapsed cap.

## After

```python
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
def fetch(url: str) -> dict:
    return httpx.get(url, timeout=10).raise_for_status().json()
```

**Cost:** 4 lines of function. Declarative retry policy. Jittered backoff via `wait_exponential`. Correct exception chaining. Testable — swap the decorator for tests.

## Which rung landed

**Rung 6 — earned library.** `tenacity` is on PyPI, actively maintained (30k+ stars), and does one thing well. `httpx` is the modern successor to `requests`. Neither is invented — both are already in most Python projects.

If tenacity isn't already installed and you can't add a dep, a 6-line pure-stdlib version:

```python
def fetch(url):
    for attempt in range(3):
        try: return httpx.get(url).raise_for_status().json()
        except httpx.HTTPError:
            if attempt == 2: raise
            time.sleep(2 ** attempt)
```

Still shorter than the "before" — same rung-3 (stdlib) reasoning.
