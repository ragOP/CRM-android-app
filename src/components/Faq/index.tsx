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
import {ActivityIndicator} from 'react-native';
import {fetchFaqs} from '../../apis/fetchFaqs';
import {List} from 'react-native-paper';
import RenderHTML from 'react-native-render-html';

const FaqScreen = () => {
  const [expanded, setExpanded] = useState(null);
  const {width} = useWindowDimensions();

  const {data, isLoading} = useQuery({
    queryKey: ['faqs'],
    queryFn: fetchFaqs,
  });

  const faqs = data || [];

  return (
    <ScreenLayout title="FAQs">
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {faqs.map((faq, index) => (
            <List.Accordion
              key={index}
              title={faq.question}
              expanded={expanded === index}
              onPress={() => setExpanded(expanded === index ? null : index)}
              style={styles.accordion}>
              <View
                style={{
                  padding: 16,
                  marginBottom: 10,
                  backgroundColor: '#fff',
                }}>
                <RenderHTML contentWidth={width} source={{html: faq.answer}} />
              </View>
            </List.Accordion>
          ))}
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
