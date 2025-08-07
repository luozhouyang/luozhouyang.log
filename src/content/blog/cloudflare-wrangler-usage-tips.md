---
title: "Cloudflare Wrangler 使用Tips"
description: "一些关于Cloudflare Wrangler的使用技巧"
pubDate: "2025-08-07"
updateDate: "2025-08-07"
tags: ["Cloudflare", "Wrangler"]
---

`wrangler`是cloudflare的官方工具，用于管理cloudflare workers。


## 显示创建本地D1数据库

在`wrangler.toml` 或者 `wrangler.jsonc` 配置了 `d1_databases` 之后，你可能希望在本地创建出一个SQLite数据库来模拟D1。

```toml
d1_databases = [
  { binding = "DB", database_name = "my_db", database_id = "1234567890" }
]
```

默认情况下，wrangler并不会即时创建此本地数据库。如果希望在本地即时创建此数据库，你需要：
* 执行 `npx wrangler dev`
* 执行一个SQL查询，例如 `npx wrangler d1 execute my_db --local --command='SELECT * FROM my_table'`

之后，你便可以在`.wrangler/state/v3/d1/` 目录下看到SQLite数据库被创建出来:

```bash
.wrangler
├── state
│   └── v3
│       ├── cache
│       │   └── miniflare-CacheObject
│       ├── d1
│       │   └── miniflare-D1DatabaseObject
│       │       ├── 14c8722131cce17d31bc37d958e4eacf978b0d4d2c28dea6784e37418eeb3643.sqlite
│       │       ├── 14c8722131cce17d31bc37d958e4eacf978b0d4d2c28dea6784e37418eeb3643.sqlite-shm
│       │       └── 14c8722131cce17d31bc37d958e4eacf978b0d4d2c28dea6784e37418eeb3643.sqlite-wal
│       └── workflows
└── tmp

8 directories, 3 files
```

然后，你就可以配置一个`drizzle-dev.config.ts` 文件，配置数据源为此本地SQLite数据库，即可在本地进行CRUD操作了。

