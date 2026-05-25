-- SQL 初始化檔: 建立 `points` 與 `routes` 表並加入範例資料
PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

-- 落點表
CREATE TABLE IF NOT EXISTS points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  zone TEXT,
  x REAL,
  y REAL,
  note TEXT
);

-- 起點 -> 落點 對應表
CREATE TABLE IF NOT EXISTS routes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_slug TEXT NOT NULL,
  target_slug TEXT NOT NULL,
  preset_label TEXT,
  note TEXT,
  FOREIGN KEY(source_slug) REFERENCES points(slug),
  FOREIGN KEY(target_slug) REFERENCES points(slug)
);

-- 範例落點資料 (根據前端目前設定的點位與估算座標)
INSERT OR IGNORE INTO points (slug, name, zone, x, y, note) VALUES
  ('b_site','B 平台','B 區',12,12,'B 平台 (左上)'),
  ('b_tunnel','B 洞','B 區',18,36,'B 洞 (偏上靠中)'),
  ('b_door','B 外','B 區',30,34,'B 外 (中左)'),
  ('car','B 門','B 區',28,50,'B 門 / 車位 (左中偏下)'),
  ('mid','中門','控制區',50,36,'中門 (中央偏上)'),
  ('short','A 上','A 區',62,46,'A 上 (靠中右)'),
  ('a_short','A 小道','A 區',72,60,'A 小道 (中偏右下)'),
  ('a_site','A BB 位','A 區',84,22,'A BB 位 (右上)'),
  ('ct_spawn','CT 起點','防守區',68,22,'CT 起點 (右上偏中)'),
  ('a_long','A 斜','A 區',84,72,'A 斜 (右下)');

-- 範例路線 (preset)
INSERT OR IGNORE INTO routes (source_slug, target_slug, preset_label, note) VALUES
  ('b_tunnel','b_site','B 洞到 B 平台','先從 B 洞選點，再看 B 平台的落點'),
  ('mid','a_site','中門到 A BB 位','中門控圖後，直接切到 A BB 位的常用點位'),
  ('a_short','a_long','A 小道到 A 斜','從 A 小道切到 A 斜，快速看進攻路線');

COMMIT;

-- 常見查詢範例
-- 取得某起點的所有對應落點
-- SELECT p.* FROM routes r JOIN points p ON r.target_slug = p.slug WHERE r.source_slug = 'b_tunnel';

-- 列出所有起點與其落點數
-- SELECT r.source_slug, COUNT(*) as n FROM routes r GROUP BY r.source_slug;

-- 用 slug 取得落點座標
-- SELECT x,y FROM points WHERE slug = 'a_site';

-- 若要在 sqlite3 建 DB，執行：
-- sqlite3 points.db < init_points_routes.sql
