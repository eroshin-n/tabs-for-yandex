({
    block: 'page',
    title: 'Tabs-n-Console',
    head: [
        { elem: 'meta', attrs: { name: 'description', content: 'Tabs n console, baby!' }},
        { elem: 'css', url: '_index.css' }
    ],
    scripts: [{ elem: 'js', url: '_index.js' }],
    content: [
        {
            block: 'app',
            content: [
                {
                    elem: 'tabs',
                    content: (function() {

                        return [           
                            {
                                header: 'Meeseeks 1',
                                content: 'I&amp;am mr. Meeseeks, look at me!'
                            },                           
                            {
                                header: 'Meeseeks 2',
                                content: 'No I&amp;am mr. Meeseeks, look at me!'
                            }
                        ].map(function(tab) {
                            return {
                                block: 'tab',
                                content: [
                                    {
                                        elem: 'header',
                                        content: tab.header
                                    },
                                    {
                                        elem: 'content',
                                        content: tab.content
                                    }
                                ]
                            };
                        });
                    })()
                },
                {
                    elem: 'console',
                    content: {
                        block: 'console',
                        content: [
                            {
                                elem: 'output_wrapper',
                                content: {
                                    elem: 'output'
                                }
                            },
                            {
                                block: 'input',
                                mods: { theme: 'islands', size: 's', 'has-clear' : true },
                                name: 'query',
                                placeholder: 'Try to put in some commands',
                                autocomplete : false
                            },
                            {
                                block : 'button',
                                mods : { theme : 'islands', size : 's', type : 'submit' },
                                text : 'Ввод'
                            }
                        ]
                    }
                }
            ]
        }
    ]
});