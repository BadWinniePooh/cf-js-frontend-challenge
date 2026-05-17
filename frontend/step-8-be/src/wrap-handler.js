export function wrapHandler(baseHandler, onSuccess) {
  return async (req, res, ctx) => {
    let statusCode
    let responseBody = null
    const originalWriteHead = res.writeHead.bind(res)
    const originalEnd = res.end.bind(res)

    res.writeHead = (code, headers) => {
      statusCode = code
      originalWriteHead(code, headers)
    }
    res.end = (payload) => {
      if (payload) {
        try {
          responseBody = JSON.parse(payload)
        } catch {
          responseBody = payload
        }
      }
      originalEnd(payload)
    }

    await baseHandler(req, res, ctx)

    if (statusCode >= 200 && statusCode < 300) {
      onSuccess({ statusCode, body: responseBody, params: ctx.params })
    }
  }
}
