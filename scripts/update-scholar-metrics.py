#!/usr/bin/env python3
"""Fetch Google Scholar profile metrics and write them to src/data/scholarMetrics.json."""

from __future__ import annotations

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "src" / "data" / "scholarMetrics.json"

SCHOLAR_USER_ID = os.environ.get("SCHOLAR_USER_ID", "tkEx8OQAAAAJ")
SCHOLAR_URL = f"https://scholar.google.com/citations?user={SCHOLAR_USER_ID}&hl=en"

METRIC_PATTERN = re.compile(r'<td class="gsc_rsb_std">([^<]+)</td>')


def parse_int(value: str) -> int:
  cleaned = value.replace(",", "").strip()
  if cleaned == "":
    raise ValueError("Empty numeric value")
  return int(cleaned)


def fetch_html(url: str) -> str:
  request = Request(
    url,
    headers={
      "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
      )
    },
  )
  with urlopen(request, timeout=30) as response:
    return response.read().decode("utf-8", errors="replace")


def extract_metrics(html: str) -> dict[str, int]:
  if "Our systems have detected unusual traffic" in html:
    raise RuntimeError("Google Scholar blocked automated access.")

  values = METRIC_PATTERN.findall(html)
  if len(values) < 6:
    raise RuntimeError("Could not parse metrics table from Google Scholar response.")

  numbers = [parse_int(value) for value in values[:6]]
  return {
    "citationsAll": numbers[0],
    "citationsSince2019": numbers[1],
    "hIndexAll": numbers[2],
    "hIndexSince2019": numbers[3],
    "i10IndexAll": numbers[4],
    "i10IndexSince2019": numbers[5],
  }


def now_utc() -> str:
  return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def resolve_updated_at(attempt_time: str) -> str:
  override = os.environ.get("METRICS_UPDATED_AT", "").strip()
  if not override:
    return attempt_time

  try:
    datetime.fromisoformat(override.replace("Z", "+00:00"))
    return override
  except ValueError:
    return attempt_time


def build_payload(existing: dict, source_url: str) -> dict:
  return {
    "sourceUrl": source_url,
    "updatedAt": existing.get("updatedAt"),
    "papersAll": existing.get("papersAll"),
    "citationsAll": existing.get("citationsAll"),
    "citationsSince2019": existing.get("citationsSince2019"),
    "hIndexAll": existing.get("hIndexAll"),
    "hIndexSince2019": existing.get("hIndexSince2019"),
    "i10IndexAll": existing.get("i10IndexAll"),
    "i10IndexSince2019": existing.get("i10IndexSince2019"),
    "status": existing.get("status", "unknown"),
    "lastAttemptAt": existing.get("lastAttemptAt"),
    "lastSuccessAt": existing.get("lastSuccessAt") or existing.get("updatedAt"),
    "lastError": existing.get("lastError"),
  }


def main() -> int:
  existing = {}
  if OUTPUT_PATH.exists():
    try:
      existing = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
      existing = {}

  attempt_time = now_utc()
  payload = build_payload(existing, SCHOLAR_URL)

  try:
    html = fetch_html(SCHOLAR_URL)
    metrics = extract_metrics(html)
  except (HTTPError, URLError, TimeoutError, ValueError, RuntimeError) as exc:
    payload["status"] = "stale"
    payload["lastAttemptAt"] = attempt_time
    payload["lastError"] = str(exc)
    OUTPUT_PATH.write_text(f"{json.dumps(payload, indent=2)}\n", encoding="utf-8")
    print(f"Scholar metrics fetch failed; keeping last good values. Reason: {exc}", file=sys.stderr)
    return 0

  updated_at = resolve_updated_at(attempt_time)
  payload.update({
    "updatedAt": updated_at,
    **metrics,
    "status": "ok",
    "lastAttemptAt": attempt_time,
    "lastSuccessAt": updated_at,
    "lastError": None,
  })

  OUTPUT_PATH.write_text(f"{json.dumps(payload, indent=2)}\n", encoding="utf-8")
  print("Scholar metrics updated.")
  return 0


if __name__ == "__main__":
  raise SystemExit(main())
