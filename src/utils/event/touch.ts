export const hasTouch = () => 'ontouchstart' in window
/**
 * 获取事件的位置信息
 * @param  ev, 原生事件对象
 * @return array  [{ x: int, y: int }]
 */
export function getPosOfEvent(ev) {
  //多指触摸， 返回多个手势位置信息
  if (hasTouch()) {
    var posi: any[] = []
    var src: any = null

    for (var t = 0, len = ev.touches.length; t < len; t++) {
      src = ev.touches[t]
      posi.push({
        x: src.pageX,
        y: src.pageY
      })
    }
    return posi
  } //处理PC浏览器的情况
  else {
    return [
      {
        x: ev.pageX,
        y: ev.pageY
      }
    ]
  }
}

/**
 *计算事件的手势个数
 *@param ev {Event}
 */
export function getFingers(ev) {
  return ev.touches ? ev.touches.length : 1
}

/**
 *获取两点之间的距离
*/
export function getDistance(pos1, pos2) {
  var x = pos2.x - pos1.x,
  y = pos2.y - pos1.y;
  return Math.sqrt((x * x) + (y * y));
}

//return 角度，范围为{-180-0，0-180}， 用来识别swipe方向。
export function getAngle(p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
}
//return 角度， 范围在{0-180}， 用来识别旋转角度
export function _getAngle180(p1, p2) {
  var agl = Math.atan((p2.y - p1.y) * -1 / (p2.x - p1.x)) * (180 / Math.PI);
  return (agl < 0 ? (agl + 180) : agl);
}

//根据角度计算方位 
//@para agl {int} 是调用getAngle获取的。
export function getDirectionFromAngle(agl) {
  var directions = {
      up: agl < -45 && agl > -135,
      down: agl >= 45 && agl < 135,
      left: agl >= 135 || agl <= -135,
      right: agl >= -45 && agl <= 45
  };
  for (var key in directions) {
      if (directions[key]) {
          return key;
      }
  }
  return null;
}

export function isTouchMove(ev) {
  // ev.preventDefault();
  return (ev.type === 'touchmove' || ev.type === 'mousemove');
}
export function isTouchEnd(ev) {
  return (ev.type === 'touchend' || ev.type === 'mouseup' || ev.type === 'touchcancel');
}

export const smrEventList = {
  TOUCH_START: 'touchstart',
  TOUCH_MOVE: 'touchmove',
  TOUCH_END: 'touchend',
  TOUCH_CANCEL: 'touchcancel',

  MOUSE_DOWN: 'mousedown',
  MOUSE_MOVE: 'mousemove',
  MOUSE_UP: 'mouseup',

  CLICK: 'click',

  //PINCH TYPE EVENT NAMES
  PINCH_START: 'pinchstart',
  PINCH_END: 'pinchend',
  PINCH: 'pinch',
  PINCH_IN: 'pinchin',
  PINCH_OUT: 'pinchout',

  ROTATION_LEFT: 'rotateleft',
  ROTATION_RIGHT: 'rotateright',
  ROTATION: 'rotate',

  SWIPE_START: 'swipestart',
  SWIPING: 'swiping',
  SWIPE_END: 'swipeend',
  SWIPE_LEFT: 'swipeleft',
  SWIPE_RIGHT: 'swiperight',
  SWIPE_UP: 'swipeup',
  SWIPE_DOWN: 'swipedown',
  SWIPE: 'swipe',

  DRAG: 'drag',
  DRAGSTART : 'dragstart',
  DRAGEND : 'dragend',

  //HOLD AND TAP  
  HOLD: 'hold',
  TAP: 'tap',
  DOUBLE_TAP: 'doubletap'
};