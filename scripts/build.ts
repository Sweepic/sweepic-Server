import esbuild from 'esbuild';

async function build() {
  await esbuild.build({
    entryPoints: ['./src/app.ts'],
    bundle: true,
    format: 'cjs',
    outdir: './dist',
    outExtension: { '.js': '.cjs' },
    platform: 'node',
    target: 'node20',
    minify: true,
    keepNames: true,
  });
}

build();