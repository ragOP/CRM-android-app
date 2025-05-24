import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import ScreenLayout from '../ScreenLayout/ScreenLayout';
import {useQuery} from '@tanstack/react-query';
import {fetchPrivacyPolicy} from '../../apis/fetchPrivacyPolicy';
import {ActivityIndicator} from 'react-native';
import RenderHTML from 'react-native-render-html';

const FaqScreen = () => {
  const {width} = useWindowDimensions();

  const {data, isLoading} = useQuery({
    queryKey: ['privacy_policy'],
    queryFn: fetchPrivacyPolicy,
  });

//   console.log(data);
  const privacy_policy = data?.privacy_policy || [];
//   console.log(privacy_policy);
  return (
    <ScreenLayout title="Privacy Policy">
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator color="#007BFF" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View
            style={{padding: 16, marginBottom: 10}}>
            {privacy_policy && 
            <RenderHTML baseStyle={{fontSize: 16}} contentWidth={width} source={{html: privacy_policy}} />}
          </View>
        </ScrollView>
      )}
    </ScreenLayout>
  );
};

export default FaqScreen;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  accordion: {
    // marginVertical: 10,
    // borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
});
