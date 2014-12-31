var _docsets_all=[
        {name: "Node", default_uri: "node/", path: "node", date: null, label:'soon', active : false},
        {name: "JavaScript", default_uri: "javascript/", path: "node", date: "2014-11-22T23:00:00.000Z", label : 'new', active: true}];
var _docsets_active=[
        {name: "JavaScript", default_uri: "javascript/", path: "node", date: "2014-11-22T23:00:00.000Z", label : 'new', active: true}
    ];
var _types=['method','class', 'function'];
var _references=[
        {reference: "aaaa", docset:'node', ref_uri:'aaaaa', uri: "/node/aaaaa", type: "method"} 
    ];
var _formattedreferences=[
{"docset":"node.js v0.10.29","reference":"Buffer","type":"module","uri":"/node.js v0.10.29/buffer", 
"ref_uri": "buffer"},
{"docset":"node.js v0.10.29","reference":"Buffer","type":"class","uri":"/node.js v0.10.29/buffer/buffer",
"ref_uri": "buffer/buffer"}
];

var _newReference={
    type: "function",
    content: "This is an example\n-----\n\nexample.foo(bar)\n\n**some** descriptive *text*\n\n\t\t\t\tfunction example.foo(bar){\n\t\t\t\t\treturn bar;\n\t\t\t\t}",
    uri: "/slash/test.html",
    parent_uri: null,
    name: "search",
    _links: {
        self: { "href": "/api/references/slash/test.html" },
        curies: [
            {
                name: "rl",
                href: "http://refly.co/rels/{rel}",
                templated: true
            }
        ],
        "rl:docset": { href: "/api/docsets/slash" },
        "rl:ascendants": { href: "/api/references/ascendants/slash/test.html" },
        "rl:relatives": { href: "/api/references/relatives/slash/test.html" }
    }
};

function get (resource, filters) {
    var _filters = filters || {};
    return { 
        then: function(callback){
            var data;
            if(resource==='type'){
                data = callback(_types);
            }else if(resource==='docset_active'){
                data = callback(_docsets_active);
            }else if(resource==='docset_all'){
                data = callback(_docsets_all);
            }else if(resource==='branch'){
                data = callback(_formattedreferences);
            }else if(resource==='breadcrumbs'){
                data = callback(_formattedreferences);
            }else if(resource==='reference'){
                data = callback(_newReference);
            }else if(resource==='treeviewreference'){
                data = callback(_references);
            }else if(resource==='search'){
                data = callback(_formattedreferences);
            }
            return {then: function(callback){callback(data);}};
        }
    };
}

var storeMock = jest.genMockFromModule('../store.js');
storeMock.get.mockImplementation(get);

module.exports = storeMock;
