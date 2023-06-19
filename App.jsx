import React, { useCallback, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View, Image } from "react-native";
import { default as Mapbox, default as MapboxGL, } from "@rnmapbox/maps";
import { eventData } from "./src/eventsData";

import udazzyEventImg11 from './src/assets/images/udazzy-event1.1.png'
import udazzyEventImg12 from './src/assets/images/udazzy-event1.2.png'
import Yacht from './src/assets/images/yacht.svg'
import Party from './src/assets/images/party.svg'
import NightClub from './src/assets/images/night-club.svg'

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
              {/*<Mapbox.Images images={{clusterImg: udazzyEventImg12, singleMarkerImg: udazzyEventImg11} } />*/}

              <Mapbox.Images>
                <Mapbox.Image name="singleMarkerImage">
                  <View style={styles.markerImageContainer} pointerEvents="none">
                    <Yacht width={24} height={24} fill='#E4E4E4'/>
                  </View>
                </Mapbox.Image>
                <Mapbox.Image name="clusterImg">
                  <View style={styles.markerImageContainer} pointerEvents="none">
                    <NightClub width={24} height={24} fill='#E4E4E4'/>
                  </View>
                </Mapbox.Image>
              </Mapbox.Images>

              {/*Clustered marker image*/}
              <Mapbox.SymbolLayer
                  id="clusteredMarkersImage"
                  filter={['has', 'point_count']}
                  style={styles.clusteredMarkersImage}
              />
              {/*Clustered marker image circle*/}
              <Mapbox.CircleLayer
                  id="clusteredMarkerImageCircle"
                  belowLayerID="clusteredMarkersImage"
                  filter={['has', 'point_count']}
                  style={styles.clusteredMarkersImageCircle}
              />
              {/*Cluster marker count*/}
              <Mapbox.SymbolLayer
                id="clusteredMarkerCount"
                style={styles.markerCount}
                filter={['has', 'point_count']}
              />
              {/*Cluster marker count circle*/}
              <Mapbox.CircleLayer
                id="clusteredMarkersCircle"
                belowLayerID="clusteredMarkerCount"
                filter={['has', 'point_count']}
                style={styles.markerCountCircle}
              />


              {/*Single marker image*/}
              <Mapbox.SymbolLayer
                  id="singleMarkerImage"
                  filter={['!', ['has', 'point_count']]}
                  style={styles.singleMarkerImage}
              />
              {/*Single marker image circle*/}
              <Mapbox.CircleLayer
                  id="singleMarkerImageCircle"
                  belowLayerID="singleMarkerImage"
                  filter={['!', ['has', 'point_count']]}
                  style={styles.singleMarkerImageCircle}
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
  markerImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#1C1B27",
    justifyContent: "center",
    alignItems: "center",
  },
  clusteredMarkersImage: {
    iconImage: 'clusterImg',
    //iconSize: 0.5,
    iconAllowOverlap: true,
    iconIgnorePlacement: false,
  },
  clusteredMarkersImageCircle: {
    circlePitchAlignment: 'map',
    circleRadius: 26,
    circleStrokeWidth: 1,
    circleStrokeColor: '#8c4fef',
    circleOpacity: 0
  },
  markerCount: {
    textField: '{point_count}',
    textSize: 12,
    textPitchAlignment: 'map',
    textOffset: [2, -1.8],
    textColor: 'white',
    textAllowOverlap: true,
  },
  markerCountCircle: {
    circlePitchAlignment: 'map',
    circleColor: '#8c4fef',
    circleRadius: 10,
    circleStrokeWidth: 1,
    circleStrokeColor: 'black',
    circleTranslate: [24, -22]
  },

  singleMarkerImage: {
    iconImage: 'singleMarkerImage',
    iconAllowOverlap: true,
    iconIgnorePlacement: true
  },
  singleMarkerImageCircle: {
    circlePitchAlignment: 'map',
    circleRadius: 26,
    circleStrokeWidth: 1,
    circleStrokeColor: '#8c4fef',
    circleOpacity: 1
  },

});
