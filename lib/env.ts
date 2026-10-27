export function getEnv(name: string) {
  return process.env[name]?.trim() ?? ''
}

export function requireEnv(name: string) {
  const value = getEnv(name)
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export function hasAnyEnv(...names: string[]) {
  return names.some((name) => Boolean(getEnv(name)))
}

export function getRequiredEnvMap(names: readonly string[]) {
  return names.reduce<Record<string, string>>((acc, name) => {
    const value = getEnv(name)
    if (value) {
      acc[name] = value
    }
    return acc
  }, {})
}
