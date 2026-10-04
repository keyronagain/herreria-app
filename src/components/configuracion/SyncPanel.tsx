'use client';

import { useState } from 'react';
import { LogIn, LogOut, Cloud, CloudOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useSync } from '@/hooks/use-sync';

export function SyncPanel() {
  const { sesion, comprobando, iniciarSesion, registrar, cerrarSesion } = useSync();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  async function autenticar(modo: 'login' | 'registro') {
    setError('');
    setMensaje('');
    if (!email.trim() || !password) {
      setError('Ingresa correo y contraseña.');
      return;
    }
    try {
      if (modo === 'login') await iniciarSesion(email.trim(), password);
      else await registrar(email.trim(), password);
      setPassword('');
      if (modo === 'registro') {
        setMensaje('Cuenta creada. Revisa tu correo para confirmarla si es necesario.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
    }
  }

  if (comprobando) {
    return (
      <Card>
        <p className="text-sm text-slate-400">Comprobando sesión…</p>
      </Card>
    );
  }

  if (sesion) {
    return (
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-100">Cuenta</h3>
          <Cloud className="h-5 w-5 text-emerald-400" />
        </div>
        <p className="text-sm text-slate-400">
          Conectado como{' '}
          <span className="text-slate-200">{sesion.user.email}</span>
        </p>
        <p className="text-sm text-slate-500">
          Los datos se guardan y leen en tiempo real desde la nube.
        </p>
        <Button variant="ghost" onClick={() => void cerrarSesion()}>
          <LogOut className="h-4 w-4" /> Salir
        </Button>
      </Card>
    );
  }

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-100">Cuenta</h3>
        <CloudOff className="h-5 w-5 text-slate-400" />
      </div>
      <p className="text-sm text-slate-400">
        Inicia sesión para acceder a tus materiales, proyectos y cotizaciones.
      </p>
      <div className="space-y-3">
        <Input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        {mensaje && <p className="text-sm text-slate-400">{mensaje}</p>}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void autenticar('login')}>
            <LogIn className="h-4 w-4" /> Entrar
          </Button>
          <Button variant="secondary" onClick={() => void autenticar('registro')}>
            Crear cuenta
          </Button>
        </div>
      </div>
    </Card>
  );
}
