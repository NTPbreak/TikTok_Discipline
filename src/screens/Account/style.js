
import { StyleSheet } from "react-native"


const styles = StyleSheet.create(
    {
        Header:
        {
            width: 60,
            height: 60,
            borderRadius: 30, // Half of width/height for a perfect circle
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center'
        },
        profilePage: {
            flex: 1,
            padding: 20,
        },
        profileHeader: {
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 20,
        },

    }
)

export default styles;