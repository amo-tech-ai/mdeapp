#!/usr/bin/env python3
"""Google Maps Platform - Universal API Client

Supports 20+ Google Maps Platform REST APIs from a single CLI.
Reads GOOGLE_MAPS_API_KEY from environment or .env file.

Usage: gmaps.py <command> [options]
"""

import argparse
import json
import os
import ssl
import sys
import time
import urllib.request
import urllib.parse
import urllib.error
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

def load_api_key():
    """Load API key from env var or .env files."""
    key = os.environ.get("GOOGLE_MAPS_API_KEY")
    if key:
        return key

    search_paths = [
        Path.cwd() / ".env",
        Path.home() / ".env",
        Path(__file__).resolve().parent.parent / ".env",
        Path(__file__).resolve().parent / ".env",
    ]

    for p in search_paths:
        if p.exists():
            for line in p.read_text().splitlines():
                line = line.strip()
                if line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                if k.strip() == "GOOGLE_MAPS_API_KEY":
                    return v.strip().strip("\"'")

    print("Error: GOOGLE_MAPS_API_KEY not found.", file=sys.stderr)
    print("Set it in a .env file or as an environment variable.", file=sys.stderr)
    sys.exit(1)


# ---------------------------------------------------------------------------
# HTTP helpers
# ---------------------------------------------------------------------------

_CTX = ssl.create_default_context()

def _request(url, method="GET", body=None, headers=None):
    hdrs = {"User-Agent": "gmaps-cli/1.0"}
    if headers:
        hdrs.update(headers)
    if body is not None:
        if isinstance(body, dict):
            body = json.dumps(body).encode()
            hdrs.setdefault("Content-Type", "application/json")
        elif isinstance(body, str):
            body = body.encode()
    req = urllib.request.Request(url, data=body, headers=hdrs, method=method)
    try:
        with urllib.request.urlopen(req, context=_CTX) as resp:
            ct = resp.headers.get("Content-Type", "")
            raw = resp.read()
            if "json" in ct:
                return json.loads(raw)
            return raw
    except urllib.error.HTTPError as e:
        err = e.read().decode(errors="replace")
        try:
            err = json.loads(err)
            err = json.dumps(err, indent=2)
        except Exception:
            pass
        print(f"HTTP {e.code} Error:\n{err}", file=sys.stderr)
        sys.exit(1)


def api_get(base_url, params=None):
    params = params or {}
    params["key"] = load_api_key()
    qs = urllib.parse.urlencode(params, doseq=True)
    return _request(f"{base_url}?{qs}")


def api_post(base_url, data, extra_headers=None, use_key_param=True):
    params = {}
    if use_key_param:
        params["key"] = load_api_key()
    qs = urllib.parse.urlencode(params)
    url = f"{base_url}?{qs}" if qs else base_url
    hdrs = {}
    if extra_headers:
        hdrs.update(extra_headers)
    return _request(url, method="POST", body=data, headers=hdrs)


def api_get_fieldmask(base_url, params=None, fields=None):
    """GET with X-Goog-FieldMask header (for new Google APIs)."""
    params = params or {}
    params["key"] = load_api_key()
    qs = urllib.parse.urlencode(params, doseq=True)
    url = f"{base_url}?{qs}"
    hdrs = {}
    if fields:
        hdrs["X-Goog-FieldMask"] = fields
    return _request(url, headers=hdrs)


def api_post_fieldmask(base_url, data, fields=None):
    """POST with X-Goog-FieldMask header (for new Google APIs)."""
    params = {"key": load_api_key()}
    qs = urllib.parse.urlencode(params)
    url = f"{base_url}?{qs}"
    hdrs = {}
    if fields:
        hdrs["X-Goog-FieldMask"] = fields
    return _request(url, method="POST", body=data, headers=hdrs)


def download_file(url, params, output_path):
    params["key"] = load_api_key()
    qs = urllib.parse.urlencode(params, doseq=True)
    full = f"{url}?{qs}"
    data = _request(full)
    if isinstance(data, bytes):
        Path(output_path).write_bytes(data)
        return {"saved": str(output_path), "size_bytes": len(data)}
    return data


def out(data):
    """Print JSON result."""
    if isinstance(data, bytes):
        print(f"(binary data, {len(data)} bytes)")
    else:
        print(json.dumps(data, indent=2, ensure_ascii=False))


# ---------------------------------------------------------------------------
# 1. GEOCODING
# ---------------------------------------------------------------------------

