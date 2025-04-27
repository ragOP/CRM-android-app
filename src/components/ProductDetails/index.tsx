import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ProductDetailsProps {
  description: string;
  features: string[];
  directions: string[];
  faqs?: { question: string; answer: string }[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  description, 
  features, 
  directions,
  faqs
}) => {
  const [activeTab, setActiveTab] = useState('description');
  
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={styles.tab} 
          onPress={() => setActiveTab('description')}
        >
          <Text style={[styles.tabText, activeTab === 'description' && {color: '#00008B'}]}>Product Information</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tab} 
          onPress={() => setActiveTab('directions')}
        >
          <Text style={[styles.tabText, activeTab === 'directions' && {color: '#00008B'}]}>Directions for use</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tab} 
          onPress={() => setActiveTab('faqs')}
        >
          <Text style={[styles.tabText, activeTab === 'faqs' && {color: '#00008B'}]}>FAQs</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tab} 
          onPress={() => setActiveTab('bought')}
        >
          <Text style={[styles.tabText, activeTab === 'bought' && {color: '#00008B'}]}>Customers Also Bought</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        {activeTab === 'description' && (
          <View>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{description}</Text>
            
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresList}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {activeTab === 'directions' && (
          <View>
            <Text style={styles.sectionTitle}>Directions for Use</Text>
            <View style={styles.directionsList}>
              {directions.map((direction, index) => (
                <View key={index} style={styles.directionItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.directionText}>{direction}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {activeTab === 'faqs' && faqs && (
          <View>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {faqs.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={styles.questionText}>{faq.question}</Text>
                <Text style={styles.answerText}>{faq.answer}</Text>
              </View>
            ))}
          </View>
        )}
        
        {activeTab === 'bought' && (
          <Text style={styles.comingSoonText}>Customers also bought these items...</Text>
        )}
      </View>
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    // marginVertical: 15,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 15,
  },
  tab: {
    paddingVertical: 10,
    marginRight: 15,
  },
  tabText: {
    fontSize: 11,
    color: '#666',
  },
  contentContainer: {
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
    marginTop: 15,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  featuresList: {
    marginTop: 5,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  directionsList: {
    marginTop: 5,
  },
  directionItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#333333',
    marginRight: 5,
    lineHeight: 20,
  },
  featureText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    flex: 1,
  },
  directionText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    flex: 1,
  },
  faqItem: {
    marginBottom: 15,
  },
  questionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  answerText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#333333',
    fontStyle: 'italic',
  },
});