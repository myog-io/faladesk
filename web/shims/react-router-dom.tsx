import React, { createContext, useContext, useEffect, useState } from 'react'

const RouterCtx = createContext({ path: '/', navigate: (p) => {}, params: {} })

export function BrowserRouter({ children }) {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  const navigate = (to) => {
    if (to === path) return
    window.history.pushState(null, '', to)
    setPath(to)
  }
  return (
    <RouterCtx.Provider value={{ path, navigate, params: {} }}>{children}</RouterCtx.Provider>
  )
}

function match(routePath, currentPath) {
  const r = routePath.split('/').filter(Boolean)
  const c = currentPath.split('/').filter(Boolean)
  if (r.length !== c.length) return null
  const params = {}
  for (let i = 0; i < r.length; i++) {
    if (r[i].startsWith(':')) {
      params[r[i].slice(1)] = c[i]
    } else if (r[i] !== c[i]) {
      return null
    }
  }
  return params
}

export function Routes({ children }) {
  const { path, navigate } = useContext(RouterCtx)
  let element = null
  let params = {}
  React.Children.forEach(children, (child) => {
    if (element) return
    if (!React.isValidElement(child)) return
    const m = match(child.props.path, path)
    if (m) {
      element = child.props.element
      params = m
    }
  })
  return <RouterCtx.Provider value={{ path, navigate, params }}>{element}</RouterCtx.Provider>
}

export function Route() {
  return null
}

export function Link({ to, children }) {
  const { navigate } = useContext(RouterCtx)
  return (
    <a href={to} onClick={(e) => { e.preventDefault(); navigate(to) }}>{children}</a>
  )
}

export function useNavigate() {
  const { navigate } = useContext(RouterCtx)
  return navigate
}

export function useParams() {
  const { params } = useContext(RouterCtx)
  return params
}

export function useMatch(pattern: string) {
  const { path } = useContext(RouterCtx)
  const params = match(pattern, path)
  return params ? { params } : null
}
