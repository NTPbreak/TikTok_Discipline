import {
    StyleSheet
} from "react-native";

const sheetStyles = StyleSheet.create({
    sheet: {
        padding: 16,
        paddingRight: '2rem',
        paddingLeft: '2rem',
        height: 150,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backdrop: Object.assign(Object.assign({}, StyleSheet.absoluteFillObject), {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    }),
});


export default sheetStyles;