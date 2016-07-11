require.config({
  baseUrl: './dist',
  paths: {
    'js': 'js',
    'lib': 'lib',
    'library': 'js/canvas/library',
    'jquery': 'lib/jquery/jquery-3.0.0',
    'tpl': 'template',
    'underscore': 'lib/underscore/underscore-min',
    'layer': 'lib/layer/layer',
    'event': 'js/event',
    //data相关
    'identifier': 'js/data/identifier',
    'css': 'js/data/css',
    'data': 'js/data/index'
  },
  config: {
    'data': {
      debug: true
    }
  }
})
