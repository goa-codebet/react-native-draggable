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
  }

  componentWillMount() {
    if (this.props.reverse == false)
      this.state.pan.addListener(c => (this.state._value = c))
  }
  componentWillUnmount() {
    this.state.pan.removeAllListeners()
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
        if (tolerance > 0) {
          const distance = {
            x: Math.abs(this.prevCoords.x - this.state._value.x),
            y: Math.abs(this.prevCoords.y - this.state._value.y),
					}

          if (distance.x < tolerance && distance.y < tolerance && pressDrag)
            pressDrag(e, gestureState)
        }

        if (pressDragRelease) pressDragRelease(e, gestureState)
        if (reverse == false) this.state.pan.flattenOffset()
        else this.reversePosition()
      },
    })
  }

  _positionCss = () => {
    let Window = Dimensions.get('window')
    const { renderSize, offsetX, offsetY, x, y, z } = this.props
    return Platform.select({
      ios: {
        zIndex: z != null ? z : 999,
        position: 'absolute',
        top: y != null ? y : Window.height / 2 - renderSize + offsetY,
        left: x != null ? x : Window.width / 2 - renderSize + offsetX,
      },
      android: {
        position: 'absolute',
        width: Window.width,
        height: Window.height,
        top: y != null ? y : Window.height / 2 - renderSize + offsetY,
        left: x != null ? x : Window.width / 2 - renderSize + offsetX,
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

  render() {
    const { pressDrag, longPressDrag, pressInDrag, pressOutDrag } = this.props

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
          >
            {this.props.children}
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }
}
