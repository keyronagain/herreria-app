export function mensajeSupabase(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/row-level security|violates.*policy|permission denied/i.test(msg)) {
    return 'Debes iniciar sesión en Configuración → Cuenta para guardar datos.';
  }
  return msg || 'Error desconocido';
}
