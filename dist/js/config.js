require.config({
  baseUrl: './dist',
  paths: {
    'js': 'js',
    'lib': 'lib',
    'jquery': 'lib/jquery/jquery-3.0.0',
    'tpl': 'template',
    'underscore': 'lib/underscore/underscore-min',
    'layer': 'lib/layer/layer',
    'event': 'js/event',
    //data相关
    'identifier': 'js/data/identifier',
    'style': 'js/data/style',
    'data': 'js/data/index'
  },
  config: {
    'data': {
      debug: true
    }
  }
})
