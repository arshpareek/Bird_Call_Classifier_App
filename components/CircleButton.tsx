import { MaterialIcons } from "@expo/vector-icons/";
import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

type Props = {
    icon: keyof typeof MaterialIcons.glyphMap;
    onPress: () => void;
    recorderState: boolean;
};

export default function CircleButton({ icon, onPress, recorderState}: Props) {
    useEffect(() => {
        progress.value = recorderState
                    ?   withRepeat(withTiming(1, {duration: 1000}), -1, true)
                    :   withTiming(0);
        }, [recorderState])
    
    const progress = useSharedValue(0);
    
    const animatedStyle = useAnimatedStyle(() => {
    return {
        backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['#019eff', 'red']
        )};
    });
    return (
        <View style={styles.circleButtonContainer}>
            <Pressable onPress={onPress}>
                <Animated.View style={[styles.circleButton, animatedStyle]}>
                    <MaterialIcons name={icon} size={24} color="indigo" />
                </Animated.View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    circleButtonContainer: {
        width: 84,
        height: 84,
        marginHorizontal: 20,
        borderWidth: 4,
        borderRadius: 42,
        borderColor: '#9b31ff',
        padding: 3,
    },
    circleButton: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 42,
        backgroundColor: '#019eff',
    },
})