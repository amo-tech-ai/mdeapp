Test rentals production flow on https://www.mdeai.co/

1. Open:
   https://www.mdeai.co/

2. Test rental search with results:
   Query:
   1BR in Laureles under $80/night

Verify:

* rental cards appear
* rental map pins appear
* schedule viewing CTA visible
* no duplicate generic results column
* no critical console/network errors
* /api/rentals/search returns 200

3. Test zero-result rental search:
   Query:
   1BR in Laureles under $1/night

Verify:

* response does not crash
* old rental pins clear
* other category pins remain
* no stale rental pins remain
* no critical console errors
* API returns 200 JSON with results: []

4. Save evidence:

* screenshots
* console/network status
* API responses
* final verdict

5. Report:

* Test A pass/fail
* Test B pass/fail
* pin clear working: yes/no
* remaining issues/blockers
