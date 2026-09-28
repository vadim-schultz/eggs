export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

function requireVar(
  env: Record<string, string | undefined>,
  name: string,
): string {
  const value = env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseEnv(
  env: Record<string, string | undefined>,
): SupabaseEnv {
  return {
    url: requireVar(env, "VITE_SUPABASE_URL"),
    anonKey: requireVar(env, "VITE_SUPABASE_ANON_KEY"),
  };
}
