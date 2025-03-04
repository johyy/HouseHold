const js = require("@eslint/js")

module.exports = [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        ignores: ["node_modules", "dist"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                require: "readonly",
                module: "readonly",
                __dirname: "readonly",
                process: "readonly",
                console: "readonly",
                test: "readonly",
                expect: "readonly",
                jest: "readonly",
                describe: "readonly",
                it: "readonly",
            },
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
            strict: ["error", "global"],
            indent: ["error", 4],
        },
    },
]
