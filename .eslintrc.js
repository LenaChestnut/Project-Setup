module.exports = {
    "env": {
        "browser": true,
        "es2020": true,
        "node": true
    },
    "extends": ["airbnb", "prettier"],
    "parserOptions": {
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "rules": {
        "import/no-extraneous-dependencies": "off",
    },
    "plugins": ["prettier"],
};
