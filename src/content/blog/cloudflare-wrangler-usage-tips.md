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


## 配置开发环境的D1和Drizzle-ORM(弯路版)

drizzle-orm可以为每一个环境提供一个配置文件。通常情况下，你可能会配置**开发**和**生产**两个环境。

对于本地开发环境，这里提供一个配置示例。即 `drizzle-dev.config.ts`:

```typescript
import { defineConfig } from 'drizzle-kit';
import fs from "fs";
import path from "path";

function resolveDbPath() {
    const dir = path.resolve(".wrangler/state/v3/d1/miniflare-D1DatabaseObject");
    try {
        const files = fs.readdirSync(dir);
        const sqliteFile = files.find((file) => file.endsWith('.sqlite'));
        if (!sqliteFile) {
            throw new Error(`No .sqlite file found in ${dir}`);
        }
        return path.join(dir, sqliteFile);
    } catch (err) {
        console.error('Error resolving database path:', err);
        // Return a default or throw an error if the directory/file can't be found
        // For now, let's throw to make it obvious something is wrong.
        throw new Error('Could not resolve the local D1 database path. Please ensure you have mannual created the local db correctly.');
    }
}

export default defineConfig({
    schema: './src/db/schemas/*',
    out: 'drizzle/migrations',
    dialect: 'sqlite',
    dbCredentials: {
        url: resolveDbPath(),
    },
});

```

这样你就可以为数据库变更，生成migrations文件了：
```bash
npx drizzle-kit generate --config drizzle-dev.config.ts --name='update_tables'
```

为了方便，可以在 `package.json` 增加一个 `script`:

```json
"scripts": {
  "db:generate": "drizzle-kit generate --config drizzle-dev.config.ts",
}
```

使用script的示例：

```bash
npm run db:generate -- --name='init_tables'
```

## 配置开发环境的D1和Drizzle-ORM(正确版)

其实 `drizzle.config.ts` 文件并不是必须的，尤其是在**运行时**，它是不需要的。

对于Cloudflare Workers项目来说，你在本地提供`drizzle.config.ts`文件，最大的作用是在本地生成`migrations`文件。而要应用migrations到D1数据库，需要使用`wrangler`来实现。

经过摸索，可以按照以下步骤来配置drizzle：
步骤一：在项目创建`drizzle.config.ts`文件，内容为：
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    schema: "./src/db/schemas",
    driver: "d1-http",
    out: "./drizzle/migrations",
    dbCredentials: {
        accountId: process.env.CF_ACCOUNT_ID!,
        databaseId: process.env.CF_DATABASE_ID!,
        token: process.env.CF_ACCESS_TOKEN!,
    },
});

```

其中`dbCredentials`的参数你都可以在`.env.local`里设置为空，drizzle并不会在真的使用它。因为运行时的代码是不会读取`drizzle.config.ts`文件的。

步骤二：使用上述`drizzle.config.ts`文件生成migrations文件：
```bash
npx drizzle-kit generate --name=your_message
```

步骤三：使用`wrangler`对**本地**开发的D1数据库进行apply：
```bash
npx wrangler d1 apply $your_database_name --local
```
这个步骤，会在 `.wrangler/state/v3/d1/`目录下的SQLite数据库文件中，应用migrations，此为D1的本地开发数据库。

步骤四：在**运行时**使用`drizzle-orm`连接D1数据库：
```typescript

import { drizzle } from "drizzle-orm/d1"
import { Database } from "../types"
import * as schemas from "./schemas"

export function getDatabase(db: D1Database): Database {
    return drizzle(db, { schema: schemas })
}

```

可知：只需要提供`D1Database`对象即可，而这个`D1Database`就是Cloudflare Workers的`env`里声明的D1 Binding。配置如下：
```json
{
    "d1_databases": [
		{
			"binding": "DB",
			"database_name": "xxxxx",
			"database_id": "xxxxx",
			"migrations_dir": "drizzle/migrations"
		}
	],
}
```

执行 `npx wrangler typegen`之后，你可以在生产的`worker-configuration.d.ts`或者类似文件中找到`Env`的定义，例如：
```typescript
declare namespace Cloudflare {
	interface Env {
		CF_ACCOUNT_ID: string;
		CF_DATABASE_ID: string;
		CF_ACCESS_TOKEN: string;
		DB: D1Database;
	}
}
interface CloudflareBindings extends Cloudflare.Env {}

```
