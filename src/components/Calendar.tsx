import React from 'react';
import {View, Text, StyleSheet, FlatList, Dimensions, Platform} from 'react-native';

const actualDayNumber = new Date().getDate();

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.15;
const ITEM_HEIGHT = width * 0.2;
// @ts-ignore
const DateBadge = ({day, date}) => {
    return (
        <View style={[styles.badgeContainer, {
            backgroundColor: 'rgba(211,229,246,0.73)',
            width: ITEM_WIDTH,
            height: ITEM_HEIGHT,
        }]}>
            {/*{color: actualDayNumber === date ? '#ffffff' : '#424242'}*/}
            <Text style={[styles.day, {color: '#424242'}]}>{day}</Text>
            <Text style={[styles.date, {color: '#424242'}, (actualDayNumber === date && Platform.OS === 'ios') ? styles.circleIos : (actualDayNumber === date && Platform.OS !== 'ios') ? styles.circle : null]}>{date}</Text>
        </View>
    );
};

const Calendar = () => {
    const generateDates = () => {
        const dates = [];
        const currentDate = new Date();

        for (let i = 0; i <= 5; i++) {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() + i);

            const dayName = newDate.toLocaleDateString('es-ES', {weekday: 'short'}).charAt(0).toUpperCase() +
                newDate.toLocaleDateString('es-ES', {weekday: 'short'}).slice(3);

            const dayNumber = newDate.getDate();
            dates.push({day: dayName, date: dayNumber});
        }
        return dates;
    };

    const dates = generateDates();

    return (
        <View style={styles.center}>
            <View style={styles.container}>
                <FlatList
                    data={dates}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({item}) => (
                        <View>
                            <DateBadge day={item.day} date={item.date}/>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    center: {
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        height: ITEM_HEIGHT * 1.2,
        backgroundColor: '#ffffff',
        marginVertical: 20,
    },
    badgeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        width: 50,
        borderRadius: 10,
        marginRight: 4,
    },
    listContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    day: {
        fontSize: 16,
    },
    date: {
        fontSize: 20,
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgb(32,120,250)',
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: 30,
    },
    circleIos: {
        overflow: 'hidden',
        borderRadius: 15,
        width: 30,
        height: 30,
        backgroundColor: 'rgb(32,120,250)',
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: 30,
    }
});

export default Calendar;
