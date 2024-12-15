import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import DropShadow from "react-native-drop-shadow";


const actualDayNumber = new Date().getDate();
// @ts-ignore
const DateBadge = ({day, date}) => {
    return (
        <View style={[styles.badgeContainer, {
            backgroundColor: actualDayNumber === date ? '#1976D2' : '#7CB8E7',
        }]}>
            <Text style={styles.day}>{day}</Text>
            <Text style={styles.date}>{date}</Text>
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
                newDate.toLocaleDateString('es-ES', {weekday: 'short'}).slice(1);

            const dayNumber = newDate.getDate();
            dates.push({day: dayName, date: dayNumber});
        }
        return dates;
    };

    const dates = generateDates();

    return (
        <View style={styles.container}>
            <FlatList
                data={dates}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                renderItem={({item}) => (
                    <DropShadow
                        style={actualDayNumber === item.date && styles.shadowProps}
                    >
                        <DateBadge day={item.day} date={item.date}/>
                    </DropShadow>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 90,
        marginTop: 10,
    },
    badgeContainer: {
        height: 80,
        borderRadius: 40,
        paddingVertical: 10,
        paddingHorizontal: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    listContainer: {
        justifyContent: 'center',
    },
    day: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    date: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    shadowProps: {
        shadowColor: "#6c6b6b",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 2,
        shadowRadius: 2,
        elevation: 3,
    }
});

export default Calendar;