def cmd_geocode(args):
    """Forward geocode: address -> coordinates."""
    params = {"address": args.address}
    if args.bounds:
        params["bounds"] = args.bounds
    if args.region:
        params["region"] = args.region
    if args.components:
        params["components"] = args.components
    if args.language:
        params["language"] = args.language
    out(api_get("https://maps.googleapis.com/maps/api/geocode/json", params))


def cmd_reverse_geocode(args):
    """Reverse geocode: coordinates -> address."""
    params = {"latlng": f"{args.lat},{args.lng}"}
    if args.result_type:
        params["result_type"] = args.result_type
    if args.location_type:
        params["location_type"] = args.location_type
    if args.language:
        params["language"] = args.language
    out(api_get("https://maps.googleapis.com/maps/api/geocode/json", params))


# ---------------------------------------------------------------------------
# 2. ROUTES (new API)
# ---------------------------------------------------------------------------

def cmd_directions(args):
    """Compute routes between origin and destination."""
    modes = {"driving": "DRIVE", "walking": "WALK", "bicycling": "BICYCLE",
             "transit": "TRANSIT", "two_wheeler": "TWO_WHEELER"}
    body = {
        "origin": {"address": args.origin},
        "destination": {"address": args.destination},
        "travelMode": modes.get(args.mode, "DRIVE"),
        "computeAlternativeRoutes": args.alternatives,
        "languageCode": args.language or "en",
    }
    if args.departure_time:
        body["departureTime"] = args.departure_time
    if args.avoid_tolls:
        body.setdefault("routeModifiers", {})["avoidTolls"] = True
    if args.avoid_highways:
        body.setdefault("routeModifiers", {})["avoidHighways"] = True
    if args.avoid_ferries:
        body.setdefault("routeModifiers", {})["avoidFerries"] = True
    if args.waypoints:
        body["intermediates"] = [{"address": w} for w in args.waypoints]
    if args.units == "imperial":
        body["units"] = "IMPERIAL"

    fields = "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs,routes.description,routes.warnings,routes.travelAdvisory"
    out(api_post_fieldmask(
        "https://routes.googleapis.com/directions/v2:computeRoutes",
        body, fields=fields))


def cmd_distance_matrix(args):
    """Compute distance/duration matrix between origins and destinations."""
    body = {
        "origins": [{"waypoint": {"address": o}} for o in args.origins],
        "destinations": [{"waypoint": {"address": d}} for d in args.destinations],
        "travelMode": args.mode.upper() if args.mode else "DRIVE",
    }
    fields = "originIndex,destinationIndex,duration,distanceMeters,status,condition"
    out(api_post_fieldmask(
        "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix",
        body, fields=fields))


# ---------------------------------------------------------------------------
# 3. PLACES (new API)
# ---------------------------------------------------------------------------

PLACES_FIELDS = "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.types,places.nationalPhoneNumber,places.websiteUri,places.regularOpeningHours,places.priceLevel,places.editorialSummary,places.location"

def cmd_places_search(args):
    """Search for places by text query."""
    body = {"textQuery": args.query}
    if args.location:
        lat, lng = [float(x) for x in args.location.split(",")]
        body["locationBias"] = {
            "circle": {"center": {"latitude": lat, "longitude": lng},
                       "radius": float(args.radius or 5000)}}
    if args.type:
        body["includedType"] = args.type
    if args.min_rating:
        body["minRating"] = float(args.min_rating)
    if args.open_now:
        body["openNow"] = True
    if args.language:
        body["languageCode"] = args.language
    if args.max_results:
        body["maxResultCount"] = int(args.max_results)
    out(api_post_fieldmask(
        "https://places.googleapis.com/v1/places:searchText",
        body, fields=args.fields or PLACES_FIELDS))


def cmd_places_nearby(args):
    """Find places near a location."""
    body = {
        "locationRestriction": {
            "circle": {
                "center": {"latitude": float(args.lat), "longitude": float(args.lng)},
                "radius": float(args.radius or 500)}},
        "maxResultCount": int(args.max_results or 20),
    }
    if args.type:
        body["includedTypes"] = [args.type]
    if args.language:
        body["languageCode"] = args.language
    out(api_post_fieldmask(
        "https://places.googleapis.com/v1/places:searchNearby",
        body, fields=args.fields or PLACES_FIELDS))


def cmd_place_details(args):
    """Get details for a specific place by ID."""
    fields = args.fields or "id,displayName,formattedAddress,rating,userRatingCount,types,nationalPhoneNumber,internationalPhoneNumber,websiteUri,regularOpeningHours,priceLevel,editorialSummary,reviews,photos,location,adrFormatAddress,businessStatus,googleMapsUri"
    out(api_get_fieldmask(
        f"https://places.googleapis.com/v1/places/{args.place_id}",
        {}, fields=fields))


