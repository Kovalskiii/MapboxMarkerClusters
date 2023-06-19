import React, { useCallback, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View, Image } from "react-native";
import { default as Mapbox, default as MapboxGL, } from "@rnmapbox/maps";
import { eventData } from "./src/eventsData";

import Alcohol from './src/assets/icons/alcohol.svg'
import Brunch from './src/assets/icons/brunch.svg'
import Concert from './src/assets/icons/concert.svg'
import CulturalEvent from './src/assets/icons/cultural-event.svg'
import Dinner from './src/assets/icons/dinner.svg'
import Festival from './src/assets/icons/festival.svg'
import HouseParty from './src/assets/icons/house-party.svg'
import NightClub from './src/assets/icons/night-club.svg'
import NoAlcohol from './src/assets/icons/no-alcohol.svg'
import Photoshoot from './src/assets/icons/photoshoot.svg'
import Rave from './src/assets/icons/rave.svg'
import Restaurant from './src/assets/icons/restaurant.svg'
import Rooftop from './src/assets/icons/rooftop.svg'
import SocialClub from './src/assets/icons/social-club.svg'
import Yacht from './src/assets/icons/yacht.svg'
import Airdrop from './src/assets/icons/airdrop.svg'

Mapbox.setAccessToken('pk.eyJ1Ijoibmlrb2xvczE5OTkiLCJhIjoiY2xlNDl3aWFrMDEwMDNwcGh4ajFqb3NybyJ9.yy0sE8uLdPENNF3v5_pnlA');

