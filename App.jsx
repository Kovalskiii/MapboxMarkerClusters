import React, { useCallback, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View, Image } from "react-native";
import { default as Mapbox, default as MapboxGL, } from "@rnmapbox/maps";
import { eventData } from "./src/eventsData";

import udazzyEventImg11 from './src/assets/images/udazzy-event1.1.png'
import udazzyEventImg12 from './src/assets/images/udazzy-event1.2.png'
import Yacht from './src/assets/images/yacht.svg'

Mapbox.setWellKnownTileServer('Mapbox');
Mapbox.setAccessToken('pk.eyJ1Ijoibmlrb2xvczE5OTkiLCJhIjoiY2xlNDl3aWFrMDEwMDNwcGh4ajFqb3NybyJ9.yy0sE8uLdPENNF3v5_pnlA');


export default function MapScreen({ navigation }) {
  const mapEvents = useRef(eventData)
  const shapeSource = useRef()

  const eventMarkersData = {
    type: 'FeatureCollection',
    totalMarkers: mapEvents.current.length,
    features: mapEvents.current.map(event => ({
      type: 'Feature',
      id: event._id,
      geometry: {
        type: 'Point',
        coordinates: event.location.coordinates,
      },
      properties: {
        id: event._id,
      },
    })),
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView
          styleURL={"mapbox://styles/mapbox/dark-v11"}
          style={styles.map}
          rotateEnabled={false}
        >
          {eventMarkersData && (
            <Mapbox.ShapeSource
              ref={shapeSource}
              id="events"
              cluster={true}
              clusterMaxZoom={18}
              clusterRadius={60}
              shape={eventMarkersData}
              onPress={async marker => {
                if (marker.features[0].properties.cluster) {
                  const collection = await shapeSource.current.getClusterLeaves(
                    marker.features[0],
                    marker.features[0].properties.point_count,
                    0,
                  )
                  // Do what you want if the user clicks the cluster
                  console.log('Cluster',collection)
                } else {
                  // Do what you want if the user clicks individual marker
                  console.log('One marker', marker)
                }
              }}
            >
              <Mapbox.Images images={{clusterImg: udazzyEventImg12, singleMarkerImg: udazzyEventImg11} } />
              <Mapbox.SymbolLayer
                id="clusteredMarkerCount"
                style={styles.markerCount}
                filter={['has', 'point_count']}
              />
              <Mapbox.CircleLayer
                id="clusteredMarkersCircle"
                belowLayerID="clusteredMarkerCount"
                filter={['has', 'point_count']}
                style={styles.markerCountCircle}
              />

              <Mapbox.SymbolLayer
                id="clusteredMarkersImage"
                filter={['has', 'point_count']}
                style={styles.clusterImage}
              />

              <Mapbox.SymbolLayer
                id="singleMarker"
                filter={['!', ['has', 'point_count']]}
                style={{
                  iconImage: 'singleMarkerImg',
                  iconSize: 0.4,
                  // iconOpacity: 1,
                  // iconAllowOverlap: true,
                  // iconHaloBlur: 0
                }}
              />

            </Mapbox.ShapeSource>
          )}
        </Mapbox.MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: "100%",
    height: "100%"
  },
  map: {
    flex: 1
  },
  markerContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: ["#1C1B27", "#1D1C28"],
    justifyContent: "center",
    alignItems: "center"
    // borderWidth: 1,
    // borderColor: '#8c4fef'
  },
  clusterImage: {
    iconImage: 'clusterImg',
    iconSize: 0.5,
    iconAllowOverlap: true,
    iconIgnorePlacement: true
  },

  markerCount: {
    textField: '{point_count}',
    textSize: 15,
    textPitchAlignment: 'map',
    textOffset: [2, -1.6],
    textColor: 'white',
    textAllowOverlap: true,
  },
  markerCountCircle: {
    circlePitchAlignment: 'map',
    circleColor: '#8c4fef',
    circleRadius: 12,
    circleStrokeWidth: 1,
    circleStrokeColor: 'black',
    circleTranslate: [30, -24]
  },

});