def cmd_autocomplete(args):
    """Get place autocomplete suggestions."""
    body = {"input": args.input}
    if args.location:
        lat, lng = [float(x) for x in args.location.split(",")]
        body["locationBias"] = {
            "circle": {"center": {"latitude": lat, "longitude": lng},
                       "radius": float(args.radius or 5000)}}
    if args.language:
        body["languageCode"] = args.language
    if args.region:
        body["regionCode"] = args.region
    if args.types:
        body["includedPrimaryTypes"] = args.types
    out(api_post(
        "https://places.googleapis.com/v1/places:autocomplete", body))


def cmd_place_photo(args):
    """Download a place photo."""
    params = {
        "maxHeightPx": args.max_height or 400,
        "maxWidthPx": args.max_width or 400,
        "skipHttpRedirect": "true",
    }
    result = api_get(
        f"https://places.googleapis.com/v1/{args.photo_ref}/media", params)
    if isinstance(result, dict) and "photoUri" in result:
        print(json.dumps(result, indent=2))
    else:
        out(result)


# ---------------------------------------------------------------------------
# 4. ELEVATION
# ---------------------------------------------------------------------------

def cmd_elevation(args):
    """Get elevation for coordinates."""
    if args.path:
        params = {"path": args.path, "samples": args.samples or 10}
    else:
        locations = f"{args.lat},{args.lng}"
        if args.locations:
            locations = args.locations
        params = {"locations": locations}
    out(api_get("https://maps.googleapis.com/maps/api/elevation/json", params))


# ---------------------------------------------------------------------------
# 5. TIMEZONE
# ---------------------------------------------------------------------------

def cmd_timezone(args):
    """Get timezone for coordinates."""
    params = {
        "location": f"{args.lat},{args.lng}",
        "timestamp": args.timestamp or str(int(time.time())),
    }
    if args.language:
        params["language"] = args.language
    out(api_get("https://maps.googleapis.com/maps/api/timezone/json", params))


# ---------------------------------------------------------------------------
# 6. AIR QUALITY
# ---------------------------------------------------------------------------

def cmd_air_quality(args):
    """Get current air quality conditions."""
    body = {
        "location": {"latitude": float(args.lat), "longitude": float(args.lng)},
    }
    if args.language:
        body["languageCode"] = args.language
    extras = []
    if args.health:
        extras.append("HEALTH_RECOMMENDATIONS")
    if args.pollutants:
        extras.append("DOMINANT_POLLUTANT_CONCENTRATION")
        extras.append("POLLUTANT_CONCENTRATION")
    if extras:
        body["extraComputations"] = extras
    out(api_post(
        "https://airquality.googleapis.com/v1/currentConditions:lookup", body))


def cmd_air_quality_history(args):
    """Get historical air quality data."""
    body = {
        "location": {"latitude": float(args.lat), "longitude": float(args.lng)},
        "hours": int(args.hours or 24),
    }
    if args.language:
        body["languageCode"] = args.language
    out(api_post(
        "https://airquality.googleapis.com/v1/history:lookup", body))


def cmd_air_quality_forecast(args):
    """Get air quality forecast."""
    body = {
        "location": {"latitude": float(args.lat), "longitude": float(args.lng)},
    }
    if args.language:
        body["languageCode"] = args.language
    out(api_post(
        "https://airquality.googleapis.com/v1/forecast:lookup", body))


# ---------------------------------------------------------------------------
# 7. POLLEN
# ---------------------------------------------------------------------------

def cmd_pollen(args):
    """Get pollen forecast."""
    params = {
        "location.latitude": args.lat,
        "location.longitude": args.lng,
        "days": args.days or 3,
    }
    if args.language:
        params["languageCode"] = args.language
    out(api_get("https://pollen.googleapis.com/v1/forecast:lookup", params))


# ---------------------------------------------------------------------------
# 8. SOLAR
# ---------------------------------------------------------------------------

def cmd_solar(args):
    """Get solar potential for a building."""
    params = {
        "location.latitude": args.lat,
        "location.longitude": args.lng,
    }
    if args.quality:
        params["requiredQuality"] = args.quality
    out(api_get("https://solar.googleapis.com/v1/buildingInsights:findClosest", params))


