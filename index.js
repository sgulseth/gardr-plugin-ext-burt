var win = global, d = document, gardrParams;
var validateOpts = require('define-options')({
    burtScript       : 'string    - Required URL to the burt xdi-script',
    burtConnect      : '?|function  - Optional function to connect campaignId to a burtUnit. Arguments (burtUnit, containerEl).'
});

function saveParams (params) {
    gardrParams = params;
}

function trackGardrContainer (options, el) {
    if (win.burtApi.trackByNode) {
        el.setAttribute('data-name', gardrParams.id);
        el.setAttribute('data-xdi-id', gardrParams.id);
        var burtUnit = win.burtApi.trackByNode(el, {name : gardrParams.id, xdiId : gardrParams.id});
        if (options.burtConnect) {
            options.burtConnect(burtUnit, el);
        }
    } else {
        win.burtApi.push(trackGardrContainer.bind(null, options, el));
    }
}

function burtExt (gardrPluginApi, options) {
    win.burtApi = win.burtApi || [];
    gardrPluginApi.on('params:parsed', saveParams);
    gardrPluginApi.on('element:containercreated', trackGardrContainer.bind(null,options));

    var s = d.createElement('script');
    s.src = options.burtScript;
    d.getElementsByTagName('head')[0].appendChild(s);
}

module.exports = burtExt;
