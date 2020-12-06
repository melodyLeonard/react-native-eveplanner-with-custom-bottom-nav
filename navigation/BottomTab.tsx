import React from 'react'
import { View, SafeAreaView, Dimensions, StyleSheet, Animated } from 'react-native'
import Svg,{Path} from 'react-native-svg'
import * as shape from 'd3-shape'
import StaticBottom, { tabHeight as height } from '../components/StaticBottom'

// tabs icon
const tabs = [
    { name: 'grid' },
    { name: 'list' },
    { name: 'refresh-cw' },
    { name: 'box' },
    { name: 'user' }
]


const { width } = Dimensions.get("window")

const tabWidth = width / tabs.length

const AnimatedSvg = Animated.createAnimatedComponent(Svg)

const left = shape.line()
    .x(d => d.x)
    .y(d => d.y)([
        { x: 0, y: 0 },
        {x: width, y: 0}
    ])

    const tab = shape.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(shape.curveBasis)([
        { x: width, y: 0 },
        { x: width + 5, y: 0 },
        { x: width + 10, y: 10 },
        { x: width + 15, y: height },
        { x: width + tabWidth - 15, y: height },
        { x: width + tabWidth - 10, y: 10 },
        { x: width + tabWidth - 5, y: 0 },
        { x: width + tabWidth, y: 0 }
    ])

const right = shape.line()
    .x(d => d.x)
    .y(d => d.y)
    ([
        { x: width + tabWidth, y: 0 },
        { x: width * 2.5, y: 0 },
        { x: width * 2.5, y: height },
        { x: 0, y: height },
        { x: 0, y: 0 },
    ])


const d = `${left} ${tab} ${right}`


interface BottomTabProps {

}

export default class BottomTab extends React.PureComponent<BottomTabProps> {
    value = new Animated.Value(-width)

    render() {
        const {value: translateX} = this
        return (
            <>
            <View {...{width, height}}>
                <AnimatedSvg width={width * 2.5 }{...{height}} style={{transform: [{translateX}]}} >
                    <Path {...{d}} fill='white' />
                </AnimatedSvg>
                <View style={ StyleSheet.absoluteFill }>
                    <StaticBottom value={translateX} {...{ tabs }} />
                </View>
            </View>
            
            <SafeAreaView style={ styles.safeArea }/>
        </>
    )
}
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor:'white'
    }
})