def cmd_solar_layers(args):
    """Get solar data layers (DSM, flux, etc.)."""
    params = {
        "location.latitude": args.lat,
        "location.longitude": args.lng,
        "radiusMeters": args.radius or 50,
    }
    if args.quality:
        params["requiredQuality"] = args.quality
    if args.pixel_size:
        params["pixelSizeMeters"] = args.pixel_size
    out(api_get("https://solar.googleapis.com/v1/dataLayers:get", params))


# ---------------------------------------------------------------------------
# 9. WEATHER
# ---------------------------------------------------------------------------

def cmd_weather(args):
    """Get weather data (current, forecast, history)."""
    base = "https://weather.googleapis.com/v1"
    params = {
        "location.latitude": args.lat,
        "location.longitude": args.lng,
    }
    if args.language:
        params["languageCode"] = args.language

    if args.mode == "current":
        url = f"{base}/currentConditions:lookup"
    elif args.mode == "hourly":
        url = f"{base}/forecast/hours"
        if args.hours:
            params["forecastHours"] = args.hours
    elif args.mode == "daily":
        url = f"{base}/forecast/days"
        if args.days:
            params["forecastDays"] = args.days
    elif args.mode == "history":
        url = f"{base}/history/hours"
        if args.hours:
            params["hours"] = args.hours
    else:
        url = f"{base}/currentConditions:lookup"

    out(api_get(url, params))


# ---------------------------------------------------------------------------
# 10. ADDRESS VALIDATION
# ---------------------------------------------------------------------------

def cmd_validate_address(args):
    """Validate a postal address."""
    body = {
        "address": {
            "addressLines": [args.address],
        },
    }
    if args.region:
        body["address"]["regionCode"] = args.region
    if args.locality:
        body["address"]["locality"] = args.locality
    if args.enable_usps:
        body["enableUspsCass"] = True
    out(api_post(
        "https://addressvalidation.googleapis.com/v1:validateAddress", body))


# ---------------------------------------------------------------------------
# 11. ROADS
# ---------------------------------------------------------------------------

def cmd_snap_roads(args):
    """Snap GPS points to nearest roads."""
    params = {
        "path": args.path,
    }
    if args.interpolate:
        params["interpolate"] = "true"
    out(api_get("https://roads.googleapis.com/v1/snapToRoads", params))


def cmd_nearest_roads(args):
    """Find nearest road segments."""
    params = {"points": args.points}
    out(api_get("https://roads.googleapis.com/v1/nearestRoads", params))


# ---------------------------------------------------------------------------
# 12. STREET VIEW
# ---------------------------------------------------------------------------

def cmd_streetview(args):
    """Download a Street View static image."""
    params = {
        "size": args.size or "600x400",
        "location": f"{args.lat},{args.lng}" if args.lat else args.location,
    }
    if args.heading is not None:
        params["heading"] = args.heading
    if args.pitch is not None:
        params["pitch"] = args.pitch
    if args.fov is not None:
        params["fov"] = args.fov
    if args.pano:
        params["pano"] = args.pano
        del params["location"]
    output = args.output or "streetview.jpg"
    result = download_file(
        "https://maps.googleapis.com/maps/api/streetview",
        params, output)
    out(result)


# ---------------------------------------------------------------------------
# 13. STATIC MAP
# ---------------------------------------------------------------------------

def cmd_static_map(args):
    """Download a static map image."""
    params = {
        "center": f"{args.lat},{args.lng}" if args.lat else args.center,
        "zoom": args.zoom or 14,
        "size": args.size or "600x400",
        "maptype": args.maptype or "roadmap",
        "format": args.format or "png",
    }
    if args.markers:
        params["markers"] = args.markers
    if args.path_line:
        params["path"] = args.path_line
    if args.style:
        params["style"] = args.style
    if args.scale:
        params["scale"] = args.scale
    output = args.output or f"map.{args.format or 'png'}"
    result = download_file(
        "https://maps.googleapis.com/maps/api/staticmap",
        params, output)
    out(result)


# ---------------------------------------------------------------------------
# 14. GEOLOCATION
# ---------------------------------------------------------------------------

def cmd_geolocation(args):
    """Geolocate from WiFi access points or cell towers."""
    body = {}
    if args.consider_ip is not None:
        body["considerIp"] = args.consider_ip
    if args.wifi:
        aps = []
        for w in args.wifi:
            parts = w.split(",")
            ap = {"macAddress": parts[0]}
            if len(parts) > 1:
                ap["signalStrength"] = int(parts[1])
            aps.append(ap)
        body["wifiAccessPoints"] = aps
    if args.cell:
        towers = []
        for c in args.cell:
            parts = c.split(",")
            tower = {
                "cellId": int(parts[0]),
                "locationAreaCode": int(parts[1]) if len(parts) > 1 else 0,
                "mobileCountryCode": int(parts[2]) if len(parts) > 2 else 0,
                "mobileNetworkCode": int(parts[3]) if len(parts) > 3 else 0,
            }
            towers.append(tower)
        body["cellTowers"] = towers
    out(api_post("https://www.googleapis.com/geolocation/v1/geolocate", body))


