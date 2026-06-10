import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/layout/Layout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { InventarioListado } from '@/pages/inventario/InventarioListado'
import { ClienteListado } from '@/pages/clientes/ClienteListado'
import { EventoListado } from '@/pages/eventos/EventoListado'
import { EventoDetalle } from '@/pages/eventos/EventoDetalle'
import { AlbaranListado } from '@/pages/albaranes/AlbaranListado'
import { Perfil } from '@/pages/perfil/Perfil'

function RutaProtegida({ children }: { children: React.ReactNode }) {
  const estaAutenticado = useAuthStore((s) => s.estaAutenticado())
  return estaAutenticado ? <>{children}</> : <Navigate to="/login" replace />
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/*"
        element={
          <RutaProtegida>
            <Layout>
              <Routes>
                <Route path="/"              element={<Dashboard />} />
                <Route path="/inventario"    element={<InventarioListado />} />
                <Route path="/clientes"      element={<ClienteListado />} />
                <Route path="/eventos"       element={<EventoListado />} />
                <Route path="/eventos/:id"   element={<EventoDetalle />} />
                <Route path="/albaranes"     element={<AlbaranListado />} />
                <Route path="/perfil"        element={<Perfil />} />
                <Route path="*"              element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </RutaProtegida>
        }
      />
    </Routes>
  )
}
