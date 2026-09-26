"""Build src/data/basemap.json for the cruise route map.

Natural Earth (public domain) land polygons, lakes and river centrelines, kept only
where we have cruise ports (a padded box round every port in port-coords.json),
simplified with Douglas-Peucker and rounded to 3 decimals. Pure Python, no GIS deps.
"""
import json, sys, math
S = sys.argv[2] if len(sys.argv) > 2 else 'ne'  # folder holding the three Natural Earth GeoJSON files
PORTS = '/Users/admin/holiday-site/src/data/port-coords.json'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'src/data/basemap.json'
PAD = 4.0          # degrees round each port
LAND_TOL = 0.02    # ~2 km
RIVER_TOL = 0.008
LAKE_TOL = 0.015
MIN_LAKE_SPAN = 0.15  # degrees; drop ponds

ports = json.load(open(PORTS))
boxes = [(p['lng'] - PAD, p['lat'] - PAD, p['lng'] + PAD, p['lat'] + PAD) for p in ports.values()]

def bbox(coords):
    xs = [c[0] for c in coords]; ys = [c[1] for c in coords]
    return (min(xs), min(ys), max(xs), max(ys))

def hits(bb):
    return any(not (bb[2] < b[0] or bb[0] > b[2] or bb[3] < b[1] or bb[1] > b[3]) for b in boxes)

def dp(points, tol):
    if len(points) < 3: return points
    def perp(p, a, b):
        dx, dy = b[0]-a[0], b[1]-a[1]
        if dx == 0 and dy == 0: return math.hypot(p[0]-a[0], p[1]-a[1])
        t = max(0, min(1, ((p[0]-a[0])*dx + (p[1]-a[1])*dy) / (dx*dx+dy*dy)))
        return math.hypot(p[0]-(a[0]+t*dx), p[1]-(a[1]+t*dy))
    # iterative stack version
    keep = [False]*len(points); keep[0] = keep[-1] = True
    stack = [(0, len(points)-1)]
    while stack:
        i, j = stack.pop()
        if j <= i+1: continue
        dmax, idx = 0, -1
        for k in range(i+1, j):
            d = perp(points[k], points[i], points[j])
            if d > dmax: dmax, idx = d, k
        if dmax > tol:
            keep[idx] = True; stack.append((i, idx)); stack.append((idx, j))
    return [p for p, k in zip(points, keep) if k]

def rnd(pts): return [[round(x, 3), round(y, 3)] for x, y in pts]

def rings_of(geom):
    if geom['type'] == 'Polygon': return [geom['coordinates'][0]]
    if geom['type'] == 'MultiPolygon': return [poly[0] for poly in geom['coordinates']]
    return []

def lines_of(geom):
    if geom['type'] == 'LineString': return [geom['coordinates']]
    if geom['type'] == 'MultiLineString': return geom['coordinates']
    return []

land, labels = [], []
for f in json.load(open(f'{S}/ne_50m_admin_0_countries.geojson'))['features']:
    pr = f['properties']
    for ring in rings_of(f['geometry']):
        bb = bbox(ring)
        if not hits(bb): continue
        simp = dp(ring, LAND_TOL)
        if len(simp) >= 4: land.append(rnd(simp))
    lx, ly = pr.get('LABEL_X'), pr.get('LABEL_Y')
    if lx is not None and hits((lx, ly, lx, ly)):
        labels.append({'n': pr.get('NAME_EN') or pr.get('NAME'), 'x': round(lx, 2), 'y': round(ly, 2)})

lakes = []
for f in json.load(open(f'{S}/ne_50m_lakes.geojson'))['features']:
    for ring in rings_of(f['geometry']):
        bb = bbox(ring)
        if not hits(bb): continue
        if (bb[2]-bb[0]) < MIN_LAKE_SPAN and (bb[3]-bb[1]) < MIN_LAKE_SPAN: continue
        simp = dp(ring, LAKE_TOL)
        if len(simp) >= 4: lakes.append(rnd(simp))

rivers = []
for f in json.load(open(f'{S}/ne_10m_rivers_lake_centerlines.geojson'))['features']:
    pr = f['properties']
    name = pr.get('name_en') or pr.get('name') or ''
    rank = pr.get('scalerank') or 10
    for line in lines_of(f['geometry']):
        bb = bbox(line)
        if not hits(bb): continue
        simp = dp(line, RIVER_TOL)
        if len(simp) >= 2: rivers.append({'n': name, 's': rank, 'c': rnd(simp)})

out = {'land': land, 'lakes': lakes, 'rivers': rivers, 'labels': labels}
json.dump(out, open(OUT, 'w'), separators=(',', ':'), ensure_ascii=False)
import os
print(f"land rings {len(land)} pts {sum(len(r) for r in land)} | lakes {len(lakes)} | rivers {len(rivers)} pts {sum(len(r['c']) for r in rivers)} | labels {len(labels)} | {os.path.getsize(OUT)/1024:.0f} KB -> {OUT}")
print("rivers named:", sorted({r['n'] for r in rivers if r['n']})[:80])