export default function MapScreen({ navigation }) {
  const mapEvents = useRef(eventData)
  const shapeSource = useRef()

  const eventTypes = [
    {
      value: 'night club',
      id: '1',
    },
    {
      value: 'house party',
      id: '2',
    },
    {
      value: 'dinner',
      id: '3',
    },
    {
      value: 'brunch',
      id: '4',
    },
    {
      value: 'cultural event',
      id: '5',
    },
    {
      value: 'concert',
      id: '6',
    },
    {
      value: 'photoshoot',
      id: '7',
    },
    {
      value: 'rave',
      id: '8',
    },
    {
      value: 'festival',
      id: '9',
    },
    {
      value: 'alcohol',
      id: '10',
    },
    {
      value: 'no alcohol',
      id: '11',
    },
    {
      value: 'rooftop',
      id: '12',
    },
    {
      value: 'yacht',
      id: '13',
    },
    {
      value: 'social club',
      id: '14',
    },
    {
      value: 'restaurant',
      id: '15',
    },
  ]


  function eventMarkerIconHelper(eventType) {
    switch (eventType) {
      case "alcohol":
        return {iconName: "alcoholMarkerIcon", icon: (<Alcohol width={24} height={24} fill='#E4E4E4'/>)}
      case "brunch":
        return {iconName: "brunchMarkerIcon", icon: (<Brunch width={24} height={24} fill='#E4E4E4'/>)}
      case "concert":
        return {iconName: "concertMarkerIcon", icon: (<Concert width={24} height={24} fill='#E4E4E4'/>)}
      case "cultural event":
        return {iconName: "culturalEventMarkerIcon", icon: (<CulturalEvent width={24} height={24} fill='#E4E4E4'/>)}
      case "dinner":
        return {iconName: "dinnerMarkerIcon", icon: (<Dinner width={24} height={24} fill='#E4E4E4'/>)}
      case "festival":
        return {iconName: "festivalMarkerIcon", icon: (<Festival width={24} height={24} fill='#E4E4E4'/>)}
      case "house party":
        return {iconName: "housePartyMarkerIcon", icon: (<HouseParty width={24} height={24} fill='#E4E4E4'/>)}
      case "night club":
        return {iconName: "nightClubMarkerIcon", icon: (<NightClub width={24} height={24} fill='#E4E4E4'/>)}
      case "no alcohol":
        return {iconName:  "noAlcoholMarkerIcon", icon: (<NoAlcohol width={24} height={24} fill='#E4E4E4'/>)}
      case "photoshoot":
        return {iconName: "photoshootMarkerIcon", icon: (<Photoshoot width={24} height={24} fill='#E4E4E4'/>)}
      case "rave":
        return {iconName: "raveMarkerIcon", icon: (<Rave width={24} height={24} fill='#E4E4E4'/>)}
      case "restaurant":
        return {iconName:  "restaurantMarkerIcon", icon: (<Restaurant width={24} height={24} fill='#E4E4E4'/>)}
      case "rooftop":
        return {iconName:  "rooftopMarkerIcon", icon: (<Rooftop width={24} height={24} fill='#E4E4E4'/>)}
      case "social club":
        return {iconName:  "socialClubMarkerIcon", icon: (<SocialClub width={24} height={24} fill='#E4E4E4'/>)}
      case "yacht":
        return {iconName:  "yachtMarkerIcon", icon: (<Yacht width={24} height={24} fill='#E4E4E4'/>)}

      default:
        return {iconName:  "defaultMarkerIcon", icon: (<NightClub width={24} height={24} fill='#E4E4E4'/>)}
    }
  }

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
        eventType: event.eventType,
        eventTypeIconName: eventMarkerIconHelper(event.eventType).iconName
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
                  console.log('One marker', marker.features[0].properties)
                }
              }}
            >

              {/*Icons*/}
              <Mapbox.Images>
                {/*Cluster default icon*/}
                <Mapbox.Image name={eventMarkerIconHelper().iconName} sdf={true}>
                    <Airdrop width={24} height={24} fill='#E4E4E4'/>
                </Mapbox.Image>

                {/*Event types icons*/}
                {eventTypes.map(type => (
                    <Mapbox.Image key={type.id} name={eventMarkerIconHelper(type.value).iconName} sdf={true}>
                        {eventMarkerIconHelper(type.value).icon}
                    </Mapbox.Image>
                ))}
              </Mapbox.Images>

              {/*Clustered marker icon*/}
              <Mapbox.SymbolLayer
                  id="clusteredMarkersIcon"
                  filter={['has', 'point_count']}
                  style={styles.clusteredMarkersIcon}
              />
              {/*Clustered marker icon circle*/}
              <Mapbox.CircleLayer
                  id="clusteredMarkerIconCircle"
                  belowLayerID="clusteredMarkersIcon"
                  filter={['has', 'point_count']}
                  style={styles.clusteredMarkersIconCircle}
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

              {/*Single marker icon*/}
              <Mapbox.SymbolLayer
                  id="singleMarkerIcon"
                  filter={['!', ['has', 'point_count']]}
                  style={styles.singleMarkerIcon}
              />
              {/*Single marker icon circle*/}
              <Mapbox.CircleLayer
                  id="singleMarkerIconCircle"
                  belowLayerID="singleMarkerIcon"
                  filter={['!', ['has', 'point_count']]}
                  style={styles.singleMarkerIconCircle}
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
  clusteredMarkersIcon: {
    iconImage: 'defaultMarkerIcon',
    iconOpacity: 1,
    iconColor: '#E4E4E4',
    iconAllowOverlap: true,
    iconIgnorePlacement: false,
  },
  clusteredMarkersIconCircle: {
    circlePitchAlignment: 'map',
    circleRadius: 26,
    circleStrokeWidth: 1.4,
    circleStrokeColor: '#8c4fef',
    circleColor: "#1C1B27",
    circleOpacity: 1
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
  singleMarkerIcon: {
    iconImage: ['get', 'eventTypeIconName'],
    iconOpacity: 1,
    iconColor: '#E4E4E4',
    iconAllowOverlap: true,
    iconIgnorePlacement: false,
  },
  singleMarkerIconCircle: {
    circlePitchAlignment: 'map',
    circleRadius: 26,
    circleStrokeWidth: 1.4,
    circleStrokeColor: '#8c4fef',
    circleColor: "#1C1B27",
    circleOpacity: 1
  },
});
