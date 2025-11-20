---
title: 'Deploy Kong gateway with Docker'
description: 'Deploy kong gateway with Docker'
pubDate: 'Sep 20 2025'
tags: ['Kong', 'Docker']
---

Kong官方的文档已经比较详细，读者应该优先参考官方文档。此文档主要用于个人记录，相当于一个备忘录，因此可能会缺失很多细节。

首先，部署Kong Gateway有很多种方式，本文使用的是最简单的一种：使用Docker手动部署容器。

# Network

```bash
docker network create kong-network
```

# Database

这里采用本地部署Postgres容器的方式。

```bash
docker volume create kong-database-volume

docker run -d \
    --name kong-database \
    --network kong-network \
    -p 5432:5432 \
    -e "POSTGRES_USER=kong" \
    -e "POSTGRES_DB=kong" \
    -e "POSTGRES_PASSWORD=kongpass" \
    -v kong-database-volume:/var/lib/postgresql/data \
    postgres:16

```

数据迁移：

```bash
docker run --rm --network kong-network \
    -e "KONG_DATABASE=postgres" \
    -e "KONG_PG_HOST=kong-database" \
    -e "KONG_PG_PASSWORD=kongpass" \
    kong/kong:3.9.1 kong migrations bootstrap

```

# Kong Gateway

```bash
docker run -d \
    --name kong-gateway \
    --network kong-network \
    -e "KONG_DATABASE=postgres" \
    -e "KONG_PG_HOST=kong-database" \
    -e "KONG_PG_USER=kong" \
    -e "KONG_PG_PASSWORD=kongpass" \
    -e "KONG_PROXY_ACCESS_LOG=/dev/stdout" \
    -e "KONG_ADMIN_ACCESS_LOG=/dev/stdout" \
    -e "KONG_PROXY_ERROR_LOG=/dev/stderr" \
    -e "KONG_ADMIN_ERROR_LOG=/dev/stderr" \
    -e "KONG_ADMIN_LISTEN=0.0.0.0:8001" \
    -e "KONG_ADMIN_GUI_PATH=/manager" \
    -e "KONG_ADMIN_GUI_URL=http://yourdomain.com:8002/manager" \
    -p 80:8000 \
    -p 443:8443 \
    -p 8001:8001 \
    -p 8002:8002 \
    kong/kong:3.9.1

```

注意：为了能够通过公网域名访问Kong Manager，配置了以下环境变量：
* KONG_ADMIN_GUI_PATH=/manager
* KONG_ADMIN_GUI_URL=http://yourdomain.com:8002/manager

既然配额了域名，那么就必然要解决SSL证书的问题。Kong自带ACME插件，刚好可以给自己的域名颁发证书，并且能够自动刷新证书。


通过浏览器访问：`http://yourdomain.com:8002/manager`即可进入Kong Manager的UI界面，方便配置Kong。 如图所示：

![kong-manager](../../assets/kong-manager.png)


# ACME Plugin

要利用ACME插件实现给域名颁发证书，主要有三个步骤：
* 创建一个acme-service，是一个虚假的service，它部负责ACME Challenge等工作。
* 创建一个acme-route，挂在上述acme-service下。
* 创建一个acme-plugin，它是**全局的**，此插件实现了ACME的核心功能。


## acme-service

![acme-service](../../assets/kong-acme-service.png)

可以看到：
* host: localhost
* port: 65535

都是无意义的值。

## acme-route

![acme-route](../../assets/kong-acme-route.png)

注意：
* 取消勾选 **Strip Path**

## acme-plugin

![acme-plugin](../../assets/kong-acme-plugin.png)



至此，ACME插件配置完毕。


## Create SSL Certificate

可以通过Kong Admin API来触发**证书生成**

```bash
curl http://localhost:8001/acme -d host=yourdomain.com
```

过几分钟你会看到如下输出:

```bash
{"message":"certificate for host yourdomain.com is created"}
```


然后你可以在Kong Manager / Certificates 看到:

![acme-certificate](../../assets/kong-acme-certificate.png)


接下来你可以在修改上述`kong gateway`的docker env:
* KONG_ADMIN_GUI_URL=https://yourdomain.com:8002/manager

然后可以从浏览器访问Kong Manager: https://yourdomain.com:8002/manager