# ---------------------------------------------------------------------------
# 15. AERIAL VIEW
# ---------------------------------------------------------------------------

def cmd_aerial_view(args):
    """Get aerial view video for a US address."""
    if args.action == "check":
        params = {"address": args.address}
        out(api_get(
            "https://aerialview.googleapis.com/v1/videos:lookupVideoMetadata",
            params))
    elif args.action == "render":
        body = {"address": args.address}
        out(api_post(
            "https://aerialview.googleapis.com/v1/videos:renderVideo", body))
    elif args.action == "get":
        params = {}
        if args.video_id:
            params["videoId"] = args.video_id
        elif args.address:
            params["address"] = args.address
        out(api_get(
            "https://aerialview.googleapis.com/v1/videos:lookupVideo", params))


# ---------------------------------------------------------------------------
# 16. ROUTE OPTIMIZATION
# ---------------------------------------------------------------------------

def cmd_route_optimize(args):
    """Optimize vehicle routes (requires JSON input file)."""
    input_data = json.loads(Path(args.input).read_text())
    project = args.project or "default"
    out(api_post(
        f"https://routeoptimization.googleapis.com/v1/projects/{project}:optimizeTours",
        input_data))


# ---------------------------------------------------------------------------
# 17. PLACES AGGREGATE (Insights)
# ---------------------------------------------------------------------------

def cmd_places_aggregate(args):
    """Get aggregate place insights for an area."""
    body = {
        "insights": [args.insight or "INSIGHT_COUNT"],
        "filter": {},
    }
    if args.location:
        lat, lng = [float(x) for x in args.location.split(",")]
        body["filter"]["locationFilter"] = {
            "circle": {
                "latLng": {"latitude": lat, "longitude": lng},
                "radius": float(args.radius or 5000)}}
    if args.type:
        body["filter"]["typeFilter"] = {"includedTypes": [args.type]}
    if args.min_rating:
        body["filter"]["ratingFilter"] = {"minRating": float(args.min_rating)}
    if args.price_levels:
        body["filter"]["priceLevelFilter"] = {
            "priceLevels": args.price_levels}
    out(api_post(
        "https://areainsights.googleapis.com/v1:computeInsights", body))


# ---------------------------------------------------------------------------
# 18. MAP EMBED URL (free, no API call - just generates URL)
# ---------------------------------------------------------------------------

def cmd_embed_url(args):
    """Generate a Google Maps Embed URL (free, unlimited)."""
    key = load_api_key()
    mode = args.mode or "place"
    params = {"key": key}
    if mode == "place":
        params["q"] = args.query
    elif mode == "directions":
        params["origin"] = args.origin or ""
        params["destination"] = args.destination or ""
        if args.waypoints_str:
            params["waypoints"] = args.waypoints_str
    elif mode == "search":
        params["q"] = args.query
    elif mode == "view":
        params["center"] = f"{args.lat},{args.lng}" if args.lat else args.center
        params["zoom"] = args.zoom or 14
    elif mode == "streetview":
        params["location"] = f"{args.lat},{args.lng}" if args.lat else args.location
        if args.heading is not None:
            params["heading"] = args.heading

    qs = urllib.parse.urlencode(params)
    url = f"https://www.google.com/maps/embed/v1/{mode}?{qs}"
    print(json.dumps({"embed_url": url, "mode": mode}, indent=2))


# ===========================================================================
# CLI PARSER
# ===========================================================================

