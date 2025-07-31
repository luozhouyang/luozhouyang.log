---
title: "利用Cloudflare R2构建图床"
description: "A guide to building an image hosting platform with Cloudflare R2"
pubDate: "2025-07-31"
updateDate: "2025-07-31"
tags: ["Cloudflare", "R2"]
---

Cloudflare R2是一个基于Amazon S3 API的云存储服务，它允许用户存储任意数量的对象，并使用HTTP API进行访问。利用Cloudflare R2，我们可以构建一个图床，用于存储和分享图片。

## Cloudflare R2的特点

- [x] 存储任意数量的对象
- [x] S3 API兼容
- [x] 出网流量不收费
- [x] 免费10G存储

## 使用步骤

1. 注册Cloudflare账号
2. 创建R2存储桶
3. 配置访问权限
4. 上传图片
5. 获取图片链接

## 套餐对比

| 功能 | 免费套餐 | 付费套餐 |
| --- | --- | --- |
| 存储空间 | 10GB | 无限制 |
| 出网流量 | 免费 | 免费 |
| 请求数 | 每天10万次 | 无限制 |

## 参考代码

```typescript
const s3 = new S3Client({
  region: 'auto',
  endpoint: 'https://r2.cloudflare.com',
  credentials: {
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey',
  },
})
```
