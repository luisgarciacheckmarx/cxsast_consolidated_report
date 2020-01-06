module.exports = {
    coverageReporters: ['text'],
    globals: {
        'ts-jest': {
            diagnostics: {
                ignoreCodes: [6133, 151001],
            },
        },
    },
    preset: 'ts-jest',
};