def build_parser():
    p = argparse.ArgumentParser(
        prog="gmaps",
        description="Google Maps Platform - Universal API Client (20+ APIs)")
    sub = p.add_subparsers(dest="command", help="API command")

    # --- geocode ---
    s = sub.add_parser("geocode", help="Forward geocode (address -> coordinates)")
    s.add_argument("address", help="Address to geocode")
    s.add_argument("--bounds", help="Bounding box bias (sw_lat,sw_lng|ne_lat,ne_lng)")
    s.add_argument("--region", help="Region bias (ccTLD, e.g. 'us')")
    s.add_argument("--components", help="Component filter (e.g. 'country:US')")
    s.add_argument("--language", help="Language code")
    s.set_defaults(func=cmd_geocode)

    # --- reverse-geocode ---
    s = sub.add_parser("reverse-geocode", help="Reverse geocode (coords -> address)")
    s.add_argument("lat", type=float, help="Latitude")
    s.add_argument("lng", type=float, help="Longitude")
    s.add_argument("--result-type", help="Filter result types")
    s.add_argument("--location-type", help="Filter location types")
    s.add_argument("--language", help="Language code")
    s.set_defaults(func=cmd_reverse_geocode)

    # --- directions ---
    s = sub.add_parser("directions", help="Get routes between locations")
    s.add_argument("origin", help="Starting address")
    s.add_argument("destination", help="Destination address")
    s.add_argument("--mode", default="driving",
                   choices=["driving", "walking", "bicycling", "transit", "two_wheeler"])
    s.add_argument("--alternatives", action="store_true", help="Compute alternative routes")
    s.add_argument("--avoid-tolls", action="store_true")
    s.add_argument("--avoid-highways", action="store_true")
    s.add_argument("--avoid-ferries", action="store_true")
    s.add_argument("--waypoints", nargs="+", help="Intermediate stops")
    s.add_argument("--departure-time", help="ISO 8601 departure time")
    s.add_argument("--units", choices=["metric", "imperial"], default="metric")
    s.add_argument("--language", help="Language code")
    s.set_defaults(func=cmd_directions)

    # --- distance-matrix ---
    s = sub.add_parser("distance-matrix", help="Distance/duration matrix")
    s.add_argument("--origins", nargs="+", required=True, help="Origin addresses")
    s.add_argument("--destinations", nargs="+", required=True, help="Destination addresses")
    s.add_argument("--mode", default="driving")
    s.set_defaults(func=cmd_distance_matrix)

    # --- places-search ---
    s = sub.add_parser("places-search", help="Search places by text")
    s.add_argument("query", help="Search query (e.g. 'pizza in NYC')")
    s.add_argument("--location", help="Bias location (lat,lng)")
    s.add_argument("--radius", help="Bias radius in meters")
    s.add_argument("--type", help="Place type filter")
    s.add_argument("--min-rating", help="Minimum rating (1-5)")
    s.add_argument("--open-now", action="store_true")
    s.add_argument("--language", help="Language code")
    s.add_argument("--max-results", help="Max results (1-20)")
    s.add_argument("--fields", help="Custom field mask")
    s.set_defaults(func=cmd_places_search)

    # --- places-nearby ---
    s = sub.add_parser("places-nearby", help="Find places near a location")
    s.add_argument("lat", type=float, help="Latitude")
    s.add_argument("lng", type=float, help="Longitude")
    s.add_argument("--radius", default=500, help="Radius in meters")
    s.add_argument("--type", help="Place type (e.g. restaurant, cafe)")
    s.add_argument("--language", help="Language code")
    s.add_argument("--max-results", help="Max results")
    s.add_argument("--fields", help="Custom field mask")
    s.set_defaults(func=cmd_places_nearby)

    # --- place-details ---
    s = sub.add_parser("place-details", help="Get place details by ID")
    s.add_argument("place_id", help="Google Place ID")
    s.add_argument("--fields", help="Custom field mask")
    s.set_defaults(func=cmd_place_details)

    # --- autocomplete ---
    s = sub.add_parser("autocomplete", help="Place autocomplete")
    s.add_argument("input", help="Text to autocomplete")
    s.add_argument("--location", help="Bias location (lat,lng)")
    s.add_argument("--radius", help="Bias radius in meters")
    s.add_argument("--language", help="Language code")
    s.add_argument("--region", help="Region code")
    s.add_argument("--types", nargs="+", help="Type filters")
    s.set_defaults(func=cmd_autocomplete)

    # --- place-photo ---
    s = sub.add_parser("place-photo", help="Get place photo URL")
    s.add_argument("photo_ref", help="Photo resource name (from place details)")
    s.add_argument("--max-height", type=int, default=400)
    s.add_argument("--max-width", type=int, default=400)
    s.set_defaults(func=cmd_place_photo)

    # --- elevation ---
    s = sub.add_parser("elevation", help="Get elevation for coordinates")
    s.add_argument("lat", nargs="?", type=float, help="Latitude")
    s.add_argument("lng", nargs="?", type=float, help="Longitude")
    s.add_argument("--locations", help="Multiple lat,lng pairs separated by |")
    s.add_argument("--path", help="Encoded polyline or pipe-separated coords for path sampling")
    s.add_argument("--samples", type=int, help="Number of samples along path")
    s.set_defaults(func=cmd_elevation)

    # --- timezone ---
    s = sub.add_parser("timezone", help="Get timezone for coordinates")
    s.add_argument("lat", type=float, help="Latitude")
    s.add_argument("lng", type=float, help="Longitude")
    s.add_argument("--timestamp", help="Unix timestamp (default: now)")
    s.add_argument("--language", help="Language code")
    s.set_defaults(func=cmd_timezone)

    # --- air-quality ---
    s = sub.add_parser("air-quality", help="Current air quality")
    s.add_argument("lat", type=float, help="Latitude")
    s.add_argument("lng", type=float, help="Longitude")
    s.add_argument("--health", action="store_true", help="Include health recommendations")
    s.add_argument("--pollutants", action="store_true", help="Include pollutant details")
    s.add_argument("--language", help="Language code")
    s.set_defaults(func=cmd_air_quality)

    # --- air-quality-history ---
    s = sub.add_parser("air-quality-history", help="Historical air quality")
    s.add_argument("lat", type=float, help="Latitude")
    s.add_argument("lng", type=float, help="Longitude")
    s.add_argument("--hours", default=24, help="Hours of history (max 720)")
    s.add_argument("--language", help="Language code")
    s.set_defaults(func=cmd_air_quality_history)

    # --- air-quality-forecast ---
    s = sub.add_parser("air-quality-forecast", help="Air quality forecast")
    s.add_argument("lat", type=float, help="Latitude")
    s.add_argument("lng", type=float, help="Longitude")
    s.add_argument("--language", help="Language code")
    s.set_defaults(func=cmd_air_quality_forecast)

    # --- pollen ---
    s = sub.add_parser("pollen", help="Pollen forecast")
    s.add_argument("lat", type=float, help="Latitude")
    s.add_argument("lng", type=float, help="Longitude")
    s.add_argument("--days", type=int, default=3, help="Forecast days (1-5)")
    s.add_argument("--language", help="Language code")
    s.set_defaults(func=cmd_pollen)

    # --- solar ---
    s = sub.add_parser("solar", help="Building solar potential")
    s.add_argument("lat", type=float, help="Latitude")
    s.add_argument("lng", type=float, help="Longitude")
    s.add_argument("--quality", choices=["LOW", "MEDIUM", "HIGH"],
                   help="Required imagery quality")
    s.set_defaults(func=cmd_solar)

    # --- solar-layers ---
    s = sub.add_parser("solar-layers", help="Solar data layers (DSM, flux)")
    s.add_argument("lat", type=float, help="Latitude")
    s.add_argument("lng", type=float, help="Longitude")
    s.add_argument("--radius", type=float, default=50, help="Radius in meters")
    s.add_argument("--quality", choices=["LOW", "MEDIUM", "HIGH"])
    s.add_argument("--pixel-size", type=float, help="Pixel size in meters")
    s.set_defaults(func=cmd_solar_layers)

    # --- weather ---
    s = sub.add_parser("weather", help="Weather data")
    s.add_argument("lat", type=float, help="Latitude")
    s.add_argument("lng", type=float, help="Longitude")
    s.add_argument("--mode", default="current",
                   choices=["current", "hourly", "daily", "history"])
    s.add_argument("--hours", type=int, help="Forecast/history hours")
    s.add_argument("--days", type=int, help="Forecast days (for daily mode)")
    s.add_argument("--language", help="Language code")
    s.set_defaults(func=cmd_weather)

    # --- validate-address ---
    s = sub.add_parser("validate-address", help="Validate a postal address")
    s.add_argument("address", help="Address to validate")
    s.add_argument("--region", help="Region code (e.g. US)")
    s.add_argument("--locality", help="City/locality")
    s.add_argument("--enable-usps", action="store_true", help="Enable USPS CASS (US only)")
    s.set_defaults(func=cmd_validate_address)

    # --- snap-roads ---
    s = sub.add_parser("snap-roads", help="Snap GPS points to roads")
    s.add_argument("path", help="Pipe-separated lat,lng pairs")
    s.add_argument("--interpolate", action="store_true", help="Interpolate between points")
    s.set_defaults(func=cmd_snap_roads)

    # --- nearest-roads ---
    s = sub.add_parser("nearest-roads", help="Find nearest road segments")
    s.add_argument("points", help="Pipe-separated lat,lng pairs")
    s.set_defaults(func=cmd_nearest_roads)

    # --- streetview ---
    s = sub.add_parser("streetview", help="Download Street View image")
    s.add_argument("--lat", type=float, help="Latitude")
    s.add_argument("--lng", type=float, help="Longitude")
    s.add_argument("--location", help="Address or lat,lng string")
    s.add_argument("--pano", help="Panorama ID (instead of location)")
    s.add_argument("--size", default="600x400", help="Image size WxH")
    s.add_argument("--heading", type=float, help="Camera heading (0-360)")
    s.add_argument("--pitch", type=float, help="Camera pitch (-90 to 90)")
    s.add_argument("--fov", type=float, help="Field of view (10-120)")
    s.add_argument("--output", help="Output file path")
    s.set_defaults(func=cmd_streetview)

    # --- static-map ---
    s = sub.add_parser("static-map", help="Download static map image")
    s.add_argument("--lat", type=float, help="Center latitude")
    s.add_argument("--lng", type=float, help="Center longitude")
    s.add_argument("--center", help="Center as address or lat,lng")
    s.add_argument("--zoom", type=int, default=14, help="Zoom level (0-21)")
    s.add_argument("--size", default="600x400", help="Image size WxH")
    s.add_argument("--maptype", default="roadmap",
                   choices=["roadmap", "satellite", "terrain", "hybrid"])
    s.add_argument("--format", default="png", choices=["png", "jpg", "gif"])
    s.add_argument("--markers", help="Marker specification")
    s.add_argument("--path-line", help="Path/polyline specification")
    s.add_argument("--style", help="Map style")
    s.add_argument("--scale", type=int, choices=[1, 2, 4], help="Image scale")
    s.add_argument("--output", help="Output file path")
    s.set_defaults(func=cmd_static_map)

    # --- geolocation ---
    s = sub.add_parser("geolocation", help="Geolocate from WiFi/cell towers")
    s.add_argument("--wifi", nargs="+", help="WiFi APs as MAC,signal pairs")
    s.add_argument("--cell", nargs="+",
                   help="Cell towers as cellId,lac,mcc,mnc")
    s.add_argument("--consider-ip", type=bool, default=True,
                   help="Use IP as fallback")
    s.set_defaults(func=cmd_geolocation)

    # --- aerial-view ---
    s = sub.add_parser("aerial-view", help="Aerial view video (US only)")
    s.add_argument("action", choices=["check", "render", "get"],
                   help="check metadata, render video, or get video")
    s.add_argument("--address", help="US street address")
    s.add_argument("--video-id", help="Video ID (for 'get' action)")
    s.set_defaults(func=cmd_aerial_view)

    # --- route-optimize ---
    s = sub.add_parser("route-optimize", help="Optimize vehicle routes")
    s.add_argument("input", help="JSON input file with shipments/vehicles")
    s.add_argument("--project", help="GCP project ID")
    s.set_defaults(func=cmd_route_optimize)

    # --- places-aggregate ---
    s = sub.add_parser("places-aggregate", help="Aggregate place insights")
    s.add_argument("--location", help="Center location (lat,lng)")
    s.add_argument("--radius", help="Radius in meters")
    s.add_argument("--type", help="Place type filter")
    s.add_argument("--min-rating", help="Minimum rating")
    s.add_argument("--price-levels", nargs="+",
                   help="Price levels (PRICE_LEVEL_FREE, etc.)")
    s.add_argument("--insight", default="INSIGHT_COUNT",
                   choices=["INSIGHT_COUNT", "INSIGHT_PLACES"],
                   help="Type of insight to return")
    s.set_defaults(func=cmd_places_aggregate)

    # --- embed-url ---
    s = sub.add_parser("embed-url", help="Generate Maps Embed URL (free)")
    s.add_argument("--mode", default="place",
                   choices=["place", "directions", "search", "view", "streetview"])
    s.add_argument("--query", help="Place or search query")
    s.add_argument("--origin", help="Directions origin")
    s.add_argument("--destination", help="Directions destination")
    s.add_argument("--waypoints-str", help="Pipe-separated waypoints")
    s.add_argument("--lat", type=float, help="Latitude")
    s.add_argument("--lng", type=float, help="Longitude")
    s.add_argument("--center", help="Center as lat,lng")
    s.add_argument("--location", help="Location string")
    s.add_argument("--zoom", type=int, help="Zoom level")
    s.add_argument("--heading", type=float, help="Street View heading")
    s.set_defaults(func=cmd_embed_url)

    return p


def main():
    parser = build_parser()
    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        sys.exit(1)
    args.func(args)


if __name__ == "__main__":
    main()
