import React, { Fragment } from 'react'
import { View, TouchableWithoutFeedback, StyleSheet, Animated, Dimensions } from 'react-native'
import { Feather as Icon } from "@expo/vector-icons"

interface Tab {
    name: string
}

interface StaticBottomProps {
    tabs: Tab[];
    value: Animated.Value
}

export const tabHeight: number = 55
const ICON_SIZE: number =25
const {width} = Dimensions.get('window')

export default class StaticBottom extends React.PureComponent<StaticBottomProps> {

    values: Animated.Value[] =[]
    constructor(props: StaticBottomProps) {
        super(props)
        const { tabs } = this.props
        this.values = tabs.map((tab, index) => new Animated.Value(index === 0 ? 1 : 0))

    }

    onPress = (index: number) => {
        const { value, tabs } = this.props
        const tabWidth = width / tabs.length
        Animated.sequence([
            ...this.values.map(value => Animated.timing(value, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true
            })),
            Animated.parallel([
                Animated.spring(this.values[index], {
                    toValue: 1,
                    useNativeDriver: true
                }),
                Animated.spring(value,{
                    toValue: -width + tabWidth * index,
                    useNativeDriver: true
                })
            ]),   
        ]).start()
    }

    render() {
        const {onPress} = this
        const { tabs, value } = this.props
        const tabWidth = width / tabs.length

        return (
            <View style={styles.container}>
                {
                    tabs.map(({ name }, key) => {
                        const activeValue = this.values[key]
                        const opacity = value.interpolate({
                            inputRange: [-width + tabWidth * (key - 1), -width + tabWidth * key, -width + tabWidth * (key + 1)],
                            outputRange: [1, 0, 1],
                            extrapolate: 'clamp'
                        })
                        const translateY = activeValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [tabHeight, 0]
                        })
                        return (
                            <Fragment {...{ key }}> 
                            <TouchableWithoutFeedback onPress={() => onPress(key)}>
                                <Animated.View style={[styles.tab, { opacity }]}>
                                    <Icon size={ICON_SIZE} {...{ name }} />
                                </Animated.View>
                                </TouchableWithoutFeedback>
                                <Animated.View style={{
                                    position: 'absolute',
                                    top: -8,
                                    width: tabWidth,
                                    left: tabWidth * key,
                                    height: tabHeight,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    transform: [{translateY}]
                                }}>
                                    <View style={styles.circle}>
                                        <Icon size={ICON_SIZE} {...{name}} />
                                    </View>
                                </Animated.View>
                            </ Fragment>
                        )
                    }
                    )
            }
        </View>
        
        )
    }
}
    
const styles = StyleSheet.create({
    container: {
       flexDirection: 'row' 
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: tabHeight
    },
    circle: {
        width: 45,
        height: 45,
        borderRadius: 45 / 2,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    }
})


