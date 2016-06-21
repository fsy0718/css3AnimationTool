
(function(){
  var prop = {
    transform: 'T',
    'transform-origin': 'TO',
    'transform-style': 'TS',
    rotate: 'TR',
    rotateX: 'TRX',
    rotateY: 'TRY',
    rotateZ: 'TRZ',
    scale: 'TS',
    scaleX: 'TSX',
    scaleY: 'TSY',
    scaleZ: 'TSZ',
    translate: 'TT',
    translateX: 'TTX',
    translateY: 'TTY',
    translateZ: 'TTZ',
    skew: 'TK',
    skewX: 'TKX',
    skewY: 'TKY',
    skewZ: 'TKZ',
    matrix: 'TM',
    perspective: 'TP',
    transition: 'S',
    'transition-property': 'SP',
    'transition-duration': 'SD',
    'transition-delay': 'SL',
    'transition-timing-function': 'SF',
    'animation-name': 'AN',
    'animation-duration': 'AD',
    'animation-timing-function': 'AF',
    'animation-delay': 'AL',
    'animation-iteration-count': 'AC',
    'animation-direction': 'AR',
    'animation-fill-mode': 'AM',
    'animation-play-state': 'AS',
    'backface-visibility': 'BS',
    'perspective-origin': 'PO'
  }


  var constant = {
    T: {
      _key: 'transform',
      _name: '变形'
    },
    TO: {
      _key: 'transform-origin',
      _name: '变形原点',
      _items: {
        x: {
          _name: 'x',
          _unit: '%'
        },
        y: {
          _name: 'y',
          _unit: '%'
        }
      }
    },
    TL: {
      _key: 'transform-style',
      _name: '是否3D呈现',
      _items: {
        _type: 'unique',
        flat: {
          _name: '2D',
          _checked: true
        },
        'preserve-3d': {
          _name: '3D'
        }
      }
    },
    TR: {
      _key: 'rotate'
    },
    TRX: {
      _key: 'rotateX',
      _name: 'X轴旋转',
      _unit: 'deg'
    },
    TRY: {
      _key: 'rotateY',
      _name: 'Y轴旋转',
      _unit: 'deg'
    },
    TRZ: {
      _key: 'rotateZ',
      _name: 'Z轴旋转',
      _unit: 'deg',
      _ref: 'preserve-3d'
    },
    TS: {
      _key: 'scale'
    },
    TSX: {
      _key: 'scaleX',
      _name: 'X轴缩放',
      _unit: '倍'
    },
    TSY: {
      _key: 'scaleY',
      _name: 'Y轴缩放',
      _unit: '倍'
    },
    TSZ: {
      _key: 'scaleZ',
      _name: 'Z轴缩放',
      _unit: '倍',
      _ref: 'preserve-3d'
    },
    TT: {
      _key: 'translate'
    },
    TTX: {
      _key: 'translateX',
      _name: 'X轴位移',
      _unit: 'px'
    },
    TTY: {
      _key: 'translateY',
      _name: 'Y轴位移',
      _unit: 'px'
    },
    TTZ: {
      _key: 'translateZ',
      _name: 'Z轴位移',
      _unit: 'px',
      _ref: 'preserve-3d'
    },
    TK: {
      _key: 'skew'
    },
    TKX: {
      _key: 'skewX',
      _name: 'X轴倾斜',
      _unit: 'deg'
    },
    TKY: {
      _key: 'skewY',
      _name: 'Y轴倾斜',
      _unit: 'deg'
    },
    TKZ: {
      _key: 'skewZ',
      _name: 'Z轴倾斜',
      _unit: 'deg',
      _ref: 'preserve-3d'
    },
    TP: {
      _key: 'perspective',
      _name: '透视',
      _unit: 'px',
      _ref: 'preserve-3d'
    },
    TM: {
      _key: 'matrix',
      _name: '矩阵变形',
      _items: {
        a: {
          _name: '参数a',
          _value: 1
        },
        c: {
          _name: '参数c',
          _value: 1
        },
        e: {
          _name: '参数e',
          _value: 0
        },
        b: {
          _name: '参数b',
          _value: 0
        },
        d: {
          _name: '参数d',
          _value: 0
        },
        f: {
          _name: '参数f',
          _value: 0
        }
      }
    },
    S: {
      _key: 'transition'
    },
    SP: {
      _key: 'transition-property',
      _name: '过渡css属性'
    },
    SL: {
      _key: 'transition-delay',
      _name: '过渡延迟时间',
      _unit: 's'
    },
    SD: {
      _key: 'transition-duration',
      _name: '过渡时间',
      _unit: 's'
    },
    SF: {
      _key: 'transition-timing-function',
      _name: '过渡效果',
      _items: {
        linear: {
          _name: 'linear'
        },
        ease: {
          _name: 'ease'
        },
        'ease-in': {
          _name: 'ease-in'
        },
        'ease-out': {
          _name: 'ease-out'
        },
        'ease-in-out': {
          _name: 'ease-in-out'
        },
        'cubic-bezier': {
          _name: 'cubic-bezier(0.500,0.250,0.500,0.750)',
          _value: '0.500，0.250,0.500,0.750'
        }
      }
    },
    A: {
      _key: 'animation'
    },
    AN: {
      _key: 'animation-name'
    },
    AD: {
      _key: 'animation-duration'
    },
    AF: {
      _key: 'animation-timing-function'
    },
    AL: {
      _key: 'animation-delay'
    },
    AC: {
      _key: 'animation-iteration-count'
    },
    AR: {
      _key: 'animation-direction'
    },
    AM: {
      _key: 'animation-fill-mode'
    },
    AS: {
      _key: 'animation-play-state'
    },
    BS: {
      _key: 'backface-visibility'
    },
    P: {
      _key: 'perspective'
    },
    PO: {
      _key: 'perspective-origin'
    }
  }
  try{
    if(window){
      window.css3Prop = prop;
      window.css3Cons = constant;
    }
  }catch(e){
    exports.css3Prop = prop;
    exports.css3Cons = constant;
  }
})()
