export class Router {
  #routes = []

  get(pathPattern, handler) {
    this.#addRoute('GET', pathPattern, handler)
  }

  post(pathPattern, handler) {
    this.#addRoute('POST', pathPattern, handler)
  }

  put(pathPattern, handler) {
    this.#addRoute('PUT', pathPattern, handler)
  }

  patch(pathPattern, handler) {
    this.#addRoute('PATCH', pathPattern, handler)
  }

  delete(pathPattern, handler) {
    this.#addRoute('DELETE', pathPattern, handler)
  }

  resolve(method, pathname) {
    const matchedRoute = this.#routes.find((route) => {
      if (route.method !== method) return false
      return route.regex.test(pathname)
    })

    if (!matchedRoute) {
      const hasPathMatch = this.#routes.some((route) => route.regex.test(pathname))
      return {
        status: hasPathMatch ? 'method_not_allowed' : 'not_found',
      }
    }

    const match = pathname.match(matchedRoute.regex)
    const params = Object.fromEntries(
      matchedRoute.keys.map((key, idx) => [key, decodeURIComponent(match[idx + 1])])
    )

    return {
      status: 'matched',
      handler: matchedRoute.handler,
      params,
    }
  }

  #addRoute(method, pathPattern, handler) {
    const { regex, keys } = toPathRegex(pathPattern)
    this.#routes.push({ method, regex, keys, handler })
  }
}

function toPathRegex(pathPattern) {
  const keys = []
  const escaped = pathPattern
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\/:([a-zA-Z0-9_]+)/g, (_, key) => {
      keys.push(key)
      return '/([^/]+)'
    })
  return { regex: new RegExp(`^${escaped}$`), keys }
}
