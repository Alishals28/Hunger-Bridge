# utils/geocoding.py
import requests

def geocode_location(address):
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        'q': address,
        'format': 'json',
        'limit': 1
    }
    headers = {
        'User-Agent': 'HungerBridgeApp'
    }
    try:
        response = requests.get(url, params=params, headers=headers, timeout=5)
        if response.status_code == 200 and response.json():
            data = response.json()[0]
            return float(data['lat']), float(data['lon'])
    except Exception as e:
        print(f"Geocoding error: {e}")
    return None, None
