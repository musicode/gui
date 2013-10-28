require.config({
    baseUrl: '/',
    paths: {
        css: './demo/asset/js/css'
    },
    packages: [
        {
            name: 'gui',
            //location: './gui/src'
            location: './src',
            main: 'main'
        }
    ]
});
document.createElement('header');