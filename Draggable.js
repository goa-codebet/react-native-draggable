/**
 *	* https://github.com/tongyy/react-native-draggable
 *
 */

import React, { Component } from 'react'
import {
  Platform,
  View,
  PanResponder,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'

export default class Draggable extends Component {
  static propTypes = {
    renderText: PropTypes.string,
    renderShape: PropTypes.string,
    renderSize: PropTypes.number,
    imageSource: PropTypes.oneOfType([
      PropTypes.shape({
        uri: PropTypes.string,
      }),
      PropTypes.number,
    ]),
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
    renderColor: PropTypes.string,
    reverse: PropTypes.bool,
    pressDrag: PropTypes.func,
    onMove: PropTypes.func,
    pressDragRelease: PropTypes.func,
    longPressDrag: PropTypes.func,
    pressInDrag: PropTypes.func,
    pressOutDrag: PropTypes.func,
    z: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
    prevCoords: PropTypes.object,
    tolerance: PropTypes.number,
    sticky: PropTypes.bool,
  }
  static defaultProps = {
    offsetX: 100,
    renderShape: 'circle',
    renderColor: 'yellowgreen',
    renderText: '＋',
    renderSize: 36,
    offsetY: 100,
    reverse: true,
    prevCoords: {},
    tolerance: 0,
    sticky: false,
  }

  currentStickyPosition = false

  componentWillMount() {
    if (this.props.reverse == false) {
      this.state.pan.addListener(c => (this.state._value = c))
      Dimensions.addEventListener('change', this.updateStickyPosition)
      this.setInitialPosition()
    }
  }

  componentWillUnmount() {
    this.state.pan.removeAllListeners()
    Dimensions.removeEventListener('change', this.updateStickyPosition)
  }

  constructor(props, defaultProps) {
    super(props, defaultProps)
    const { pressDragRelease, pressDrag, reverse, onMove } = props
    this.state = {
      pan: new Animated.ValueXY(),
      _value: { x: 0, y: 0 },
    }

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (e, gestureState) => {
        if (reverse == false) {
          this.state.pan.setOffset({
            x: this.state._value.x,
            y: this.state._value.y,
          })
          this.state.pan.setValue({ x: 0, y: 0 })
          this.prevCoords = { x: this.state._value.x, y: this.state._value.y }
        }
      },
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: this.state.pan.x,
            dy: this.state.pan.y,
          },
        ],
        { listener: onMove },
      ),
      onPanResponderRelease: (e, gestureState) => {
        const { tolerance } = this.props
        let isActive = true
        if (tolerance > 0) {
          const distance = {
            x: Math.abs(this.prevCoords.x - this.state._value.x),
            y: Math.abs(this.prevCoords.y - this.state._value.y),
          }

          if (distance.x < tolerance && distance.y < tolerance && pressDrag) {
            isActive = false
            pressDrag(e, gestureState)
          }
        }

        if (isActive && !reverse) {
          this.stickToEdge()
          return
        }

        if (pressDragRelease) pressDragRelease(e, gestureState)
        if (reverse == false) this.state.pan.flattenOffset()
        else this.reversePosition()
      },
    })
  }

  _positionCss = () => {
    let Window = Dimensions.get('window')
    const { renderSize, offsetX, offsetY, x, y, z, sticky } = this.props
    let posX,
      posY = 0
    if (!sticky) {
      posX = x != null ? x : Window.width / 2 - renderSize + offsetX
      posY = y != null ? y : Window.width / 2 - renderSize + offsetY
    }
    return Platform.select({
      ios: {
        zIndex: z != null ? z : 999,
        position: 'absolute',
        top: posY,
        left: posX,
      },
      android: {
        position: 'absolute',
        width: Window.width,
        height: Window.height,
        top: posY,
        left: posX,
      },
    })
  }

  _dragItemTextCss = () => {
    const { renderSize } = this.props
    return {
      marginTop: renderSize - 10,
      marginLeft: 5,
      marginRight: 5,
      textAlign: 'center',
      color: '#fff',
    }
  }

  reversePosition = () => {
    Animated.spring(this.state.pan, { toValue: { x: 0, y: 0 } }).start()
  }

  updateStickyPosition = () => {
    this.setInitialPosition(this.currentStickyPosition)
  }

  stickToEdge = (pos = false) => {
    const {
      _value: { x },
      _value: { y },
      pan,
    } = this.state
    const buttonPosition = this.getClosestPosition({ y, x })

    pan.flattenOffset()
    Animated.spring(pan, {
      toValue: { x: buttonPosition.pos.x, y: buttonPosition.pos.y },
    }).start()

    this.currentStickyPosition = buttonPosition.name
  }

  getClosestPosition = pos => {
    const buttonPositions = this.getStickyPositios()

    let shortestDistance = { distance: Number.MAX_SAFE_INTEGER, pos: null }
    let distance = 0
    for (var p in buttonPositions) {
      distance = Math.hypot(
        pos.x - buttonPositions[p].x,
        pos.y - buttonPositions[p].y,
      )
      if (distance < shortestDistance.distance) {
        shortestDistance = { distance, pos: buttonPositions[p], name: p }
      }
    }

    return shortestDistance
  }

  getStickyPositios = () => {
    const { width, height } = Dimensions.get('screen')
    const { renderSize } = this.props
    const padding = 20
    const paddingRight = padding * 2 + renderSize
    const softNavBarHeight = Platform.OS === 'android' ? 70 : 0

    const buttonPositions = {
      topLeft: { x: padding, y: padding },
      topMiddle: { x: width / 2 - renderSize, y: padding },
      topRight: { x: width - paddingRight, y: padding },
      middleLeft: { x: padding, y: height / 2 },
      middleRight: { x: width - paddingRight, y: height / 2 },
      bottomLeft: { x: padding, y: height - paddingRight - softNavBarHeight },
      bottomMiddle: {
        x: width / 2 - renderSize,
        y: height - paddingRight - softNavBarHeight,
      },
      bottomRight: {
        x: width - paddingRight,
        y: height - paddingRight - softNavBarHeight,
      },
    }

    return buttonPositions
  }

  setInitialPosition = (pos = false) => {
    const { startPosition } = this.props
    const positions = this.getStickyPositios()
    const buttonPosition = pos ? positions[pos] : positions[startPosition]
    if (buttonPosition) {
      this.state.pan.setValue({
        x: buttonPosition.x,
        y: buttonPosition.y,
      })
    }
  }

  render() {
    const { pressDrag, longPressDrag, pressInDrag, pressOutDrag, renderSize } = this.props
    return (
      <View style={this._positionCss()}>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[this.state.pan.getLayout()]}
        >
          <TouchableOpacity
            onPress={pressDrag}
            onLongPress={longPressDrag}
            onPressIn={pressInDrag}
            onPressOut={pressOutDrag}
            style={{width: renderSize * 2}}
          >
            {this.props.children}
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }
}
