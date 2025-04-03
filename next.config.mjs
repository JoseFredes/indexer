/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Deshabilitar el linting durante la compilación para Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Deshabilitar la verificación de tipos durante la compilación
    ignoreBuildErrors: true,
  },
  // Configuración del output para Vercel
  output: 'standalone',
};

export default nextConfig;
