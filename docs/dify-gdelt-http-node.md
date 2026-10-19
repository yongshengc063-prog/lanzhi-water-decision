# Dify 工作流调用 GDELT：HTTP Request 节点配置示例

> 本项目默认由 Node 后端代理调用 GDELT（`server/news.mjs`），无需 Dify 也能工作。
> 如果你希望在 Dify 内完成资讯检索，可按下面的节点配置搭建一个独立的 **News Workflow**。

## 1. 开始节点变量

| 变量 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `query` | text | 否 | 检索词；为空时使用默认词 |
| `max_records` | number | 否 | 默认 10，最大 24 |

> GDELT 要求检索词至少 5 个字符，建议在开始节点或前置 Code 节点校验。

## 2. HTTP Request 节点

| 配置项 | 值 |
| --- | --- |
| Method | `GET` |
| URL | `https://api.gdeltproject.org/api/v2/doc/doc` |
| Timeout | `30000` ms |
| Retry | `2` 次 |
| Retry interval | `5000` ms |

Query Params：

| Key | Value |
| --- | --- |
| `query` | `{{#start.query#}}`（为空时填 `water pollution`） |
| `mode` | `artlist` |
| `maxrecords` | `10` 或 `{{#start.max_records#}}` |
| `format` | `json` |
| `sort` | `datedesc` |

Headers：

| Key | Value |
| --- | --- |
| `Accept` | `application/json` |
| `User-Agent` | `lanzhi-water-portal/1.0` |

> GDELT 官方限流约 **每 5 秒 1 次**。如果同一出口 IP 并发较高，HTTP 节点会收到 429；
> 请降低并发、拉开重试间隔，或在后端代理层做串行队列（本项目的 Node 代理已实现）。

## 3. Code 节点：归一化字段

HTTP 节点返回的 `body` 可能是 JSON 字符串，也可能是对象。用 Code 节点统一成前端需要的结构：

```js
function main({ body }) {
  let data = body

  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      return { articles: [] }
    }
  }

  const list = Array.isArray(data && data.articles) ? data.articles : []

  const articles = list
    .filter((item) => item && item.title && item.url)
    .map((item) => ({
      title: item.title,
      summary: '',                    // GDELT artlist 不提供摘要，不编造
      source: item.domain || '',      // 来源域名
      url: item.url,                  // 原文链接
      image: item.socialimage || '',  // 封面图
      publishedAt: item.seendate || '',
      language: item.language || '',
    }))

  return { articles }
}
```

Code 节点输出变量：`articles`（JSON 数组）。

## 4. 结束节点

输出：

```json
{
  "articles": [
    {
      "title": "…",
      "summary": "",
      "source": "example.com",
      "url": "https://example.com/news/…",
      "image": "https://…",
      "publishedAt": "20261019081500",
      "language": "English"
    }
  ]
}
```

## 5. 接入本项目

如果要让门户资讯改由 Dify 新闻工作流提供：

```bash
NEWS_PROVIDER=dify
DIFY_NEWS_API_KEY=app-你的新闻工作流Key
DIFY_NEWS_BASE_URL=https://api.dify.ai
DIFY_NEWS_QUERY_FIELD=query
DIFY_NEWS_LIMIT_FIELD=          # 如需发送条数，可填 max_records
```

服务端会调用：

```http
POST {DIFY_BASE_URL}/v1/workflows/run
Authorization: Bearer {DIFY_NEWS_API_KEY}
Content-Type: application/json

{
  "inputs": { "query": "water pollution" },
  "response_mode": "blocking",
  "user": "lanzhi-portal-news"
}
```

并从 `data.outputs` 中提取 `articles` / `news` / `items` / `list` / `result` / `text`
等字段里的 JSON 数组。

## 6. 排查

| 现象 | 处理 |
| --- | --- |
| `InvalidParameter` | 检索词少于 5 个字符；补充关键词 |
| 429 | GDELT 限流；降低并发、延长重试间隔、使用缓存 |
| 18–21 秒才返回 | 正常；HTTP 节点超时建议 30000 ms |
| 返回 HTML/空 body | 检查 `format=json` 与网络；用 Code 节点做兜底 |
| 卡片没有摘要 | GDELT artlist 不返回摘要，前端显示“未返回摘要”提示 |
