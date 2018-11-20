# react-native-draggable



Draggable item for react-native!


How to use

```
return (
    <View >
        <Draggable renderSize={56} renderColor='black' offsetX={-100} offsetY={-200} pressDrag={()=>alert('touched!!')} tolerance={5} />
            <ChildCompoent />
        <Draggable/>
    </View>
);
```
[Demo](https://github.com/tongyy/react-native-draggable/blob/master/demo/demo.gif)

[![N|Solid](https://raw.githubusercontent.com/tongyy/react-native-draggable/master/demo/demo.gif)](https://raw.githubusercontent.com/tongyy/react-native-draggable/master/demo/demo.gif)
in my project => <img src="https://raw.githubusercontent.com/tongyy/react-native-draggable/master/demo/demo2.png" width="289">

```
return (
    <View style={{backgroundColor: 'blue', flex: 0.5}} >
        <Draggable renderShape='image' imageSource={this.state.source} renderSize={80}
            offsetX={0} offsetY={0}
            pressDragRelease={this._changeFace}
            longPressDrag={()=>console.log('long press')}
            pressDrag={()=>console.log('press drag')}
            pressInDrag={()=>console.log('in press')}
            pressOutDrag={()=>console.log('out press')}
        />
    </View>
);

```
[Event Demo](https://github.com/tongyy/react-native-draggable/blob/master/demo/demo3.gif)

![DEMO2](https://raw.githubusercontent.com/tongyy/react-native-draggable/master/demo/demo3.gif)


# Props spec & Example
## Properties
| Prop | Type | Example | Default | Description |
| :------------ |:---------------:|:---------------:|:---------------:|:-----|
| tolerance | number | {25} | {0} | Distance component can move and also trigger click |
| offsetX | number |{0}| {100} | offsetX with center |
| offsetY | number |{100}| {100} | offsetY with center |
| x | number |{0}| --- | position x |
| y | number |{0}| --- | position y |
| z | number |{0}| --- | position z |
| reverse | bool | {true} | {true} | reverse flag |

## Events
| Event | Type | Description |
| :------------ |:---------------:|:-----|
| pressDrag | func | onPress event |
| pressDragRelease | func | release drag event |
| longPressDrag | func | long press event |
| pressInDrag | func | in press event |
| pressOutDrag | func | out press event |

## Methods
| Method | params | Description |
| :------------ |:---------------:|:-----|
| reversePosition | --- | manually reset Draggable to start position |

# What's next?

This Draggable is used to be a Draggable Button in my project.
Let me know if you have any idea or demand, let's discuss and develop it.
    


