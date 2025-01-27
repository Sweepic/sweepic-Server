import esbuild from 'esbuild';
import {copy} from 'esbuild-plugin-copy';

async function build() {
  await esbuild
    .build({
      entryPoints: ['./src/app.ts'],
      bundle: true,
      format: 'cjs',
      outdir: './dist',
      outExtension: {'.js': '.cjs'},
      platform: 'node',
      target: 'node20',
      minify: false,
      keepNames: true,
      metafile: true,
      plugins: [
        copy({
          assets: [
            {
              from: ['./node_modules/swagger-ui-dist/*'],
              to: ['./'],
            },
          ],
        }),
      ],
    })
    .then(result => {
      console.log(result.metafile); // 번들에 포함된 파일들 확인
    });
}

build();
