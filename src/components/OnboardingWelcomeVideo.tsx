import type {VideoReadyForDisplayEvent} from 'expo-av';
import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import useLocalize from '@hooks/useLocalize';
import useNetwork from '@hooks/useNetwork';
import useOnboardingLayout from '@hooks/useOnboardingLayout';
import useThemeStyles from '@hooks/useThemeStyles';
import useWindowDimensions from '@hooks/useWindowDimensions';
import Navigation from '@libs/Navigation/Navigation';
import variables from '@styles/variables';
import CONST from '@src/CONST';
import Button from './Button';
import Lottie from './Lottie';
import LottieAnimations from './LottieAnimations';
import Modal from './Modal';
import Text from './Text';
import VideoPlayer from './VideoPlayer';

// Aspect ratio and height of the video.
// Useful before video loads to reserve space.
const VIDEO_ASPECT_RATIO = 1280 / 960;

const MODAL_PADDING = variables.spacing2;

type VideoLoadedEventType = {
    srcElement: {
        videoWidth: number;
        videoHeight: number;
    };
};

type VideoPlaybackStatusEventType = {
    isLoaded: boolean;
};

type VideoStatus = 'video' | 'animation';

function OnboardingWelcomeVideo() {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [isModalVisible, setIsModalVisible] = useState(true);
    const {isSmallScreenWidth} = useWindowDimensions();
    const {shouldUseNarrowLayout} = useOnboardingLayout();
    const [welcomeVideoStatus, setWelcomeVideoStatus] = useState<VideoStatus>('video');
    const [isWelcomeVideoStatusLocked, setIsWelcomeVideoStatusLocked] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [videoAspectRatio, setVideoAspectRatio] = useState(VIDEO_ASPECT_RATIO);
    const {isOffline} = useNetwork();

    useEffect(() => {
        if (isWelcomeVideoStatusLocked) {
            return;
        }

        if (isOffline) {
            setWelcomeVideoStatus('animation');
        } else if (!isOffline && isVideoLoaded) {
            setWelcomeVideoStatus('video');
            setIsWelcomeVideoStatusLocked(true);
        }
    }, [isOffline, isVideoLoaded, isWelcomeVideoStatusLocked]);

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        Navigation.goBack();
    }, []);

    const setAspectRatio = (event: VideoReadyForDisplayEvent | VideoLoadedEventType | undefined) => {
        if (!event) {
            return;
        }

        if ('naturalSize' in event) {
            setVideoAspectRatio(event.naturalSize.width / event.naturalSize.height);
        } else {
            setVideoAspectRatio(event.srcElement.videoWidth / event.srcElement.videoHeight);
        }
    };

    const setVideoStatus = (e: VideoPlaybackStatusEventType) => {
        setIsVideoLoaded(e.isLoaded);
    };

    const getWelcomeVideo = () => {
        const aspectRatio = videoAspectRatio || VIDEO_ASPECT_RATIO;

        return (
            <View
                style={[
                    styles.w100,
                    // Prevent layout jumps by reserving height
                    // for the video until it loads. Also, when
                    // welcomeVideoStatus === 'animation' it will
                    // set the same aspect ratio as the video would.
                    {aspectRatio},
                ]}
            >
                {welcomeVideoStatus === 'video' ? (
                    <VideoPlayer
                        url={CONST.WELCOME_VIDEO_URL}
                        videoPlayerStyle={[styles.onboardingVideoPlayer, {aspectRatio}]}
                        onVideoLoaded={setAspectRatio}
                        onPlaybackStatusUpdate={setVideoStatus}
                        progressStatus={CONST.VIDEO_PLAYER.PROGRESS_STATUS.VOLUME_ONLY}
                        shouldPlay
                        isLooping
                    />
                ) : (
                    <Lottie
                        source={LottieAnimations.Hands}
                        style={styles.w100}
                        webStyle={isSmallScreenWidth ? styles.h100 : styles.w100}
                        autoPlay
                        loop
                    />
                )}
            </View>
        );
    };

    return (
        <Modal
            isVisible={isModalVisible}
            type={shouldUseNarrowLayout ? CONST.MODAL.MODAL_TYPE.CENTERED_SMALL : CONST.MODAL.MODAL_TYPE.BOTTOM_DOCKED}
            onClose={closeModal}
            innerContainerStyle={shouldUseNarrowLayout ? undefined : {paddingTop: MODAL_PADDING, paddingBottom: MODAL_PADDING}}
        >
            <View style={[styles.mh100, shouldUseNarrowLayout && styles.welcomeVideoNarrowLayout]}>
                <View style={shouldUseNarrowLayout ? {padding: MODAL_PADDING} : {paddingHorizontal: MODAL_PADDING}}>{getWelcomeVideo()}</View>
                <View style={[shouldUseNarrowLayout ? [styles.mt5, styles.mh8] : [styles.mt3, styles.mh5]]}>
                    <View style={[shouldUseNarrowLayout ? [styles.gap1, styles.mb8] : [styles.gap2, styles.mb10]]}>
                        <Text style={styles.textHeroSmall}>{translate('onboarding.welcomeVideo.title')}</Text>
                        <Text style={styles.textSupporting}>{translate('onboarding.welcomeVideo.description')}</Text>
                    </View>
                    <Button
                        success
                        pressOnEnter
                        onPress={closeModal}
                        text={translate('onboarding.welcomeVideo.button')}
                    />
                </View>
            </View>
        </Modal>
    );
}

OnboardingWelcomeVideo.displayName = 'OnboardingWelcomeVideo';

export default OnboardingWelcomeVideo;
