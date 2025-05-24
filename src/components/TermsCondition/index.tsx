import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import ScreenLayout from '../ScreenLayout/ScreenLayout';
import {useQuery} from '@tanstack/react-query';

import {fetchTermsConditions} from '../../apis/fetchTermsConditions';
import RenderHTML from 'react-native-render-html';

const TermsConditionsScreen = () => {
  const {width} = useWindowDimensions();
  const {data, isLoading} = useQuery({
    queryKey: ['terms_conditions'],
    queryFn: fetchTermsConditions,
  });

  const terms_conditions = data?.terms_and_conditions || [];
  return (
    <ScreenLayout title="Terms & Conditions">
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={{padding: 16, marginBottom: 10}}>
            {terms_conditions && (
              <RenderHTML
                baseStyle={{fontSize: 16}}
                contentWidth={width}
                source={{html: terms_conditions}}
              />
            )}
          </View>
        </ScrollView>
      )}
    </ScreenLayout>
  );
};

export default TermsConditionsScreen;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});
