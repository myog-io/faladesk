declare module 'react-router-dom' {
  import { ReactNode } from 'react'
  export function BrowserRouter(props: { children: ReactNode }): JSX.Element
  export function Routes(props: { children: ReactNode }): JSX.Element
  export function Route(props: { path: string; element: JSX.Element }): null
  export function Link(props: { to: string; children: ReactNode }): JSX.Element
  export function useNavigate(): (to: string) => void
  export function useParams<T extends Record<string, string | undefined>>(): T
}
