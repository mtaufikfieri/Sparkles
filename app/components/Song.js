import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  Animated,
} from 'react-native';
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import Icon from '../components/utilities/Icon';
import {FONTS, SIZES} from '../assets/theme/theme';

import songs from '../model/data';

/* Setting Up Player Function */
const setUpPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
    });
    await TrackPlayer.add(songs);
  } catch (e) {
    console.log('Player Error:>>', e);
  }
};

/* Pause & Play Function */
const togglePlayback = async playBackState => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  if (currentTrack != null) {
    if (playBackState == State.Paused) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
};

const Song = () => {
  /* Hooks */

  /* State */
  const playBackState = usePlaybackState();
  const progress = useProgress();
  const [songIndex, setSongIndex] = useState(0);
  const [repeatMode, setRepeatMode] = useState('off');

  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackArtwork, setTrackArtwork] = useState();

  /* Reference */
  const scrollX = useRef(new Animated.Value(0)).current; // Scrolling Animation Reference For Finding The Indexes
  const songSlider = useRef(null); // Flatlist Refrerence To Make The Flatlist Slides

  /* Changing The Track On Complete */
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);

      const {title, artwork, artist} = track;
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtwork(artwork);
    }
  });

  const repeatIcon = () => {
    if (repeatMode == 'off') {
      return 'repeat-off';
    } else if (repeatMode == 'track') {
      return 'repeat-once';
    } else if (repeatMode == 'repeat') {
      return 'repeat';
    }
  };

  const changeRepeatMode = () => {
    if (repeatMode == 'off') {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeatMode('track');
    } else if (repeatMode == 'track') {
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
      setRepeatMode('repeat');
    } else if (repeatMode == 'repeat') {
      TrackPlayer.setRepeatMode(RepeatMode.Off);
      setRepeatMode('off');
    }
  };

  const skipTo = async trackID => {
    await TrackPlayer.skip(trackID);
  };

  /* useEffect */
  useEffect(() => {
    setUpPlayer();
    scrollX.addListener(({value}) => {
      // console.log(`ScrollX : ${value} | Device Width : ${SIZES.width}`);
      const index = Math.round(value / SIZES.width);
      skipTo(index);
      setSongIndex(index);

      // console.log(index);

      return () => {
        scrollX.removeAllListeners();
        TrackPlayer.destroy();
      };
    });
  }, []);

  /* Next Function */
  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * SIZES.width,
    });
  };

  /* Previous Function */
  const skipToPrevious = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * SIZES.width,
    });
  };

  /* Song Artwork */
  const renderSongs = ({item, index}) => {
    return (
      <Animated.View style={styles.mainArtworkWrapper}>
        <View style={[styles.imageWrapper, styles.elevation]}>
          <Image source={trackArtwork} style={styles.musicArtwork} />
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* Artwork */}
        <Animated.FlatList
          ref={songSlider}
          renderItem={renderSongs}
          data={songs}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {x: scrollX},
                },
              },
            ],
            {useNativeDriver: true},
          )}
        />

        {/* Song Details */}
        <View>
          <Text style={[styles.songDetail, styles.songTitle]}>
            {trackTitle}
          </Text>
          <Text style={[styles.songDetail, styles.songArtist]}>
            {trackArtist}
          </Text>
        </View>

        {/* Slider */}
        <View>
          <Slider
            style={styles.progressBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#FFFFFF"
            onSlidingComplete={async value => {
              await TrackPlayer.seekTo(value);
            }}
          />
        </View>

        {/* Duration */}
        <View style={styles.musicDuration}>
          <Text style={styles.musicLabelDuration}>
            {new Date(progress.position * 1000)
              .toLocaleTimeString()
              .substring(3)}
          </Text>
          <Text style={styles.musicLabelDuration}>
            {new Date((progress.duration - progress.position) * 1000)
              .toLocaleTimeString()
              .substring(3)}
          </Text>
        </View>

        {/* Action Control */}
        <View style={styles.musicControlContainer}>
          <TouchableOpacity onPress={() => skipToPrevious()}>
            <Icon
              type="ionicon"
              style={{color: '#FFD369'}}
              size={35}
              name="play-skip-back-outline"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => togglePlayback(playBackState)}>
            <Icon
              type="ionicon"
              style={{color: '#FFD369'}}
              size={65}
              name={
                playBackState === State.Playing
                  ? 'ios-pause-circle'
                  : 'ios-play-circle'
              }
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => skipToNext()}>
            <Icon
              type="ionicon"
              style={{color: '#FFD369'}}
              size={35}
              name="play-skip-forward-outline"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={() => {}}>
            <Icon
              type="ionicon"
              style={{color: '#888888'}}
              size={30}
              name="heart-outline"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={changeRepeatMode}>
            <Icon
              type="materialCommunity"
              style={{color: repeatMode !== 'off' ? '#FFD369' : '#888888'}}
              size={30}
              name={`${repeatIcon()}`}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Icon
              type="ionicon"
              style={{color: '#888888'}}
              size={30}
              name="share-outline"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Icon
              type="ionicon"
              style={{color: '#888888'}}
              size={30}
              name="ellipsis-horizontal"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    width: SIZES.width,
    alignItems: 'center',
    paddingVertical: 15,
    borderTopColor: '#393E46',
    borderWidth: 1,
  },
  iconWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  mainArtworkWrapper: {
    width: SIZES.width,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  imageWrapper: {
    width: 300,
    height: 340,
    // marginBottom: 25,
  },
  musicArtwork: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },

  elevation: {
    elevation: 5,

    shadowColor: '#ccc',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },

  songDetail: {
    textAlign: 'center',
    color: '#EEEEEE',
  },
  songTitle: {
    fontFamily: 'Dongle-Regular',
    fontSize: 18,
    fontWeight: '600',
  },
  songArtist: {
    fontSize: 16,
    fontWeight: '300',
  },

  progressBar: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },

  musicDuration: {
    width: 330,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  musicLabelDuration: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginTop: 10,
  },
  musicControlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    width: '60%',
  },
});

export default Song;
