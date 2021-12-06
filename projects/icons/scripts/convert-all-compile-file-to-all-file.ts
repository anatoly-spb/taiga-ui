import {rollup, RollupOptions} from 'rollup';
import typescript, {RPT2Options} from 'rollup-plugin-typescript2';

import {rollupSvgo} from './rollup-svgo';

const banner = `
/**
 * @description:
 * DO NOT CHANGE THIS FILE. AUTOGENERATED
 */
`;

interface Options {
    prt2Options?: RPT2Options;
    from: string;
    to: string;
}

export async function convertAllCompileFileToAllFile(config: Options): Promise<void> {
    const {from, to, prt2Options} = config;

    const inputOptions: RollupOptions = {
        input: from,
        output: {preferConst: true},
        plugins: [
            typescript(prt2Options ?? {cacheRoot: 'node_modules/.cache/.rpt2_cache'}),
            rollupSvgo({
                include: '**/*.svg',
                options: {
                    plugins: [
                        {
                            name: 'preset-default',
                            params: {
                                overrides: {
                                    removeViewBox: false,
                                    collapseGroups: false,
                                    cleanupIDs: false,
                                    removeUnknownsAndDefaults: false,
                                },
                            },
                        },
                    ],
                },
            }),
        ],
    };

    const bundle = await rollup(inputOptions);

    await bundle.write({
        banner,
        file: to,
        format: 'es',
        preferConst: true,
    });
}