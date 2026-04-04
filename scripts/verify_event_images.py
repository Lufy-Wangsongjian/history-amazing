import argparse
import collections
import concurrent.futures
import csv
import sqlite3
import ssl
import urllib.error
import urllib.request


def fetch_urls(db_path: str) -> list[str]:
    conn = sqlite3.connect(db_path)
    try:
        rows = conn.execute(
            "select distinct image from events where image is not null and trim(image) != ''"
        ).fetchall()
    finally:
        conn.close()
    return [r[0].strip() for r in rows if r[0] and r[0].strip()]


def probe(url: str, timeout: float):
    if not (url.startswith("http://") or url.startswith("https://")):
        return ("BAD_SCHEME", url, "")

    headers = {"User-Agent": "Mozilla/5.0"}
    ssl_ctx = ssl._create_unverified_context()

    try:
        req = urllib.request.Request(url, method="HEAD", headers=headers)
        with urllib.request.urlopen(req, timeout=timeout, context=ssl_ctx) as r:
            code = getattr(r, "status", None) or r.getcode()
            ctype = (r.headers.get("Content-Type") or "").lower()
            if 200 <= code < 400 and ctype.startswith("image/"):
                return ("OK", url, f"{code} {ctype}")
    except Exception:
        pass

    try:
        req = urllib.request.Request(
            url, method="GET", headers={**headers, "Range": "bytes=0-1023"}
        )
        with urllib.request.urlopen(req, timeout=timeout + 2, context=ssl_ctx) as r:
            code = getattr(r, "status", None) or r.getcode()
            ctype = (r.headers.get("Content-Type") or "").lower()
            if 200 <= code < 400 and ctype.startswith("image/"):
                return ("OK", url, f"{code} {ctype}")
            return ("BAD_TYPE", url, f"{code} {ctype}")
    except urllib.error.HTTPError as e:
        return ("HTTP_ERROR", url, str(e.code))
    except Exception as e:
        return ("NET_ERROR", url, e.__class__.__name__)


def run_round(urls: list[str], workers: int, timeout: float):
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as ex:
        for item in ex.map(lambda u: probe(u, timeout), urls):
            results.append(item)
    return results


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--db", required=True)
    parser.add_argument("--workers", type=int, default=24)
    parser.add_argument("--timeout", type=float, default=10)
    parser.add_argument("--show-bad", type=int, default=30)
    parser.add_argument("--retries", type=int, default=1)
    parser.add_argument("--bad-csv", default="")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--offset", type=int, default=0)
    args = parser.parse_args()

    urls = fetch_urls(args.db)
    attempts = max(1, args.retries)

    final_results_map: dict[str, tuple[str, str]] = {}
    pending = urls[:]

    for i in range(attempts):
        round_results = run_round(pending, args.workers, args.timeout)
        next_pending = []
        for status, url, detail in round_results:
            final_results_map[url] = (status, detail)
            if status != "OK":
                next_pending.append(url)

        ok_count = sum(1 for s, _ in final_results_map.values() if s == "OK")
        print(f"round={i+1}/{attempts} pending={len(pending)} ok_so_far={ok_count}")

        if not next_pending:
            break
        pending = next_pending

    results = [(status, url, detail) for url, (status, detail) in final_results_map.items()]
    counter = collections.Counter(s for s, _, _ in results)
    bad = [r for r in results if r[0] != "OK"]

    print(f"total_urls={len(urls)}")
    print(f"ok={counter.get('OK', 0)}")
    print(f"bad={len(bad)}")
    print("breakdown=" + ", ".join(f"{k}:{v}" for k, v in sorted(counter.items())))

    if bad:
        print("\n--- bad samples ---")
        for status, url, detail in bad[: args.show_bad]:
            print(f"{status}\t{detail}\t{url}")

    if args.bad_csv:
        with open(args.bad_csv, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["status", "detail", "url"])
            for status, url, detail in bad:
                writer.writerow([status, detail, url])
        print(f"\nwritten_bad_csv={args.bad_csv}")


if __name__ == "__main__":
    main()
