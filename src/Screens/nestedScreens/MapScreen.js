import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export const MapScreen = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 50.005,
          longitude: 36.229,
          latitudeDelta: 0.011,
          longitudeDelta: 0.011,
        }}
      >
        <Marker
          coordinate={{
            latitude: 50.005733199201764,
            longitude: 36.22917948135358,
          }}
        />
      </MapView>
    </View>
  );
};
//50.005733199201764, 36.22917948135358
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
