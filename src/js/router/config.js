define(['jquery', 'get'], function($, get) {
    var config = {};

    config.start = function(ctx, next) {
        ctx.data = {};
        next();
    }

    config.index = function(ctx, next) {
        get('/view/index.html').then(function(res) {
            $('.wrap').html(res);
            ctx.data.script = 'index';
            ctx.data.api = '/api/index';
            next();
        })
    }

    config.detail = function(ctx, next) {
        get('/view/detail.html').then(function(res) {
            $('.wrap').html(res);
            ctx.data.script = 'detail';
            next();
        })
    }

    config.script = function(ctx) {
        require([ctx.data.script], function(cb) {
            cb(ctx.data);
        })
    }

    return config
})